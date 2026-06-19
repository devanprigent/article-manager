import jwt
from fastapi import Response

from app.constants import (
    ACCESS_COOKIE_NAME,
    ACCESS_COOKIE_PATH,
    ACCESS_CSRF_COOKIE_NAME,
    REFRESH_COOKIE_NAME,
    REFRESH_CSRF_COOKIE_NAME,
)
from app.exceptions import AuthenticationError
from app.settings import Settings


def _csrf_from_token(encoded_token: str) -> str:
    payload = jwt.decode(
        encoded_token,
        options={"verify_signature": False},
        algorithms=["HS256"],
    )
    csrf = payload.get("csrf")
    if csrf is None:
        raise AuthenticationError("Invalid cookie")
    return str(csrf)


def _cookie_flags(settings: Settings) -> dict:
    return {
        "secure": settings.jwt_cookie_secure,
        "samesite": settings.jwt_cookie_samesite,
        "domain": settings.jwt_cookie_domain,
        "max_age": None,  # session cookie; expiry lives in JWT exp claim
    }


def set_access_cookies(
    response: Response, access_token: str, settings: Settings
) -> None:
    flags = _cookie_flags(settings)
    response.set_cookie(
        ACCESS_COOKIE_NAME,
        value=access_token,
        httponly=True,
        path=ACCESS_COOKIE_PATH,
        **flags,
    )
    if settings.jwt_cookie_csrf_protect and settings.jwt_csrf_in_cookies:
        response.set_cookie(
            ACCESS_CSRF_COOKIE_NAME,
            value=_csrf_from_token(access_token),
            httponly=False,
            path=settings.jwt_access_csrf_cookie_path,
            **flags,
        )


def set_refresh_cookies(
    response: Response, refresh_token: str, settings: Settings
) -> None:
    flags = _cookie_flags(settings)
    response.set_cookie(
        REFRESH_COOKIE_NAME,
        value=refresh_token,
        httponly=True,
        path=settings.jwt_refresh_cookie_path,
        **flags,
    )
    if settings.jwt_cookie_csrf_protect and settings.jwt_csrf_in_cookies:
        response.set_cookie(
            REFRESH_CSRF_COOKIE_NAME,
            value=_csrf_from_token(refresh_token),
            httponly=False,
            path=settings.jwt_refresh_csrf_cookie_path,
            **flags,
        )


def set_auth_cookies(
    response: Response,
    access_token: str,
    refresh_token: str,
    settings: Settings,
) -> None:
    set_access_cookies(response, access_token, settings)
    set_refresh_cookies(response, refresh_token, settings)


def unset_access_cookies(response: Response, settings: Settings) -> None:
    response.delete_cookie(
        ACCESS_COOKIE_NAME,
        path=ACCESS_COOKIE_PATH,
        domain=settings.jwt_cookie_domain,
        secure=settings.jwt_cookie_secure,
        httponly=True,
        samesite=settings.jwt_cookie_samesite,
    )
    if settings.jwt_cookie_csrf_protect and settings.jwt_csrf_in_cookies:
        response.delete_cookie(
            ACCESS_CSRF_COOKIE_NAME,
            path=settings.jwt_access_csrf_cookie_path,
            domain=settings.jwt_cookie_domain,
            secure=settings.jwt_cookie_secure,
            httponly=False,
            samesite=settings.jwt_cookie_samesite,
        )


def unset_refresh_cookies(response: Response, settings: Settings) -> None:
    response.delete_cookie(
        REFRESH_COOKIE_NAME,
        path=settings.jwt_refresh_cookie_path,
        domain=settings.jwt_cookie_domain,
        secure=settings.jwt_cookie_secure,
        httponly=True,
        samesite=settings.jwt_cookie_samesite,
    )
    if settings.jwt_cookie_csrf_protect and settings.jwt_csrf_in_cookies:
        response.delete_cookie(
            REFRESH_CSRF_COOKIE_NAME,
            path=settings.jwt_refresh_csrf_cookie_path,
            domain=settings.jwt_cookie_domain,
            secure=settings.jwt_cookie_secure,
            httponly=False,
            samesite=settings.jwt_cookie_samesite,
        )


def unset_jwt_cookies(response: Response, settings: Settings) -> None:
    unset_access_cookies(response, settings)
    unset_refresh_cookies(response, settings)
