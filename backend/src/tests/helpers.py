from pathlib import Path
from types import SimpleNamespace

FIXTURES_DIR = Path(__file__).parent / "fixtures" / "parser"


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
