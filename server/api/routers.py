from fastapi import APIRouter
from server.api.endpoints import answer, profile

api_router = APIRouter()
api_router.include_router(answer.router, tags=["answer"])
api_router.include_router(profile.router, tags=["profile"])