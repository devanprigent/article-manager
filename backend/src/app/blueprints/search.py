import logging

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy import String, cast, or_, select
from werkzeug.exceptions import BadRequest

from app.database import db
from app.decorators import get_user_id
from app.models import Article, Author

logger = logging.getLogger("article_manager.search")

search_bp = Blueprint("search", __name__, url_prefix="/search")


@search_bp.route("", methods=["GET"])
@jwt_required()
@get_user_id
def search(user_id: int):
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
    articles = db.session.execute(stmt).scalars().all()
    return jsonify(
        {
            "data": [article.to_dict() for article in articles],
            "total": len(articles),
        }
    ), 200
