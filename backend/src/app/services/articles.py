from collections.abc import Sequence

import requests
from sqlalchemy import func, select

from app.exceptions import ClientInputError, EntityDuplicatedError
from app.models import Article, Author
from app.parser import MetadataParser
from app.schemas import ArticleSchema
from app.services.common import (
    check_url_uniqueness,
    get_entities,
    get_entity,
    get_or_create_by_name,
    update_model_fields,
)
from app.services.tags import associate_tags
from app.types import DbSession


def get_articles(
    session: DbSession, offset: int | None, limit: int | None, user_id: int
) -> tuple[Sequence[Article], int]:
    stmt = (
        select(Article)
        .where(Article.user_id == user_id)
        .order_by(Article.date_modification.desc(), Article.id.desc())
    )
    if offset is not None:
        stmt = stmt.offset(offset)
    if limit is not None:
        stmt = stmt.limit(limit)
    articles = session.execute(stmt).scalars().all()
    count_stmt = (
        select(func.count()).select_from(Article).where(Article.user_id == user_id)
    )
    total = session.execute(count_stmt).scalar_one()
    return articles, total


def create_article(session: DbSession, data: ArticleSchema, user_id: int) -> Article:
    if not check_url_uniqueness(session, data.url, user_id):
        raise EntityDuplicatedError("Add article", user_id, "URL", data.url)
    parser = MetadataParser(data.url)
    content = parser.get_content()
    tags = associate_tags(session, data.tags, user_id)
    author = get_or_create_by_name(session, Author, data.author, user_id)
    article = Article(
        user_id=user_id,
        title=data.title,
        url=data.url,
        year=data.year,
        summary=data.summary,
        consulted=data.consulted,
        read_later=data.read_later,
        liked=data.liked,
        author_id=author.id,
        tags=tags,
        content=content,
    )
    session.add(article)
    session.commit()
    return article


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
        _ = article.author.name
        _ = [t.name for t in article.tags]
        session.delete(article)

    session.commit()
    return articles


def get_metadata(session: DbSession, url: str, user_id: int) -> MetadataParser:
    if not check_url_uniqueness(session, url, user_id):
        raise EntityDuplicatedError("Add article", user_id, "URL", url)

    try:
        parser = MetadataParser(url)
        parser.parse()
        return parser
    except requests.exceptions.RequestException as error:
        raise ClientInputError(
            "Unable to fetch metadata from the provided URL. "
            "Please check that the URL is valid and reachable."
        ) from error
