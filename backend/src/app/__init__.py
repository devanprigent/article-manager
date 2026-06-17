import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

from app.blueprints.articles import articles_bp
from app.blueprints.auth import auth_bp
from app.blueprints.authors import authors_bp
from app.blueprints.health import health_bp
from app.blueprints.search import search_bp
from app.blueprints.tags import tags_bp
from app.database import db
from app.handlers import register_error_handlers
from app.logger import configure_logging, register_logging
from app.services import _normalize_database_url

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

logger = configure_logging()


def create_app(test_config=None):
    app = Flask(__name__)

    if test_config is not None:
        app.config.update(test_config)
    else:
        app.config["SQLALCHEMY_DATABASE_URI"] = _normalize_database_url(
            os.environ["DATABASE_URL"]
        )
        app.config["SECRET_KEY"] = os.environ["SECRET_KEY"]
        app.config["JWT_SECRET_KEY"] = os.environ["JWT_SECRET_KEY"]

        _origins_raw = os.environ.get("FRONTEND_ORIGIN", "http://localhost:3000")
        frontend_origins = [o.strip() for o in _origins_raw.split(",") if o.strip()]
        CORS(
            app,
            resources={r"/*": {"origins": frontend_origins}},
            supports_credentials=True,
        )

    app.config.setdefault("SECRET_KEY", os.environ.get("SECRET_KEY", ""))
    app.config.setdefault("JWT_SECRET_KEY", os.environ.get("JWT_SECRET_KEY", ""))
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_REFRESH_COOKIE_PATH"] = "/auth/refresh"
    app.config["JWT_COOKIE_SECURE"] = True
    app.config["JWT_COOKIE_SAMESITE"] = "Lax"
    app.config["JWT_COOKIE_CSRF_PROTECT"] = True
    app.config["JWT_CSRF_IN_COOKIES"] = True
    app.config["JWT_COOKIE_DOMAIN"] = os.environ.get("JWT_COOKIE_DOMAIN")
    app.config["JWT_CSRF_COOKIE_HTTPONLY"] = False
    app.config["JWT_ACCESS_CSRF_COOKIE_PATH"] = "/"
    app.config["JWT_REFRESH_CSRF_COOKIE_PATH"] = "/"

    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)

    register_logging(app, logger)
    register_error_handlers(app, logger)

    @app.route("/favicon.ico")
    def favicon():
        return "", 204

    blueprints = [health_bp, auth_bp, articles_bp, authors_bp, tags_bp, search_bp]
    for bp in blueprints:
        app.register_blueprint(bp)

    logger.info("App created — blueprints registered, DB ready")
    return app
