import asyncio
import logging
from collections.abc import Sequence

import httpx2
from sqlalchemy import func, select, update

from app.exceptions import (
    ClientInputError,
    EntityDuplicatedError,
    MetadataParsingError,
)
from app.models import Article, Author
from app.schemas import ArticleSchema, RankSchema
from app.services.common import (
    check_url_uniqueness,
    get_entities,
    get_entity,
    get_or_create_by_name,
    update_model_fields,
)
from app.services.parser import MetadataParser
from app.services.tags import associate_tags
from app.settings import Settings
from app.types import DbSession

logger = logging.getLogger("article_manager.services.articles")


def get_articles(
    session: DbSession,
    offset: int | None,
    limit: int | None,
    user_id: int,
    read_later: bool | None,
    liked: bool | None,
) -> tuple[Sequence[Article], int]:
    stmt = select(Article).where(Article.user_id == user_id)
    count_stmt = (
        select(func.count()).select_from(Article).where(Article.user_id == user_id)
    )
    if read_later is not None:
        stmt = stmt.where(Article.read_later == read_later)
        count_stmt = count_stmt.where(Article.read_later == read_later)
    if liked is not None:
        stmt = stmt.where(Article.liked == liked)
        count_stmt = count_stmt.where(Article.liked == liked)

    if read_later is True:
        stmt = stmt.order_by(Article.rank.asc(), Article.id.asc())
    else:
        stmt = stmt.order_by(Article.date_modification.desc(), Article.id.desc())

    if offset is not None:
        stmt = stmt.offset(offset)
    if limit is not None:
        stmt = stmt.limit(limit)

    articles = session.execute(stmt).scalars().all()
    total = session.execute(count_stmt).scalar_one()
    return articles, total


async def enrich_with_content(
    session: DbSession, user_id: int, url: str
) -> list[dict] | None:
    try:
        parser = await get_metadata(session, url, user_id)
        content = await asyncio.to_thread(parser.get_content)
        return content
    except MetadataParsingError as error:
        logger.info(
            "Article content enrichment failed for url=%s; continuing without content",
            url,
            exc_info=error,
        )
        return None


async def create_article(
    session: DbSession, settings: Settings, data: ArticleSchema, user_id: int
) -> Article:
    content = await enrich_with_content(session, user_id, data.url)
    tags = await resolve_article_tags(session, settings, data.tags, user_id, content)
    author = get_or_create_by_name(session, Author, data.author, user_id)
    session.execute(
        update(Article)
        .where(Article.user_id == user_id, Article.read_later.is_(True))
        .values(rank=Article.rank + 1)
    )
    article = Article(
        user_id=user_id,
        title=data.title,
        url=data.url,
        year=data.year,
        summary=data.summary,
        consulted=data.consulted,
        read_later=True,
        liked=data.liked,
        rank=0,
        author_id=author.id,
        tags=tags,
        content=content,
    )
    session.add(article)
    session.commit()
    return article


def rank_list_in_place(elements: list[int], old_rank: int, new_rank: int) -> None:
    if old_rank == new_rank:
        return
    item = elements.pop(old_rank)
    elements.insert(new_rank, item)


def update_rank(session: DbSession, data: RankSchema, user_id: int) -> list[Article]:
    articles, _ = get_articles(session, None, None, user_id, True, None)
    article_count = len(articles)
    if not (0 <= data.old_rank < article_count and 0 <= data.new_rank < article_count):
        raise ClientInputError(
            f"Ranks must be between 0 and {article_count - 1} (got old_rank={data.old_rank}, new_rank={data.new_rank})"
            if article_count
            else "No read-later articles to reorder"
        )

    ids = [article.id for article in articles]
    by_id = {article.id: article for article in articles}
    rank_list_in_place(ids, data.old_rank, data.new_rank)
    for index, article_id in enumerate(ids):
        by_id[article_id].rank = index
    session.commit()
    return [by_id[article_id] for article_id in ids]


def update_article(session: DbSession, data: ArticleSchema, user_id: int) -> Article:
    if data.id is None:
        raise ClientInputError("Article id is required for update")
    if not check_url_uniqueness(session, data.url, user_id, data.id):
        raise EntityDuplicatedError("Edit article", user_id, "URL", data.url)
    article = get_entity(session, data.id, Article, user_id)
    tags = associate_tags(session, data.tags, user_id)
    author = get_or_create_by_name(session, Author, data.author, user_id)
    payload = data.model_dump()
    payload["author_id"] = author.id
    payload["tags"] = tags
    update_model_fields(
        article,
        payload,
        {
            "title",
            "author_id",
            "tags",
            "url",
            "year",
            "summary",
            "consulted",
            "read_later",
            "liked",
        },
    )
    session.commit()
    return article


def remove_articles(
    session: DbSession, article_ids: list[int], user_id: int
) -> Sequence[Article]:
    articles = list(get_entities(session, article_ids, Article, user_id))

    for article in articles:
        # force relationships into memory before delete + commit
        _ = article.author.name
        _ = [t.name for t in article.tags]
        session.delete(article)

    session.commit()
    return articles


async def get_metadata(session: DbSession, url: str, user_id: int) -> MetadataParser:
    if not check_url_uniqueness(session, url, user_id):
        raise EntityDuplicatedError("Add article", user_id, "URL", url)
    try:
        parser = MetadataParser(url)
        await parser.fetch()
        await asyncio.to_thread(parser.parse)
        return parser
    except httpx2.HTTPError as error:
        logger.info("Article parsing failed with url: %s", url)
        raise MetadataParsingError(
            "Unable to fetch metadata from the provided URL. "
            "Please check that the URL is valid and reachable."
        ) from error


async def resolve_article_tags(
    session: DbSession,
    settings: Settings,
    raw_tags: list[str],
    user_id: int,
    content: list[dict] | None,
):
    if raw_tags:
        return associate_tags(session, raw_tags, user_id)
    return []
