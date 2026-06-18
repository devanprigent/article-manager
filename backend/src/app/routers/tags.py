import logging
from typing import Any

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.decorators import get_user_id, validate_json
from app.schemas import BasicSchema, DeleteResponse, IDSchema, NamedEntityResponse
from app.services import create_tag, get_tags, remove_tags
from app.sessions import get_session

logger = logging.getLogger("article_manager.tags")

tags_bp = Blueprint("tags", __name__, url_prefix="/tags")


@tags_bp.route("")
@jwt_required()
@get_user_id
def list_tags(user_id: int):
    tags = get_tags(get_session(), user_id)
    logger.debug("Listed %d tags for user_id=%d", len(tags), user_id)
    return jsonify(
        [
            NamedEntityResponse.model_validate(tag).model_dump(mode="json")
            for tag in tags
        ]
    ), 200


@tags_bp.route("", methods=["POST"])
@jwt_required()
@validate_json
@get_user_id
def add_tag(data: dict[str, Any], user_id: int):
    schema = BasicSchema.model_validate(data)
    tag = create_tag(get_session(), schema.name, user_id)
    logger.info(
        "Tag created/retrieved: id=%d name=%r user_id=%d", tag.id, tag.name, user_id
    )
    return jsonify(NamedEntityResponse.model_validate(tag).model_dump(mode="json")), 201


@tags_bp.route("", methods=["DELETE"])
@jwt_required()
@validate_json
@get_user_id
def delete_tags(data: dict[str, Any], user_id: int):
    schema = IDSchema.model_validate(data)
    tags = remove_tags(get_session(), schema.ids, user_id)
    tags_count = len(tags)
    logger.info(
        "Tags deleted: ids=%s user_id=%d count=%d", schema.ids, user_id, tags_count
    )
    return (
        jsonify(
            DeleteResponse[NamedEntityResponse](
                deleted=[NamedEntityResponse.model_validate(tag) for tag in tags],
                count=tags_count,
            ).model_dump(mode="json")
        ),
        200,
    )
