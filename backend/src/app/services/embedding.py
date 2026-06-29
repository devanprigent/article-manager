import asyncio
import logging
import time

import httpx2
from fastapi import HTTPException

from app.services.common import get_api, post_api
from app.settings import Settings

logger = logging.getLogger("article_manager.services.embedding")


async def wake_up_server(settings: Settings):
    logger.info("Checking health of server")
    api_key = settings.embedding_api_key
    try:
        res = await get_api(f"{settings.embedding_api_url}/health", api_key)
        return {"msg": "Server is already alive"}
    except httpx2.HTTPError:
        logger.info("Waking up embedding server")
        pass
    res = await get_api(settings.embedding_wake_url, api_key)
    return res.json()


async def wait_for_api(url: str, api_key: str, timeout_seconds: int = 180):
    logger.info("Checking health of server")
    deadline = time.time() + timeout_seconds
    while time.time() < deadline:
        try:
            res = await get_api(f"{url}/health", api_key)
            if res.status_code == 200:
                return
        except httpx2.HTTPError:
            logger.debug("Health check failed, retrying...")
            pass
        await asyncio.sleep(5)
    raise HTTPException(status_code=503, detail="Service Unavailable")


async def generate_tags(settings: Settings, content: list[dict] | None) -> list[str]:
    logger.info("Get labels")
    await wait_for_api(settings.embedding_api_url, settings.embedding_api_key)
    raw_text = " ".join(block["text"] for block in content) if content else ""
    try:
        res = await post_api(
            f"{settings.embedding_api_url}/v1/labels",
            settings.embedding_api_key,
            json={"text": raw_text},
        )
        data = res.json()["data"]
        labels = [el["label"] for el in data]
        return labels
    except httpx2.HTTPError as error:
        logger.info("Error while generating tags", exc_info=error)
        return []


async def stop_server(settings: Settings):
    logger.info("Stop embedding server")
    res = await get_api(settings.embedding_stop_url, settings.embedding_api_key)
    return res.json()
