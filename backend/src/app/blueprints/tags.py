from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import select

from app.database import db
from app.decorators import get_user_id, validate_json
from app.models import Tag
from app.schemas import BasicSchema, IDSchema
from app.services import get_entities, get_or_create_by_name

tags_bp = Blueprint("tags", __name__, url_prefix="/tags")


@tags_bp.route("")
@jwt_required()
@get_user_id
def list_tags(user_id):
    stmt = select(Tag).where(Tag.user_id == user_id)
    tags = db.session.execute(stmt).scalars().all()
    return jsonify([tag.to_dict() for tag in tags]), 200


@tags_bp.route("", methods=["POST"])
@jwt_required()
@validate_json
@get_user_id
def add_tag(data, user_id):
    schema = BasicSchema.model_validate(data)
    tag = get_or_create_by_name(Tag, schema.name, user_id)
    db.session.commit()
    return jsonify(tag.to_dict()), 201


@tags_bp.route("", methods=["DELETE"])
@jwt_required()
@validate_json
@get_user_id
def delete_tags(data, user_id):
    schema = IDSchema.model_validate(data)
    tags = get_entities(schema.ids, Tag, user_id)
    for tag in tags:
        db.session.delete(tag)
    db.session.commit()
    return (
        jsonify({"deleted": [tag.to_dict() for tag in tags], "count": len(tags)}),
        200,
    )
