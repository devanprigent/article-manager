from collections.abc import Sequence

from sqlalchemy import select

from app.models import Tag
from app.services.common import get_entities, get_or_create_by_name, normalize_name
from app.types import DbSession


def get_tags(session: DbSession, user_id: int) -> Sequence[Tag]:
    stmt = select(Tag).where(Tag.user_id == user_id)
    tags = session.execute(stmt).scalars().all()
    return tags


def create_tag(session: DbSession, name: str, user_id: int) -> Tag:
    tag = get_or_create_by_name(session, Tag, name, user_id)
    session.commit()
    return tag


def remove_tags(session: DbSession, tag_ids: list[int], user_id: int) -> list[dict]:
    tags = get_entities(session, tag_ids, Tag, user_id)
    tags_dict = [tag.to_dict() for tag in tags]
    for tag in tags:
        session.delete(tag)
    session.commit()
    return tags_dict


def associate_tags(session: DbSession, raw_tags: list[str], user_id: int) -> list[Tag]:
    seen = set()
    tags = []
    for raw_tag in raw_tags:
        key = normalize_name(raw_tag)
        if key in seen:
            continue
        seen.add(key)
        tags.append(get_or_create_by_name(session, Tag, raw_tag, user_id))
    return tags
