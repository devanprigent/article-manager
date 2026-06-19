from functools import wraps
from hmac import compare_digest

from flask import g, jsonify, request

from app.auth.tokens import decode_token
from app.constants import ACCESS_COOKIE_NAME, CSRF_METHODS, REFRESH_COOKIE_NAME
from app.exceptions import AuthenticationError, ClientInputError
from app.settings import get_settings


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
        return fn(*args, user_id=g.user_id, **kwargs)

    return wrapper


def jwt_required(*, refresh: bool = False):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            settings = get_settings()
            cookie_name = REFRESH_COOKIE_NAME if refresh else ACCESS_COOKIE_NAME
            token = request.cookies.get(cookie_name)
            if not token:
                raise AuthenticationError()
            payload = decode_token(token, settings, refresh=refresh)
            if settings.jwt_cookie_csrf_protect and request.method in CSRF_METHODS:
                csrf_header = request.headers.get("X-CSRF-TOKEN")
                if not csrf_header:
                    raise AuthenticationError()
                token_csrf = payload.get("csrf")
                if not token_csrf or not compare_digest(csrf_header, token_csrf):
                    raise AuthenticationError()
            g.user_id = int(payload["sub"])
            return fn(*args, **kwargs)

        return wrapper

    return decorator


MAX_LIMIT = 1000


def get_pagination(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        offset = request.args.get("offset", type=int)
        limit = request.args.get("limit", type=int)
        if offset is not None and offset < 0:
            raise ClientInputError("Offset should be greater than or equal to 0.")
        if limit is not None and limit <= 0:
            raise ClientInputError("Limit should be greater than 0.")
        if limit is not None and limit > MAX_LIMIT:
            raise ClientInputError(f"Limit should not exceed {MAX_LIMIT}.")
        return fn(*args, offset=offset, limit=limit, **kwargs)

    return wrapper
