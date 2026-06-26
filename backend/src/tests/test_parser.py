import socket
from pathlib import Path
from types import SimpleNamespace

import pytest

FIXTURES_DIR = Path(__file__).parent / "fixtures" / "parser"


async def fake_get(html: str, *args, **kwargs):
    return SimpleNamespace(
        text=html,
        raise_for_status=lambda: None,
    )


@pytest.mark.parametrize(
    "fixture_name, title, author, date",
    [
        ("og_title.html", "Different Worlds", "Scott Alexander", "2017-10-02"),
        (
            "twitter_title.html",
            "What the humans like is responsiveness",
            "Sasha Chapin",
            "2023-07-12",
        ),
        ("title_tag.html", "Why Cryonics Makes Sense", "Tim Urban", "2016-03-18"),
        ("h1_fallback.html", "The Lesson to Unlearn", "Paul Graham", "2019-01-01"),
    ],
)
def test_parse_metadata(auth_client, monkeypatch, fixture_name, title, author, date):
    html = (FIXTURES_DIR / fixture_name).read_text(encoding="utf-8")
    monkeypatch.setattr(
        "httpx2.AsyncClient.get", lambda *args, **kwargs: fake_get(html)
    )

    res = auth_client.post("/articles/metadata", json={"name": "https://example.com"})
    assert res.status_code == 200
    json = res.json()
    assert json["title"] == title
    assert json["author"] == author
    assert json["date"] == date


def test_duplicated_url_on_parsing(auth_client, article):
    res = auth_client.post("/articles/metadata", json={"name": article["url"]})
    assert res.status_code == 409
    payload = res.json()
    assert "duplicate" in payload["detail"]


@pytest.mark.parametrize("vuln_url", ["not-a-url", "ftp://localhost:8765"])
@pytest.mark.nomocksanitizer
def test_ssrf_attacks(auth_client, vuln_url):
    res = auth_client.post("/articles/metadata", json={"name": vuln_url})
    assert res.status_code == 400


def mock_resolved_ip(monkeypatch, ip: str, family=socket.AF_INET):
    socket_address = (ip, 80, 0, 0) if family == socket.AF_INET6 else (ip, 80)

    def fake_getaddrinfo(hostname, port):
        return [(family, socket.SOCK_STREAM, 6, "", socket_address)]

    monkeypatch.setattr("app.services.parser.socket.getaddrinfo", fake_getaddrinfo)


@pytest.mark.parametrize(
    "vuln_url, resolved_ip, family",
    [
        ("http://localhost:8765", "127.0.0.1", socket.AF_INET),
        ("https://10.0.0.0", "10.0.0.0", socket.AF_INET),
        ("http://169.254.169.254", "169.254.169.254", socket.AF_INET),
        ("http://127.0.0.1", "127.0.0.1", socket.AF_INET),
        ("http://[::1]", "::1", socket.AF_INET6),
        ("http://192.168.1.1", "192.168.1.1", socket.AF_INET),
        ("http://172.16.0.1", "172.16.0.1", socket.AF_INET),
    ],
)
@pytest.mark.nomocksanitizer
def test_rejects_unsafe_resolved_ips(
    auth_client, monkeypatch, vuln_url, resolved_ip, family
):
    mock_resolved_ip(monkeypatch, resolved_ip, family)
    res = auth_client.post("/articles/metadata", json={"name": vuln_url})
    assert res.status_code == 400
