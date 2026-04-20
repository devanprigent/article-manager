from flask import Blueprint, jsonify
from sqlalchemy import select

from app.database import db
from app.decorators import validate_json
from app.models import Article, Author, Tag
from app.schemas import ArticleSchema, IDSchema
from app.services import get_entities, get_entity

articles_bp = Blueprint("articles", __name__, url_prefix="/articles")


@articles_bp.route("")
def list_articles():
    stmt = select(Article)
    articles = db.session.execute(stmt).scalars().all()
    return jsonify([article.to_dict() for article in articles]), 200


@articles_bp.route("", methods=["POST"])
@validate_json
def add_article(data):
    schema = ArticleSchema.model_validate(data)
    tags_id = schema.tags_id
    tags = get_entities(tags_id, Tag)
    author = get_entity(schema.author_id, Author)

    article = Article(
        title=schema.title,
        url=schema.url,
        year=schema.year,
        summary=schema.summary,
        read=schema.read,
        read_again=schema.read_again,
        favorite=schema.favorite,
        author_id=author.id,
        tags=tags,
    )
    db.session.add(article)
    db.session.commit()
    return jsonify(article.to_dict()), 201


@articles_bp.route("", methods=["DELETE"])
@validate_json
def delete_articles(data):
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
