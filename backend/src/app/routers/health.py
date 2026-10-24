import logging

from fastapi import APIRouter

router = APIRouter(prefix="/health")

logger = logging.getLogger("article_manager.routers.health")


@router.get("")
async def health() -> dict[str, str]:
    return {"msg": "Server is alive"}
