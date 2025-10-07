import os, sys
from dotenv import load_dotenv
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
from langchain.schema import BaseMessage, HumanMessage, AIMessage
import logging

# .env 파일 로드 (있는 경우)
load_dotenv()

# Azure OpenAI 설정
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION", "2024-08-01-preview")
AZURE_OPENAI_EMBEDDING = os.getenv("AZURE_OPENAI_EMBEDDING")

# 로그 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_llm(temperature:float=0.3):
    """Azure OpenAI LLM 인스턴스를 반환합니다."""
    return AzureChatOpenAI(
            azure_endpoint=AZURE_OPENAI_ENDPOINT,
            api_key=AZURE_OPENAI_API_KEY,
            azure_deployment=AZURE_OPENAI_DEPLOYMENT_NAME,
            api_version=AZURE_OPENAI_API_VERSION,
            temperature=temperature,
            # streaming=True
        )

def get_embeddings():
    return AzureOpenAIEmbeddings(
        model=AZURE_OPENAI_EMBEDDING,
        azure_endpoint=AZURE_OPENAI_ENDPOINT,
        api_key=AZURE_OPENAI_API_KEY,
        api_version=AZURE_OPENAI_API_VERSION
    )