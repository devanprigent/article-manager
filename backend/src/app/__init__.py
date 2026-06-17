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
from app.settings import Settings

logger = configure_logging()


def create_app(settings: Settings | None = None):
    app = Flask(__name__)
    settings = settings or Settings()
    app.config.update(settings.to_flask_config())
    CORS(
        app,
        resources={r"/*": {"origins": settings.frontend_origins}},
        supports_credentials=True,
    )

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
