import uuid
from datetime import UTC, datetime

import jwt

from app.settings import Settings


def _base_payload(
    user_id: int, settings: Settings, token_type: str, expires_delta
) -> dict:
    now = datetime.now(UTC)
    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": now + expires_delta,
        "type": token_type,
        "fresh": False,
        "jti": str(uuid.uuid4()),
    }
    if settings.jwt_cookie_csrf_protect:
        payload["csrf"] = str(uuid.uuid4())
    return payload


def create_access_token(user_id: int, settings: Settings) -> str:
    payload = _base_payload(
        user_id, settings, "access", settings.jwt_access_token_expires
    )
    return jwt.encode(payload, settings.jwt_secret_key, algorithm="HS256")


def create_refresh_token(user_id: int, settings: Settings) -> str:
    payload = _base_payload(
        user_id, settings, "refresh", settings.jwt_refresh_token_expires
    )
    return jwt.encode(payload, settings.jwt_secret_key, algorithm="HS256")
