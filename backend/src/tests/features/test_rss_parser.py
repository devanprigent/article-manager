import asyncio
from datetime import UTC, datetime
from types import SimpleNamespace

import pytest

from app.exceptions import ParsingError, UrlValidationError
from app.services import RssParser

RSS_FEED = b"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Example Blog</title>
    <link>https://example.com</link>
    <item>
      <title> First post </title>
      <link>https://example.com/first-post</link>
      <dc:creator>Jane Doe</dc:creator>
      <pubDate>Mon, 05 Oct 2026 10:30:00 +0200</pubDate>
    </item>
    <item>
      <title>Second post</title>
      <link>https://example.com/second-post</link>
    </item>
    <item>
      <title>Post without link</title>
    </item>
  </channel>
</rss>
"""


def mock_feed(monkeypatch, content: bytes):
    async def fake_get(*args, **kwargs):
        return SimpleNamespace(content=content, raise_for_status=lambda: None)

    monkeypatch.setattr("httpx2.AsyncClient.get", fake_get)


def test_parse_rss_feed(monkeypatch):
    mock_feed(monkeypatch, RSS_FEED)
    parser = RssParser("https://example.com/feed.xml")
    asyncio.run(parser.fetch())

    assert len(parser.entries) == 2
    first, second = parser.entries
    assert first.title == "First post"
    assert first.url == "https://example.com/first-post"
    assert first.author == "Jane Doe"
    assert first.published == datetime(2026, 10, 5, 8, 30, tzinfo=UTC)
    assert second.title == "Second post"
    assert second.author == ""
    assert second.published is None


def test_parse_rss_feed_latest_published(monkeypatch):
    mock_feed(monkeypatch, RSS_FEED)
    parser = RssParser("https://example.com/feed.xml")
    asyncio.run(parser.fetch())

    assert parser.latest_published == datetime(2026, 10, 5, 8, 30, tzinfo=UTC)


def test_parse_rss_feed_keeps_only_newer_entries(monkeypatch):
    mock_feed(monkeypatch, RSS_FEED)
    parser = RssParser(
        "https://example.com/feed.xml",
        last_element=datetime(2026, 10, 5, 8, 0, tzinfo=UTC),
    )
    asyncio.run(parser.fetch())

    assert [entry.url for entry in parser.entries] == ["https://example.com/first-post"]


def test_parse_rss_feed_skips_already_fetched_entries(monkeypatch):
    mock_feed(monkeypatch, RSS_FEED)
    # Naive datetimes, as read from the database, are treated as UTC.
    parser = RssParser(
        "https://example.com/feed.xml", last_element=datetime(2026, 10, 5, 8, 30)
    )
    asyncio.run(parser.fetch())

    assert parser.entries == []
    assert parser.latest_published is None


def test_parse_invalid_rss_feed(monkeypatch):
    mock_feed(monkeypatch, b"<html><body><p>Not a feed</body></html>")
    parser = RssParser("https://example.com/feed.xml")
    with pytest.raises(ParsingError):
        asyncio.run(parser.fetch())


@pytest.mark.nomocksanitizer
def test_rss_parser_rejects_invalid_url():
    with pytest.raises(UrlValidationError):
        RssParser("ftp://localhost:8765")
