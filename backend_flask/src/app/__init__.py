from flask import Flask, jsonify
from pydantic import ValidationError

from app.blueprints.articles import articles_bp
from app.blueprints.authors import authors_bp
from app.blueprints.tags import tags_bp
from app.database import db
from app.types import EntitiesNotFoundError


def create_app(test_config=None):
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
    app.config["SECRET_KEY"] = "dev-secret-key-change-in-production"

    if test_config is not None:
        app.config.update(test_config)

    db.init_app(app)

    with app.app_context():
        db.create_all()

    @app.errorhandler(ValidationError)
    def handle_validation_error(error):
        return jsonify({"error": error.errors()}), 422

    @app.errorhandler(EntitiesNotFoundError)
    def handle_entities_not_found_error(error):
        return jsonify({"error": str(error), "missing_ids": error.missing_ids}), 404

    @app.errorhandler(Exception)
    def handle_unexpected(error):
        print("handle_unexpected", str(error))
        return jsonify({"error": "Internal server error"}), 500

    app.register_blueprint(articles_bp)
    app.register_blueprint(authors_bp)
    app.register_blueprint(tags_bp)

    return app
