from fastapi import APIRouter

router = APIRouter(prefix="/health")


@router.get("")
async def health() -> dict[str, str]:
    return {"msg": "Server is alive"}
