import logging

from fastapi import APIRouter

from app.dependencies import AppSettings

router = APIRouter(prefix="/health")

logger = logging.getLogger("article_manager.routers.health")


@router.get("")
async def health(settings: AppSettings) -> dict[str, str]:
    return {"msg": "Server is alive"}
