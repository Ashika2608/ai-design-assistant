from fastapi import APIRouter, Depends
from app.schemas import ChatRequest, ChatResponse
from app.services import groq_service
from app.auth.utils import get_current_user

router = APIRouter(prefix="/api/chat", tags=["AI Chat"])


@router.post("", response_model=ChatResponse)
def chat(payload: ChatRequest, current_user=Depends(get_current_user)):
    reply = groq_service.chat_reply(payload.message)
    return ChatResponse(reply=reply)
