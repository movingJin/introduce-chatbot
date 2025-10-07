from fastapi import APIRouter
from server.api.endpoints import answer

api_router = APIRouter()
api_router.include_router(answer.router, tags=["answer"])