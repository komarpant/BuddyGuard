# Buddy Guard — System Architecture

**Team:** Runtime Terror
**Track:** Bal Suraksha (Child Safety, Protection & Well-being)
**Event:** Bit N Build Hackathon (48-hour build)

---

## 1. High-Level System Overview

```
                        ┌─────────────────────────────┐
                        │        Child Client         │
                        │  (Chat UI, SOS button,      │
                        │  Report form, History,      │
                        │  Profile & Privacy)         │
                        └──────────────┬──────────────┘
                                       │ HTTPS / WebSocket
                                       ▼
                        ┌──────────────────────────────┐
                        │        API Gateway /         │
                        │        Backend Service       │
                        └──────────────┬───────────────┘
                    ┌──────────────────┼────────────────────┐
                    ▼                  ▼                    ▼
        ┌────────────────────┐ ┌─────────────────┐   ┌──────────────────────┐
        │  Detection Layer   │ │ Behavioral      │   │  Report/Case         │
        │  (Chatbot + NLP)   │ │ Engine (Triage) │   │  Management Service  │
        └─────────┬──────────┘ └───────┬─────────┘   └─────────┬────────────┘
                  │                    │                       │
                  ▼                    ▼                       ▼
        ┌────────────────────────────────────────────────────────────────┐
        │                          Database Layer                        │
        │  (Conversations, History, Users/Profiles, Cases, Risk Scores,  │
        │   Guardian Links, Emergency Contacts, Heatmap/Incident Data)   │
        └────────────────────────────────────────────────────────────────┘
                  │                    │                       │
                  ▼                    ▼                       ▼
        ┌───────────────┐  ┌────────────────────┐  ┌───────────────────────┐
        │ Guardian      │  │ Official Dashboard │  │ Notification          │
        │ Dashboard     │  │ (Heatmap + Case    │  │ Service (Guardian /   │
        │               │  │ Pipeline)          │  │ Officials / Emergency │
        │               │  │                    │  │ Contacts / SOS)       │
        └───────────────┘  └────────────────────┘  └───────────────────────┘
```

---

## 2. Components

### 2.1 Child Client (Frontend)
- **Type:** Web app (web or mobile web is acceptable per hackathon rules)
- **Screens:** Chat, Report/screenshot upload, SOS button, History (past conversations & reports), Profile & privacy settings, Awareness section
- **Key behavior:** Sends conversation turns to the backend in real time; supports anonymous session mode (Privacy Mode); lets the child view their own saved history

### 2.2 API Gateway / Backend Service
- Central request router; handles auth (alias-based, not necessarily real identity), session state, and routes messages to the Detection Layer, Report Service, and SOS handler
- **Suggested stack:** Node.js/Express or Next.js API routes (whichever the team is fastest in)

### 2.3 Detection Layer
- Receives each chat message
- Analyzes it for signs of mental health distress or bullying — contextual pattern analysis for MVP, LLM-based classification if time allows (can be the same LLM call that generates the chatbot's reply)
- Multilingual handling — start with 1–2 languages for the demo, structure code to be language-agnostic
- Outputs: a `risk_signal` object → passed to the Behavioral Engine

### 2.4 Behavioral Engine (Triage)
- Input: `risk_signal` (from chat), a manual report (e.g., bullying screenshot), or an SOS trigger
- Applies classification logic:
  - **Critical Emergency** → creates a case, notifies Guardian + Officials (and Emergency Contacts if triggered via SOS)
  - **Mental Breakdown / Distress / Bullying** → creates a case, notifies Guardian only, attaches therapist/helpline resources
  - **Spam / Scam / No risk** → logs only, no notification
- This is the core "smart" component of the demo — keep the logic simple, explainable, and testable against a fixed set of sample inputs

### 2.5 Report / Case Management Service
- Owns the case lifecycle: `Report → AI Report → Human Review → Follow-up → Resolved`
- Assigns Case IDs, stores case status transitions
- Serves data to both the Guardian Dashboard and the Official Dashboard

### 2.6 SOS Handler
- Separate, direct path from the Detection Layer/Behavioral Engine — child-initiated, not passively inferred
- Triggered by the SOS button for real-time physical danger (being followed, unsafe surroundings, late at night, etc.)
- Immediately creates a Critical-tier case and pushes to the Notification Service for Emergency Contacts + Officials, bypassing the normal triage queue for speed

### 2.7 Notification Service
- Sends alerts to Guardians, Officials, and/or Emergency Contacts based on Behavioral Engine output or an SOS trigger
- MVP: in-app notification/dashboard badge is sufficient (real SMS/email/police-system integration is a stretch goal, not implemented for the demo)

### 2.8 Guardian Dashboard
- Shows notices tied to their linked ward(s), for Distress and Critical tiers only
- Displays safety recommendations, not raw conversation transcripts
- (Stretch) Emergency Contact Circle management, Safe-Mode threshold settings

### 2.9 Official Dashboard
- **Heatmap:** geographic view of incident density (mock/sample data acceptable for the demo)
- **Case pipeline view:** list of cases with current status, filterable/sortable by priority

### 2.10 Database Layer
- **Suggested:** Firebase/Firestore (fastest to ship in 48 hours, works directly from the frontend) or PostgreSQL if the team already knows it well
- **Core tables/collections:**
  - `users` (alias, role: child/guardian/emergency-contact/official/admin, linked guardian ID, linked emergency contact IDs)
  - `conversations` (message log, session ID, anonymized flag)
  - `history` (per-child saved record of past conversations/reports, viewable by the child and shareable at their discretion — e.g., with a doctor)
  - `risk_signals` (conversation ID, detected category, confidence/score)
  - `cases` (case ID, category, status, timestamps, linked user, SOS flag)
  - `incidents` (for heatmap — location, category, timestamp)

---

## 3. Data Flows

### 3.1 Critical Emergency (detected through conversation)
1. Child sends a message → Detection Layer analyzes it
2. Detection Layer flags a high-risk pattern → sends a `risk_signal` to the Behavioral Engine
3. Behavioral Engine classifies it as **Critical Emergency**
4. Case Management Service creates a new case (status: `AI Report`)
5. Notification Service alerts the Guardian + Officials
6. An Official picks up the case on their dashboard → moves status through `Human Review` → `Follow-up` → `Resolved`
7. The Guardian sees the case status update throughout

### 3.2 SOS (child-initiated emergency)
1. Child hits the SOS button
2. SOS Handler immediately creates a Critical-tier case, bypassing normal triage
3. Notification Service alerts Emergency Contacts + Officials right away
4. Case appears on the Official dashboard for follow-up, same as any other Critical case
5. Status updates flow back to the child and Emergency Contacts until Resolved

### 3.3 Distress / Bullying (non-emergency)
1. Child sends messages showing signs of ongoing distress or bullying → Detection Layer flags it
2. Behavioral Engine classifies it as **Mental Breakdown / Distress / Bullying**
3. Case Management Service creates a case, Notification Service alerts the Guardian only
4. Child is shown therapist/helpline resources in-app
5. Conversation is saved to the child's History for future reference (e.g., to show a therapist)

---

## 4. Privacy & Security Notes (for demo credibility, not production-grade)

- Default to alias/avatar identity, not real name, for the child
- Anonymous chat sessions are analyzed for risk but not linked to identity unless escalated to Critical/Emergency tier
- A child's History is visible to and controlled by the child; it is not silently shared with Guardians, Officials, or anyone else
- No secrets/API keys committed to the public GitHub repo (hackathon rule — use `.env` + `.gitignore`)
- Clearly document in the README what is a security *placeholder* vs. what's actually implemented, to be transparent with judges

---

## 5. Suggested Tech Stack (fill in once team decides)

| Layer | Options |
|---|---|
| Frontend | React / Next.js |
| Backend | Node.js (Express) or Next.js API routes |
| Database | Firebase/Firestore or PostgreSQL |
| Detection Layer | LLM API call (chat reply + risk classification in one call) |
| Heatmap | Leaflet.js / Mapbox with sample geo data |
| Hosting/Demo | Vercel / Render / Railway for quick deploy |

---

## 6. Suggested Repo Structure

```
/buddy-guard
├── README.md
├── PRD.md
├── Architecture.md
├── /frontend
│   ├── /chat
│   ├── /history
│   ├── /guardian-dashboard
│   ├── /official-dashboard
│   └── /profile
├── /backend
│   ├── /detection-layer
│   ├── /behavioral-engine
│   ├── /sos-handler
│   ├── /case-management
│   └── /notifications
└── /docs
```

---

## 7. Build Phasing (for 48-hour window)

1. **Hours 0–8:** Core chatbot UI + backend skeleton + database schema
2. **Hours 8–20:** Detection Layer + Behavioral Engine triage logic + SOS handler
3. **Hours 20–32:** Case Management Service + Guardian/Official dashboards + History view
4. **Hours 32–40:** Notification flow, Privacy Mode, polish UI
5. **Hours 40–48:** Testing with sample conversations, record demo video, finalize PPT and README
