from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.api.routers import api_router

app = FastAPI(
    title="Ask anything to me",
    description="궁금한 사람에 대해 답변해드려요.",
    version="0.0.1"
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://introduce-chatbot-client:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,              # 개발 환경에서 모든 origin 허용
    allow_credentials=True,          # credentials 비활성화 (보안상 안전)
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # 명시적으로 메서드 지정
    allow_headers=["*"],              # 모든 헤더 허용
)

app.include_router(api_router)