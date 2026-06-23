import logging

from fastapi import APIRouter, Response

from app.auth import (
    create_access_token,
    create_refresh_token,
    set_access_cookies,
    set_auth_cookies,
    unset_jwt_cookies,
)
from app.dependencies import AppSettings, DbSession, RefreshUserId, UserId
from app.models import User
from app.schemas import AuthMessageResponse, NamedEntityResponse, UserSchema
from app.services import get_entity, login_user, register_user

logger = logging.getLogger("article_manager.auth")

router = APIRouter(prefix="/auth")


@router.post("/register", status_code=201)
def register(
    db: DbSession, payload: UserSchema, settings: AppSettings, response: Response
) -> AuthMessageResponse:
    logger.info("Registering user: name=%r", payload.name)

    user_id = register_user(db, payload.name, payload.password)
    access_token = create_access_token(user_id, settings)
    refresh_token = create_refresh_token(user_id, settings)
    set_auth_cookies(response, access_token, refresh_token, settings)

    logger.info("User registered: id=%d name=%r", user_id, payload.name)
    return AuthMessageResponse(msg="Successfully registered")


@router.post("/login")
def login(
    db: DbSession, payload: UserSchema, settings: AppSettings, response: Response
) -> AuthMessageResponse:
    logger.info("Logging user: name=%r", payload.name)

    user_id = login_user(db, payload.name, payload.password)
    access_token = create_access_token(user_id, settings)
    refresh_token = create_refresh_token(user_id, settings)
    set_auth_cookies(response, access_token, refresh_token, settings)

    logger.info("User logged in: id=%d name=%r", user_id, payload.name)
    return AuthMessageResponse(msg="Successfully logged-in")


@router.get("/session")
def session(db: DbSession, user_id: UserId) -> NamedEntityResponse:
    logger.info("Session verified: user_id=%d", user_id)
    user = get_entity(db, user_id, User)
    return NamedEntityResponse(id=user_id, name=user.name)


@router.post("/refresh")
def refresh(
    user_id: RefreshUserId, settings: AppSettings, response: Response
) -> AuthMessageResponse:
    logger.info("Token refreshed: user_id=%d", user_id)
    access_token = create_access_token(user_id, settings)
    set_access_cookies(response, access_token, settings)
    return AuthMessageResponse(msg="Refresh successful")


@router.post("/logout")
def logout(settings: AppSettings, response: Response) -> AuthMessageResponse:
    logger.info("User logged out")
    unset_jwt_cookies(response, settings)
    return AuthMessageResponse(msg="Successfully logged-out")
