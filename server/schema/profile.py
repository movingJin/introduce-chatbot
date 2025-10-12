from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SearchCondition(BaseModel):
    user_id: list[str] = []
    name: list[str] = []
    sex: list[str] = []
    date_of_birth_start: Optional[datetime] = None
    date_of_birth_end: Optional[datetime] = None
    chain_id: list[str] = []