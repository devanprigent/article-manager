from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
)
from sqlalchemy import select
from werkzeug.security import check_password_hash, generate_password_hash

from app.database import db
from app.exceptions import EntityDuplicatedError, InvalidCredentialsError
from app.models import User


def register_user(username: str, password: str) -> tuple[int, str, str]:
    password_hash = generate_password_hash(password)
    stmt = select(User).where(User.name == username)
    user = db.session.execute(stmt).scalars().first()

    if user is not None:
        raise EntityDuplicatedError("Register user", None, "username", username)

    user = User(name=username, password_hash=password_hash)
    db.session.add(user)
    db.session.commit()
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))
    return user.id, access_token, refresh_token


def login_user(username: str, password: str) -> tuple[int, str, str]:
    stmt = select(User).where(User.name == username)
    user = db.session.execute(stmt).scalars().first()

    if user is None or not check_password_hash(user.password_hash, password):
        raise InvalidCredentialsError("Wrong username or password")

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))
    return user.id, access_token, refresh_token
