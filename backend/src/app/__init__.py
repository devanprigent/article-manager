from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.handlers import register_error_handlers
from app.logger import configure_logging, register_logging
from app.routers.articles import router as articles_router
from app.routers.auth import router as auth_router
from app.routers.authors import router as authors_router
from app.routers.embedding import router as embedding_router
from app.routers.health import router as health_router
from app.routers.search import router as search_router
from app.routers.tags import router as tags_router
from app.settings import Settings

logger = configure_logging()


def create_app(settings: Settings | None = None):
    app = FastAPI()
    settings = settings or Settings()
    app.state.settings = settings
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.frontend_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    init_db(settings.database_url)
    register_logging(app, logger)
    register_error_handlers(app, logger)

    @app.get("/favicon.ico", status_code=204)
    def favicon():
        return ""

    routers = [
        health_router,
        auth_router,
        articles_router,
        authors_router,
        tags_router,
        search_router,
        embedding_router,
    ]
    for r in routers:
        app.include_router(r)

    logger.info("App created — routers registered, DB ready")
    return app
