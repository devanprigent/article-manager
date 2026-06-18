from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from app.database import db
from app.handlers import register_error_handlers
from app.logger import configure_logging, register_logging
from app.routers.articles import articles_bp
from app.routers.auth import auth_bp
from app.routers.authors import authors_bp
from app.routers.health import health_bp
from app.routers.search import search_bp
from app.routers.tags import tags_bp
from app.settings import Settings

logger = configure_logging()


def create_app(settings: Settings | None = None):
    app = Flask(__name__)
    settings = settings or Settings()
    app.config.update(settings.to_flask_config())
    CORS(
        app,
        resources={r"/*": {"origins": settings.frontend_origins_list}},
        supports_credentials=True,
    )

    db.init_app(app)
    JWTManager(app)

    register_logging(app, logger)
    register_error_handlers(app, logger)

    @app.route("/favicon.ico")
    def favicon():
        return "", 204

    routers = [health_bp, auth_bp, articles_bp, authors_bp, tags_bp, search_bp]
    for r in routers:
        app.register_blueprint(r)

    logger.info("App created — routers registered, DB ready")
    return app
