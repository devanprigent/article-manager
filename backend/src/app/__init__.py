import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from pydantic import ValidationError
from werkzeug.exceptions import HTTPException

from app.blueprints.articles import articles_bp
from app.blueprints.auth import auth_bp
from app.blueprints.authors import authors_bp
from app.blueprints.health import health_bp
from app.blueprints.search import search_bp
from app.blueprints.tags import tags_bp
from app.database import db
from app.exceptions import EntitiesNotFoundError, EntityDuplicatedError
from app.log_config import configure_logging, register_logging
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

    @app.route("/favicon.ico")
    def favicon():
        return "", 204

    @app.errorhandler(EntityDuplicatedError)
    def handle_duplicated_error(error: EntityDuplicatedError):
        logger.warning(
            f"{error.action} failed — duplicate {error.entity_name} for user_id={error.user_id}: {error.entity_id}"
        )
        return jsonify({"error": str(error)}), 409

    @app.errorhandler(ValidationError)
    def handle_validation_error(error: ValidationError):
        logger.warning(
            "Validation error on %s %s: %s",
            request.method,
            request.path,
            error.errors(),
        )
        return jsonify({"error": error.errors()}), 422

    @app.errorhandler(EntitiesNotFoundError)
    def handle_entities_not_found_error(error: EntitiesNotFoundError):
        logger.warning(
            "Entities not found on %s %s: missing_ids=%s",
            request.method,
            request.path,
            error.missing_ids,
        )
        return jsonify({"error": str(error), "missing_ids": error.missing_ids}), 404

    @app.errorhandler(HTTPException)
    def handle_http_exception(error: HTTPException):
        logger.warning(
            "HTTP %d on %s %s: %s",
            error.code,
            request.method,
            request.path,
            error.description,
        )
        return jsonify({"error": error.description}), error.code

    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(articles_bp)
    app.register_blueprint(authors_bp)
    app.register_blueprint(tags_bp)
    app.register_blueprint(search_bp)

    logger.info("App created — blueprints registered, DB ready")
    return app
