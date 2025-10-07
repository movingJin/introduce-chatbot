from typing import Any, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import FileResponse
from server.workflows.introduce_workflow import SummaryNode
import os

router = APIRouter()


@router.get("/answer")
def notices_total(query: str) -> str:
    result = SummaryNode().run(query)
    answer = result["response"]["answer"] if "response" in result else "질의에 대한 응답을 받을 수 없습니다."
    return answer
