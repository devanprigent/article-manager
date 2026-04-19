from flask import Flask, jsonify, request
from pydantic import ValidationError
from sqlalchemy import select

from app.database import db
from app.models import Article, Author, Tag
from app.schemas import ArticleSchema, BasicSchema, IDSchema
from app.services import get_entities, get_articles_by_author
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
        return jsonify({"error": "Internal server error"}), 500

    @app.route("/articles")
    def list_articles():
        stmt = select(Article)
        articles = db.session.execute(stmt).scalars().all()
        return jsonify([article.to_dict() for article in articles]), 200

    @app.route("/articles", methods=["POST"])
    def add_article():
        if not request.is_json:
            return jsonify({"error": "Must be a JSON"}), 400
        data = request.get_json()
        if not data:
            return jsonify({"error": "JSON body is required"}), 400
        schema = ArticleSchema.model_validate(data)
        tags_id = schema.tags_id
        tags = get_entities(tags_id, Tag)
        article = Article(
            title=schema.title,
            url=schema.url,
            year=schema.year,
            summary=schema.summary,
            read=schema.read,
            read_again=schema.read_again,
            favorite=schema.favorite,
            author_id=schema.author_id,
            tags=tags,
        )
        db.session.add(article)
        db.session.commit()
        return jsonify(article.to_dict()), 201

    @app.route("/articles", methods=["DELETE"])
    def delete_articles():
        if not request.is_json:
            return jsonify({"error": "Must be a JSON"}), 400
        data = request.get_json()
        if not data:
            return jsonify({"error": "JSON body is required"}), 400
        schema = IDSchema.model_validate(data)
        article_ids = schema.ids
        articles = get_entities(article_ids, Article)
        articles_dict = [article.to_dict() for article in articles]
        for article in articles:
            db.session.delete(article)
        db.session.commit()
        return (
            jsonify(
                {
                    "deleted": articles_dict,
                    "count": len(articles),
                }
            ),
            200,
        )

    @app.route("/authors")
    def list_authors():
        stmt = select(Author)
        authors = db.session.execute(stmt).scalars().all()
        return jsonify([author.to_dict() for author in authors]), 200

    @app.route("/authors", methods=["POST"])
    def add_author():
        if not request.is_json:
            return jsonify({"error": "Must be a JSON"}), 400
        data = request.get_json()
        if not data:
            return jsonify({"error": "JSON body is required"}), 400
        schema = BasicSchema.model_validate(data)
        author = Author(name=schema.name)
        db.session.add(author)
        db.session.commit()
        return jsonify(author.to_dict()), 201

    @app.route("/authors", methods=["DELETE"])
    def delete_authors():
        if not request.is_json:
            return jsonify({"error": "Must be a JSON"}), 400
        data = request.get_json()
        if not data:
            return jsonify({"error": "JSON body is required"}), 400

        schema = IDSchema.model_validate(data)
        author_ids = schema.ids
        authors = get_entities(author_ids, Author)
        authors_dict = [author.to_dict() for author in authors]
        for author in authors:
            articles = get_articles_by_author(author.id)
            if articles:
                return (
                    jsonify(
                        {"error": f"The author {author.id} has associated articles."}
                    ),
                    409,
                )
            db.session.delete(author)
        db.session.commit()
        return (
            jsonify(
                {
                    "deleted": authors_dict,
                    "count": len(authors),
                }
            ),
            200,
        )

    @app.route("/tags")
    def list_tags():
        stmt = select(Tag)
        tags = db.session.execute(stmt).scalars().all()
        return jsonify([tag.to_dict() for tag in tags]), 200

    @app.route("/tags", methods=["POST"])
    def add_tag():
        if not request.is_json:
            return jsonify({"error": "Must be a JSON"}), 400
        data = request.get_json()
        if not data:
            return jsonify({"error": "JSON body is required"}), 400

        schema = BasicSchema.model_validate(data)
        tag = Tag(name=schema.name)
        db.session.add(tag)
        db.session.commit()
        return jsonify(tag.to_dict()), 201

    @app.route("/tags", methods=["DELETE"])
    def delete_tags():
        if not request.is_json:
            return jsonify({"error": "Must be a JSON"}), 400
        data = request.get_json()
        if not data:
            return jsonify({"error": "JSON body is required"}), 400

        schema = IDSchema.model_validate(data)
        tags = get_entities(schema.ids, Tag)
        for tag in tags:
            db.session.delete(tag)
        db.session.commit()
        return (
            jsonify({"deleted": [tag.to_dict() for tag in tags], "count": len(tags)}),
            200,
        )

    return app
