import logging

import httpx2
from fastapi import APIRouter

from app.dependencies import AppSettings
from app.services.embedding import wake_up_server

router = APIRouter(prefix="/health")

logger = logging.getLogger("article_manager.routers.health")


@router.get("")
async def health(settings: AppSettings) -> dict[str, str]:
    logger.info("Health service activated, waking up embedding server...")
    try:
        res = await wake_up_server(settings)
        logger.info("Woke up embedding server", res)
    except httpx2.HTTPError as error:
        logger.info(
            "Tried to wake up embedding server but got an error",
            exc_info=error,
        )
    return {"msg": "Server is alive"}
