# Buddy Guard

**AI companion for child safety, mental well-being, and cyberbullying protection**

**Team:** Runtime Terror



---

## 1.The Problem

Children and teens in India regularly face bullying (online and offline), digital exploitation, abuse, and mental health distress — but rarely have a safe, low-friction way to talk about it before things escalate. Most existing reporting systems require a child to explicitly name a problem and escalate it themselves, which many kids are too scared, too young, or too unsure to do. By the time an adult finds out, the situation has often already gotten serious.

There's no system today that quietly listens, understands context, and connects a child to the *right* kind of help — a trusted person for emotional support, or real emergency responders when it's genuinely dangerous.

---

## 2.Our Solution

**Buddy Guard** is an AI chat companion that a child can talk to like a friend. Underneath the conversation, it's doing two things at once:

1. **Understanding** — picking up on signs of mental health distress or bullying through the conversation itself (not just keyword matching), and gently offering coping guidance or a nearby therapist recommendation.
2. **Protecting** — if the situation looks like heavy/sustained bullying or a genuine emergency, it loops in the right humans automatically: the child's **Guardian** for support, and/or **Officials** and **Emergency Contacts** when real-world safety is at risk.

The core idea: the chatbot *is* the detection layer. A child who'd never fill out an abuse report might still say something revealing while just chatting — Buddy Guard is built to notice that and respond appropriately, without forcing the child to make the first move.

---

## 3.Who's Involved

| Role | Who they are | What they get |
|---|---|---|
| **Child (User)** | The primary user — can chat, report, or hit SOS | A safe space to talk, coping guidance, therapist suggestions, and a way to get help without confrontation |
| **Guardian** | Whoever the child trusts most — could be a parent, cousin, uncle, close friend, or even their psychologist. **Not necessarily a parent.** | Notified when their ward shows signs of mental health struggle or bullying; sees safety recommendations, not raw chat logs |
| **Emergency Contact** | People the child trusts specifically for *urgent, physical-safety* situations (usually parents/guardians, but configurable) | Notified immediately via SOS — being followed, unsafe surroundings, late-night danger, or any acute emergency |
| **Official** | Government / police team member | Sees a case-management dashboard: heatmap of incidents + case pipeline, from report to resolution |
| **Admin** | Our team | Owns the platform, oversight of system health and data integrity |

**Guardian vs. Emergency Contact — the distinction:**
- **Guardian** = emotional/personal support line. Notified for *mental health distress* or *bullying* cases. Helps with the child's personal life and well-being.
- **Emergency Contact** = crisis response line. Notified (along with police, via SOS) only in *extreme, acute* situations — physical danger, being followed, unsafe environment. Speed matters more than nuance here.

A single person (e.g. a parent) can be both — but the system treats them as two distinct notification paths with different triggers.

---

## 4.Core Features

### AI Chat Companion
- Child-friendly, conversational tone — feels like talking to a friend, not filling out a form
- Multilingual support
- Passive contextual analysis of the conversation to detect distress or bullying signals
- Can also be told directly — child can upload bullying screenshots as manual reports

### Behavioral Engine (Triage)
Every flagged conversation or report gets classified into one of three tiers:

| Tier | Trigger | Action |
|---|---|---|
| **Critical Emergency** | Signs of immediate danger / abuse | Notifies **Guardian + Officials** immediately |
| **Mental Breakdown / Distress / Bullying** | Ongoing emotional distress, cyberbullying | Notifies **Guardian**, surfaces therapist & helpline info |
| **Spam / Scam / No Risk** | Nothing concerning | Logged only, no notification, no false alarms |

### SOS
Separate from the Behavioral Engine — this is a direct, child-initiated panic button for real-time physical danger (being followed, unsafe surroundings, late at night, etc.). Immediately alerts **Emergency Contacts** and can initiate contact with **police/officials**.

### Report & Case System
- Every incident (AI-detected or manually reported) gets a **Case ID**
- Status pipeline: `Report → AI Report → Human Review → Follow-up → Resolved`
- Full history tracked for accountability

### Guardian Dashboard
- Notices tied to their ward, only for relevant tiers (Distress / Critical)
- Safety recommendations, not raw conversation transcripts
- (Stretch) Configure Emergency Contact Circle & Safe-Mode sensitivity threshold

### 👮Official Dashboard
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
- The app keeps a history of the child's conversations and reports
- Useful to show a doctor, therapist, or counselor later — gives real context instead of the child having to re-explain everything from scratch
- Accessible to the child (and shareable at their discretion), not silently handed to anyone else

---

## 5.User Flows

**Child:**
`Open Buddy Guard → chat naturally (or report an incident / hit SOS) → AI analyzes in the background → if risk detected, case is created → child is shown safety resources → guardian/officials notified per tier`

**Guardian:**
`Receive notice (Distress or Critical tier only) → view context & safety recommendation → if Critical, coordinate directly with officials`

**Official:**
`New case appears on dashboard → view on heatmap + case list → Human Review → Follow-up → mark Resolved`

**SOS (emergency, child-initiated):**
`Child hits SOS → Emergency Contacts notified instantly → police/officials alerted → live status until resolved`

---

## 6.Team — Runtime Terror

| Name |
|---|
| Harsh Komarpant |
| Santosh Bothiraja |
| Ayush Desai |
| Bhawesh Papanai |

**Track:** Bal Suraksha (Child Safety, Protection & Well-being) — Bit N Build Hackathon
