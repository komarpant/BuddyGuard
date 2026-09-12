<div align="center">

# 🛡️ Buddy Guard

### AI companion for child safety, mental well-being, and cyberbullying protection

**Team Runtime Terror** · Bit N Build Hackathon · Track: **Bal Suraksha** (Child Safety, Protection & Well-being)

[![Track](https://img.shields.io/badge/Track-Bal%20Suraksha-blueviolet)](#)
[![Hackathon](https://img.shields.io/badge/Bit%20N%20Build-2026-informational)](#)
[![Status](https://img.shields.io/badge/Status-Prototype-orange)](#)
[![License](https://img.shields.io/badge/License-MIT-green)](#)

</div>

---

## Table of Contents

- [The Problem](#-1-the-problem)
- [Our Solution](#-2-our-solution)
- [Who's Involved](#-3-whos-involved)
- [Core Features](#-4-core-features)
- [User Flows](#-5-user-flows)
- [Tech Stack](#-6-tech-stack)
- [Getting Started](#-7-getting-started)
- [Team](#-8-team--runtime-terror)

---

##  1. The Problem

Children and teens in India regularly face bullying (online and offline), digital exploitation, abuse, and mental health distress — but rarely have a safe, low-friction way to talk about it before things escalate.

Most existing reporting systems require a child to **explicitly name a problem and escalate it themselves** — something many kids are too scared, too young, or too unsure to do. By the time an adult finds out, the situation has often already gotten serious.

> There's no system today that quietly listens, understands context, and connects a child to the *right* kind of help — a trusted person for emotional support, or real emergency responders when it's genuinely dangerous.

---

##  2. Our Solution

**Buddy Guard** is an AI chat companion that a child can talk to like a friend. Underneath the conversation, it's doing two things at once:

| | |
|---|---|
| **Understanding** | Picks up on signs of mental health distress or bullying through the conversation itself (not just keyword matching), and gently offers coping guidance or a nearby therapist recommendation. |
| **Protecting** | If the situation looks like heavy/sustained bullying or a genuine emergency, it loops in the right humans automatically — the child's **Guardian** for support, and/or **Officials** and **Emergency Contacts** when real-world safety is at risk. |

**The core idea:** the chatbot *is* the detection layer. A child who'd never fill out an abuse report might still say something revealing while just chatting — Buddy Guard is built to notice that and respond appropriately, without forcing the child to make the first move.

---

##  3. Who's Involved

| Role | Who they are | What they get |
|------|--------------|----------------|
| **Child (User)** | The primary user — can chat, report, or hit SOS | A safe space to talk, coping guidance, therapist suggestions, and a way to get help without confrontation |
| **Guardian** | Whoever the child trusts most — parent, cousin, uncle, close friend, or even their psychologist. **Not necessarily a parent.** | Notified when their ward shows signs of mental health struggle or bullying; sees safety recommendations, not raw chat logs |
| **Emergency Contact** | People the child trusts specifically for *urgent, physical-safety* situations (usually parents/guardians, but configurable) | Notified immediately via SOS — being followed, unsafe surroundings, late-night danger, or any acute emergency |
| **Official** | Government / police team member | Sees a case-management dashboard: heatmap of incidents + case pipeline, from report to resolution |
| **Admin** | Our team | Owns the platform, oversight of system health and data integrity |

**Guardian vs. Emergency Contact — the distinction:**
- **Guardian** = emotional/personal support line. Notified for *mental health distress* or *bullying* cases.
- **Emergency Contact** = crisis response line. Notified (along with police, via SOS) only in *extreme, acute* situations. Speed matters more than nuance here.

*A single person (e.g. a parent) can be both — but the system treats them as two distinct notification paths with different triggers.*

---

## 4. Core Features

### AI Chat Companion
- Child-friendly, conversational tone — feels like talking to a friend, not filling out a form
- Multilingual support
- Passive contextual analysis of the conversation to detect distress or bullying signals
- Can also be told directly — child can upload bullying screenshots as manual reports

###  Behavioral Engine (Triage)
Every flagged conversation or report gets classified into one of three tiers:

| Tier | Trigger | Action |
|------|---------|--------|
| 🔴 **Critical Emergency** | Signs of immediate danger / abuse | Notifies **Guardian + Officials** immediately |
| 🟡 **Mental Breakdown / Distress / Bullying** | Ongoing emotional distress, cyberbullying | Notifies **Guardian**, surfaces therapist & helpline info |
| ⚪ **Spam / Scam / No Risk** | Nothing concerning | Logged only, no notification, no false alarms |

###  SOS
Separate from the Behavioral Engine — a direct, child-initiated panic button for real-time physical danger (being followed, unsafe surroundings, late at night, etc.). Immediately alerts **Emergency Contacts** and can initiate contact with **police/officials**.

### Report & Case System
- Every incident (AI-detected or manually reported) gets a **Case ID**
- Status pipeline: `Report → AI Report → Human Review → Follow-up → Resolved`
- Full history tracked for accountability

### Guardian Dashboard
- Notices tied to their ward, only for relevant tiers (Distress / Critical)
- Safety recommendations, not raw conversation transcripts
- *(Stretch)* Configure Emergency Contact Circle & Safe-Mode sensitivity threshold

### Official Dashboard
- **Heatmap** of incident density (mock/sample geo data for demo)
- **Case pipeline** view — filterable, sortable by priority/status

### Privacy Mode
- Default identity is alias/avatar-based, not real name
- Anonymous chats are still analyzed for risk, but not linked to real identity **unless escalated to Critical/Emergency**
- Child controls what's shared and when

### Support Resources
- Nearby therapist lookup
- Helpline numbers
- Awareness/education section for kids

### Incident & Conversation History
- Keeps a history of the child's conversations and reports
- Useful to show a doctor, therapist, or counselor later — gives real context instead of re-explaining everything from scratch
- Accessible to the child (and shareable at their discretion), not silently handed to anyone else

---

## 5. User Flows

**Child**
```
Open Buddy Guard → chat naturally (or report an incident / hit SOS)
→ AI analyzes in the background → if risk detected, case is created
→ child is shown safety resources → guardian/officials notified per tier
```

**Guardian**
```
Receive notice (Distress or Critical tier only) → view context & safety recommendation
→ if Critical, coordinate directly with officials
```

**Official**
```
New case appears on dashboard → view on heatmap + case list
→ Human Review → Follow-up → mark Resolved
```

**SOS (emergency, child-initiated)**
```
Child hits SOS → Emergency Contacts notified instantly
→ police/officials alerted → live status until resolved
```

---

## 6. Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React / Next.js |
| **Backend** | Node.js (Express) or Next.js API routes |
| **Database** | Firebase/Firestore or PostgreSQL |
| **Detection Layer** | LLM API call — chat reply + risk classification in one call |
| **Heatmap** | Leaflet.js / Mapbox with sample geo data |
| **Hosting/Demo** | Vercel / Render / Railway |

---

## 7. Getting Started

```bash
# Clone the repo
git clone https://github.com/komarpant/BuddyGuard.git
cd BuddyGuard

# Install frontend dependencies
cd frontend
npm install
npm run dev

# Install backend dependencies
cd ../backend
npm install
npm run dev
```

> Add your environment variables (LLM API key, database credentials, map API key) in a `.env` file before running.

---

## 8. Team — Runtime Terror

| Name |
|------|
| Harsh Komarpant |
| Santosh Bothiraja |
| Ayush Desai |
| Bhawesh Papanai |

**Track:** Bal Suraksha (Child Safety, Protection & Well-being) — Bit N Build Hackathon

<div align="center">

*Because every child deserves to be heard before things escalate.*

</div>
