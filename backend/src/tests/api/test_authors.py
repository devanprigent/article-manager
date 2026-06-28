def test_add_valid_author(auth_client, author):
    res = auth_client.get("/authors")
    assert res.status_code == 200
    payload = res.json()
    assert len(payload) == 1
    assert payload[0]["name"] == author["name"]


def test_add_invalid_author(auth_client):
    res = auth_client.post("/authors", json={"name": ""})
    assert res.status_code == 422


def test_delete_author(auth_client, author):
    res = auth_client.get("/authors")
    payload = res.json()
    assert len(payload) == 1
    entity_id = int(payload[0]["id"])
    res_delete = auth_client.delete("/authors", json={"ids": [entity_id]})
    assert res_delete.status_code == 200
    assert res_delete.json()["count"] == 1
    new_res = auth_client.get("/authors")
    new_payload = new_res.json()
    assert len(new_payload) == 0


def test_delete_author_with_article(auth_client, author, mock_article):
    mock_article = {**mock_article, "author": author["name"]}
    auth_client.post("/articles", json=mock_article)
    res_delete = auth_client.delete("/authors", json={"ids": [author["id"]]})
    assert res_delete.status_code == 409


def test_top_authors(auth_client, create_list_authors_articles):
    res = auth_client.get("/authors/top")
    assert res.status_code == 200
    payload = res.json()
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
