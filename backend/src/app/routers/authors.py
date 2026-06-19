import logging

from fastapi import APIRouter

from app.dependencies import DbSession, UserId
from app.schemas import (
    BasicSchema,
    DeleteResponse,
    IDSchema,
    NamedEntityResponse,
    TopAuthorResponse,
)
from app.services import (
    create_author,
    get_authors,
    get_top_authors,
    remove_authors,
)

logger = logging.getLogger("article_manager.authors")

router = APIRouter(prefix="/authors")


@router.get("")
def list_authors(db: DbSession, user_id: UserId) -> list[NamedEntityResponse]:
    authors = get_authors(db, user_id)
    logger.debug("Listed %d authors for user_id=%d", len(authors), user_id)
    return [NamedEntityResponse.model_validate(author) for author in authors]


@router.get("/top")
def list_top_authors(db: DbSession, user_id: UserId) -> list[TopAuthorResponse]:
    authors_count = get_top_authors(db, user_id)
    logger.debug(
        "Top authors fetched for user_id=%d: %d results", user_id, len(authors_count)
    )
    return [
        TopAuthorResponse(author=author.name, count=count)
        for author, count in authors_count
    ]


@router.post("", status_code=201)
def add_author(
    db: DbSession, payload: BasicSchema, user_id: UserId
) -> NamedEntityResponse:
    author = create_author(db, payload.name, user_id)
    logger.info(
        "Author created/retrieved: id=%d name=%r user_id=%d",
        author.id,
        author.name,
        user_id,
    )
    return NamedEntityResponse.model_validate(author)


@router.delete("")
def delete_authors(
    db: DbSession, payload: IDSchema, user_id: UserId
) -> DeleteResponse[NamedEntityResponse]:
    authors = remove_authors(db, payload.ids, user_id)
    authors_count = len(authors)
    logger.info(
        "Authors deleted: ids=%s user_id=%d count=%d",
        payload.ids,
        user_id,
        authors_count,
    )
    return DeleteResponse[NamedEntityResponse](
        deleted=[NamedEntityResponse.model_validate(a) for a in authors],
        count=authors_count,
    )
