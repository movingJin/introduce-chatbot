import json
import os
from langchain_core.messages import SystemMessage, HumanMessage
from langgraph.graph import StateGraph, END
from typing import Dict, Any, TypedDict
from openai import ContentFilterFinishReasonError, BadRequestError
from server.utils.config import get_llm
from pydantic import BaseModel
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
this_dir = os.path.abspath(os.path.join(os.path.dirname(__file__)))

class NodeState(TypedDict):
    query: str
    answer: str
    current_step: str


def load_json_file(file_name: str) -> Dict[str, Any]:
    """json 파일 로드"""
    try:
        with open(file_name, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"데이터 로드 실패: {e}")
        return {}


class SummaryNode:
    def __init__(
            self, session_id: str = None
    ):
        self.graph = self.setup_graph()  # 그래프 설정
        self.session_id = session_id  # langfuse 세션 ID
        self.llm = get_llm()
        self.profile = load_json_file(this_dir + "/profile.json")

    def setup_graph(self):
        # 그래프 생성
        workflow = StateGraph(NodeState)

        workflow.add_node("answer_node", self.answer_node)
        workflow.set_entry_point("answer_node")
        workflow.add_edge("answer_node", END)

        # 그래프 컴파일
        return workflow.compile()

    def run(self, query: str) -> Dict[str, Any]:
        """단일 리드 처리"""
        initial_state = {
            "query": query,
            "answer": "",
            "current_step": "initialized"
        }

        response = {}
        try:
            result = self.graph.invoke(initial_state)
            answer = result.get("answer")
            response["answer"] = answer
        except (ContentFilterFinishReasonError, BadRequestError, ValueError) as e:
            response["answer"] = str(e)
            print(f"{str(e)}")

        return {
            "query": query,
            "response": response,
            "status": "success"
        }

    def answer_node(self, state: NodeState) -> NodeState:
        """Report 요약 함수"""
        query = state["query"]
        state["current_step"] = "answer_node"
        if not query:
            return state

        # LLM을 사용한 의미적 매칭
        prompt = f"""
        다음 사용자 질의에 대한 내용을 답변해 줘.
        {query}
        """

        messages = [
            SystemMessage(
                content=f"""
                당신의 정체성:
                - 당신은 인물을 소개하는 전문가입니다.
                - 사용자가 질의하면, 질의 대상이 되는 인물을 찾고, 질의한 내용에 대한 답변을 하세요.

                당신의 역할:
                - 아래의 profile 정보를 바탕으로 답변합니다.
                - profile에 존재하지 않는 내용이라면, 모른다고 답변합니다.
                - 현재시간은 {datetime.now()} 이야.
                - profile:
                {self.profile}

                출력 형식:
                - 답변을 Markdown 형식으로 정리해서 답변해주세요.
                - 출력 언어는 기본적으로 한국어
                - 형식은 깔끔하고 읽기 쉬운 문장으로 구성

                 평가 결과를 다음 JSON 형식으로 제공해주세요:
                 {{
                    "answer": 사용자 질의에 대한 답변
                 }}

                JSON만 반환하고 다른 텍스트는 포함하지 마세요.
                """
            ),
            HumanMessage(content=prompt),
        ]

        class StructuredOutput(BaseModel):
            answer: str

        creative_llm = get_llm()
        structured_lld = creative_llm.with_structured_output(StructuredOutput)
        response = structured_lld.invoke(messages)
        state["answer"] = response.answer

        return state
