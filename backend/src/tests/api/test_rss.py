from datetime import timedelta
from types import SimpleNamespace

import httpx2
import pytest

from tests.helpers import call_endpoint

RSS_FEED = b"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Example Blog</title>
    <item>
      <title>First post</title>
      <link>https://example.com/first-post</link>
      <dc:creator>Jane Doe</dc:creator>
      <pubDate>Mon, 05 Oct 2099 10:30:00 +0200</pubDate>
    </item>
    <item>
      <title>Second post</title>
      <link>https://example.com/second-post</link>
      <pubDate>Fri, 02 Oct 2099 10:30:00 +0200</pubDate>
    </item>
    <item>
      <title>Old post</title>
      <link>https://example.com/old-post</link>
      <pubDate>Fri, 02 Oct 2025 10:30:00 +0200</pubDate>
    </item>
  </channel>
</rss>
"""


def patch_feed(monkeypatch) -> list[str]:
    fetched: list[str] = []

    async def fake_get(self, url, *args, **kwargs):
        fetched.append(url)
        return SimpleNamespace(content=RSS_FEED, raise_for_status=lambda: None)

    monkeypatch.setattr("httpx2.AsyncClient.get", fake_get)
    return fetched


@pytest.fixture()
def mock_feed(monkeypatch) -> list[str]:
    return patch_feed(monkeypatch)


@pytest.fixture(autouse=True)
def stale_feeds(monkeypatch):
    # New feeds count as just fetched: a negative interval makes them stale
    # right away, even within the clock's resolution.
    monkeypatch.setattr("app.services.rss.RSS_REFRESH_INTERVAL", timedelta(minutes=-1))


def test_list_rss(auth_client, rss):
    rss_feeds = call_endpoint(auth_client, "/rss")
    assert rss_feeds == [rss]


def test_list_rss_empty(auth_client):
    assert call_endpoint(auth_client, "/rss") == []


def test_list_rss_only_returns_own_feeds(client, auth_client, rss):
    client.cookies.clear()
    res = client.post("/auth/register", json={"name": "Other", "password": "12345678"})
    assert res.status_code == 201

    res_list = client.get("/rss")
    assert res_list.status_code == 200
    assert res_list.json() == []


@pytest.mark.parametrize("field", ["site_name", "site_url", "site_rss_feed"])
def test_add_rss_with_empty_field(auth_client, mock_rss, field):
    res = auth_client.post("/rss", json={**mock_rss, field: ""})
    assert res.status_code == 422


@pytest.mark.parametrize("field", ["site_name", "site_url", "site_rss_feed"])
def test_add_rss_with_missing_field(auth_client, mock_rss, field):
    payload = {k: v for k, v in mock_rss.items() if k != field}
    res = auth_client.post("/rss", json=payload)
    assert res.status_code == 422


def test_delete_rss(auth_client, rss):
    res_delete = auth_client.delete("/rss", json={"ids": [rss["id"]]})
    assert res_delete.status_code == 200
    payload = res_delete.json()
    assert payload["count"] == 1
    assert payload["deleted"] == [rss]

    res_again = auth_client.delete("/rss", json={"ids": [rss["id"]]})
    assert res_again.status_code == 404


def test_delete_several_rss(auth_client, rss, mock_rss):
    res = auth_client.post(
        "/rss", json={**mock_rss, "site_rss_feed": "https://example.com/other.xml"}
    )
    assert res.status_code == 201
    ids = [rss["id"], res.json()["id"]]

    res_delete = auth_client.delete("/rss", json={"ids": ids})
    assert res_delete.status_code == 200
    assert res_delete.json()["count"] == 2


def test_delete_unknown_rss(auth_client, rss):
    res_delete = auth_client.delete("/rss", json={"ids": [rss["id"], 999]})
    assert res_delete.status_code == 404
    assert res_delete.json()["missing_ids"] == [999]

    # Nothing is deleted when one of the ids is missing
    res_again = auth_client.delete("/rss", json={"ids": [rss["id"]]})
    assert res_again.status_code == 200


def test_refresh_feeds(auth_client, rss, mock_feed):
    res = auth_client.post("/rss/refresh")
    assert res.status_code == 200
    # Entries published before the feed was added are ignored
    articles = {article["url"]: article for article in res.json()}
    assert articles.keys() == {
        "https://example.com/first-post",
        "https://example.com/second-post",
    }
    first = articles["https://example.com/first-post"]
    assert first["title"] == "First post"
    assert first["author"] == "Jane Doe"
    assert first["year"] == 2099
    assert first["read_later"] is False
    # Falls back on the site name when the entry has no author
    assert articles["https://example.com/second-post"]["author"] == "Example Blog"


def test_refresh_feeds_only_imports_new_entries(auth_client, rss, mock_feed):
    assert len(auth_client.post("/rss/refresh").json()) == 2
    res = auth_client.post("/rss/refresh")
    assert res.status_code == 200
    assert res.json() == []


def test_refresh_feeds_skips_recently_fetched_feeds(
    auth_client, rss, mock_feed, monkeypatch
):
    monkeypatch.setattr("app.services.rss.RSS_REFRESH_INTERVAL", timedelta(minutes=30))
    # A feed that was just added counts as fetched
    res = auth_client.post("/rss/refresh")
    assert res.status_code == 200
    assert res.json() == []
    assert mock_feed == []


def test_refresh_feeds_refetches_stale_feeds(auth_client, rss, mock_feed):
    auth_client.post("/rss/refresh")
    auth_client.post("/rss/refresh")
    assert len(mock_feed) == 2


def test_refresh_feeds_skips_existing_articles(
    auth_client, rss, mock_article, monkeypatch
):
    res = auth_client.post(
        "/articles", json={**mock_article, "url": "https://example.com/first-post"}
    )
    assert res.status_code == 201

    # Patched afterwards: article creation also fetches the page content
    patch_feed(monkeypatch)
    res = auth_client.post("/rss/refresh")
    assert res.status_code == 200
    assert [a["url"] for a in res.json()] == ["https://example.com/second-post"]


@pytest.mark.parametrize(
    "param, expected_urls",
    [
        (
            "rss=true",
            {"https://example.com/first-post", "https://example.com/second-post"},
        ),
        ("rss=false", {"https://example.com/article-1"}),
    ],
)
def test_list_articles_filters_by_rss(
    auth_client, rss, mock_article, monkeypatch, param, expected_urls
):
    res = auth_client.post("/articles", json=mock_article)
    assert res.status_code == 201
    # Patched afterwards: article creation also fetches the page content
    patch_feed(monkeypatch)
    assert auth_client.post("/rss/refresh").status_code == 200

    response = call_endpoint(auth_client, "/articles", param)
    assert {article["url"] for article in response["data"]} == expected_urls
    assert response["total"] == len(expected_urls)


def test_remove_article_from_inbox(auth_client, rss, mock_feed):
    articles = auth_client.post("/rss/refresh").json()
    article = next(a for a in articles if a["url"] == "https://example.com/second-post")
    assert article["rss"] is True

    res = auth_client.put("/articles", json={**article, "rss": False})
    assert res.status_code == 200
    assert res.json()["rss"] is False

    inbox = call_endpoint(auth_client, "/articles", "rss=true")["data"]
    assert [a["url"] for a in inbox] == ["https://example.com/first-post"]


def test_move_inbox_articles_to_read_later_top(auth_client, rss, mock_feed):
    articles = auth_client.post("/rss/refresh").json()
    for article in articles:
        res = auth_client.put(
            "/articles", json={**article, "rss": False, "read_later": True}
        )
        assert res.status_code == 200

    assert call_endpoint(auth_client, "/articles", "rss=true")["data"] == []
    read_later = call_endpoint(auth_client, "/articles", "read_later=true")["data"]
    # The last article moved goes to the top, like a newly created one
    assert [a["url"] for a in read_later[:2]] == [
        articles[1]["url"],
        articles[0]["url"],
    ]


def test_refresh_feeds_ignores_failing_feed(auth_client, rss, monkeypatch):
    async def fake_get(*args, **kwargs):
        raise httpx2.ConnectError("unreachable")

    monkeypatch.setattr("httpx2.AsyncClient.get", fake_get)
    res = auth_client.post("/rss/refresh")
    assert res.status_code == 200
    assert res.json() == []


def test_refresh_feeds_without_feeds(auth_client):
    res = auth_client.post("/rss/refresh")
    assert res.status_code == 200
    assert res.json() == []
