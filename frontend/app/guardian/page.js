"use client";

import CaseCard from "@/components/CaseCard";

const wardAlerts = [
  {
    id: "BG-2847",
    title: "Cyberbullying detected in conversation",
    status: "AI Report",
    tier: "distress",
    date: "Sep 10, 2026 — 6:15 PM",
    description: "AI detected signs of online harassment during a chat session. The child mentioned receiving mean messages from classmates on social media.",
  },
  {
    id: "BG-2801",
    title: "SOS Alert triggered",
    status: "Follow-up",
    tier: "critical",
    date: "Sep 7, 2026 — 11:30 PM",
    description: "Emergency SOS was triggered by the child. Location was shared with emergency contacts and officials.",
  },
  {
    id: "BG-2756",
    title: "Emotional distress — school anxiety",
    status: "Resolved",
    tier: "safe",
    date: "Sep 3, 2026 — 2:00 PM",
    description: "Child expressed anxiety about school exams. Coping resources and therapist information were provided.",
  },
];

const recommendations = [
  {
    icon: "🗣️",
    title: "Have an open conversation",
    desc: "Talk to your ward about how they're doing at school. Keep it casual — don't mention specific reports unless they bring it up.",
  },
  {
    icon: "📱",
    title: "Review social media settings",
    desc: "Help your ward review their privacy settings on social media platforms and block any accounts sending harassment.",
  },
  {
    icon: "🧠",
    title: "Consider professional support",
    desc: "Based on recent conversations, your ward may benefit from talking to a school counselor or therapist.",
  },
];

export default function GuardianPage() {
  return (
    <div className="guardian-page">
      <div className="animate-fade-in">
        <div className="guardian-header">
          <div>
            <h1 className="section-title" style={{ fontSize: "24px" }}>🛡️ Guardian Dashboard</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Alerts and safety recommendations for your ward
            </p>
          </div>
          <div className="ward-info glass">
            <div className="ward-avatar">B</div>
            <div>
              <div className="ward-name">Buddy&apos;s Ward</div>
              <div className="ward-status">Last active: 2 hours ago</div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-grid">
          <div className="summary-card" style={{ borderLeftColor: "var(--status-critical)" }}>
            <div className="summary-value">1</div>
            <div className="summary-label">Critical</div>
          </div>
          <div className="summary-card" style={{ borderLeftColor: "var(--status-distress)" }}>
            <div className="summary-value">1</div>
            <div className="summary-label">Distress</div>
          </div>
          <div className="summary-card" style={{ borderLeftColor: "var(--status-safe)" }}>
            <div className="summary-value">1</div>
            <div className="summary-label">Resolved</div>
          </div>
          <div className="summary-card" style={{ borderLeftColor: "var(--accent)" }}>
            <div className="summary-value">3</div>
            <div className="summary-label">Total Cases</div>
          </div>
        </div>

        {/* Recommendations */}
        <section className="recs-section">
          <h2 className="section-title">💡 Safety Recommendations</h2>
          <p className="section-subtitle">Personalized guidance based on your ward&apos;s activity</p>
          <div className="recs-list">
            {recommendations.map((rec, i) => (
              <div key={i} className={`rec-card card-flat animate-fade-in stagger-${i + 1}`}>
                <span className="rec-icon">{rec.icon}</span>
                <div>
                  <h3 className="rec-title">{rec.title}</h3>
                  <p className="rec-desc">{rec.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cases */}
        <section>
          <h2 className="section-title">📋 Recent Alerts</h2>
          <p className="section-subtitle">Cases involving your ward (Distress and Critical tiers only shown in real-time)</p>
          <div className="cases-list">
            {wardAlerts.map((c, i) => (
              <div key={c.id} className={`animate-fade-in stagger-${i + 1}`}>
                <CaseCard caseData={c} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        .guardian-page { max-width: 850px; margin: 0 auto; }

        .guardian-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .ward-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 18px;
          border-radius: var(--radius-lg);
        }

        .ward-avatar {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          background: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: white;
        }

        .ward-name { font-size: 14px; font-weight: 600; }
        .ward-status { font-size: 12px; color: var(--text-muted); }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 36px;
        }

        .summary-card {
          padding: 18px;
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-default);
          border-left: 4px solid;
          text-align: center;
        }

        .summary-value { font-size: 28px; font-weight: 700; color: var(--text-primary); }
        .summary-label { font-size: 12px; color: var(--text-muted); margin-top: 4px; }

        .recs-section { margin-bottom: 36px; }
        .recs-list { display: flex; flex-direction: column; gap: 10px; }

        .rec-card {
          display: flex;
          gap: 16px;
          padding: 18px 20px;
          align-items: flex-start;
        }

        .rec-icon { font-size: 24px; flex-shrink: 0; margin-top: 2px; }
        .rec-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
        .rec-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin: 0; }

        .cases-list { display: flex; flex-direction: column; gap: 12px; }

        @media (max-width: 768px) {
          .summary-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
