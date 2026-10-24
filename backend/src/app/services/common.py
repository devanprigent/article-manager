import re
import unicodedata
from collections.abc import Sequence
from typing import Any, overload

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.exceptions import EntitiesNotFoundError
from app.models import Article
from app.types import HasPrimaryKey, NamedEntity, UserScoped


def normalize_name(raw: str) -> str:
    s = unicodedata.normalize("NFKC", raw or "")
    s = re.sub(r"\s+", " ", s).strip()
    return s.casefold()


def get_or_create_by_name[T: NamedEntity](
    session: Session, model: type[T], name: str, user_id: int
) -> T:
    normalized_name = normalize_name(name)
    query_model: Any = model
    stmt = select(model).where(
        query_model.normalized_name == normalized_name, query_model.user_id == user_id
    )
    entity = session.execute(stmt).scalars().first()
    if entity is None:
        new_entity = model(
            name=name, normalized_name=normalized_name, user_id=user_id)
        session.add(new_entity)
        session.flush()
        return new_entity
    return entity


def check_url_uniqueness(
    session: Session, url: str, user_id: int, existing_id: int | None = None
) -> bool:
    stmt = select(Article).where(
        Article.url == url, Article.user_id == user_id)
    entity = session.execute(stmt).scalars().first()
    return entity is None or entity.id == existing_id


def update_model_fields(instance, payload: dict, allowed_fields: set[str]) -> None:
    for field, value in payload.items():
        if field in allowed_fields:
            setattr(instance, field, value)


def list_owned[T: UserScoped](
    session: Session, model: type[T], user_id: int
) -> Sequence[T]:
    query_model: Any = model
    stmt = select(model).where(query_model.user_id == user_id)
    return session.execute(stmt).scalars().all()


def remove_owned[T: UserScoped](
    session: Session, model: type[T], ids: Sequence[int], user_id: int
) -> list[T]:
    entities = list(get_entities_by_ids(session, ids, model, user_id))
    for entity in entities:
        session.delete(entity)
    session.commit()
    return entities


@overload
def get_entity[T: HasPrimaryKey](
    session: Session, entity_id: int, model: type[T], user_id: None = None
) -> T: ...


@overload
def get_entity[T: UserScoped](
    session: Session, entity_id: int, model: type[T], user_id: int | None = None
) -> T: ...


def get_entity[T: HasPrimaryKey](
    session: Session, entity_id: int, model: type[T], user_id: int | None = None
) -> T:
    query_model: Any = model
    stmt = select(model).where(query_model.id == entity_id)
    if user_id is not None:
        stmt = stmt.where(query_model.user_id == user_id)
    entity = session.execute(stmt).scalars().first()
    if entity is None:
        raise EntitiesNotFoundError([entity_id], "Entity not found")
    return entity


@overload
def get_entities_by_ids[T: HasPrimaryKey](
    session: Session, ids: Sequence[int], model: type[T], user_id: None = None
) -> Sequence[T]: ...


@overload
def get_entities_by_ids[T: UserScoped](
    session: Session, ids: Sequence[int], model: type[T], user_id: int | None = None
) -> Sequence[T]: ...


def get_entities_by_ids[T: HasPrimaryKey](
    session: Session, ids: Sequence[int], model: type[T], user_id: int | None = None
) -> Sequence[T]:
    dedup_ids = set(ids)
    stmt = select(model).where(model.id.in_(dedup_ids))
    if user_id is not None:
        stmt = stmt.where(model.user_id == user_id)
    entities = session.execute(stmt).scalars().all()

    if len(entities) == len(dedup_ids):
        return entities

    found_ids = {entity.id for entity in entities}
    missing_ids = [i for i in dedup_ids if i not in found_ids]

    raise EntitiesNotFoundError(
        missing_ids, "One or several entities weren't found based on the provided ids"
    )

