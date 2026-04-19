from typing import Literal, Optional

from pydantic import BaseModel, Field, PositiveInt


class ArticleSchema(BaseModel):
    title: str = Field(..., min_length=1)
    author_id: PositiveInt
    url: str = Field(..., min_length=1)
    year: PositiveInt
    summary: Optional[str] = None
    read: bool
    read_again: bool
    favorite: bool
    tags_id: list[PositiveInt]


class BasicSchema(BaseModel):
    name: str = Field(..., min_length=1)


class IDSchema(BaseModel):
    ids: list[PositiveInt]
