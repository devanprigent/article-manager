import pytest

from tests.helpers import call_endpoint


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


def test_list_rss_unauthenticated(client):
    res = client.get("/rss")
    assert res.status_code == 401


@pytest.mark.parametrize("field", ["site_name", "site_url", "site_rss_feed"])
def test_add_rss_with_empty_field(auth_client, mock_rss, field):
    res = auth_client.post("/rss", json={**mock_rss, field: ""})
    assert res.status_code == 422


@pytest.mark.parametrize("field", ["site_name", "site_url", "site_rss_feed"])
def test_add_rss_with_missing_field(auth_client, mock_rss, field):
    payload = {k: v for k, v in mock_rss.items() if k != field}
    res = auth_client.post("/rss", json=payload)
    assert res.status_code == 422


def test_add_rss_unauthenticated(client, mock_rss):
    res = client.post("/rss", json=mock_rss)
    assert res.status_code == 401


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


def test_delete_rss_unauthenticated(client, rss):
    res = client.request("DELETE", "/rss", json={"ids": [rss["id"]]})
    assert res.status_code == 401
