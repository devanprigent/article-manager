import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pydantic import ValidationError

from app.blueprints.articles import articles_bp
from app.blueprints.auth import auth_bp
from app.blueprints.authors import authors_bp
from app.blueprints.tags import tags_bp
from app.database import db
from app.types import EntitiesNotFoundError

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")


def create_app(test_config=None):
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]
    app.config["SECRET_KEY"] = os.environ["SECRET_KEY"]
    app.config["JWT_SECRET_KEY"] = os.environ["JWT_SECRET_KEY"]

    frontend_origin = os.environ.get("FRONTEND_ORIGIN")
    CORS(
        app,
        resources={r"/*": {"origins": [frontend_origin]}},
        supports_credentials=True,
    )

    if test_config is not None:
        app.config.update(test_config)

    db.init_app(app)
    JWTManager(app)

    with app.app_context():
        db.create_all()

    @app.route("/favicon.ico")
    def favicon():
        return "", 204

    @app.errorhandler(ValidationError)
    def handle_validation_error(error):
        return jsonify({"error": error.errors()}), 422

    @app.errorhandler(EntitiesNotFoundError)
    def handle_entities_not_found_error(error):
        return jsonify({"error": str(error), "missing_ids": error.missing_ids}), 404

    @app.errorhandler(404)
    def handle_404(error):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(Exception)
    def handle_unexpected(error):
        print("handle_unexpected", str(error))
        return jsonify({"error": "Internal server error"}), 500

    app.register_blueprint(auth_bp)
    app.register_blueprint(articles_bp)
    app.register_blueprint(authors_bp)
    app.register_blueprint(tags_bp)

    return app
