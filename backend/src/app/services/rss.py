import asyncio
import logging
from collections.abc import Sequence
from datetime import UTC, datetime

import httpx2
from sqlalchemy import select

from app.exceptions import ParsingError
from app.models import RSS, Article, Author
from app.schemas import RssSchema
from app.services.common import (
    check_url_uniqueness,
    get_entities,
    get_or_create_by_name,
)
from app.services.parser import RssEntry, RssParser
from app.types import DbSession

logger = logging.getLogger("article_manager.services.rss")


def get_rss_feeds(session: DbSession, user_id: int) -> Sequence[RSS]:
    stmt = select(RSS).where(RSS.user_id == user_id)
    rss_feeds = session.execute(stmt).scalars().all()
    return rss_feeds


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


def remove_rss_feeds(session: DbSession, rss_ids: list[int], user_id: int) -> list[RSS]:
    rss_feeds = list(get_entities(session, rss_ids, RSS, user_id))
    for rss in rss_feeds:
        session.delete(rss)
    session.commit()
    return rss_feeds


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


async def refresh_rss_feeds(session: DbSession, user_id: int) -> list[Article]:
    rss_feeds = get_rss_feeds(session, user_id)
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
