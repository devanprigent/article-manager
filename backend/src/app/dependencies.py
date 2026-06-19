from hmac import compare_digest
from typing import Annotated

from fastapi import Depends, Request
from sqlalchemy.orm import Session

from app.auth import decode_token
from app.constants import (
    ACCESS_COOKIE_NAME,
    CSRF_METHODS,
    MAX_LIMIT,
    REFRESH_COOKIE_NAME,
)
from app.database import get_db
from app.exceptions import AuthenticationError, ClientInputError
from app.settings import Settings, get_settings
from app.types import Pagination


def get_pagination(offset: int | None = None, limit: int | None = None):
    if offset is not None and offset < 0:
        raise ClientInputError("Offset should be greater than or equal to 0.")
    if limit is not None and limit <= 0:
        raise ClientInputError("Limit should be greater than 0.")
    if limit is not None and limit > MAX_LIMIT:
        raise ClientInputError(f"Limit should not exceed {MAX_LIMIT}.")
    return Pagination(offset=offset, limit=limit)


def require_jwt(*, refresh: bool = False):
    def _dependency(
        request: Request,
        settings: Annotated[Settings, Depends(get_settings)],
    ) -> int:
        cookie_name = REFRESH_COOKIE_NAME if refresh else ACCESS_COOKIE_NAME
        token = request.cookies.get(cookie_name)
        if not token:
            raise AuthenticationError("Invalid token")
        payload = decode_token(token, settings, refresh=refresh)
        if settings.jwt_cookie_csrf_protect and request.method in CSRF_METHODS:
            csrf_header = request.headers.get("X-CSRF-TOKEN")
            if not csrf_header:
                raise AuthenticationError("Invalid token")
            token_csrf = payload.get("csrf")
            if not token_csrf or not compare_digest(csrf_header, token_csrf):
                raise AuthenticationError("Invalid token")
        return int(payload["sub"])

    return _dependency


UserId = Annotated[int, Depends(require_jwt())]
RefreshUserId = Annotated[int, Depends(require_jwt(refresh=True))]
AppSettings = Annotated[Settings, Depends(get_settings)]
DbSession = Annotated[Session, Depends(get_db)]
