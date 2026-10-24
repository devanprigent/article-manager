from collections.abc import Sequence

from sqlalchemy import Row, func, select

from app.exceptions import EntityInUseError
from app.models import Article, Author
from app.services.common import get_entities_by_ids, get_or_create_by_name
from app.types import DbSession


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


def remove_authors(
    session: DbSession, author_ids: list[int], user_id: int
) -> Sequence[Author]:
    stmt = select(Article.author_id).where(
        Article.user_id == user_id,
        Article.author_id.in_(author_ids),
    )
    authors_with_articles = set(session.execute(stmt).scalars().all())

    authors = list(get_entities_by_ids(session, author_ids, Author, user_id))
    for author in authors:
        if author.id in authors_with_articles:
            raise EntityInUseError(
                f"Author {author.name!r} has associated articles and cannot be deleted."
            )
        session.delete(author)
    session.commit()
    return authors
