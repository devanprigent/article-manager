import logging
from typing import Any

import requests
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import func, select
from werkzeug.exceptions import BadRequest

from app.database import db
from app.decorators import get_pagination, get_user_id, validate_json
from app.exceptions import EntityDuplicatedError
from app.models import Article, Author
from app.parser import MetadataParser
from app.schemas import ArticleSchema, BasicSchema, IDSchema
from app.services import (
    associate_tags,
    check_url_uniqueness,
    get_entities,
    get_entity,
    get_or_create_by_name,
    update_model_fields,
)

logger = logging.getLogger("article_manager.articles")

articles_bp = Blueprint("articles", __name__, url_prefix="/articles")


@articles_bp.route("", methods=["GET"])
@jwt_required()
@get_user_id
@get_pagination
def list_articles(user_id: int, offset: int | None = None, limit: int | None = None):
    stmt = (
        select(Article)
        .where(Article.user_id == user_id)
        .order_by(Article.date_modification.desc(), Article.id.desc())
    )
    if offset is not None:
        stmt = stmt.offset(offset)
    if limit is not None:
        stmt = stmt.limit(limit)
    articles = db.session.execute(stmt).scalars().all()
    logger.debug("Listed %d articles for user_id=%d", len(articles), user_id)
    count_stmt = (
        select(func.count()).select_from(Article).where(Article.user_id == user_id)
    )
    total = db.session.execute(count_stmt).scalar_one()
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
    if not check_url_uniqueness(db.session, schema.url, user_id):
        raise EntityDuplicatedError("Add article", user_id, "URL", schema.url)

    parser = MetadataParser(schema.url)
    content = parser.get_content()

    tags = associate_tags(db.session, schema.tags, user_id)
    author = get_or_create_by_name(db.session, Author, schema.author, user_id)

    article = Article(
        user_id=user_id,
        title=schema.title,
        url=schema.url,
        year=schema.year,
        summary=schema.summary,
        consulted=schema.consulted,
        read_later=schema.read_later,
        liked=schema.liked,
        author_id=author.id,
        tags=tags,
        content=content,
    )
    db.session.add(article)
    db.session.commit()
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
    if schema.id is None:
        logger.warning("Edit article failed — missing id for user_id=%d", user_id)
        return jsonify({"error": "Missing id"}), 400
    if not check_url_uniqueness(db.session, schema.url, user_id, schema.id):
        raise EntityDuplicatedError("Edit article", user_id, "URL", schema.url)
    article = get_entity(db.session, schema.id, Article, user_id)
    tags = associate_tags(db.session, schema.tags, user_id)
    author = get_or_create_by_name(db.session, Author, schema.author, user_id)
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
            "consulted",
            "read_later",
            "liked",
        },
    )
    db.session.commit()
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
    article_ids = schema.ids
    articles = get_entities(db.session, article_ids, Article, user_id)
    articles_dict = [article.to_dict() for article in articles]
    for article in articles:
        db.session.delete(article)
    db.session.commit()
    logger.info(
        "Articles deleted: ids=%s user_id=%d count=%d",
        schema.ids,
        user_id,
        len(articles),
    )
    return (
        jsonify(
            {
                "deleted": articles_dict,
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

    if not check_url_uniqueness(db.session, url, user_id):
        raise EntityDuplicatedError("Add article", user_id, "URL", url)

    try:
        parser = MetadataParser(url)
        parser.parse()
    except requests.exceptions.RequestException as error:
        raise BadRequest(
            "Unable to fetch metadata from the provided URL. "
            "Please check that the URL is valid and reachable."
        ) from error
    return jsonify(
        {
            "title": parser.title,
            "author": parser.author,
            "date": parser.date,
            "url": url,
        }
    ), 200
