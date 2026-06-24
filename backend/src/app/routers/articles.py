import logging
from typing import Annotated

from fastapi import APIRouter, Depends

from app.dependencies import DbSession, UserId, get_pagination
from app.models import Article
from app.schemas import (
    ArticleResponse,
    ArticleSchema,
    BasicSchema,
    DeleteResponse,
    IDSchema,
    PaginatedArticlesResponse,
    ParsedArticleResponse,
)
from app.services import (
    create_article,
    get_articles,
    get_entity,
    get_metadata,
    remove_articles,
    update_article,
)
from app.types import Pagination

logger = logging.getLogger("article_manager.articles")

router = APIRouter(prefix="/articles")


@router.get("")
def list_articles(
    db: DbSession,
    user_id: UserId,
    pagination: Annotated[Pagination, Depends(get_pagination)],
) -> PaginatedArticlesResponse:
    articles, total = get_articles(db, pagination.offset, pagination.limit, user_id)
    logger.debug("Listed %d articles for user_id=%d", len(articles), user_id)
    return PaginatedArticlesResponse(
        data=[ArticleResponse.from_model(a) for a in articles],
        total=total,
        offset=pagination.offset,
        limit=pagination.limit,
    )


@router.get("/{article_id}")
def get_article(db: DbSession, user_id: UserId, article_id: int) -> ArticleResponse:
    article = get_entity(db, article_id, Article, user_id)
    logger.info(
        "Article fetched: id=%d title=%r user_id=%d", article.id, article.title, user_id
    )
    return ArticleResponse.from_model(article, include_content=True)


@router.post("", status_code=201)
async def add_article(
    db: DbSession, payload: ArticleSchema, user_id: UserId
) -> ArticleResponse:
    article = await create_article(db, payload, user_id)
    logger.info(
        "Article created: id=%d title=%r user_id=%d", article.id, article.title, user_id
    )
    return ArticleResponse.from_model(article)


@router.put("")
def edit_article(
    db: DbSession, payload: ArticleSchema, user_id: UserId
) -> ArticleResponse:
    article = update_article(db, payload, user_id)
    logger.info(
        "Article updated: id=%d title=%r user_id=%d", article.id, article.title, user_id
    )
    return ArticleResponse.from_model(article)


@router.delete("")
def delete_articles(
    db: DbSession, payload: IDSchema, user_id: UserId
) -> DeleteResponse[ArticleResponse]:
    articles = remove_articles(db, payload.ids, user_id)
    articles_count = len(articles)
    logger.info(
        "Articles deleted: ids=%s user_id=%d count=%d",
        payload.ids,
        user_id,
        articles_count,
    )
    return DeleteResponse[ArticleResponse](
        deleted=[ArticleResponse.from_model(article) for article in articles],
        count=articles_count,
    )


@router.post("/metadata")
async def parse_article(
    db: DbSession, payload: BasicSchema, user_id: UserId
) -> ParsedArticleResponse:
    url = payload.name
    parser = await get_metadata(db, url, user_id)
    return ParsedArticleResponse(
        title=parser.title, author=parser.author, date=parser.date, url=url
    )
