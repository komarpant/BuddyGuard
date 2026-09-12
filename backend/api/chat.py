import json
import random
import os
from dotenv import load_dotenv

load_dotenv() # This loads the variables from the .env file
from fastapi import APIRouter
from pydantic import BaseModel
from google import genai
from google.genai import types

from db.database import supabase

# FIXED: Correct initialization for the new google-genai SDK
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

system_instruction = (
    "You are Buddy, a friendly, empathetic AI companion for children. "
    "Analyze the user's message and categorize the risk tier: "
    "'safe' (normal conversation), 'distress' (signs of bullying, anxiety, sadness), "
    "or 'critical' (physical danger, extreme abuse, self-harm). "
    "Respond ONLY with a valid JSON object containing exactly two keys: "
    "'reply' (your conversational, comforting response to the child) and "
    "'tier' (the categorized risk level)."
)

router = APIRouter()

class ChatRequest(BaseModel):
    user_id: str
    message: str
    anonymous: bool = True

@router.post("/chat")
def chat(request: ChatRequest):
    # Create a new conversation in Supabase
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

    # Save the child's message to Supabase
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

    try:
        # FIXED: Using the properly initialized 'client' and 'gemini-3.6-flash'
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=f"Child's message: {request.message}",
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
            )
        )
        
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:-3].strip()
        elif raw_text.startswith("```"):
            raw_text = raw_text[3:-3].strip()
            
        data = json.loads(raw_text)
        reply_text = data.get("reply", "I'm here for you. Let's talk.")
        tier = data.get("tier", "safe").lower()

        if tier in ["critical", "distress"]:
            supabase.table("cases").insert({
                "id": f"BG-{random.randint(1000, 9999)}",
                "title": f"AI Flagged: {tier.capitalize()} Alert",
                "status": "AI Report",
                "tier": tier,
                "description": f"Flagged message: '{request.message}'"
            }).execute()

    except Exception as e:
        print(f"\n--- LLM ERROR --- \n{e}\n-----------------\n")
        reply_text = "I'm having a little trouble connecting right now, but I'm still here for you!"
        tier = "safe"

    # Save Buddy's AI reply
    supabase.table("messages").insert({
        "conversation_id": conversation_id,
        "sender": "buddy",
        "text": reply_text
    }).execute()

    return {
        "status": "success",
        "conversation_id": conversation_id,
        "message_id": message.data[0]["id"],
        "reply": reply_text,
        "detected_tier": tier
    }