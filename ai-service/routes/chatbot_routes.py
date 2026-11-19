from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any
from services.phi3_chatbot import generate_contextual_chat_reply

router = APIRouter(tags=["Chatbot"])

class ChatRequest(BaseModel):
    message: Optional[str] = ""
    prompt: Optional[str] = ""
    context: Optional[Dict[str, Any]] = None

class FeedbackRequest(BaseModel):
    resume_text: str

@router.post("/chatbot/chat")
@router.post("/chat")
@router.post("/ask")
def chat_endpoint(data: ChatRequest):
    user_prompt = data.prompt or data.message or ""
    reply = generate_contextual_chat_reply(user_prompt, data.context)
    return {
        "response": reply,
        "reply": reply
    }

@router.post("/chatbot/feedback")
@router.post("/feedback")
def feedback_endpoint(data: FeedbackRequest):
    reply = generate_contextual_chat_reply(
        "Analyze this resume and provide improvements, missing skills, and interview tips.",
        context={"resume_text": data.resume_text}
    )
    return {
        "feedback": reply
    }