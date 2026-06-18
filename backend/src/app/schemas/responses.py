from pydantic import BaseModel, ConfigDict


class ArticleCreate:
    pass


class ArticleUpdate:
    pass


class ArticleResponse:
    pass


class ArticleDetailResponse:
    pass


class NamedEntityResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
