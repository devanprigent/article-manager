import pytest

from tests.conftest import INVALID_ARTICLE_CASES


def test_register(client):
    res = client.post("/auth/register", json={"name": "Test", "password": "Test"})
    assert res.status_code == 201
    payload = res.get_json()
    assert "access_token" in payload


def test_login(client):
    res = client.post("/auth/register", json={"name": "Test", "password": "Test"})
    assert res.status_code == 201
    res2 = client.post("/auth/login", json={"name": "Test", "password": "Test"})
    assert res.status_code == 201
    payload = res.get_json()
    assert "access_token" in payload


def test_logout(auth_client):
    res = auth_client.post("/auth/logout")
    assert res.status_code == 200
    payload = res.get_json()
    assert payload["msg"] == "Successfully logged out"

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
    payload = res.get_json()
    assert len(payload) == 1
    article_id = int(payload[0]["id"])
    res_delete = auth_client.delete("/articles", json={"ids": [article_id]})
    assert res_delete.status_code == 200
    assert res_delete.get_json()["count"] == 1
    new_res = auth_client.get("/articles")
    new_payload = new_res.get_json()
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
    payload = res.get_json()
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
        assert payload[i]["author"]["name"] == expected_responses[i][0]
        assert payload[i]["count"] == expected_responses[i][1]
