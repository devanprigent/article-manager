from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

from app.models import Article


class ArticleResponse(BaseModel):
    id: int
    title: str
    author: str
    url: str
    year: int
    summary: str | None
    consulted: bool
    read_later: bool
    liked: bool
    tags: list[str]
    date_creation: datetime
    date_modification: datetime
    content: list[dict] | None = None

    @classmethod
    def from_model(cls, article: Article, include_content=False) -> "ArticleResponse":
        return cls(
            id=article.id,
            title=article.title,
            author=article.author.name,
            url=article.url,
            year=article.year,
            summary=article.summary,
            consulted=article.consulted,
            read_later=article.read_later,
            liked=article.liked,
            tags=[t.name for t in article.tags],
            date_creation=article.date_creation,
            date_modification=article.date_modification,
            content=article.content if include_content else None,
        )


class NamedEntityResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str


class PaginatedArticlesResponse(BaseModel):
    data: list[ArticleResponse]
    total: int
    offset: int | None
    limit: int | None


class ParsedArticleResponse(BaseModel):
    title: str
    author: str
    date: date
    url: str


class DeleteResponse[T](BaseModel):
    deleted: list[T]
    count: int


class TopAuthorResponse(BaseModel):
    author: str
    count: int
