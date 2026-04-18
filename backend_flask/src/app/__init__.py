from flask import Flask, jsonify
from sqlalchemy import select
from app.database import db
from app.models import Tag, Author, Article


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
    
    @app.route("/authors")
    def list_authors():
        stmt = select(Author)
        authors = db.session.execute(stmt).scalars().all()
        return jsonify([author.to_dict() for author in authors]), 200
    
    @app.route("/tags")
    def list_tags():
        stmt = select(Tag)
        tags = db.session.execute(stmt).scalars().all()
        return jsonify([tag.to_dict() for tag in tags]), 200

    return app
