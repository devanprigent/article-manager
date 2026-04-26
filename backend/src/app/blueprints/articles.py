from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import select

from app.database import db
from app.decorators import validate_json
from app.models import Article, Author
from app.schemas import ArticleSchema, IDSchema
from app.services import (
    associate_tags,
    check_url_uniqueness,
    get_entities,
    get_entity,
    get_or_create_by_name,
    update_model_fields,
)

articles_bp = Blueprint("articles", __name__, url_prefix="/articles")


@articles_bp.route("")
@jwt_required()
def list_articles():
    user_id = int(get_jwt_identity())
    stmt = select(Article).where(Article.user_id == user_id)
    articles = db.session.execute(stmt).scalars().all()
    return jsonify([article.to_dict() for article in articles]), 200


@articles_bp.route("", methods=["POST"])
@jwt_required()
@validate_json
def add_article(data):
    user_id = int(get_jwt_identity())
    schema = ArticleSchema.model_validate(data)
    if not check_url_uniqueness(schema.url, user_id):
        return jsonify({"error": "URL already exists"}), 409

    tags = associate_tags(schema.tags, user_id)
    author = get_or_create_by_name(Author, schema.author, user_id)

    article = Article(
        user_id=user_id,
        title=schema.title,
        url=schema.url,
        year=schema.year,
        summary=schema.summary,
        read=schema.read,
        read_again=schema.read_again,
        favorite=schema.favorite,
        author_id=author.id,
        tags=tags,
    )
    db.session.add(article)
    db.session.commit()
    return jsonify(article.to_dict()), 201


@articles_bp.route("", methods=["PUT"])
@jwt_required()
@validate_json
def edit_article(data):
    user_id = int(get_jwt_identity())
    schema = ArticleSchema.model_validate(data)
    if schema.id is None:
        return jsonify({"error": "Missing id"}), 400
    if not check_url_uniqueness(schema.url, user_id, schema.id):
        return jsonify({"error": "URL already exists"}), 409
    article = get_entity(schema.id, Article, user_id)
    tags = associate_tags(schema.tags, user_id)
    author = get_or_create_by_name(Author, schema.author, user_id)
    payload = schema.model_dump()
    payload["author_id"] = author.id
    payload["tags"] = tags
    update_model_fields(
        article,
        payload,
        {
            "title",
            "author_id",
            "tags",
            "url",
            "year",
            "summary",
            "read",
            "read_again",
            "favorite",
        },
    )
    db.session.commit()
    return (jsonify(article.to_dict()), 200)


@articles_bp.route("", methods=["DELETE"])
@jwt_required()
@validate_json
def delete_articles(data):
    user_id = int(get_jwt_identity())
    schema = IDSchema.model_validate(data)
    article_ids = schema.ids
    articles = get_entities(article_ids, Article, user_id)
    articles_dict = [article.to_dict() for article in articles]
    for article in articles:
        db.session.delete(article)
    db.session.commit()
    return (
        jsonify(
            {
                "deleted": articles_dict,
                "count": len(articles),
            }
        ),
        200,
    )
