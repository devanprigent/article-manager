from typing import TypeVar

from sqlalchemy import select

from app.database import Base, db
from app.models import Article
from app.types import EntitiesNotFoundError

ModelType = TypeVar("ModelType", bound=Base)


def get_entity(id: int, model: type[ModelType]) -> ModelType:
    entity = db.session.get(model, id)
    if entity is None:
        raise EntitiesNotFoundError(
            [id], f"{model.__name__} with id {id} was not found"
        )
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
