import json
import re
import sys
import unicodedata
from datetime import datetime
from pathlib import Path

FLASK_BACKEND_SRC = Path(__file__).resolve().parents[1] / "backend_flask" / "src"
sys.path.insert(0, str(FLASK_BACKEND_SRC))

from app import create_app
from app.database import db
from app.models import Article, Author, Tag, User


def parse_datetime(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def normalize_name(raw: str) -> str:
    s = unicodedata.normalize("NFKC", raw or "")
    s = re.sub(r"\s+", " ", s).strip()
    return s.casefold()


def parse_json():
    DATA_PATH = Path("old_data.json")
    with DATA_PATH.open("r", encoding="utf-16") as f:
        rows = json.load(f)

    authors_names = set()
    articles = []
    tags = []

    for row in rows:
        fields = row["fields"]
        match row["model"]:
            case "article.article":
                authors_names.add(fields["author"])
                article = {
                    "title": fields["title"],
                    "user_id": 1,
                    "url": fields["url"],
                    "year": fields["year"],
                    "summary": fields["summary"],
                    "read": fields["read"],
                    "read_again": fields["read_again"],
                    "favorite": fields["favorite"],
                    "date_creation": parse_datetime(fields["date_creation"]),
                    "date_modification": parse_datetime(fields["date_modification"]),
                    "author": fields["author"],
                    "tags": fields["tags"],
                }
                articles.append(article)
            case "tag.tag":
                tag = {
                    "old_id": row["pk"],
                    "normalized_name": normalize_name(fields["name"]),
                    "user_id": 1,
                    "name": fields["name"],
                    "date_creation": parse_datetime(fields["date_creation"]),
                    "date_modification": parse_datetime(fields["date_modification"]),
                }
                tags.append(tag)

    return articles, authors_names, tags


app = create_app()

with app.app_context():
    user = db.session.get(User, 1)
    if user is None:
        raise RuntimeError("User 1 does not exist")

    articles, authors_names, tags = parse_json()

    author_by_normalized_name = {}
    for name in authors_names:
        author = Author(
            name=name,
            normalized_name=normalize_name(name),
            user_id=user.id,
        )
        db.session.add(author)
        db.session.flush()

        author_by_normalized_name[normalize_name(name)] = author

    tag_by_old_id = {}
    for tag_data in tags:
        tag = Tag(
            name=tag_data["name"],
            normalized_name=tag_data["normalized_name"],
            user_id=user.id,
            date_creation=tag_data["date_creation"],
            date_modification=tag_data["date_modification"],
        )
        db.session.add(tag)
        db.session.flush()

        tag_by_old_id[tag_data["old_id"]] = tag

    for article_data in articles:
        new_author = author_by_normalized_name[normalize_name(article_data["author"])]

        new_tags = [
            tag_by_old_id[legacy_tag_id]
            for legacy_tag_id in article_data["tags"]
            if legacy_tag_id in tag_by_old_id
        ]

        article = Article(
            user_id=article_data["user_id"],
            title=article_data["title"],
            url=article_data["url"],
            year=article_data["year"],
            summary=article_data["summary"],
            read=article_data["read"],
            read_again=article_data["read_again"],
            favorite=article_data["favorite"],
            date_creation=article_data["date_creation"],
            date_modification=article_data["date_modification"],
            author_id=new_author.id,
            tags=new_tags,
        )

        db.session.add(article)
        db.session.flush()

    print(len(authors_names), len(tags), len(articles))
    db.session.commit()
