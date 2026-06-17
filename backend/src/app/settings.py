from datetime import timedelta
from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str
    secret_key: str
    jwt_secret_key: str
    frontend_origins: list[str] = ["http://localhost:3000"]
    jwt_cookie_domain: str | None = None
    jwt_access_token_expires: timedelta = timedelta(minutes=15)
    jwt_refresh_token_expires: timedelta = timedelta(days=30)
    jwt_token_location: list[str] = ["cookies"]
    jwt_refresh_cookie_path: str = "/auth/refresh"
    jwt_cookie_secure: bool = True
    jwt_cookie_samesite: str = "Lax"
    jwt_cookie_csrf_protect: bool = True
    jwt_csrf_in_cookies: bool = True
    jwt_csrf_cookie_httponly: bool = False
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

    @field_validator("frontend_origins", mode="before")
    @classmethod
    def split_frontend_origins(cls, v: str | list[str]) -> list[str]:
        if isinstance(v, list):
            return v
        return [o.strip() for o in v.split(",") if o.strip()]

    def to_flask_config(self) -> dict:
        return {
            "SQLALCHEMY_DATABASE_URI": self.database_url,
            "SECRET_KEY": self.secret_key,
            "JWT_SECRET_KEY": self.jwt_secret_key,
            "JWT_ACCESS_TOKEN_EXPIRES": self.jwt_access_token_expires,
            "JWT_REFRESH_TOKEN_EXPIRES": self.jwt_refresh_token_expires,
            "JWT_TOKEN_LOCATION": self.jwt_token_location,
            "JWT_REFRESH_COOKIE_PATH": self.jwt_refresh_cookie_path,
            "JWT_COOKIE_DOMAIN": self.jwt_cookie_domain,
            "JWT_COOKIE_SECURE": self.jwt_cookie_secure,
            "JWT_COOKIE_SAMESITE": self.jwt_cookie_samesite,
            "JWT_COOKIE_CSRF_PROTECT": self.jwt_cookie_csrf_protect,
            "JWT_CSRF_IN_COOKIES": self.jwt_csrf_in_cookies,
            "JWT_CSRF_COOKIE_HTTPONLY": self.jwt_csrf_cookie_httponly,
            "JWT_ACCESS_CSRF_COOKIE_PATH": self.jwt_access_csrf_cookie_path,
            "JWT_REFRESH_CSRF_COOKIE_PATH": self.jwt_refresh_csrf_cookie_path,
            "TESTING": self.testing,
        }
