import logging
from typing import Any

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import func, select

from app.database import db
from app.decorators import get_user_id, validate_json
from app.models import Article, Author
from app.schemas import BasicSchema, IDSchema
from app.services import get_articles_by_author, get_entities, get_or_create_by_name

logger = logging.getLogger("article_manager.authors")

authors_bp = Blueprint("authors", __name__, url_prefix="/authors")


@authors_bp.route("")
@jwt_required()
@get_user_id
def list_authors(user_id: int):
    stmt = select(Author).where(Author.user_id == user_id)
    authors = db.session.execute(stmt).scalars().all()
    logger.debug("Listed %d authors for user_id=%d", len(authors), user_id)
    return jsonify([author.to_dict() for author in authors]), 200


@authors_bp.route("/top")
@jwt_required()
@get_user_id
def list_top_authors(user_id: int):
    nb_articles = func.count(Article.id).label("nb_articles")
    stmt = (
        select(Author, nb_articles)
        .where(Author.user_id == user_id)
        .join(Article, Article.author_id == Author.id, isouter=True)
        .group_by(Author.id)
        .order_by(nb_articles.desc(), Author.name.asc())
    )
    rows = db.session.execute(stmt).all()
    logger.debug("Top authors fetched for user_id=%d: %d results", user_id, len(rows))
    return (
        jsonify(
            [
                {"author": author.to_dict()["name"], "count": count}
                for author, count in rows
            ]
        ),
        200,
    )


@authors_bp.route("", methods=["POST"])
@jwt_required()
@validate_json
@get_user_id
def add_author(data: dict[str, Any], user_id: int):
    schema = BasicSchema.model_validate(data)
    author = get_or_create_by_name(db.session, Author, schema.name, user_id)
    db.session.commit()
    logger.info(
        "Author created/retrieved: id=%d name=%r user_id=%d",
        author.id,
        author.name,
        user_id,
    )
    return jsonify(author.to_dict()), 201


@authors_bp.route("", methods=["DELETE"])
@jwt_required()
@validate_json
@get_user_id
def delete_authors(data: dict[str, Any], user_id: int):
    schema = IDSchema.model_validate(data)
    author_ids = schema.ids
    authors = get_entities(db.session, author_ids, Author, user_id)
    authors_dict = [author.to_dict() for author in authors]
    for author in authors:
        articles = get_articles_by_author(db.session, author.id, user_id)
        if articles:
            logger.warning(
                "Delete author blocked — has articles: author_id=%d user_id=%d",
                author.id,
                user_id,
            )
            return (
                jsonify({"error": f"The author {author.id} has associated articles."}),
                409,
            )
        db.session.delete(author)
    db.session.commit()
    logger.info(
        "Authors deleted: ids=%s user_id=%d count=%d", schema.ids, user_id, len(authors)
    )
    return (
        jsonify(
            {
                "deleted": authors_dict,
                "count": len(authors),
            }
        ),
        200,
    )
