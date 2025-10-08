import json
import os
from typing import Dict, Any
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
this_dir = os.path.abspath(os.path.join(os.path.dirname(__file__)))
profile_path = this_dir + "/../workflows/profile.json"

def load_profile() -> Dict[str, Any]:
    """json 파일 로드"""
    try:
        with open(profile_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"데이터 로드 실패: {e}")
        return {}

def save_profile(profile: Dict[str, Any]):
    os.makedirs(os.path.dirname(profile_path), exist_ok=True)
    with open(profile_path, "w", encoding="utf-8") as json_file:
        json.dump(profile, json_file, ensure_ascii=False, indent=2)