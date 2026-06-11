from pathlib import Path
from types import SimpleNamespace

import pytest
import requests

FIXTURES_DIR = Path(__file__).parent / "fixtures" / "parser"


@pytest.mark.parametrize(
    "fixture_name, title, author, date",
    [
        ("og_title.html", "Different Worlds", "Scott Alexander", "2017-10-02"),
        (
            "twitter_title.html",
            "What the humans like is responsiveness",
            "Sasha Chapin",
            "2023-07-12",
        ),
        ("title_tag.html", "Why Cryonics Makes Sense", "Tim Urban", "2016-03-18"),
        ("h1_fallback.html", "The Lesson to Unlearn", "Paul Graham", "2019-01-01"),
    ],
)
def test_parse_metadata(auth_client, monkeypatch, fixture_name, title, author, date):
    html = (FIXTURES_DIR / fixture_name).read_text(encoding="utf-8")
    response = SimpleNamespace(text=html, raise_for_status=lambda: None)
    monkeypatch.setattr("app.parser.requests.get", lambda *args, **kwargs: response)

    res = auth_client.post("/articles/metadata", json={"name": "https://example.com"})
    assert res.status_code == 200
    json = res.get_json()
    assert json["title"] == title
    assert json["author"] == author
    assert json["date"] == date


def test_parse_metadata_returns_client_error_for_invalid_url(auth_client, monkeypatch):
    def raise_invalid_url(*args, **kwargs):
        raise requests.exceptions.InvalidURL("Invalid URL")

    monkeypatch.setattr("app.parser.requests.get", raise_invalid_url)
    res = auth_client.post("/articles/metadata", json={"name": "not-a-url"})

    assert res.status_code == 400
    assert (
        res.get_json()["error"] == "Unable to fetch metadata from the provided URL. "
        "Please check that the URL is valid and reachable."
    )


def test_duplicated_url_on_parsing(auth_client, article):
    res = auth_client.post("/articles/metadata", json={"name": article["url"]})
    assert res.status_code == 409
    assert "duplicate" in res.get_json()["error"]
