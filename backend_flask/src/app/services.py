from typing import TypeVar

from sqlalchemy import select

from app.database import Base, db

from app.types import EntitiesNotFoundError

ModelType = TypeVar("ModelType", bound=Base)


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
