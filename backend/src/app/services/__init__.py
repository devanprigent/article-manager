"""Service layer public API."""

from app.services.articles import (
    create_article,
    get_articles,
    get_metadata,
    remove_articles,
    update_article,
)
from app.services.auth import login_user, register_user
from app.services.authors import (
    create_author,
    get_articles_by_author,
    get_authors,
    get_top_authors,
    remove_authors,
)
from app.services.common import (
    check_url_uniqueness,
    get_entities,
    get_entity,
    get_or_create_by_name,
    normalize_name,
    update_model_fields,
)
from app.services.tags import associate_tags, create_tag, get_tags, remove_tags

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
    "register_user",
    "login_user",
    "get_authors",
    "get_top_authors",
    "create_author",
    "remove_authors",
    "get_tags",
    "create_tag",
    "remove_tags",
]
