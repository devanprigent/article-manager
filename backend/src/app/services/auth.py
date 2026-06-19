from pwdlib import PasswordHash
from sqlalchemy import select

from app.exceptions import EntityDuplicatedError, InvalidCredentialsError
from app.models import User
from app.types import DbSession

password_hash = PasswordHash.recommended()


def register_user(session: DbSession, username: str, password: str) -> int:
    pwd_hash = password_hash.hash(password)
    stmt = select(User).where(User.name == username)
    user = session.execute(stmt).scalars().first()

    if user is not None:
        raise EntityDuplicatedError("Register user", None, "username", username)

    user = User(name=username, password_hash=pwd_hash)
    session.add(user)
    session.commit()

    return user.id


def login_user(session: DbSession, username: str, password: str) -> int:
    stmt = select(User).where(User.name == username)
    user = session.execute(stmt).scalars().first()

    if user is None or not password_hash.verify(password, user.password_hash):
        raise InvalidCredentialsError("Wrong username or password")

    return user.id
