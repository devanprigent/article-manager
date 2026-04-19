import pytest

from tests.conftest import INVALID_ARTICLE_CASES


def test_add_valid_tag(client, tag):
    res = client.get("/tags")
    assert res.status_code == 200
    payload = res.get_json()
    assert len(payload) == 1
    assert payload[0]["name"] == tag["name"]


def test_add_invalid_tag(client):
    res = client.post("/tags", json={"name": ""})
    assert res.status_code == 422


def test_add_valid_author(client, author):
    res2 = client.get("/authors")
    assert res2.status_code == 200
    payload = res2.get_json()
    assert len(payload) == 1
    assert payload[0]["name"] == author["name"]


def test_add_invalid_author(client):
    res = client.post("/authors", json={"name": ""})
    assert res.status_code == 422


def test_add_valid_article(client, article, tag, author):
    article["tags_id"] = [tag["id"]]
    article["author_id"] = author["id"]
    res = client.post("/articles", json=article)
    assert res.status_code == 201
    res2 = client.get("/articles")
    assert res2.status_code == 200
    payload = res2.get_json()
    assert len(payload) == 1
    assert payload[0]["title"] == article["title"]


@pytest.mark.usefixtures("tag", "author")
@pytest.mark.parametrize(
    "invalid_article, expected_status, expected_error_locs",
    INVALID_ARTICLE_CASES,
)
def test_add_invalid_articles(
    client, invalid_article, expected_status, expected_error_locs
):
    res = client.post("/articles", json=invalid_article)
    assert res.status_code == expected_status
    payload = res.get_json()
    assert "error" in payload
    if expected_error_locs is not None:
        actual_locs = [e["loc"] for e in payload["error"]]
        for loc in expected_error_locs:
            assert loc in actual_locs, (loc, actual_locs)
