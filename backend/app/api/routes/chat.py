from fastapi import APIRouter
from pydantic import BaseModel

from app.core.rag import query_rag

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


@router.post("/")
def chat(request: ChatRequest):

    result = query_rag(request.message)

    return result