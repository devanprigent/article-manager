"""Service layer public API."""

from app.services.articles import (
    create_article,
    get_articles,
    get_metadata,
    remove_articles,
    update_article,
    update_rank,
)
from app.services.auth import login_user, register_user
from app.services.authors import (
    create_author,
    get_top_authors,
    remove_authors,
)
from app.services.common import (
    check_url_uniqueness,
    get_api,
    get_entities_by_ids,
    get_entity,
    get_or_create_by_name,
    list_owned,
    normalize_name,
    post_api,
    remove_owned,
    update_model_fields,
)
from app.services.parser import MetadataParser, RssParser
from app.services.rss import (
    create_rss_feed,
    refresh_rss_feeds,
)
from app.services.search import search_query
from app.services.tags import associate_tags, create_tag

__all__ = [
    "associate_tags",
    "check_url_uniqueness",
    "remove_owned",
    "get_articles",
    "create_article",
    "update_article",
    "update_rank",
    "remove_articles",
    "get_metadata",
    "get_entities_by_ids",
    "get_entity",
    "get_or_create_by_name",
    "list_owned",
    "normalize_name",
    "update_model_fields",
    "register_user",
    "login_user",
    "get_top_authors",
    "create_author",
    "remove_authors",
    "create_tag",
    "create_rss_feed",
    "refresh_rss_feeds",
    "search_query",
    "MetadataParser",
    "RssParser",
    "get_api",
    "post_api",
]
