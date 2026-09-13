from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import shutil
from pathlib import Path

Path("uploads").mkdir(exist_ok=True)
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

# === SUPABASE CONNECTION ===
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
sb = None
USE_SUPABASE = False

if supabase_url and supabase_key:
    try:
        from supabase import create_client
        sb = create_client(supabase_url, supabase_key)
        # Test if our custom tables exist
        test = sb.table("users").select("id, email").limit(1).execute()
        USE_SUPABASE = True
        print("Supabase connected successfully!")
    except Exception as e:
        print(f"Supabase not ready, using in-memory fallback: {e}")
        sb = None

app = FastAPI(title="Buddy Guard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://buddyguard-three.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# === IN-MEMORY FALLBACK DATABASE ===
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
guardians_mem_db = []

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

class SOSRequest(BaseModel):
    user_id: str

class GuardianRequest(BaseModel):
    user_id: str
    name: str
    relationship: str = "Parent"
    whatsapp_number: str = ""
    phone_number: str = ""
    notes: str = ""

class GuardianUpdate(BaseModel):
    notes: Optional[str] = None
    name: Optional[str] = None
    relationship: Optional[str] = None
    whatsapp_number: Optional[str] = None
    phone_number: Optional[str] = None

# === ENDPOINTS ===

@app.get("/")
def root():
    return {
        "message": "Buddy Guard API is running"
    }

@app.get("/health")
def health():
    return {
        "status": "ok"
    }

@app.get("/health/db")
def database_health():
    if not USE_SUPABASE:
        return {
            "status": "ok",
            "database": "in-memory fallback"
        }

    try:
        sb.table("users").select("id").limit(1).execute()
        return {
            "status": "ok",
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "error",
            "database": "connection failed",
            "details": str(e)
        }

@app.post("/api/auth/login")
def login(request: AuthRequest):
    if USE_SUPABASE:
        try:
            result = sb.table("users").select("*").eq("email", request.email).eq("password", request.password).execute()
            if not result.data:
                raise HTTPException(status_code=401, detail="Invalid email or password")
            user = result.data[0]
            return {"status": "success", "user": {"id": user["id"], "email": user["email"], "role": user["role"]}}
        except HTTPException:
            raise
        except Exception as e:
            print(f"Supabase error: {e}")
    # Fallback to in-memory
    user = next((u for u in users_db if u["email"] == request.email and u["password"] == request.password), None)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"status": "success", "user": {"id": user["id"], "email": user["email"], "role": user["role"]}}

@app.post("/api/auth/signup")
def signup(request: AuthRequest):
    if USE_SUPABASE:
        try:
            existing = sb.table("users").select("id").eq("email", request.email).execute()
            if existing.data:
                raise HTTPException(status_code=400, detail="User already exists")
            new_id = f"local-user-{int(time.time()*1000)}"
            sb.table("users").insert({"id": new_id, "email": request.email, "password": request.password, "role": "user"}).execute()
            return {"status": "success", "user": {"id": new_id, "email": request.email, "role": "user"}}
        except HTTPException:
            raise
        except Exception as e:
            print(f"Supabase error: {e}")
    # Fallback
    if any(u["email"] == request.email for u in users_db):
        raise HTTPException(status_code=400, detail="User already exists")
    new_user = {"id": f"local-user-{int(time.time()*1000)}", "email": request.email, "password": request.password, "role": "user"}
    users_db.append(new_user)
    return {"status": "success", "user": {"id": new_user["id"], "email": new_user["email"], "role": new_user["role"]}}

@app.get("/api/profile/{user_id}")
def get_profile(user_id: str):
    if USE_SUPABASE:
        try:
            result = sb.table("profiles").select("*").eq("user_id", user_id).execute()
            if result.data:
                return {"status": "success", "profile": result.data[0]}
        except Exception as e:
            print(f"Supabase error: {e}")
    return {"status": "success", "profile": profiles_db.get(user_id, {"alias": "Buddy", "avatar": "fox", "color": "#5B8DEF"})}

@app.post("/api/profile")
def update_profile(request: ProfileRequest):
    profile_data = {"alias": request.alias, "avatar": request.avatar, "color": request.color}
    if USE_SUPABASE:
        try:
            existing = sb.table("profiles").select("user_id").eq("user_id", request.user_id).execute()
            if existing.data:
                sb.table("profiles").update(profile_data).eq("user_id", request.user_id).execute()
            else:
                sb.table("profiles").insert({"user_id": request.user_id, **profile_data}).execute()
            return {"status": "success", "profile": profile_data}
        except Exception as e:
            print(f"Supabase error: {e}")
    profiles_db[request.user_id] = profile_data
    return {"status": "success", "profile": profile_data}

@app.get("/api/chat/conversations/{user_id}")
def get_conversations(user_id: str):
    if USE_SUPABASE:
        try:
            result = sb.table("conversations").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
            return {"status": "success", "conversations": result.data}
        except Exception as e:
            print(f"Supabase error: {e}")
    user_convs = [c for c in conversations_db if c["user_id"] == user_id]
    user_convs.sort(key=lambda x: x["created_at"], reverse=True)
    return {"status": "success", "conversations": user_convs}

@app.get("/api/chat/messages/{conversation_id}")
def get_messages(conversation_id: str):
    if USE_SUPABASE:
        try:
            result = sb.table("messages").select("*").eq("conversation_id", conversation_id).order("created_at").execute()
            return {"status": "success", "messages": result.data}
        except Exception as e:
            print(f"Supabase error: {e}")
    msgs = [m for m in messages_db if m["conversation_id"] == conversation_id]
    return {"status": "success", "messages": msgs}

@app.post("/api/chat")
def handle_chat(request: ChatRequest):
    conv_id = request.conversation_id
    if not conv_id:
        conv_id = f"conv_{int(time.time()*1000)}"
        conv_data = {"id": conv_id, "user_id": request.user_id, "created_at": int(time.time()*1000), "status": "active"}
        if USE_SUPABASE:
            try:
                sb.table("conversations").insert(conv_data).execute()
            except Exception as e:
                print(f"Supabase error: {e}")
        conversations_db.append(conv_data)
    
    user_msg_id = int(time.time()*1000)
    user_msg = {"id": user_msg_id, "conversation_id": conv_id, "sender": "child", "text": request.message, "created_at": user_msg_id}
    if USE_SUPABASE:
        try:
            sb.table("messages").insert(user_msg).execute()
        except Exception as e:
            print(f"Supabase error: {e}")
    messages_db.append(user_msg)

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
            case_data = {
                "id": f"BG-{random.randint(1000, 9999)}",
                "title": f"AI Flagged: {tier.capitalize()} Alert",
                "status": "AI Report",
                "tier": tier,
                "description": f"Flagged message: '{request.message}'"
            }
            if USE_SUPABASE:
                try:
                    sb.table("cases").insert(case_data).execute()
                except Exception as e:
                    print(f"Supabase error: {e}")
            cases_db.append(case_data)
    except Exception as e:
        reply = "I'm having a little trouble connecting right now, but I'm still here for you!"
        tier = "safe"

    buddy_msg_id = int(time.time()*1000) + 1
    buddy_msg = {"id": buddy_msg_id, "conversation_id": conv_id, "sender": "buddy", "text": reply, "created_at": buddy_msg_id}
    if USE_SUPABASE:
        try:
            sb.table("messages").insert(buddy_msg).execute()
        except Exception as e:
            print(f"Supabase error: {e}")
    messages_db.append(buddy_msg)

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
    if USE_SUPABASE:
        try:
            result = sb.table("history").select("*").eq("user_id", user_id).order("id", desc=True).execute()
            return {"status": "success", "history": result.data}
        except Exception as e:
            print(f"Supabase error: {e}")
    user_hist = [h for h in history_db if h.get("user_id") == user_id]
    user_hist.sort(key=lambda x: x["id"], reverse=True)
    return {"status": "success", "history": user_hist}

@app.post("/api/history")
def save_history(request: HistorySaveRequest):
    new_hist = {
        "id": int(time.time()*1000),
        "user_id": request.user_id,
        "type": request.type,
        "title": request.title,
        "preview": request.preview,
        "status": request.status,
        "messages_count": request.messages,
        "case_id": request.caseId,
        "date": time.strftime("%b %d, %Y"),
        "time": time.strftime("%I:%M %p"),
    }
    if USE_SUPABASE:
        try:
            sb.table("history").insert(new_hist).execute()
        except Exception as e:
            print(f"Supabase error: {e}")
    history_db.append(new_hist)
    return {"status": "success"}

@app.post("/api/reports")
async def submit_report(
    user_id: str = Form(...),
    category: str = Form(...),
    description: str = Form(""),
    files: List[UploadFile] = File([])
):
    case_id = f"BG-{random.randint(3000, 9999)}"
    
    saved_files = []
    for file in files:
        if file.filename:
            file_ext = file.filename.split(".")[-1]
            new_filename = f"{case_id}_{int(time.time()*1000)}.{file_ext}"
            file_path = Path("uploads") / new_filename
            with file_path.open("wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            saved_files.append(f"/uploads/{new_filename}")

    case_data = {
        "id": case_id,
        "title": f"User Report: {category.capitalize()}",
        "status": "AI Report",
        "tier": "distress",
        "description": f"{description}\nAttachments: {len(saved_files)} file(s)"
    }
    if USE_SUPABASE:
        try:
            sb.table("cases").insert(case_data).execute()
        except Exception as e:
            print(f"Supabase error: {e}")
    cases_db.append(case_data)
    
    new_hist = {
        "id": int(time.time()*1000),
        "user_id": user_id,
        "type": "report",
        "title": f"{category.capitalize()} Report",
        "date": time.strftime("%b %d, %Y"),
        "time": time.strftime("%I:%M %p"),
        "preview": description or "No description provided.",
        "status": "reviewing",
        "case_id": case_id
    }
    if USE_SUPABASE:
        try:
            sb.table("history").insert(new_hist).execute()
        except Exception as e:
            print(f"Supabase error: {e}")
    history_db.append(new_hist)

    return {"status": "success", "case_id": case_id, "files": saved_files}

@app.post("/api/sos")
def trigger_sos(request: SOSRequest):
    case_id = f"BG-{random.randint(9000, 9999)}"
    case_data = {
        "id": case_id,
        "title": "SOS ALARM TRIGGERED",
        "status": "Critical Review",
        "tier": "critical",
        "description": "User initiated immediate SOS. Location shared."
    }
    if USE_SUPABASE:
        try:
            sb.table("cases").insert(case_data).execute()
        except Exception as e:
            print(f"Supabase error: {e}")
    cases_db.append(case_data)
    
    new_hist = {
        "id": int(time.time()*1000),
        "user_id": request.user_id,
        "type": "sos",
        "title": "SOS Alarm Triggered",
        "date": time.strftime("%b %d, %Y"),
        "time": time.strftime("%I:%M %p"),
        "preview": "Immediate SOS triggered. Location shared.",
        "status": "critical",
        "case_id": case_id
    }
    if USE_SUPABASE:
        try:
            sb.table("history").insert(new_hist).execute()
        except Exception as e:
            print(f"Supabase error: {e}")
    history_db.append(new_hist)

    return {"status": "success", "message": "Officials notified.", "case_id": case_id}

@app.get("/api/cases")
def get_cases():
    if USE_SUPABASE:
        try:
            result = sb.table("cases").select("*").execute()
            return {"status": "success", "cases": result.data}
        except Exception as e:
            print(f"Supabase error: {e}")
    return {"status": "success", "cases": cases_db}

# === GUARDIANS ENDPOINTS ===

@app.get("/api/guardians/{user_id}")
def get_guardians(user_id: str):
    if USE_SUPABASE:
        try:
            result = sb.table("guardians").select("*").eq("user_id", user_id).execute()
            return {"guardians": result.data}
        except Exception as e:
            print(f"Supabase error: {e}")
    user_guardians = [g for g in guardians_mem_db if g["user_id"] == user_id]
    return {"guardians": user_guardians}

@app.post("/api/guardians")
def add_guardian(request: GuardianRequest):
    guardian_id = f"guardian-{int(time.time()*1000)}"
    guardian_data = {
        "id": guardian_id,
        "user_id": request.user_id,
        "name": request.name,
        "relationship": request.relationship,
        "whatsapp_number": request.whatsapp_number,
        "phone_number": request.phone_number,
        "notes": request.notes
    }
    if USE_SUPABASE:
        try:
            sb.table("guardians").insert(guardian_data).execute()
        except Exception as e:
            print(f"Supabase error: {e}")
    guardians_mem_db.append(guardian_data)
    return {"status": "success", "guardian": guardian_data}

@app.put("/api/guardians/{guardian_id}")
def update_guardian(guardian_id: str, request: GuardianUpdate):
    updates = {k: v for k, v in request.dict().items() if v is not None}
    if USE_SUPABASE:
        try:
            sb.table("guardians").update(updates).eq("id", guardian_id).execute()
        except Exception as e:
            print(f"Supabase error: {e}")
    for g in guardians_mem_db:
        if g["id"] == guardian_id:
            g.update(updates)
            break
    return {"status": "success"}

@app.delete("/api/guardians/{guardian_id}")
def delete_guardian(guardian_id: str):
    if USE_SUPABASE:
        try:
            sb.table("guardian_notes").delete().eq("guardian_id", guardian_id).execute()
            sb.table("guardians").delete().eq("id", guardian_id).execute()
        except Exception as e:
            print(f"Supabase error: {e}")
    global guardians_mem_db, guardian_notes_mem_db
    guardians_mem_db = [g for g in guardians_mem_db if g["id"] != guardian_id]
    guardian_notes_mem_db = [n for n in guardian_notes_mem_db if n["guardian_id"] != guardian_id]
    return {"status": "success"}

# === GUARDIAN CONVERSATION NOTES ===
guardian_notes_mem_db = []

class NoteRequest(BaseModel):
    guardian_id: str
    title: str
    content: str

@app.get("/api/guardian-notes/{guardian_id}")
def get_guardian_notes(guardian_id: str):
    if USE_SUPABASE:
        try:
            result = sb.table("guardian_notes").select("*").eq("guardian_id", guardian_id).order("created_at", desc=True).execute()
            return {"notes": result.data}
        except Exception as e:
            print(f"Supabase error: {e}")
    notes = [n for n in guardian_notes_mem_db if n["guardian_id"] == guardian_id]
    notes.sort(key=lambda x: x["created_at"], reverse=True)
    return {"notes": notes}

@app.post("/api/guardian-notes")
def add_guardian_note(request: NoteRequest):
    note_id = f"note-{int(time.time()*1000)}"
    note_data = {
        "id": note_id,
        "guardian_id": request.guardian_id,
        "title": request.title,
        "content": request.content,
        "created_at": int(time.time()*1000),
        "date": time.strftime("%b %d, %Y"),
    }
    if USE_SUPABASE:
        try:
            sb.table("guardian_notes").insert(note_data).execute()
        except Exception as e:
            print(f"Supabase error: {e}")
    guardian_notes_mem_db.append(note_data)
    return {"status": "success", "note": note_data}

@app.delete("/api/guardian-notes/{note_id}")
def delete_guardian_note(note_id: str):
    if USE_SUPABASE:
        try:
            sb.table("guardian_notes").delete().eq("id", note_id).execute()
        except Exception as e:
            print(f"Supabase error: {e}")
    global guardian_notes_mem_db
    guardian_notes_mem_db = [n for n in guardian_notes_mem_db if n["id"] != note_id]
    return {"status": "success"}

