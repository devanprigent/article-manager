from typing import Literal, Optional

from pydantic import BaseModel, Field, PositiveInt

class ArticleSchema(BaseModel):
    id: PositiveInt
    title: str = Field(..., min_length=1)
    author_id: PositiveInt
    url: str = Field(..., min_length=1)
    year: PositiveInt
    summary: Optional[str] = None
    read: bool
    read_again: bool
    favorite: bool
