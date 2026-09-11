# Buddy Guard — Product Requirements Document

**Team:** Runtime Terror
**Track:** Bal Suraksha (Child Safety, Protection & Well-being)
**Event:** Bit N Build Hackathon (48-hour build)

---

## 1. Problem Statement

Children and teens in India face mental health struggles and cyberbullying with no safe, low-friction way to talk about what's happening before it escalates. A child being bullied online or offline, or quietly going through emotional distress, often doesn't have the words, courage, or trust needed to file a report or bring it up directly with an adult. By the time someone finds out, the situation has usually already gotten serious.

**Who is affected:** School-age children and teens, the people they trust (parents, guardians, relatives, close friends, counselors), and the officials who eventually have to respond once something becomes urgent.

**Why it matters:** Most harm to a child — mental health decline, sustained bullying, or an acute safety threat — goes unnoticed until it's a crisis, because there's no system that meets the child where they already are: in conversation.

---

## 2. Solution Overview

**Buddy Guard** is an AI chat companion for children that:

1. Talks with the child naturally, like a friend, not a form to fill out.
2. Understands, through the conversation itself, when a child is showing signs of mental health distress or being bullied — and responds with coping guidance and, if relevant, a nearby therapist suggestion.
3. Classifies the seriousness of what it picks up on, and routes it to the right person automatically:
   - Ongoing distress or bullying → the child's **Guardian** is notified.
   - A genuine emergency → **Guardian + Officials** are notified.
4. Gives the child a direct **SOS** option for real-time physical danger, which immediately alerts their **Emergency Contacts** and officials — separate from the passive detection above.
5. Keeps a private history of conversations and reports, so the child has something real to show a doctor, therapist, or counselor later instead of having to re-explain everything from memory.
6. Gives **Officials** a case-management view (heatmap + status pipeline) to track and resolve real incidents.

The core idea: the chatbot *is* the detection surface, not just a reporting form. A child who would never fill out a bullying or abuse report might still say something revealing in casual conversation — Buddy Guard is built to notice that and act on it without forcing the child to ask for help directly.

---

## 3. User Roles

| Role | Who they are | What they need |
|---|---|---|
| **Child (User)** | The primary user | Feels safe talking to Buddy Guard, can stay anonymous, can get help without confrontation, can self-report bullying (e.g., screenshots), can access their own history |
| **Guardian** | Whoever the child trusts most — could be a parent, cousin, uncle, close friend, or even their psychologist. Not necessarily a parent. | Gets notified when their ward shows real signs of distress or bullying; sees safety recommendations, not raw chat logs; doesn't want to be flooded with false alarms |
| **Emergency Contact** | People the child trusts specifically for urgent, physical-safety situations — usually parents/guardians, but configurable | Notified immediately, alongside police, only when the child hits SOS or a Critical Emergency is detected |
| **Official** | Government / police team member | A prioritized, geographic view of active cases; ability to track a report from intake to resolution |
| **Admin** | The Buddy Guard team (us) | Oversight of the platform and its data |

**Guardian vs. Emergency Contact:** a Guardian is the emotional/personal support line — notified for distress or bullying, and helps with the child's day-to-day life. An Emergency Contact is the crisis-response line — notified only for acute, physical danger, alongside officials. The same person can be both, but the system treats the two as separate notification paths with separate triggers.

---

## 4. Core Features (MVP Scope for 48 Hours)

### Must-Have — Demo Core

1. **Chatbot (Detection Layer)**
   - Conversational, child-friendly, multilingual interface
   - Contextual analysis of messages to detect mental health distress or bullying signals — not just keyword triggers
2. **Behavioral Engine (Triage)**
   - Classifies flagged conversations or reports into:
     - **Critical Emergency** → notifies Guardian + Officials (+ Emergency Contacts if SOS-triggered)
     - **Mental Breakdown / Distress / Bullying** → notifies Guardian only, surfaces therapist/helpline info
     - **Spam / Scam / No risk** → no action, logged only
3. **SOS**
   - Child-initiated panic button for real-time physical danger (being followed, unsafe surroundings, late at night, etc.)
   - Immediately notifies Emergency Contacts and alerts officials
4. **Report System**
   - Child can manually report an incident (e.g., a bullying screenshot) in addition to passive detection
   - Each report gets a Case ID and status: `Report → AI Report → Human Review → Follow-up → Resolved`
5. **Conversation & Incident History**
   - The app retains a private history of the child's conversations and reports
   - Useful to show a doctor, therapist, or counselor later — gives real context instead of forcing the child to re-explain everything
   - Visible to and controlled by the child; not silently exposed to anyone else
6. **Guardian View**
   - Dashboard showing alerts/notices tied to their ward, with safety recommendations
7. **Official View**
   - Case list with status pipeline
   - Basic heatmap (mocked with sample geographic data if live data isn't available in time)
8. **Privacy Mode**
   - Anonymous chat option — the conversation is analyzed but not tied to identity unless escalated to Critical/Emergency

### Stretch Goals (if time allows)

- Avatar/alias-based profile system
- Emergency Contact Circle management + configurable Safe-Mode threshold
- Conversation analytics dashboard
- Awareness/education section for children
- Nearby therapist and helpline lookup (map/list)

---

## 5. User Flows

**Child flow:**
`Open chatbot → talk / report incident (optionally anonymous) → Behavioral Engine classifies → (if risk) case created → child sees safety resources → history saved for later reference`

**Guardian flow:**
`Receive notice (only for Distress / Critical tiers) → view recommendation → (if Critical) coordinate with officials`

**Official flow:**
`New case appears on dashboard → view on heatmap + case list → Human Review → Follow-up actions → mark Resolved`

**SOS flow (child-initiated, real-time danger):**
`Child hits SOS → Emergency Contacts notified instantly → officials alerted → live status until resolved`

---

## 6. Success Metrics (for judging / pitch)

- Can the chatbot correctly classify a simulated distress or bullying conversation into the right tier, live in the demo video?
- Can a report move through the full pipeline (Report → Resolved) in the demo?
- Does the guardian/official view clearly reflect real-time state changes?
- Does SOS visibly and immediately notify the right people in the demo?

---

## 7. Out of Scope (for this hackathon build)

- Real-time production-grade multilingual NLP (a working subset/demo language is enough)
- Legal/compliance integration with actual child-protection authorities or police systems
- Production-level authentication/security hardening (should be *represented*, not fully implemented)
- Real device deployment (web prototype is sufficient per hackathon rules)

---

## 8. Risks & Open Questions

- **False positives/negatives in detection** — triage logic needs a small, clearly-defined test set of sample conversations to prove out
- **Where does "Critical Emergency" evidence come from in a demo?** — need a scripted, realistic sample conversation for the video
- **Heatmap data** — will need sample/mock incident data if no real dataset is available in time
- **Privacy vs. escalation trade-off** — need to clearly define, in advance, exactly what triggers de-anonymization
- **History access control** — who else, if anyone, should be able to see a child's saved history besides the child themselves?

---

## 9. Deliverables Checklist (per hackathon rules)

- [ ] 6-slide PPT (Title, Problem, Solution, Tech & Implementation, Feasibility/Scalability/Impact, Prototype & Future Scope)
- [ ] Public GitHub repo with README (setup + tech stack + how to run)
- [ ] Working prototype link
- [ ] 3-minute prototype demo video
