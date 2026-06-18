from typing import Protocol

from sqlalchemy.orm import Mapped, Session


class HasPrimaryKey(Protocol):
    id: Mapped[int]


class UserScoped(HasPrimaryKey, Protocol):
    user_id: Mapped[int]


class NamedEntity(UserScoped, Protocol):
    normalized_name: Mapped[str]
    name: Mapped[str]

    def __init__(self, *, name: str, normalized_name: str, user_id: int) -> None:
        pass


DbSession = Session
