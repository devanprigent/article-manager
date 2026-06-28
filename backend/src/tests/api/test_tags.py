from tests.helpers import call_endpoint


def test_add_valid_tag(auth_client, tag):
    tags = call_endpoint(auth_client, "/tags")
    assert len(tags) == 1
    assert tags[0]["name"] == tag["name"]


def test_add_invalid_tag(auth_client):
    res = auth_client.post("/tags", json={"name": ""})
    assert res.status_code == 422


def test_delete_tag(auth_client, tag):
    tags = call_endpoint(auth_client, "/tags")
    assert len(tags) == 1
    entity_id = int(tags[0]["id"])
    res_delete = auth_client.delete("/tags", json={"ids": [entity_id]})
    assert res_delete.status_code == 200
    assert res_delete.json()["count"] == 1

    new_tags = call_endpoint(auth_client, "/tags")
    assert len(new_tags) == 0
