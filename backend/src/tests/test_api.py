import pytest

from tests.conftest import INVALID_ARTICLE_CASES


def test_health(client):
    res = client.get("/health")
    assert res.status_code == 200


def test_get_article(auth_client, article):
    res = auth_client.get("/articles")
    payload = res.get_json()["data"]
    assert len(payload) == 1
    article_id = int(payload[0]["id"])
    res2 = auth_client.get(f"/articles/{article_id}")
    assert res2.status_code == 200
    payload2 = res2.get_json()
    assert payload[0]["title"] == payload2["title"]


def test_add_valid_tag(auth_client, tag):
    res = auth_client.get("/tags")
    assert res.status_code == 200
    payload = res.get_json()
    assert len(payload) == 1
    assert payload[0]["name"] == tag["name"]


def test_add_invalid_tag(auth_client):
    res = auth_client.post("/tags", json={"name": ""})
    assert res.status_code == 422


@pytest.mark.usefixtures("tag", "author")
@pytest.mark.parametrize("endpoint", ["/tags", "/authors"])
def test_delete_entity(auth_client, endpoint):
    res = auth_client.get(endpoint)
    payload = res.get_json()
    assert len(payload) == 1
    entity_id = int(payload[0]["id"])
    res_delete = auth_client.delete(endpoint, json={"ids": [entity_id]})
    assert res_delete.status_code == 200
    assert res_delete.get_json()["count"] == 1
    new_res = auth_client.get(endpoint)
    new_payload = new_res.get_json()
    assert len(new_payload) == 0


def test_delete_article(auth_client, article):
    res = auth_client.get("/articles")
    payload = res.get_json()["data"]
    assert len(payload) == 1
    article_id = int(payload[0]["id"])
    res_delete = auth_client.delete("/articles", json={"ids": [article_id]})
    assert res_delete.status_code == 200
    assert res_delete.get_json()["count"] == 1
    new_res = auth_client.get("/articles")
    new_payload = new_res.get_json()["data"]
    assert len(new_payload) == 0


def test_add_valid_author(auth_client, author):
    res = auth_client.get("/authors")
    assert res.status_code == 200
    payload = res.get_json()
    assert len(payload) == 1
    assert payload[0]["name"] == author["name"]


def test_add_invalid_author(auth_client):
    res = auth_client.post("/authors", json={"name": ""})
    assert res.status_code == 422


def test_add_valid_article(auth_client, article):
    res = auth_client.get("/articles")
    assert res.status_code == 200
    payload = res.get_json()["data"]
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
    payload = res.get_json()
    assert "error" in payload
    if expected_error_locs is not None:
        actual_locs = [e["loc"] for e in payload["error"]]
        for loc in expected_error_locs:
            assert loc in actual_locs, (loc, actual_locs)


def test_top_authors(auth_client, create_list_authors_articles):
    res = auth_client.get("/authors/top")
    assert res.status_code == 200
    payload = res.get_json()
    expected_responses = [
        ("Cal Newport", 3),
        ("Brandon Sanderson", 2),
        ("Scott Alexander", 1),
        ("J.R.R Tolkien", 0),
        ("Mark Manson", 0),
    ]
    for i in range(len(expected_responses)):
        assert payload[i]["author"] == expected_responses[i][0]
        assert payload[i]["count"] == expected_responses[i][1]


def test_duplicated_url(auth_client, article, mock_article_2):
    mock_article_2["url"] = article["url"]
    res = auth_client.post("/articles", json=mock_article_2)
    assert res.status_code == 409
    assert "duplicate" in res.get_json()["error"]


def test_list_articles_pagination(auth_client, create_list_authors_articles):
    res = auth_client.get("/articles")
    assert res.status_code == 200
    payload = res.get_json()["data"]
    assert len(payload) == 6

    res2 = auth_client.get("/articles?offset=2&limit=2")
    assert res2.status_code == 200
    payload2 = res2.get_json()["data"]
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
    assert "1000" in res.get_json()["error"]    
