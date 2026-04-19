from functools import wraps
from flask import request, jsonify


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
