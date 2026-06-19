from tests.conftest import get_cookie_value, get_csrf_header


def _normalized_cookie_value(value: str | None) -> str | None:
    if value is None:
        return None
    if value in ("", '""'):
        return None
    return value


def test_register(client):
    res = client.post("/auth/register", json={"name": "Test", "password": "12345678"})
    assert res.status_code == 201
    assert get_cookie_value(res, "access_token_cookie")
    assert get_cookie_value(res, "refresh_token_cookie")
    assert get_cookie_value(res, "csrf_access_token")
    assert get_cookie_value(res, "csrf_refresh_token")


def test_register_wrong_password(client):
    res = client.post("/auth/register", json={"name": "Test", "password": "1234567"})
    assert res.status_code == 422


def test_register_duplicated_username(client):
    res = client.post("/auth/register", json={"name": "Test", "password": "12345678"})
    assert res.status_code == 201
    res = client.post("/auth/register", json={"name": "Test", "password": "87654321"})
    assert res.status_code == 409


def test_login(client):
    client.post("/auth/register", json={"name": "Test", "password": "12345678"})
    res = client.post("/auth/login", json={"name": "Test", "password": "12345678"})
    assert res.status_code == 200
    assert get_cookie_value(res, "access_token_cookie")
    assert get_cookie_value(res, "refresh_token_cookie")
    assert get_cookie_value(res, "csrf_access_token")
    assert get_cookie_value(res, "csrf_refresh_token")


def test_login_wrong_password(client):
    client.post("/auth/register", json={"name": "Test", "password": "12345678"})
    res = client.post("/auth/login", json={"name": "Test", "password": "123456789"})
    payload = res.json()
    assert res.status_code == 401
    assert payload["detail"] == "Wrong username or password"


def test_refresh(client):
    res = client.post("/auth/register", json={"name": "Test", "password": "12345678"})
    headers = get_csrf_header(res, "refresh")
    res = client.post("/auth/refresh", headers=headers)
    assert res.status_code == 200
    assert get_cookie_value(res, "access_token_cookie")
    assert get_cookie_value(res, "csrf_access_token")


def test_logout(auth_client):
    res = auth_client.post("/auth/logout")
    assert res.status_code == 200
    access_token = get_cookie_value(res, "access_token_cookie").strip()
    csrf_access_token = get_cookie_value(res, "csrf_access_token")
    assert not _normalized_cookie_value(access_token)
    assert not _normalized_cookie_value(csrf_access_token)


def test_method_not_allowed(client):
    res = client.get("/auth/register")
    assert res.status_code == 405


def test_session_verified(auth_client):
    res = auth_client.get("/auth/session")
    assert res.status_code == 200
    payload = res.json()
    assert payload["name"] == "Test"


def test_session_rejected(client):
    res = client.get("/auth/session")
    assert res.status_code == 401


def test_per_user_isolation(client, mock_article):
    # User A
    res1 = client.post("/auth/register", json={"name": "Test", "password": "12345678"})
    assert res1.status_code == 201
    headers1 = get_csrf_header(res1, "access")

    post1 = client.post("/articles", json=mock_article, headers=headers1)
    assert post1.status_code == 201
    payload1 = client.get("/articles", headers=headers1).json()["data"]
    assert len(payload1) == 1
    article_id = post1.json()["id"]

    # User B
    res2 = client.post(
        "/auth/register", json={"name": "Test 2", "password": "123456782"}
    )
    assert res2.status_code == 201
    headers2 = get_csrf_header(res2, "access")

    # User B cannot see User A articles
    payload = client.get("/articles", headers=headers2).json()["data"]
    assert len(payload) == 0

    # User B cannot modify/delete User A articles
    edited = {**mock_article, "id": article_id, "title": "hacked"}
    assert client.put("/articles", json=edited, headers=headers2).status_code == 404
    res = client.request(
        "DELETE",
        "/articles",
        json={"ids": [article_id]},
        headers=headers2,
    )
    assert res.status_code == 404

    # A still has article
    res3 = client.post("/auth/login", json={"name": "Test", "password": "12345678"})
    assert res3.status_code == 200
    headers3 = get_csrf_header(res3, "access")
    payload = client.get("/articles", headers=headers3).json()["data"]
    assert len(payload) == 1
