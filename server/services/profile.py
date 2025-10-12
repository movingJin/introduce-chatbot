import os
from typing import Dict, Any
import logging
from server.schema.profile import SearchCondition
from server.utils.session import es, profile_index
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_must_conditions(search_condition: SearchCondition = None) -> list:
    must_conditions = [
        {"exists": {"field": "chain_id"}}
    ]

    # _id 조건 추가
    if search_condition and search_condition.user_id:
        must_conditions.append({
            "terms": {"_id": search_condition.user_id}
        })

    # chain_id 조건 추가
    if search_condition and search_condition.chain_id:
        must_conditions.append({
            "terms": {"chain_id": search_condition.chain_id}
        })

    # name 조건 추가
    if search_condition and search_condition.name:
        must_conditions.append({
            "terms": {"name": search_condition.name}
        })

    # sex 조건 추가
    if search_condition and search_condition.sex:
        must_conditions.append({
            "terms": {"sex": search_condition.sex}
        })

    # date_of_birth 날짜 범위 조건 추가
    if search_condition and (search_condition.date_of_birth_start or search_condition.date_of_birth_end):
        date_of_birth_range = {}
        if search_condition.date_of_birth_start:
            date_of_birth_range["gte"] = search_condition.date_of_birth_start.isoformat()
        if search_condition.date_of_birth_end:
            date_of_birth_range["lte"] = search_condition.date_of_birth_end.isoformat()
        must_conditions.append({
            "range": {"date_of_birth": date_of_birth_range}
        })

    return must_conditions


def load_profile(size: int=10, search_condition: SearchCondition = None):
    results = []

    query = {
        "query": {
            "bool": {
                "must": create_must_conditions(search_condition)
            }
        }
    }

    resp = es.search(index=profile_index, body=query, size=size)
    hits = resp["hits"]["hits"]
    for doc in hits:
        doc_id = doc["_id"]
        doc["_source"].update({"user_id": doc_id})
        results.append(doc["_source"])
    return results


def save_profile(user_id: str, profile: Dict[str, Any]):
    profile["last_edited"] = datetime.now().isoformat()

    es.index(index=profile_index, body=profile, id=user_id)