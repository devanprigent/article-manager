"""Service layer public API."""

from app.services.articles import (
    create_article,
    get_articles,
    get_articles_by_author,
    get_metadata,
    remove_articles,
    update_article,
)
from app.services.common import (
    check_url_uniqueness,
    get_entities,
    get_entity,
    get_or_create_by_name,
    normalize_name,
    update_model_fields,
)
from app.services.tags import associate_tags

__all__ = [
    "associate_tags",
    "check_url_uniqueness",
    "get_articles",
    "create_article",
    "update_article",
    "remove_articles",
    "get_metadata",
    "get_articles_by_author",
    "get_entities",
    "get_entity",
    "get_or_create_by_name",
    "normalize_name",
    "update_model_fields",
]
