from datetime import UTC, datetime

from sqlalchemy import JSON, Column, ForeignKey, Integer, Table, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False, unique=True)
    password_hash: Mapped[str] = mapped_column(nullable=False)
    date_creation: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(UTC), nullable=False
    )
    date_modification: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )


class Tag(Base):
    __tablename__ = "tag"
    __table_args__ = (
        UniqueConstraint(
            "user_id", "normalized_name", name="uq_tag_user_normalized_name"
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    normalized_name: Mapped[str] = mapped_column(nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    name: Mapped[str] = mapped_column(nullable=False)
    date_creation: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(UTC), nullable=False
    )
    date_modification: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )


class Author(Base):
    __tablename__ = "author"
    __table_args__ = (
        UniqueConstraint(
            "user_id", "normalized_name", name="uq_author_user_normalized_name"
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    normalized_name: Mapped[str] = mapped_column(nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    name: Mapped[str] = mapped_column(nullable=False)
    articles: Mapped[list["Article"]] = relationship(back_populates="author")
    date_creation: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(UTC), nullable=False
    )
    date_modification: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )


article_tag = Table(
    "article_tag",
    Base.metadata,
    Column("article_id", Integer, ForeignKey("article.id"), primary_key=True),
    Column(
        "tag_id", Integer, ForeignKey("tag.id", ondelete="CASCADE"), primary_key=True
    ),
)


class Article(Base):
    __tablename__ = "article"
    __table_args__ = (UniqueConstraint("user_id", "url", name="uq_article_user_url"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey("author.id"), nullable=False)
    author: Mapped["Author"] = relationship(back_populates="articles")
    url: Mapped[str] = mapped_column(nullable=False)
    year: Mapped[int] = mapped_column(nullable=False)
    content: Mapped[list[dict] | None] = mapped_column(JSON, nullable=True)
    summary: Mapped[str | None] = mapped_column(nullable=True)
    consulted: Mapped[bool] = mapped_column(default=False, nullable=False)
    read_later: Mapped[bool] = mapped_column(default=False, nullable=False)
    liked: Mapped[bool] = mapped_column(default=False, nullable=False)
    tags: Mapped[list["Tag"]] = relationship(secondary=article_tag)
    date_creation: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(UTC), nullable=False
    )
    date_modification: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )
