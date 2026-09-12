from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from google import genai
from google.genai import types
import json
import random
import os
from dotenv import load_dotenv

load_dotenv() # This loads the variables from the .env file


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

app = FastAPI(title="Buddy Guard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    user_id: str
    message: str
    anonymous: bool = True

class ReportRequest(BaseModel):
    category: str
    description: Optional[str] = ""

class SOSRequest(BaseModel):
    user_id: str
    location_shared: bool = True

cases_db = []
messages_db = []

@app.post("/api/chat")
def handle_chat(request: ChatRequest):
    messages_db.append({"sender": "user", "text": request.message})

    try:
        # 3. Request LLM Analysis using the new SDK syntax and updated model
        # 3. Request LLM Analysis using the new SDK syntax and updated model
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=f"Child's message: {request.message}",
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
            )
        )
        
        # 4. Clean the text to prevent JSON crashes if Markdown is returned
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:-3].strip()
        elif raw_text.startswith("```"):
            raw_text = raw_text[3:-3].strip()
            
        data = json.loads(raw_text)
        reply = data.get("reply", "I'm here for you, let's talk.")
        tier = data.get("tier", "safe").lower()

        # 5. Automatically push to Official/Guardian Dashboard if unsafe
        if tier in ["critical", "distress"]:
            cases_db.append({
                "id": f"BG-{random.randint(1000, 9999)}",
                "title": f"AI Flagged: {tier.capitalize()} Alert",
                "status": "AI Report",
                "tier": tier,
                "description": f"Flagged message: '{request.message}'"
            })

    except Exception as e:
        print(f"\n--- LLM ERROR --- \n{e}\n-----------------\n")
        reply = "I'm having a little trouble connecting right now, but I'm still here for you!"
        tier = "safe"

    messages_db.append({"sender": "buddy", "text": reply})

    return {
        "status": "success",
        "reply": reply,
        "detected_tier": tier
    }

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
