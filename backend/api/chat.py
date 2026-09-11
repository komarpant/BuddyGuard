from fastapi import APIRouter
from pydantic import BaseModel

from db.database import supabase

router = APIRouter()


class ChatRequest(BaseModel):
    user_id: str
    message: str
    anonymous: bool = True


@router.post("/chat")
def chat(request: ChatRequest):
    # Create a new conversation
    conversation = (
        supabase
        .table("conversations")
        .insert({
            "user_id": request.user_id,
            "anonymous": request.anonymous,
            "status": "active"
        })
        .execute()
    )

    conversation_id = conversation.data[0]["id"]

    # Save the child's message
    message = (
        supabase
        .table("messages")
        .insert({
            "conversation_id": conversation_id,
            "sender": "child",
            "text": request.message
        })
        .execute()
    )

    return {
        "status": "success",
        "conversation_id": conversation_id,
        "message_id": message.data[0]["id"],
        "reply": "I hear you. I'm here to help."
    }