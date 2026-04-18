from flask import Flask, jsonify, request
from sqlalchemy import select
from app.database import db
from app.models import Tag, Author, Article
from app.schemas import ArticleSchema, BasicSchema
from pydantic import ValidationError


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
    app.config["SECRET_KEY"] = "dev-secret-key-change-in-production"
    db.init_app(app)

    with app.app_context():
        db.create_all()

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
        try:
            schema = ArticleSchema.model_validate(data)
            tags_id = schema.tags_id
            stmt = select(Tag).where(Tag.id.in_(tags_id))
            tags = db.session.execute(stmt).scalars().all()
            article = Article(
                title=schema.title,
                url=schema.url,
                year=schema.year,
                summary=schema.summary,
                read=schema.read,
                read_again=schema.read_again,
                favorite=schema.favorite,
                author_id=schema.author_id,
                tags=tags
            )
            db.session.add(article)
            db.session.commit()
            return jsonify(article.to_dict()), 201
        except ValidationError as e:
            return jsonify({"errors": e.errors()}), 422

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
        try:
            schema = BasicSchema.model_validate(data)
            author = Author(name=schema.name)
            db.session.add(author)
            db.session.commit()
            return jsonify(author.to_dict()), 201
        except ValidationError as e:
            return jsonify({"errors": e.errors()}), 422

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
        try:
            schema = BasicSchema.model_validate(data)
            tag = Tag(name=schema.name)
            db.session.add(tag)
            db.session.commit()
            return jsonify(tag.to_dict()), 201
        except ValidationError as e:
            return jsonify({"errors": e.errors()}), 422

    return app
