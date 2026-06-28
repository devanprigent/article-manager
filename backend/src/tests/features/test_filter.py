import pytest


@pytest.mark.parametrize(
    "query, result", [("sanderson", 2), ("SANDERS", 2), ("moloch", 1), ("2019", 1)]
)
def test_filter(auth_client, create_list_authors_articles, query, result):
    res = auth_client.get("/articles")
    assert res.status_code == 200
    payload = res.json()["data"]
    assert len(payload) == 6

    res2 = auth_client.get(f"/search?q={query}")
    assert res2.status_code == 200
    payload2 = res2.json()["data"]
    assert len(payload2) == result


def test_missing_query(auth_client):
    res = auth_client.get("/search")
    assert res.status_code == 422


def test_empty_query(auth_client):
    res = auth_client.get("/search?q=")
    assert res.status_code == 400
