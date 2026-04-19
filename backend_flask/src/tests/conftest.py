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
def article():
    return {
        "title": "My article",
        "url": "https://example.com/article-1",
        "year": 2026,
        "summary": "Short summary",
        "read": False,
        "read_again": False,
        "favorite": False,
    }


INVALID_ARTICLE_CASES = [
    (
        {
            "url": "https://example.com/article-1",
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
            "url": "https://example.com/article-1",
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
            "url": "https://example.com/article-1",
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
            "url": "https://example.com/article-1",
            "year": 2026,
            "summary": "Short summary",
            "read": False,
            "read_again": False,
            "favorite": False,
            "tags_id": [1, 999],
            "author_id": 1,
        },
        404,
        None,
    ),
]
