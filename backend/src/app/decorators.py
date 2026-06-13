from functools import wraps

from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity
from werkzeug.exceptions import BadRequest


def validate_json(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if not request.is_json:
            return jsonify({"error": "Must be a JSON"}), 400
        data = request.get_json()
        if not data:
            return jsonify({"error": "JSON body is required"}), 400
        return fn(*args, data=data, **kwargs)

    return wrapper


def get_user_id(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user_id = int(get_jwt_identity())
        return fn(*args, user_id=user_id, **kwargs)

    return wrapper

MAX_LIMIT = 1000

def get_pagination(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        offset = request.args.get("offset", type=int)
        limit = request.args.get("limit", type=int)
        if offset is not None and offset < 0:
            raise BadRequest("Offset should be greater than or equal to 0.")
        if limit is not None and limit <= 0:
            raise BadRequest("Limit should be greater than 0.")
        if limit is not None and limit > MAX_LIMIT:                          # 👈 new
            raise BadRequest(f"Limit should not exceed {MAX_LIMIT}.")        # 👈 new
        return fn(*args, offset=offset, limit=limit, **kwargs)

    return wrapper