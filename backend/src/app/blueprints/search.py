import logging

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy import String, cast, func, or_, select
from werkzeug.exceptions import BadRequest

from app.database import db
from app.decorators import get_pagination, get_user_id
from app.models import Article, Author

logger = logging.getLogger("article_manager.search")

search_bp = Blueprint("search", __name__, url_prefix="/search")


@search_bp.route("", methods=["GET"])
@jwt_required()
@get_user_id
@get_pagination
def search(user_id: int, offset: int | None = None, limit: int | None = None):
    query = request.args.get("q", "").strip()

    if not query:
        raise BadRequest("Invalid query")

    pattern = f"%{query}%"
    stmt = (
        select(Article)
        .join(Article.author)
        .where(Article.user_id == user_id)
        .where(
            or_(
                Article.title.ilike(pattern),
                cast(Article.year, String).ilike(pattern),
                Author.name.ilike(pattern),
            )
        )
        .order_by(Article.date_modification.desc(), Article.id.desc())
    )
    if offset is not None:
        stmt = stmt.offset(offset)
    if limit is not None:
        stmt = stmt.limit(limit)
    articles = db.session.execute(stmt).scalars().all()
    logger.debug(
        "Listed %d articles for user_id=%d with filter=%s",
        len(articles),
        user_id,
        query,
    )
    count_stmt = (
        select(func.count())
        .select_from(Article)
        .join(Article.author)
        .where(Article.user_id == user_id)
        .where(
            or_(
                Article.title.ilike(pattern),
                cast(Article.year, String).ilike(pattern),
                Author.name.ilike(pattern),
            )
        )
    )
    total = db.session.execute(count_stmt).scalar_one()
    return jsonify(
        {"data": [article.to_dict() for article in articles], "total": total}
    ), 200
