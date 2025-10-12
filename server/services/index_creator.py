import json
import os
from datetime import datetime
from server.utils.session import es, profile_index

this_dir = os.path.abspath(os.path.join(os.path.dirname(__file__)))


def create_index_template():
    with open('es.introduce-chatbot.pipeline.json', 'r') as f:
        pipeline = json.load(f)
        es.ingest.put_pipeline(id="auto_now_add", body=pipeline)
    with open('es.introduce-chatbot.template.json', 'r') as f:
        component = json.load(f)
        es.cluster.put_component_template(name="introduce-chatbot", body=component)
    with open('es.introduce-chatbot.template.profile.json', 'r') as f:
        template = json.load(f)
        es.indices.delete_index_template(name=profile_index)
        es.indices.put_index_template(name=profile_index, body=template)


def put_initial_data():
    with open(this_dir + "/profile.json", 'r', encoding='utf-8') as f:
        profiles = json.load(f)
        for user_id, profile in profiles.items():
            profile["created"] = datetime.now().isoformat()
            profile["last_edited"] = datetime.now().isoformat()
            profile["chain_id"] = "couple0"

            es.index(index=profile_index, body=profile, id=user_id)

if __name__ == "__main__":
    # 인덱스 템플릿 생성
    # create_index_template()
    put_initial_data()
