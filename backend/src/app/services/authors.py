from collections.abc import Sequence

from sqlalchemy import Row, func, select

from app.exceptions import EntityDuplicatedError
from app.models import Article, Author
from app.services.common import get_entities, get_or_create_by_name
from app.types import DbSession


def get_authors(session: DbSession, user_id: int) -> Sequence[Author]:
    stmt = select(Author).where(Author.user_id == user_id)
    authors = session.execute(stmt).scalars().all()
    return authors


def get_top_authors(
    session: DbSession, user_id: int
) -> Sequence[Row[tuple[Author, int]]]:
    nb_articles = func.count(Article.id).label("nb_articles")
    stmt = (
        select(Author, nb_articles)
        .where(Author.user_id == user_id)
        .join(Article, Article.author_id == Author.id, isouter=True)
        .group_by(Author.id)
        .order_by(nb_articles.desc(), Author.name.asc())
    )
    authors_count = session.execute(stmt).all()
    return authors_count


def create_author(session: DbSession, name: str, user_id: int) -> Author:
    author = get_or_create_by_name(session, Author, name, user_id)
    session.commit()
    return author


def get_articles_by_author(
    session: DbSession, author_id: int, user_id: int
) -> Sequence[Article]:
    stmt = select(Article).where(
        Article.author_id == author_id, Article.user_id == user_id
    )
    articles = session.execute(stmt).scalars().all()
    return articles


def remove_authors(
    session: DbSession, author_ids: list[int], user_id: int
) -> Sequence[Author]:
    authors = list(get_entities(session, author_ids, Author, user_id))
    for author in authors:
        articles = get_articles_by_author(session, author.id, user_id)
        if articles:
            raise EntityDuplicatedError(
                "Operation blocked because author has associated articles.",
                user_id,
                "",
                author.name,
            )
        session.delete(author)
    session.commit()
    return authors
