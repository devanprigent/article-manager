import logging
from typing import Any

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.database import db
from app.decorators import get_user_id, validate_json
from app.schemas import BasicSchema, IDSchema
from app.services import (
    create_author,
    get_authors,
    get_top_authors,
    remove_authors,
)

logger = logging.getLogger("article_manager.authors")

authors_bp = Blueprint("authors", __name__, url_prefix="/authors")


@authors_bp.route("")
@jwt_required()
@get_user_id
def list_authors(user_id: int):
    authors = get_authors(db.session, user_id)
    logger.debug("Listed %d authors for user_id=%d", len(authors), user_id)
    return jsonify([author.to_dict() for author in authors]), 200


@authors_bp.route("/top")
@jwt_required()
@get_user_id
def list_top_authors(user_id: int):
    authors_count = get_top_authors(db.session, user_id)
    logger.debug(
        "Top authors fetched for user_id=%d: %d results", user_id, len(authors_count)
    )
    return (
        jsonify(
            [
                {"author": author.to_dict()["name"], "count": count}
                for author, count in authors_count
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
    author = create_author(db.session, schema.name, user_id)
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
    authors = remove_authors(db.session, schema.ids, user_id)
    authors_count = len(authors)
    logger.info(
        "Authors deleted: ids=%s user_id=%d count=%d",
        schema.ids,
        user_id,
        authors_count,
    )
    return (
        jsonify(
            {
                "deleted": authors,
                "count": authors_count,
            }
        ),
        200,
    )
