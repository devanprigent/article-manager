from sqlalchemy import select
from werkzeug.security import check_password_hash, generate_password_hash

from app.exceptions import EntityDuplicatedError, InvalidCredentialsError
from app.models import User
from app.types import DbSession


def register_user(session: DbSession, username: str, password: str) -> int:
    password_hash = generate_password_hash(password)
    stmt = select(User).where(User.name == username)
    user = session.execute(stmt).scalars().first()

    if user is not None:
        raise EntityDuplicatedError("Register user", None, "username", username)

    user = User(name=username, password_hash=password_hash)
    session.add(user)
    session.commit()

    return user.id


def login_user(session: DbSession, username: str, password: str) -> int:
    stmt = select(User).where(User.name == username)
    user = session.execute(stmt).scalars().first()

    if user is None or not check_password_hash(user.password_hash, password):
        raise InvalidCredentialsError("Wrong username or password")

    return user.id
