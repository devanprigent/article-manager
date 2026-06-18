from collections.abc import Sequence

from sqlalchemy import String, cast, func, or_, select

from app.models import Article, Author
from app.types import DbSession


def search_query(
    session: DbSession, query: str, offset: int | None, limit: int | None, user_id: int
) -> tuple[Sequence[Article], int]:
    pattern = f"%{query}%"
    stmt = (
        select(Article)
        .join(Article.author)
        .where(Article.user_id == user_id)
        .where(
            or_(
                Article.title.ilike(pattern),
                cast(Article.year, String).ilike(pattern),
                Author.name.ilike(pattern),
            )
        )
        .order_by(Article.date_modification.desc(), Article.id.desc())
    )
    if offset is not None:
        stmt = stmt.offset(offset)
    if limit is not None:
        stmt = stmt.limit(limit)
    articles = session.execute(stmt).scalars().all()

    count_stmt = (
        select(func.count())
        .select_from(Article)
        .join(Article.author)
        .where(Article.user_id == user_id)
        .where(
            or_(
                Article.title.ilike(pattern),
                cast(Article.year, String).ilike(pattern),
                Author.name.ilike(pattern),
            )
        )
    )
    total = session.execute(count_stmt).scalar_one()

    return articles, total
