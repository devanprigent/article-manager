from sqlalchemy import select

from app.database import db
from app.models import Tag


def get_tags(ids: list[int]):
    stmt = select(Tag).where(Tag.id.in_(ids))
    tags = db.session.execute(stmt).scalars().all()

    if len(tags) == len(ids):
        return tags

    raise ValueError("One or several tags weren't found based on the provided ids")
