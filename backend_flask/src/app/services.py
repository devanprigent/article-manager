import re
import unicodedata
from typing import TypeVar

from sqlalchemy import select

from app.database import Base, db
from app.models import Article, Tag
from app.types import EntitiesNotFoundError

ModelType = TypeVar("ModelType", bound=Base)

def normalize_name(raw: str) -> str:
    s = unicodedata.normalize("NFKC", raw or "")
    s = re.sub(r"\s+", " ", s).strip()
    return s.casefold()

def get_or_create_by_name(model: type[ModelType], name: str) -> ModelType:
    normalized_name = normalize_name(name)
    stmt = select(model).where(model.normalized_name == normalized_name)
    entity = db.session.execute(stmt).scalars().first()
    if entity is None:
        new_entity = model(name=name,normalized_name=normalized_name)
        db.session.add(new_entity)
        db.session.flush()
        return new_entity
    return entity

def associate_tags(raw_tags: list[str]):
    seen = set()
    tags = []
    for raw_tag in raw_tags:
        key = normalize_name(raw_tag)
        if key in seen:
            continue
        seen.add(key)
        tags.append(get_or_create_by_name(Tag, raw_tag))
    return tags

def update_model_fields(instance, payload: dict, allowed_fields: set[str]) -> None:
    for field, value in payload.items():
        if field in allowed_fields:
            setattr(instance, field, value)

def get_entity(entity_id: int, model: type[ModelType]) -> ModelType:
    stmt = select(model).where(model.id == entity_id)
    entity = db.session.execute(stmt).scalars().first()
    if entity is None:
        raise EntitiesNotFoundError([entity_id], "Entity not found")
    return entity

def get_entities(ids: list[int], model: type[ModelType]) -> list[ModelType]:
    dedup_ids = set(ids)
    stmt = select(model).where(model.id.in_(dedup_ids))
    entities = db.session.execute(stmt).scalars().all()

    if len(entities) == len(dedup_ids):
        return entities

    found_ids = {entity.id for entity in entities}
    missing_ids = [i for i in dedup_ids if i not in found_ids]

    raise EntitiesNotFoundError(
        missing_ids, "One or several entities weren't found based on the provided ids"
    )


def get_articles_by_author(author_id: int):
    stmt = select(Article).where(Article.author_id == author_id)
    articles = db.session.execute(stmt).scalars().all()
    return articles
