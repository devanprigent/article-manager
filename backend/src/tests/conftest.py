import socket
from types import SimpleNamespace

import pytest
from fastapi.testclient import TestClient

import app.database as database
from app import create_app
from app.settings import Settings
from tests.constants import DEFAULT_PARSER_HTML
from tests.helpers import get_csrf_header


@pytest.fixture()
def app():
    app = create_app(
        settings=Settings(
            database_url="sqlite:///:memory:",
            secret_key="test-key",
            jwt_secret_key="very-very-very-long-test-jwt-key",
            jwt_cookie_secure=False,
            testing=True,
            _env_file=None,
        )
    )
    database.Base.metadata.create_all(database.engine)
    yield app
    database.Base.metadata.drop_all(database.engine)


@pytest.fixture()
def client(app):
    return TestClient(app)


@pytest.fixture()
def auth_headers(client) -> dict[str, str]:
    res = client.post("/auth/register", json={"name": "Test", "password": "12345678"})
    assert res.status_code == 201
    return get_csrf_header(res, "access")


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

        def put(self, *args, **kwargs):
            headers = kwargs.pop("headers", {})
            headers = {**auth_headers, **headers}
            return client.put(*args, headers=headers, **kwargs)

        def delete(self, *args, **kwargs):
            headers = kwargs.pop("headers", {})
            headers = {**auth_headers, **headers}
            json_body = kwargs.pop("json", None)
            if json_body is not None:
                return client.request(
                    "DELETE", *args, json=json_body, headers=headers, **kwargs
                )
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
            "consulted": True,
            "read_later": True,
            "liked": True,
            "author": "Cal Newport",
            "tags": [],
        },
        {
            "title": "So Good They Can't Ignore You",
            "url": "https://example.com/so-good",
            "year": 2012,
            "summary": "Why skills trump passion in the quest for work you love.",
            "consulted": True,
            "read_later": False,
            "liked": False,
            "author": "Cal Newport",
            "tags": [],
        },
        {
            "title": "Digital Minimalism",
            "url": "https://example.com/digital-minimalism",
            "year": 2019,
            "summary": "Choosing a focused life in a noisy world.",
            "consulted": False,
            "read_later": True,
            "liked": False,
            "author": "Cal Newport",
            "tags": [],
        },
        {
            "title": "The Way of Kings",
            "url": "https://example.com/way-of-kings",
            "year": 2010,
            "summary": "Book 1 of The Stormlight Archive.",
            "consulted": True,
            "read_later": True,
            "liked": True,
            "author": "Brandon Sanderson",
            "tags": [],
        },
        {
            "title": "Mistborn: The Final Empire",
            "url": "https://example.com/mistborn",
            "year": 2006,
            "summary": "A heist in a world where ash falls from the sky.",
            "consulted": True,
            "read_later": False,
            "liked": True,
            "author": "Brandon Sanderson",
            "tags": [],
        },
        {
            "title": "Meditations on Moloch",
            "url": "https://example.com/meditations-on-moloch",
            "year": 2014,
            "summary": "On coordination failures and the forces that shape society.",
            "consulted": True,
            "read_later": False,
            "liked": True,
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
        assert r.status_code == 201


@pytest.fixture()
def author(auth_client, list_authors):
    r = auth_client.post("/authors", json=list_authors[0])
    assert r.status_code == 201
    return r.json()


@pytest.fixture()
def tag(auth_client):
    r = auth_client.post("/tags", json={"name": "Nature"})
    assert r.status_code == 201
    return r.json()


@pytest.fixture()
def mock_article():
    return {
        "title": "My article",
        "url": "https://example.com/article-1",
        "year": 2026,
        "summary": "Short summary",
        "consulted": False,
        "read_later": False,
        "liked": False,
        "author": "A famous author",
        "tags": ["Science-fiction"],
    }


@pytest.fixture()
def mock_article_2():
    return {
        "title": "Another article",
        "url": "https://example.com/article-2",
        "year": 2024,
        "summary": "A longer summary",
        "consulted": True,
        "read_later": True,
        "liked": True,
        "author": "Another famous author",
        "tags": ["Thriller"],
    }


@pytest.fixture()
def mock_article_incomplete():
    return {
        "title": "My article",
        "url": "https://example.com/article-1",
        "year": 2026,
        "summary": "Short summary",
        "consulted": False,
        "read_later": False,
        "liked": False,
    }


@pytest.fixture()
def article(auth_client, author, tag, mock_article_incomplete, list_authors):
    r_author = auth_client.post("/authors", json=list_authors[1])
    r_tags = auth_client.post("/tags", json={"name": "Personal Development"})
    assert r_author.status_code == 201
    assert r_tags.status_code == 201

    new_article = mock_article_incomplete.copy()
    new_article["author"] = r_author.json()["name"]
    new_article["tags"] = [r_tags.json()["name"]]
    r = auth_client.post("/articles", json=new_article)
    assert r.status_code == 201
    return r.json()


@pytest.fixture(autouse=True)
def mock_requests_get(monkeypatch):
    async def fake_get(url: str, *args, **kwargs):
        return SimpleNamespace(
            text=DEFAULT_PARSER_HTML,
            raise_for_status=lambda: None,
        )

    monkeypatch.setattr("httpx2.AsyncClient.get", fake_get)


@pytest.fixture(autouse=True)
def mock_getaddrinfo(request, monkeypatch):
    if "nomocksanitizer" in request.keywords:
        return

    def fake_getaddrinfo(hostname, port):
        return [
            (
                socket.AF_INET,
                socket.SOCK_STREAM,
                6,
                "",
                ("93.184.216.34", port),
            )
        ]

    monkeypatch.setattr("app.services.parser.socket.getaddrinfo", fake_getaddrinfo)
