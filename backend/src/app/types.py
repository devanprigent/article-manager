from dataclasses import dataclass
from typing import Protocol

from sqlalchemy.orm import Session


class HasPrimaryKey(Protocol):
    id: int


class UserScoped(HasPrimaryKey, Protocol):
    user_id: int


class NamedEntity(UserScoped, Protocol):
    normalized_name: str
    name: str

    def __init__(self, *, name: str, normalized_name: str, user_id: int) -> None: ...


DbSession = Session


@dataclass(frozen=True)
class Pagination:
    offset: int | None
    limit: int | None
