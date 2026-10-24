import asyncio
import logging
from collections.abc import Sequence
from datetime import UTC, datetime

import httpx2
from sqlalchemy import select

from app.constants import RSS_REFRESH_INTERVAL
from app.exceptions import ParsingError
from app.models import RSS, Article, Author
from app.schemas import RssSchema
from app.services.common import (
    check_url_uniqueness,
    get_or_create_by_name,
)
from app.services.parser import RssEntry, RssParser
from app.types import DbSession

logger = logging.getLogger("article_manager.services.rss")


def create_rss_feed(session: DbSession, data: RssSchema, user_id: int) -> RSS:
    rss = RSS(
        user_id=user_id,
        site_name=data.site_name,
        site_url=data.site_url,
        site_rss_feed=data.site_rss_feed,
    )
    session.add(rss)
    session.commit()
    return rss


async def fetch_new_entries(rss: RSS) -> RssParser | None:
    try:
        parser = RssParser(rss.site_rss_feed, rss.last_element)
        await parser.fetch()
        return parser
    except (ParsingError, httpx2.HTTPError) as error:
        logger.info(
            "RSS feed refresh failed: id=%d url=%s",
            rss.id,
            rss.site_rss_feed,
            exc_info=error,
        )
        return None


def create_rss_article(
    session: DbSession, rss: RSS, entry: RssEntry, user_id: int
) -> Article:
    author = get_or_create_by_name(
        session, Author, entry.author or rss.site_name, user_id
    )
    article = Article(
        user_id=user_id,
        title=entry.title or entry.url,
        url=entry.url,
        year=(entry.published or datetime.now(UTC)).year,
        author_id=author.id,
        rss=True,
    )
    session.add(article)
    return article


def get_stale_rss_feeds(session: DbSession, user_id: int) -> Sequence[RSS]:
    threshold = datetime.now(UTC) - RSS_REFRESH_INTERVAL
    stmt = select(RSS).where(RSS.user_id == user_id,
                             RSS.last_fetched_at < threshold)
    return session.execute(stmt).scalars().all()


async def refresh_rss_feeds(session: DbSession, user_id: int) -> list[Article]:
    # Feeds fetched recently are skipped, so clients can call this freely.
    rss_feeds = get_stale_rss_feeds(session, user_id)
    # A failing feed must not prevent the others from being refreshed.
    parsers = await asyncio.gather(*(fetch_new_entries(rss) for rss in rss_feeds))
    fetched_at = datetime.now(UTC)
    articles: list[Article] = []
    seen_urls: set[str] = set()
    for rss, parser in zip(rss_feeds, parsers, strict=True):
        if parser is None:
            continue
        for entry in parser.entries:
            # The same URL can appear in several feeds or already be saved.
            if entry.url in seen_urls or not check_url_uniqueness(
                session, entry.url, user_id
            ):
                continue
            seen_urls.add(entry.url)
            articles.append(create_rss_article(session, rss, entry, user_id))
        rss.last_element = parser.latest_published or rss.last_element
        rss.last_fetched_at = fetched_at
    session.commit()
    return articles
