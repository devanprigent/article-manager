import pytest

from app import create_app
from app.database import db as _db


@pytest.fixture()
def app():
    app = create_app(
        {
            "TESTING": True,
            "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        }
    )
    yield app
    with app.app_context():
        _db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def author(client):
    r = client.post("/authors", json={"name": "J.R.R Tolkien"})
    assert r.status_code == 201
    return r.get_json()


@pytest.fixture()
def tag(client):
    r = client.post("/tags", json={"name": "Nature"})
    assert r.status_code == 201
    return r.get_json()


@pytest.fixture()
def mock_article():
    return {
        "title": "My article",
        "url": "https://example.com/article-1",
        "year": 2026,
        "summary": "Short summary",
        "read": False,
        "read_again": False,
        "favorite": False,
    }


@pytest.fixture()
def article(client, author, tag, mock_article):
    r_author = client.post("/authors", json={"name": "Mark Manson"})
    r_tags = client.post("/tags", json={"name": "Personal Development"})
    assert r_author.status_code == 201
    assert r_tags.status_code == 201

    new_article = mock_article.copy()
    new_article["author_id"] = r_author.get_json()["id"]
    new_article["tags_id"] = [r_tags.get_json()["id"]]
    r = client.post("/articles", json=new_article)
    assert r.status_code == 201
    return r.get_json()


INVALID_ARTICLE_CASES = [
    (
        {
            "url": "https://example.com/article-2",
            "year": 2026,
            "summary": "Short summary",
            "read": False,
            "read_again": False,
            "favorite": False,
            "tags_id": [1],
            "author_id": 1,
        },
        422,
        [["title"]],
    ),
    (
        {
            "title": "My article",
            "url": "https://example.com/article-3",
            "year": 2026,
            "summary": "Short summary",
            "tags_id": [1],
            "author_id": 1,
        },
        422,
        [["read"], ["read_again"], ["favorite"]],
    ),
    (
        {
            "title": "My article",
            "url": "https://example.com/article-4",
            "year": 2026,
            "summary": "Short summary",
            "read": False,
            "read_again": False,
            "favorite": False,
            "tags_id": [99],
            "author_id": 1,
        },
        404,
        None,
    ),
    (
        {
            "title": "My article",
            "url": "https://example.com/article-5",
            "year": 2026,
            "summary": "Short summary",
            "read": False,
            "read_again": False,
            "favorite": False,
            "tags_id": [1, 99],
            "author_id": 1,
        },
        404,
        None,
    ),
    (
        {
            "title": "My article",
            "url": "https://example.com/article-6",
            "year": 2026,
            "summary": "Short summary",
            "read": False,
            "read_again": False,
            "favorite": False,
            "tags_id": [1],
            "author_id": 99,
        },
        404,
        None,
    ),
]
