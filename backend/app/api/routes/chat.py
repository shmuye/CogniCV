from fastapi import APIRouter

from fastapi.responses import (
    StreamingResponse,
)

from pydantic import BaseModel

from app.core.rag import (
    query_rag_stream,
)

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    conversation_id: str


@router.post("/")
async def chat(request: ChatRequest):

    async def event_generator():

        async for chunk in query_rag_stream(
            request.message,
            request.conversation_id,
        ):
            yield chunk

    return StreamingResponse(
        event_generator(),
        media_type="text/plain",
    )