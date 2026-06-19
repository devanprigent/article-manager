import logging
from typing import Any

from flask import Blueprint, jsonify

from app.decorators import get_pagination, get_user_id, jwt_required, validate_json
from app.models import Article
from app.schemas import (
    ArticleResponse,
    ArticleSchema,
    BasicSchema,
    DeleteResponse,
    IDSchema,
    PaginatedArticlesResponse,
    ParsedArticleResponse,
)
from app.services import (
    create_article,
    get_articles,
    get_entity,
    get_metadata,
    remove_articles,
    update_article,
)
from app.sessions import get_session

logger = logging.getLogger("article_manager.articles")

articles_bp = Blueprint("articles", __name__, url_prefix="/articles")


@articles_bp.route("", methods=["GET"])
@jwt_required()
@get_user_id
@get_pagination
def list_articles(user_id: int, offset: int | None = None, limit: int | None = None):
    articles, total = get_articles(get_session(), offset, limit, user_id)
    logger.debug("Listed %d articles for user_id=%d", len(articles), user_id)
    return jsonify(
        PaginatedArticlesResponse(
            data=[ArticleResponse.from_model(a) for a in articles],
            total=total,
            offset=offset,
            limit=limit,
        ).model_dump(mode="json")
    ), 200


@articles_bp.route("/<int:article_id>", methods=["GET"])
@jwt_required()
@get_user_id
def get_article(user_id: int, article_id: int):
    article = get_entity(get_session(), article_id, Article, user_id)
    logger.info(
        "Article fetched: id=%d title=%r user_id=%d", article.id, article.title, user_id
    )
    return jsonify(
        ArticleResponse.from_model(article, include_content=True).model_dump(
            mode="json"
        )
    ), 200


@articles_bp.route("", methods=["POST"])
@jwt_required()
@validate_json
@get_user_id
def add_article(data: dict[str, Any], user_id: int):
    schema = ArticleSchema.model_validate(data)
    article = create_article(get_session(), schema, user_id)
    logger.info(
        "Article created: id=%d title=%r user_id=%d", article.id, article.title, user_id
    )
    return jsonify(ArticleResponse.from_model(article).model_dump(mode="json")), 201


@articles_bp.route("", methods=["PUT"])
@jwt_required()
@validate_json
@get_user_id
def edit_article(data: dict[str, Any], user_id: int):
    schema = ArticleSchema.model_validate(data)
    article = update_article(get_session(), schema, user_id)
    logger.info(
        "Article updated: id=%d title=%r user_id=%d", article.id, article.title, user_id
    )
    return (jsonify(ArticleResponse.from_model(article).model_dump(mode="json")), 200)


@articles_bp.route("", methods=["DELETE"])
@jwt_required()
@validate_json
@get_user_id
def delete_articles(data: dict[str, Any], user_id: int):
    schema = IDSchema.model_validate(data)
    articles = remove_articles(get_session(), schema.ids, user_id)
    articles_count = len(articles)
    logger.info(
        "Articles deleted: ids=%s user_id=%d count=%d",
        schema.ids,
        user_id,
        articles_count,
    )
    return (
        jsonify(
            DeleteResponse[ArticleResponse](
                deleted=[ArticleResponse.from_model(article) for article in articles],
                count=articles_count,
            ).model_dump(mode="json")
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
    parser = get_metadata(get_session(), url, user_id)
    return jsonify(
        ParsedArticleResponse(
            title=parser.title, author=parser.author, date=parser.date, url=url
        ).model_dump(mode="json")
    ), 200
