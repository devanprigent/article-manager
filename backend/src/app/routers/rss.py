import logging

from fastapi import APIRouter

from app.dependencies import DbSession, UserId
from app.models import RSS
from app.schemas import (
    ArticleResponse,
    DeleteResponse,
    IDSchema,
    RssResponse,
    RssSchema,
)
from app.services import (
    create_rss_feed,
    list_owned,
    refresh_rss_feeds,
    remove_owned,
)

logger = logging.getLogger("article_manager.rss")

router = APIRouter(prefix="/rss")


@router.get("")
def list_rss_feeds(db: DbSession, user_id: UserId) -> list[RssResponse]:
    rss_feeds = list_owned(db, RSS, user_id)
    logger.debug("Listed %d RSS feeds for user_id=%d", len(rss_feeds), user_id)
    return [RssResponse.model_validate(rss) for rss in rss_feeds]


@router.post("", status_code=201)
def add_rss_feed(db: DbSession, payload: RssSchema, user_id: UserId) -> RssResponse:
    rss = create_rss_feed(db, payload, user_id)
    logger.info(
        "RSS feed created: id=%d site_name=%r user_id=%d",
        rss.id,
        rss.site_name,
        user_id,
    )
    return RssResponse.model_validate(rss)


@router.post("/refresh")
async def refresh_feeds(db: DbSession, user_id: UserId) -> list[ArticleResponse]:
    articles = await refresh_rss_feeds(db, user_id)
    logger.info(
        "RSS feeds refreshed: user_id=%d new_articles=%d", user_id, len(articles)
    )
    return [ArticleResponse.from_model(article) for article in articles]


@router.delete("")
def delete_rss_feeds(
    db: DbSession, payload: IDSchema, user_id: UserId
) -> DeleteResponse[RssResponse]:
    rss_feeds = remove_owned(db, RSS, payload.ids, user_id)
    rss_count = len(rss_feeds)
    logger.info(
        "RSS feeds deleted: ids=%s user_id=%d count=%d",
        payload.ids,
        user_id,
        rss_count,
    )
    return DeleteResponse[RssResponse](
        deleted=[RssResponse.model_validate(rss) for rss in rss_feeds],
        count=rss_count,
    )
