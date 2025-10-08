import json

from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import FileResponse
from starlette.responses import JSONResponse

from server.services.profile import save_profile, load_profile
from server.workflows.introduce_workflow import SummaryNode
import os
from pydantic import BaseModel

router = APIRouter()

class EditProfileRequest(BaseModel):
    id: str              # 사용자 고유 ID
    data: dict            # JSON 문자열


@router.get("/profile")
async def get_profile():
    profile = load_profile()
    return JSONResponse(
        content=json.loads(json.dumps(profile, ensure_ascii=False)),
        status_code=200
    )

@router.post("/profile/edit")
async def edit_profile(req: EditProfileRequest):
    try:
        # data 필드(JSON 문자열) 파싱
        profile_data = load_profile()
        profile_data[req.id] = req.data
        print(f"[INFO] Profile update for user {req.id}")
        print("Parsed Data:", profile_data)
        save_profile(profile_data)

        return {
            "message": f"Profile for {req.id} updated successfully.",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
