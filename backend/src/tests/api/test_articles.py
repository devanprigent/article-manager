import pytest

from tests.constants import INVALID_ARTICLE_CASES


def test_get_article(auth_client, article):
    res = auth_client.get("/articles")
    payload = res.json()["data"]
    assert len(payload) == 1
    article_id = int(payload[0]["id"])
    res2 = auth_client.get(f"/articles/{article_id}")
    assert res2.status_code == 200
    payload2 = res2.json()
    assert payload[0]["title"] == payload2["title"]


def test_get_invalid_article(auth_client, article):
    res = auth_client.get("/articles/999")
    assert res.status_code == 404


def test_article_return_content_not_articles(auth_client, article):
    res = auth_client.get("/articles")
    payload = res.json()["data"]
    assert len(payload) == 1
    assert payload[0]["content"] is None

    article_id = int(payload[0]["id"])
    res2 = auth_client.get(f"/articles/{article_id}")
    assert res2.status_code == 200

    payload2 = res2.json()
    assert payload2["content"] is not None


def test_delete_article(auth_client, article):
    res = auth_client.get("/articles")
    payload = res.json()["data"]
    assert len(payload) == 1
    article_id = int(payload[0]["id"])
    res_delete = auth_client.delete("/articles", json={"ids": [article_id]})
    assert res_delete.status_code == 200
    assert res_delete.json()["count"] == 1
    new_res = auth_client.get("/articles")
    new_payload = new_res.json()["data"]
    assert len(new_payload) == 0


def test_add_valid_article(auth_client, article):
    res = auth_client.get("/articles")
    assert res.status_code == 200
    payload = res.json()["data"]
    assert len(payload) == 1
    assert payload[0]["title"] == article["title"]


@pytest.mark.usefixtures("tag", "author", "article")
@pytest.mark.parametrize(
    "invalid_article, expected_status, expected_error_locs",
    INVALID_ARTICLE_CASES,
)
def test_add_invalid_articles(
    auth_client, invalid_article, expected_status, expected_error_locs
):
    res = auth_client.post("/articles", json=invalid_article)
    assert res.status_code == expected_status
    payload = res.json()
    assert "detail" in payload
    if expected_error_locs is not None:
        actual_locs = [
            e["loc"][1:] if e["loc"] and e["loc"][0] == "body" else e["loc"]
            for e in payload["detail"]
        ]
        for loc in expected_error_locs:
            assert loc in actual_locs, (loc, actual_locs)


def test_duplicated_url(auth_client, article, mock_article_2):
    mock_article_2["url"] = article["url"]
    res = auth_client.post("/articles", json=mock_article_2)
    assert res.status_code == 409
    payload = res.json()
    assert "duplicate" in payload["detail"]


def test_list_articles_pagination(auth_client, create_list_authors_articles):
    res = auth_client.get("/articles")
    assert res.status_code == 200
    payload = res.json()["data"]
    assert len(payload) == 6

    res2 = auth_client.get("/articles?offset=2&limit=2")
    assert res2.status_code == 200
    payload2 = res2.json()["data"]
    assert len(payload2) == 2

    assert payload[2]["id"] == payload2[0]["id"]
    assert payload[3]["id"] == payload2[1]["id"]


def test_list_articles_rejects_negative_offset(auth_client):
    res = auth_client.get("/articles?offset=-1&limit=2")
    assert res.status_code == 400


def test_list_articles_rejects_zero_limit(auth_client):
    res = auth_client.get("/articles?offset=0&limit=0")
    assert res.status_code == 400


def test_list_articles_rejects_limit_above_max(auth_client):
    res = auth_client.get("/articles?limit=1001")
    assert res.status_code == 400
    payload = res.json()
    assert "1000" in payload["detail"]
