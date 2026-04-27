from functools import wraps

from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity


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
