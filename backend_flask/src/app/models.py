from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import db


class Tag(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False, unique=True)
    date_creation: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc), nullable=False
    )
    date_modification: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


    def to_dict(self):
        return {
            "name": self.name
        }


class Author(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    articles: Mapped[list["Article"]] = relationship(back_populates="author")
    date_creation: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc), nullable=False
    )
    date_modification: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def to_dict(self):
        return {
            "name": self.name
        }


article_tag = db.Table(
    "article_tag",
    db.Column("article_id", db.Integer, db.ForeignKey("article.id"), primary_key=True),
    db.Column("tag_id", db.Integer, db.ForeignKey("tag.id"), primary_key=True),
)


class Article(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(nullable=False)
    author_id: Mapped[int] = mapped_column(ForeignKey("author.id"), nullable=False)
    author: Mapped["Author"] = relationship(back_populates="articles")
    url: Mapped[str] = mapped_column(nullable=False, unique=True)
    year: Mapped[int] = mapped_column(nullable=False)
    summary: Mapped[Optional[str]] = mapped_column(nullable=True)
    read: Mapped[bool] = mapped_column(default=False, nullable=False)
    read_again: Mapped[bool] = mapped_column(default=False, nullable=False)
    favorite: Mapped[bool] = mapped_column(default=False, nullable=False)
    tags: Mapped[list["Tag"]] = relationship(secondary=article_tag)
    date_creation: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc), nullable=False
    )
    date_modification: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

def to_dict(self):
    return {
        "id": self.id,
        "title": self.title,
        "author_id": self.author_id,
        "author": (
            {"id": self.author.id, "name": self.author.name}
            if self.author is not None
            else None
        ),
        "url": self.url,
        "year": self.year,
        "summary": self.summary,
        "read": self.read,
        "read_again": self.read_again,
        "favorite": self.favorite,
        "tags": [{"id": t.id, "name": t.name} for t in self.tags],
        "date_creation": self.date_creation.isoformat(),
        "date_modification": self.date_modification.isoformat(),
    }

