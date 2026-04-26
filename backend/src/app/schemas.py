from typing import Annotated

from pydantic import BaseModel, Field, PositiveInt


class ArticleSchema(BaseModel):
    id: int | None = None
    title: str = Field(..., min_length=1)
    author: str = Field(..., min_length=1)
    url: str = Field(..., min_length=1)
    year: PositiveInt
    summary: str | None = None
    read: bool
    read_again: bool
    favorite: bool
    tags: list[Annotated[str, Field(min_length=1)]]


class BasicSchema(BaseModel):
    name: str = Field(..., min_length=1)


class IDSchema(BaseModel):
    ids: list[PositiveInt]


class UserSchema(BaseModel):
    name: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)
