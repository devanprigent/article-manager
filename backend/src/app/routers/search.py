import logging

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.decorators import get_pagination, get_user_id
from app.exceptions import ClientInputError
from app.schemas import ArticleResponse, PaginatedArticlesResponse
from app.services import search_query
from app.sessions import get_session

logger = logging.getLogger("article_manager.search")

search_bp = Blueprint("search", __name__, url_prefix="/search")


@search_bp.route("", methods=["GET"])
@jwt_required()
@get_user_id
@get_pagination
def search(user_id: int, offset: int | None = None, limit: int | None = None):
    query = request.args.get("q", "").strip()

    if not query:
        raise ClientInputError("Invalid query")

    articles, total = search_query(get_session(), query, offset, limit, user_id)
    logger.debug(
        "Listed %d articles for user_id=%d with filter=%s",
        len(articles),
        user_id,
        query,
    )
    return jsonify(
        PaginatedArticlesResponse(
            data=[ArticleResponse.from_model(a) for a in articles],
            total=total,
            offset=offset,
            limit=limit,
        ).model_dump(mode="json")
    ), 200
