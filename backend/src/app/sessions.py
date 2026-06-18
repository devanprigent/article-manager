from flask import Flask, g
from sqlalchemy.orm import Session

import app.database as database


def register_session(app: Flask) -> None:
    @app.before_request
    def open_session():
        g.db = database.SessionLocal()

    @app.teardown_appcontext
    def close_session(exception=None):
        db = g.pop("db", None)
        if db is not None:
            if exception:
                db.rollback()
            db.close()


def get_session() -> Session:
    return g.db
