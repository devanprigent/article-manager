from collections.abc import Sequence

from sqlalchemy import Row, func, select
from sqlalchemy.orm import Session

from app.exceptions import EntityInUseError
from app.models import Article, Author
from app.services.common import get_or_create_by_name, remove_owned


def get_top_authors(
    session: Session, user_id: int
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


def create_author(session: Session, name: str, user_id: int) -> Author:
    author = get_or_create_by_name(session, Author, name, user_id)
    session.commit()
    return author


def remove_authors(
    session: Session, author_ids: list[int], user_id: int
) -> Sequence[Author]:
    stmt = (
        select(Author.name)
        .join(Article, Article.author_id == Author.id)
        .where(Author.user_id == user_id, Author.id.in_(author_ids))
        .distinct()
    )
    blocked = session.execute(stmt).scalars().all()
    if blocked:
        names = ", ".join(repr(name) for name in blocked)
        raise EntityInUseError(
            f"Authors with associated articles cannot be deleted: {names}"
        )
    return remove_owned(session, Author, author_ids, user_id)
