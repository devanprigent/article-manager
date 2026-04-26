import re
import unicodedata

from sqlalchemy import select

from app.database import Base, db
from app.models import Article, Tag
from app.types import EntitiesNotFoundError


def normalize_name(raw: str) -> str:
    s = unicodedata.normalize("NFKC", raw or "")
    s = re.sub(r"\s+", " ", s).strip()
    return s.casefold()


def get_or_create_by_name[T: Base](model: type[T], name: str, user_id: int) -> T:
    normalized_name = normalize_name(name)
    stmt = select(model).where(
        model.normalized_name == normalized_name, model.user_id == user_id
    )
    entity = db.session.execute(stmt).scalars().first()
    if entity is None:
        new_entity = model(name=name, normalized_name=normalized_name, user_id=user_id)
        db.session.add(new_entity)
        db.session.flush()
        return new_entity
    return entity


def check_url_uniqueness(url: str, user_id: int, existing_id: int | None = None):
    stmt = select(Article).where(Article.url == url, Article.user_id == user_id)
    entity = db.session.execute(stmt).scalars().first()
    return entity is None or entity.id == existing_id


def associate_tags(raw_tags: list[str], user_id: int):
    seen = set()
    tags = []
    for raw_tag in raw_tags:
        key = normalize_name(raw_tag)
        if key in seen:
            continue
        seen.add(key)
        tags.append(get_or_create_by_name(Tag, raw_tag, user_id))
    return tags


def update_model_fields(instance, payload: dict, allowed_fields: set[str]) -> None:
    for field, value in payload.items():
        if field in allowed_fields:
            setattr(instance, field, value)


def get_entity[T: Base](
    entity_id: int, model: type[T], user_id: int | None = None
) -> T:
    stmt = select(model).where(model.id == entity_id)
    if user_id is not None:
        stmt = stmt.where(model.user_id == user_id)
    entity = db.session.execute(stmt).scalars().first()
    if entity is None:
        raise EntitiesNotFoundError([entity_id], "Entity not found")
    return entity


def get_entities[T: Base](
    ids: list[int], model: type[T], user_id: int | None = None
) -> list[T]:
    dedup_ids = set(ids)
    stmt = select(model).where(model.id.in_(dedup_ids))
    if user_id is not None:
        stmt = stmt.where(model.user_id == user_id)
    entities = db.session.execute(stmt).scalars().all()

    if len(entities) == len(dedup_ids):
        return entities

    found_ids = {entity.id for entity in entities}
    missing_ids = [i for i in dedup_ids if i not in found_ids]

    raise EntitiesNotFoundError(
        missing_ids, "One or several entities weren't found based on the provided ids"
    )


def get_articles_by_author(author_id: int, user_id: int):
    stmt = select(Article).where(
        Article.author_id == author_id, Article.user_id == user_id
    )
    articles = db.session.execute(stmt).scalars().all()
    return articles
