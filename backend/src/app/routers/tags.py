import logging

from fastapi import APIRouter

from app.dependencies import DbSession, UserId
from app.schemas import BasicSchema, DeleteResponse, IDSchema, NamedEntityResponse
from app.services import create_tag, get_tags, remove_tags

logger = logging.getLogger("article_manager.tags")

router = APIRouter(prefix="/tags")


@router.get("")
def list_tags(db: DbSession, user_id: UserId) -> list[NamedEntityResponse]:
    tags = get_tags(db, user_id)
    logger.debug("Listed %d tags for user_id=%d", len(tags), user_id)
    return [NamedEntityResponse.model_validate(tag) for tag in tags]


@router.post("", status_code=201)
def add_tag(
    db: DbSession, payload: BasicSchema, user_id: UserId
) -> NamedEntityResponse:
    tag = create_tag(db, payload.name, user_id)
    logger.info(
        "Tag created/retrieved: id=%d name=%r user_id=%d", tag.id, tag.name, user_id
    )
    return NamedEntityResponse.model_validate(tag)


@router.delete("")
def delete_tags(
    db: DbSession, payload: IDSchema, user_id: UserId
) -> DeleteResponse[NamedEntityResponse]:
    tags = remove_tags(db, payload.ids, user_id)
    tags_count = len(tags)
    logger.info(
        "Tags deleted: ids=%s user_id=%d count=%d", payload.ids, user_id, tags_count
    )
    return DeleteResponse[NamedEntityResponse](
        deleted=[NamedEntityResponse.model_validate(tag) for tag in tags],
        count=tags_count,
    )
