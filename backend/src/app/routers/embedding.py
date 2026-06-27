import logging

from fastapi import APIRouter, Depends

from app.dependencies import AppSettings, require_jwt
from app.services import get_api, post_api

router = APIRouter(
    prefix="/embedding",
    dependencies=[Depends(require_jwt())],
)

logger = logging.getLogger("article_manager.embedding")


@router.get("/wake")
async def wake_up_server(settings: AppSettings):
    logger.info("Waking up embedding server")
    res = await get_api(settings.embedding_wake_url, settings.embedding_api_key)
    return res.json()


@router.get("/health")
async def check_health_server(settings: AppSettings):
    logger.info("Checking health of server")
    res = await get_api(
        f"{settings.embedding_api_url}/health", settings.embedding_api_key
    )
    return res.json()


@router.post("/text")
async def embed_text(settings: AppSettings):
    logger.info("Embed text")
    res = await post_api(
        f"{settings.embedding_api_url}/v1/embed",
        settings.embedding_api_key,
        json={"texts": ["Vive Macron président à vie"]},
    )
    return res.json()


@router.get("/stop")
async def stop_server(settings: AppSettings):
    logger.info("Stop embedding server")
    res = await get_api(settings.embedding_stop_url, settings.embedding_api_key)
    return res.json()
