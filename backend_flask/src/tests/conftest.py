import pytest

from app import create_app
from app.database import db as _db


@pytest.fixture()
def app():
    app = create_app(
        {
            "TESTING": True,
            "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
            "SECRET_KEY": "test-key",
        }
    )
    yield app
    with app.app_context():
        _db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def auth_headers(client):
    res = client.post("/auth/register", json={"name": "Test", "password": "Test"})
    assert res.status_code == 201
    payload = res.get_json()
    token = payload["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def auth_client(client, auth_headers):
    class AuthClient:
        def get(self, *args, **kwargs):
            headers = kwargs.pop("headers", {})
            headers = {**auth_headers, **headers}
            return client.get(*args, headers=headers, **kwargs)

        def post(self, *args, **kwargs):
            headers = kwargs.pop("headers", {})
            headers = {**auth_headers, **headers}
            return client.post(*args, headers=headers, **kwargs)

        def delete(self, *args, **kwargs):
            headers = kwargs.pop("headers", {})
            headers = {**auth_headers, **headers}
            return client.delete(*args, headers=headers, **kwargs)

    return AuthClient()


@pytest.fixture()
def list_authors():
    return [
        {"name": "J.R.R Tolkien"},
        {"name": "Mark Manson"},
        {"name": "Cal Newport"},
        {"name": "Brandon Sanderson"},
        {"name": "Scott Alexander"},
    ]


@pytest.fixture()
def list_articles():
    return [
        {
            "title": "Deep Work",
            "url": "https://example.com/deep-work",
            "year": 2016,
            "summary": "Rules for focused success in a distracted world.",
            "read": True,
            "read_again": True,
            "favorite": True,
            "author": "Cal Newport",
            "tags": [],
        },
        {
            "title": "So Good They Can't Ignore You",
            "url": "https://example.com/so-good",
            "year": 2012,
            "summary": "Why skills trump passion in the quest for work you love.",
            "read": True,
            "read_again": False,
            "favorite": False,
            "author": "Cal Newport",
            "tags": [],
        },
        {
            "title": "Digital Minimalism",
            "url": "https://example.com/digital-minimalism",
            "year": 2019,
            "summary": "Choosing a focused life in a noisy world.",
            "read": False,
            "read_again": False,
            "favorite": True,
            "author": "Cal Newport",
            "tags": [],
        },
        {
            "title": "The Way of Kings",
            "url": "https://example.com/way-of-kings",
            "year": 2010,
            "summary": "Book 1 of The Stormlight Archive.",
            "read": True,
            "read_again": True,
            "favorite": True,
            "author": "Brandon Sanderson",
            "tags": [],
        },
        {
            "title": "Mistborn: The Final Empire",
            "url": "https://example.com/mistborn",
            "year": 2006,
            "summary": "A heist in a world where ash falls from the sky.",
            "read": True,
            "read_again": False,
            "favorite": True,
            "author": "Brandon Sanderson",
            "tags": [],
        },
        {
            "title": "Meditations on Moloch",
            "url": "https://example.com/meditations-on-moloch",
            "year": 2014,
            "summary": "On coordination failures and the forces that shape society.",
            "read": True,
            "read_again": False,
            "favorite": True,
            "author": "Scott Alexander",
            "tags": [],
        },
    ]


@pytest.fixture()
def create_list_authors_articles(auth_client, list_authors, list_articles):
    for author in list_authors:
        r = auth_client.post("/authors", json=author)
        assert r.status_code == 201
    for article in list_articles:
        r = auth_client.post("/articles", json=article)
        print(r.get_json())
        assert r.status_code == 201


@pytest.fixture()
def author(auth_client, list_authors):
    r = auth_client.post("/authors", json=list_authors[0])
    assert r.status_code == 201
    return r.get_json()


@pytest.fixture()
def tag(auth_client):
    r = auth_client.post("/tags", json={"name": "Nature"})
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
def article(auth_client, author, tag, mock_article, list_authors):
    r_author = auth_client.post("/authors", json=list_authors[1])
    r_tags = auth_client.post("/tags", json={"name": "Personal Development"})
    assert r_author.status_code == 201
    assert r_tags.status_code == 201

    new_article = mock_article.copy()
    new_article["author"] = r_author.get_json()["name"]
    new_article["tags"] = [r_tags.get_json()["name"]]
    r = auth_client.post("/articles", json=new_article)
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
            "tags": ["Literature"],
            "author": "Test",
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
            "tags": ["Politics"],
            "author": "Test 2",
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
            "tags": [""],
            "author": "Test 3",
        },
        422,
        [["tags", 0]],
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
            "tags": ["War", ""],
            "author": "Test 4",
        },
        422,
        [["tags", 1]],
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
            "tags": ["Science"],
            "author": "",
        },
        422,
        [["author"]],
    ),
]
