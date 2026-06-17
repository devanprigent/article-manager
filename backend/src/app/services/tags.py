from app.models import Tag
from app.services.common import get_or_create_by_name, normalize_name
from app.types import DbSession


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
