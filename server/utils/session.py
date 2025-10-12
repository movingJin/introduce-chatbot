import os
from dotenv import load_dotenv
from elasticsearch8 import Elasticsearch
from urllib3.exceptions import InsecureRequestWarning
from urllib3 import disable_warnings

disable_warnings(InsecureRequestWarning)

load_dotenv()
ELASTICSEARCH_HOST = os.getenv("ELASTICSEARCH_HOST")

es = Elasticsearch(
    hosts=ELASTICSEARCH_HOST,
    verify_certs=False,
    request_timeout=30
)
profile_index = f"introduce-chatbot-profiles"