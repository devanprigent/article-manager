import logging
from typing import Annotated

from fastapi import APIRouter, Depends

from app.dependencies import DbSession, UserId, get_pagination
from app.exceptions import ClientInputError
from app.schemas import ArticleResponse, PaginatedArticlesResponse
from app.services import search_query
from app.types import Pagination

logger = logging.getLogger("article_manager.search")

router = APIRouter(prefix="/search")


@router.get("")
def search(
    db: DbSession,
    q: str,
    user_id: UserId,
    pagination: Annotated[Pagination, Depends(get_pagination)],
) -> PaginatedArticlesResponse:

    if not q:
        raise ClientInputError("Invalid query")

    articles, total = search_query(db, q, pagination.offset, pagination.limit, user_id)
    logger.debug(
        "Listed %d articles for user_id=%d with filter=%s",
        len(articles),
        user_id,
        q,
    )
    return PaginatedArticlesResponse(
        data=[ArticleResponse.from_model(a) for a in articles],
        total=total,
        offset=pagination.offset,
        limit=pagination.limit,
    )
