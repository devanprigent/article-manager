from flask import Blueprint, jsonify
from flask_jwt_extended import create_access_token, jwt_required
from sqlalchemy import select
from werkzeug.security import check_password_hash, generate_password_hash

from app.database import db
from app.decorators import validate_json
from app.models import User
from app.schemas import UserSchema

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/register", methods=["POST"])
@validate_json
def register(data):
    schema = UserSchema.model_validate(data)
    username = schema.name
    password = schema.password
    password_hash = generate_password_hash(password)

    stmt = select(User).where(User.name == username)
    user = db.session.execute(stmt).scalars().first()
    if user is not None:
        return jsonify({"error": "Username unavailable"}), 409

    user = User(name=username, password_hash=password_hash)
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=str(user.id))
    return jsonify(access_token=access_token), 201


@auth_bp.route("/login", methods=["POST"])
@validate_json
def login(data):
    schema = UserSchema.model_validate(data)
    username = schema.name
    password = schema.password

    stmt = select(User).where(User.name == username)
    user = db.session.execute(stmt).scalars().first()

    if user is None or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Wrong username or password"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify(access_token=access_token), 200


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    return jsonify({"msg": "Successfully logged out"}), 200
