from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import func, select

from app.database import db
from app.decorators import validate_json
from app.models import Article, Author
from app.schemas import BasicSchema, IDSchema
from app.services import get_articles_by_author, get_entities, get_or_create_by_name

authors_bp = Blueprint("authors", __name__, url_prefix="/authors")


@authors_bp.route("")
@jwt_required()
def list_authors():
    stmt = select(Author)
    authors = db.session.execute(stmt).scalars().all()
    return jsonify([author.to_dict() for author in authors]), 200


@authors_bp.route("/top")
@jwt_required()
def list_top_authors():
    nb_articles = func.count(Article.id).label("nb_articles")
    stmt = (
        select(Author, nb_articles)
        .join(Article, Article.author_id == Author.id, isouter=True)
        .group_by(Author.id)
        .order_by(nb_articles.desc())
    )
    rows = db.session.execute(stmt).all()
    return (
        jsonify(
            [{"author": author.to_dict(), "count": count} for author, count in rows]
        ),
        200,
    )


@authors_bp.route("", methods=["POST"])
@jwt_required()
@validate_json
def add_author(data):
    user_id = int(get_jwt_identity())
    schema = BasicSchema.model_validate(data)
    author = get_or_create_by_name(Author, schema.name, user_id)
    db.session.commit()
    return jsonify(author.to_dict()), 201


@authors_bp.route("", methods=["DELETE"])
@jwt_required()
@validate_json
def delete_authors(data):
    user_id = int(get_jwt_identity())
    schema = IDSchema.model_validate(data)
    author_ids = schema.ids
    authors = get_entities(author_ids, Author)
    authors_dict = [author.to_dict() for author in authors]
    for author in authors:
        articles = get_articles_by_author(author.id, user_id)
        if articles:
            return (
                jsonify({"error": f"The author {author.id} has associated articles."}),
                409,
            )
        db.session.delete(author)
    db.session.commit()
    return (
        jsonify(
            {
                "deleted": authors_dict,
                "count": len(authors),
            }
        ),
        200,
    )
