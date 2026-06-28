from types import SimpleNamespace

from fastapi import Response


def call_endpoint(auth_client, endpoint: str, params: str | None = None) -> dict | list:
    url = endpoint
    if params is not None:
        url = f"{url}?{params}"
    res = auth_client.get(url)
    assert res.status_code == 200
    return res.json()


def get_article(auth_client, article_id: int) -> dict:
    res = auth_client.get(f"/articles/{article_id}")
    assert res.status_code == 200
    return res.json()


def parse_cookies(cookies: list[str], name: str) -> str | None:
    for cookie in cookies:
        first_pair = cookie.split(";", 1)[0].strip()
        if not first_pair or "=" not in first_pair:
            continue
        cookie_name, cookie_value = first_pair.split("=", 1)
        if cookie_name.strip() == name:
            return cookie_value
    return None


def get_cookie_value(response: Response, name: str):
    cookies = response.headers.get_list("set-cookie")
    return parse_cookies(cookies, name)


def get_csrf_header(res: Response, csrf_type: str):
    if csrf_type == "access":
        csrf_access_token = get_cookie_value(res, "csrf_access_token")
        return {
            "X-CSRF-TOKEN": csrf_access_token,
        }
    else:
        csrf_refresh_token = get_cookie_value(res, "csrf_refresh_token")
        return {
            "X-CSRF-TOKEN": csrf_refresh_token,
        }


async def fake_get(html: str, *args, **kwargs):
    return SimpleNamespace(
        text=html,
        raise_for_status=lambda: None,
    )


def normalized_cookie_value(value: str | None) -> str | None:
    if value is None:
        return None
    if value in ("", '""'):
        return None
    return value
