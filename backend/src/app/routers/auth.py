import logging
from typing import Any

from flask import Blueprint, jsonify

from app.auth import (
    create_access_token,
    create_refresh_token,
    set_access_cookies,
    set_auth_cookies,
    unset_jwt_cookies,
)
from app.decorators import get_user_id, jwt_required, validate_json
from app.models import User
from app.schemas import NamedEntityResponse, UserSchema
from app.services import get_entity, login_user, register_user
from app.sessions import get_session
from app.settings import get_settings

logger = logging.getLogger("article_manager.auth")

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/register", methods=["POST"])
@validate_json
def register(data: dict[str, Any]):
    schema = UserSchema.model_validate(data)
    user_id = register_user(get_session(), schema.name, schema.password)
    settings = get_settings()
    access_token = create_access_token(user_id, settings)
    refresh_token = create_refresh_token(user_id, settings)
    logger.info("User registered: id=%d name=%r", user_id, schema.name)
    response = jsonify({"msg": "Successfully registered"})
    set_auth_cookies(response, access_token, refresh_token, settings)
    return response, 201


@auth_bp.route("/login", methods=["POST"])
@validate_json
def login(data: dict[str, Any]):
    schema = UserSchema.model_validate(data)
    user_id = login_user(get_session(), schema.name, schema.password)
    settings = get_settings()
    access_token = create_access_token(user_id, settings)
    refresh_token = create_refresh_token(user_id, settings)
    logger.info("User logged in: id=%d name=%r", user_id, schema.name)
    response = jsonify({"msg": "Successfully logged-in"})
    set_auth_cookies(response, access_token, refresh_token, settings)
    return response, 200


@auth_bp.route("/session", methods=["GET"])
@jwt_required()
@get_user_id
def session(user_id: int):
    logger.info("Session verified: user_id=%d", user_id)
    user = get_entity(get_session(), user_id, User)
    return jsonify(
        NamedEntityResponse(id=user_id, name=user.name).model_dump(mode="json")
    ), 200


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
@get_user_id
def refresh(user_id: int):
    logger.info("Token refreshed: user_id=%d", user_id)
    settings = get_settings()
    access_token = create_access_token(user_id, settings)
    response = jsonify({"msg": "Refresh successful"})
    set_access_cookies(response, access_token, settings)
    return response, 200


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    logger.info("User logged out")
    response = jsonify({"msg": "Successfully logged-out"})
    settings = get_settings()
    unset_jwt_cookies(response, settings)
    return response, 200
