import logging
from typing import Any

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.database import db
from app.decorators import get_pagination, get_user_id, validate_json
from app.models import Article
from app.schemas import ArticleSchema, BasicSchema, IDSchema
from app.services import (
    create_article,
    get_articles,
    get_entity,
    get_metadata,
    remove_articles,
    update_article,
)

logger = logging.getLogger("article_manager.articles")

articles_bp = Blueprint("articles", __name__, url_prefix="/articles")


@articles_bp.route("", methods=["GET"])
@jwt_required()
@get_user_id
@get_pagination
def list_articles(user_id: int, offset: int | None = None, limit: int | None = None):
    articles, total = get_articles(db.session, offset, limit, user_id)
    logger.debug("Listed %d articles for user_id=%d", len(articles), user_id)
    return jsonify(
        {
            "data": [article.to_dict() for article in articles],
            "total": total,
            "offset": offset,
            "limit": limit,
        }
    ), 200


@articles_bp.route("/<int:article_id>", methods=["GET"])
@jwt_required()
@get_user_id
def get_article(user_id: int, article_id: int):
    article = get_entity(db.session, article_id, Article, user_id)
    logger.info(
        "Article fetched: id=%d title=%r user_id=%d", article.id, article.title, user_id
    )
    return jsonify(article.to_dict(include_content=True)), 200


@articles_bp.route("", methods=["POST"])
@jwt_required()
@validate_json
@get_user_id
def add_article(data: dict[str, Any], user_id: int):
    schema = ArticleSchema.model_validate(data)
    article = create_article(db.session, schema, user_id)
    logger.info(
        "Article created: id=%d title=%r user_id=%d", article.id, article.title, user_id
    )
    return jsonify(article.to_dict()), 201


@articles_bp.route("", methods=["PUT"])
@jwt_required()
@validate_json
@get_user_id
def edit_article(data: dict[str, Any], user_id: int):
    schema = ArticleSchema.model_validate(data)
    article = update_article(db.session, schema, user_id)
    logger.info(
        "Article updated: id=%d title=%r user_id=%d", article.id, article.title, user_id
    )
    return (jsonify(article.to_dict()), 200)


@articles_bp.route("", methods=["DELETE"])
@jwt_required()
@validate_json
@get_user_id
def delete_articles(data: dict[str, Any], user_id: int):
    schema = IDSchema.model_validate(data)
    articles = remove_articles(db.session, schema.ids, user_id)
    logger.info(
        "Articles deleted: ids=%s user_id=%d count=%d",
        schema.ids,
        user_id,
        len(articles),
    )
    return (
        jsonify(
            {
                "deleted": articles,
                "count": len(articles),
            }
        ),
        200,
    )


@articles_bp.route("/metadata", methods=["POST"])
@validate_json
@jwt_required()
@get_user_id
def parse_article(data: dict[str, Any], user_id: int):
    schema = BasicSchema.model_validate(data)
    url = schema.name
    parser = get_metadata(db.session, url, user_id)
    return jsonify(
        {
            "title": parser.title,
            "author": parser.author,
            "date": parser.date,
            "url": url,
        }
    ), 200
