from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.pool import StaticPool


class Base(DeclarativeBase):
    pass


engine: Engine | None = None
SessionLocal: sessionmaker | None = None


def _is_sqlite_memory(database_url: str) -> bool:
    return database_url.startswith("sqlite") and ":memory:" in database_url


def init_db(database_url: str) -> None:
    global engine, SessionLocal

    if _is_sqlite_memory(database_url):
        engine = create_engine(
            database_url,
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
    else:
        engine = create_engine(database_url)

    SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
