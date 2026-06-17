import logging
from typing import Any

from flask import Blueprint, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
)
from sqlalchemy import select
from werkzeug.security import check_password_hash, generate_password_hash

from app.database import db
from app.decorators import get_user_id, validate_json
from app.models import User
from app.schemas import UserSchema
from app.services import get_entity

logger = logging.getLogger("article_manager.auth")

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/register", methods=["POST"])
@validate_json
def register(data: dict[str, Any]):
    schema = UserSchema.model_validate(data)
    username = schema.name
    password = schema.password
    password_hash = generate_password_hash(password)

    stmt = select(User).where(User.name == username)
    user = db.session.execute(stmt).scalars().first()
    if user is not None:
        logger.warning("Register failed — username already taken: %r", username)
        return jsonify({"error": "Username unavailable"}), 409

    user = User(name=username, password_hash=password_hash)
    db.session.add(user)
    db.session.commit()
    logger.info("User registered: id=%d name=%r", user.id, username)

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    response = jsonify({"msg": "Successfully logged-in"})
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)
    return response, 201


@auth_bp.route("/login", methods=["POST"])
@validate_json
def login(data: dict[str, Any]):
    schema = UserSchema.model_validate(data)
    username = schema.name
    password = schema.password

    stmt = select(User).where(User.name == username)
    user = db.session.execute(stmt).scalars().first()

    if user is None or not check_password_hash(user.password_hash, password):
        logger.warning("Login failed — wrong credentials for username: %r", username)
        return jsonify({"error": "Wrong username or password"}), 401

    logger.info("User logged in: id=%d name=%r", user.id, username)
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    response = jsonify({"msg": "Successfully logged-in"})
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)
    return response, 200


@auth_bp.route("/session", methods=["GET"])
@jwt_required()
@get_user_id
def session(user_id: int):
    logger.info("Session verified: user_id=%d", user_id)
    user = get_entity(db.session, user_id, User)
    return jsonify({"id": user_id, "name": user.name}), 200


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
@get_user_id
def refresh(user_id: int):
    logger.info("Token refreshed: user_id=%d", user_id)
    access_token = create_access_token(identity=str(user_id))
    response = jsonify({"msg": "Refresh successful"})
    set_access_cookies(response, access_token)
    return response, 200


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    logger.info("User logged out")
    response = jsonify({"msg": "Successfully logged-out"})
    unset_jwt_cookies(response)
    return response, 200
