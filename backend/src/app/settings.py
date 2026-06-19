from datetime import timedelta
from pathlib import Path
from typing import Literal, cast

from fastapi import Request
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]
CookieSameSite = Literal["lax", "strict", "none"]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str
    secret_key: str
    jwt_secret_key: str
    frontend_origins: str = "http://localhost:3000"
    jwt_cookie_domain: str | None = None
    jwt_access_token_expires: timedelta = timedelta(minutes=15)
    jwt_refresh_token_expires: timedelta = timedelta(days=30)
    jwt_refresh_cookie_path: str = "/auth/refresh"
    jwt_cookie_secure: bool = True
    jwt_cookie_samesite: CookieSameSite | None = "lax"
    jwt_cookie_csrf_protect: bool = True
    jwt_csrf_in_cookies: bool = True
    jwt_access_csrf_cookie_path: str = "/"
    jwt_refresh_csrf_cookie_path: str = "/"
    testing: bool = False

    @field_validator("database_url", mode="before")
    @classmethod
    def normalize_db_url(cls, url: str) -> str:
        """Render and others often use postgres:// or postgresql://; SQLAlchemy needs the psycopg3 driver prefix."""
        if url.startswith("postgresql+psycopg://"):
            return url
        if url.startswith("postgres://"):
            return "postgresql+psycopg://" + url.removeprefix("postgres://")
        if url.startswith("postgresql://"):
            return "postgresql+psycopg://" + url.removeprefix("postgresql://")
        return url

    @field_validator("jwt_cookie_samesite", mode="before")
    @classmethod
    def normalize_cookie_samesite(cls, value: str | None) -> CookieSameSite | None:
        if value is None:
            return None
        normalized = str(value).lower()
        if normalized not in ("lax", "strict", "none"):
            raise ValueError("jwt_cookie_samesite must be 'lax', 'strict', or 'none'")
        return cast(CookieSameSite, normalized)

    @property
    def frontend_origins_list(self) -> list[str]:
        if isinstance(self.frontend_origins, list):
            return self.frontend_origins
        return [o.strip() for o in self.frontend_origins.split(",") if o.strip()]


def get_settings(request: Request) -> Settings:
    return cast(Settings, request.app.state.settings)
