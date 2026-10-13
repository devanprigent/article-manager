from collections.abc import Sequence

from sqlalchemy import select

from app.models import RSS
from app.schemas import RssSchema
from app.services.common import get_entities
from app.types import DbSession


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
