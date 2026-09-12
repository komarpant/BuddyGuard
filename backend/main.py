from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
from google import genai
from google.genai import types
import json
import random
import os
import time
from dotenv import load_dotenv

load_dotenv() 

gemini_api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=gemini_api_key) if gemini_api_key else None

app = FastAPI(title="Buddy Guard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === IN-MEMORY DATABASE ===
# Pre-seeded users
users_db = [
    {"id": "admin-1", "email": "admin@demo.com", "password": "demo123", "role": "admin"},
    {"id": "official-1", "email": "official@demo.com", "password": "demo123", "role": "official"},
    {"id": "user-1", "email": "user1@demo.com", "password": "demo123", "role": "user"},
    {"id": "user-2", "email": "user2@demo.com", "password": "demo123", "role": "user"},
    {"id": "user-3", "email": "user3@demo.com", "password": "demo123", "role": "user"},
    {"id": "user-4", "email": "user4@demo.com", "password": "demo123", "role": "user"},
    {"id": "user-5", "email": "user5@demo.com", "password": "demo123", "role": "user"},
]

profiles_db = {}
conversations_db = []
messages_db = []
history_db = []
cases_db = []

# === MODELS ===
class AuthRequest(BaseModel):
    email: str
    password: str

class ProfileRequest(BaseModel):
    user_id: str
    alias: str
    avatar: str
    color: str

class ChatRequest(BaseModel):
    user_id: str
    message: str
    anonymous: bool = True
    conversation_id: Optional[str] = None

class ReportRequest(BaseModel):
    user_id: str
    category: str
    description: Optional[str] = ""

class HistorySaveRequest(BaseModel):
    user_id: str
    type: str
    title: str
    preview: str
    status: str
    messages: int = 0
    caseId: Optional[str] = None

# === ENDPOINTS ===

@app.post("/api/auth/login")
def login(request: AuthRequest):
    user = next((u for u in users_db if u["email"] == request.email and u["password"] == request.password), None)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"status": "success", "user": {"id": user["id"], "email": user["email"], "role": user["role"]}}

@app.post("/api/auth/signup")
def signup(request: AuthRequest):
    if any(u["email"] == request.email for u in users_db):
        raise HTTPException(status_code=400, detail="User already exists")
    new_user = {"id": f"local-user-{int(time.time()*1000)}", "email": request.email, "password": request.password, "role": "user"}
    users_db.append(new_user)
    return {"status": "success", "user": {"id": new_user["id"], "email": new_user["email"], "role": new_user["role"]}}

@app.get("/api/profile/{user_id}")
def get_profile(user_id: str):
    return {"status": "success", "profile": profiles_db.get(user_id, {"alias": "Buddy", "avatar": "🦊", "color": "#5B8DEF"})}

@app.post("/api/profile")
def update_profile(request: ProfileRequest):
    profiles_db[request.user_id] = {"alias": request.alias, "avatar": request.avatar, "color": request.color}
    return {"status": "success", "profile": profiles_db[request.user_id]}

@app.get("/api/chat/conversations/{user_id}")
def get_conversations(user_id: str):
    user_convs = [c for c in conversations_db if c["user_id"] == user_id]
    user_convs.sort(key=lambda x: x["created_at"], reverse=True)
    return {"status": "success", "conversations": user_convs}

@app.get("/api/chat/messages/{conversation_id}")
def get_messages(conversation_id: str):
    msgs = [m for m in messages_db if m["conversation_id"] == conversation_id]
    return {"status": "success", "messages": msgs}

@app.post("/api/chat")
def handle_chat(request: ChatRequest):
    conv_id = request.conversation_id
    if not conv_id:
        conv_id = f"conv_{int(time.time()*1000)}"
        conversations_db.append({
            "id": conv_id, "user_id": request.user_id, "created_at": int(time.time()*1000), "status": "active"
        })
    
    user_msg_id = int(time.time()*1000)
    messages_db.append({
        "id": user_msg_id, "conversation_id": conv_id, "sender": "child", 
        "text": request.message, "created_at": int(time.time()*1000)
    })

    system_instruction = (
        "You are Buddy, a friendly, empathetic AI companion for children. "
        "Analyze the user's message and categorize the risk tier: "
        "'safe' (normal conversation), 'distress' (signs of bullying, anxiety, sadness), "
        "or 'critical' (physical danger, extreme abuse, self-harm). "
        "Respond ONLY with a valid JSON object containing exactly two keys: "
        "'reply' (your conversational, comforting response to the child) and "
        "'tier' (the categorized risk level)."
    )

    try:
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=f"Child's message: {request.message}",
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
            )
        )
        
        raw_text = response.text.strip()
        if raw_text.startswith("```json"): raw_text = raw_text[7:-3].strip()
        elif raw_text.startswith("```"): raw_text = raw_text[3:-3].strip()
            
        data = json.loads(raw_text)
        reply = data.get("reply", "I'm here for you. Let's talk.")
        tier = data.get("tier", "safe").lower()

        if tier in ["critical", "distress"]:
            cases_db.append({
                "id": f"BG-{random.randint(1000, 9999)}",
                "title": f"AI Flagged: {tier.capitalize()} Alert",
                "status": "AI Report",
                "tier": tier,
                "description": f"Flagged message: '{request.message}'"
            })
    except Exception as e:
        reply = "I'm having a little trouble connecting right now, but I'm still here for you!"
        tier = "safe"

    buddy_msg_id = int(time.time()*1000) + 1
    messages_db.append({
        "id": buddy_msg_id, "conversation_id": conv_id, "sender": "buddy", 
        "text": reply, "created_at": buddy_msg_id
    })

    return {
        "status": "success",
        "conversation_id": conv_id,
        "reply": reply,
        "detected_tier": tier,
        "user_message": {"id": user_msg_id, "sender": "child", "text": request.message, "created_at": user_msg_id},
        "buddy_message": {"id": buddy_msg_id, "sender": "buddy", "text": reply, "created_at": buddy_msg_id}
    }

@app.get("/api/history/{user_id}")
def get_history(user_id: str):
    user_hist = [h for h in history_db if h.get("user_id") == user_id]
    user_hist.sort(key=lambda x: x["id"], reverse=True)
    return {"status": "success", "history": user_hist}

@app.post("/api/history")
def save_history(request: HistorySaveRequest):
    new_hist = request.dict()
    new_hist["id"] = int(time.time()*1000)
    new_hist["date"] = time.strftime("%b %d, %Y")
    new_hist["time"] = time.strftime("%I:%M %p")
    history_db.append(new_hist)
    return {"status": "success"}

@app.post("/api/reports")
def submit_report(request: ReportRequest):
    case_id = f"BG-{random.randint(3000, 9999)}"
    
    cases_db.append({
        "id": case_id,
        "title": f"User Report: {request.category.capitalize()}",
        "status": "AI Report",
        "tier": "distress",
        "description": request.description
    })
    
    new_hist = {
        "id": int(time.time()*1000),
        "user_id": request.user_id,
        "type": "report",
        "title": f"{request.category.capitalize()} Report",
        "date": time.strftime("%b %d, %Y"),
        "time": time.strftime("%I:%M %p"),
        "preview": request.description or "No description provided.",
        "status": "reviewing",
        "caseId": case_id
    }
    history_db.append(new_hist)

    return {"status": "success", "case_id": case_id}

@app.post("/api/sos")
def trigger_sos(request: SOSRequest):
    cases_db.append({
        "id": f"BG-{random.randint(9000, 9999)}",
        "title": "SOS ALARM TRIGGERED",
        "status": "Critical Review",
        "tier": "critical",
        "description": "User initiated immediate SOS. Location shared."
    })
    return {"status": "success", "message": "Officials notified."}

@app.get("/api/cases")
def get_cases():
    return {"status": "success", "cases": cases_db}
