"use client";

import Link from "next/link";

const roles = [
  { icon: "🧒", title: "Child", desc: "A safe space to talk, get coping guidance, or trigger an SOS without confrontation.", color: "#5B8DEF" },
  { icon: "👨‍👩‍👧", title: "Guardian", desc: "Notified when their ward shows signs of distress. Sees safety recommendations, not raw chat logs.", color: "#9B7FE6" },
  { icon: "🚨", title: "Emergency Contact", desc: "Notified instantly via SOS for urgent physical-safety situations (late-night danger, etc.).", color: "#E87461" },
  { icon: "👮", title: "Official", desc: "Government or police team member managing a dashboard of flagged cases and incident heatmaps.", color: "#D4A24C" }
];

const tiers = [
  { icon: "🔴", name: "Critical Emergency", trigger: "Signs of immediate danger or abuse", action: "Notifies Guardian + Officials immediately", bg: "rgba(228, 114, 154, 0.15)", border: "#E4729A" },
  { icon: "🟡", name: "Distress / Bullying", trigger: "Ongoing emotional distress, cyberbullying", action: "Notifies Guardian, surfaces therapist info", bg: "rgba(212, 162, 76, 0.15)", border: "#D4A24C" },
  { icon: "⚪", name: "Safe / No Risk", trigger: "Nothing concerning detected", action: "Logged only, no notification, no false alarms", bg: "rgba(123, 143, 163, 0.1)", border: "#7B8FA3" }
];

export default function HomePage() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero animate-fade-in">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Track: Bal Suraksha (Child Safety, Protection & Well-being)
        </div>
        <h1 className="hero-title">
          🛡️ Buddy Guard
        </h1>
        <h2 className="hero-subtitle">
          AI app for child safety, mental well-being, and cyberbullying protection
        </h2>
        <p className="hero-desc">
          Children face bullying and distress but rarely have a safe, low-friction way to talk about it. 
          Buddy Guard quietly listens, understands context, and connects a child to the right kind of help.
        </p>
        <div className="hero-actions">
          <Link href="/chat" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: "16px" }}>
            💬 Talk to Buddy
          </Link>
          <Link href="/sos" className="btn btn-danger" style={{ padding: "14px 32px", fontSize: "16px" }}>
            🚨 SOS Alarm
          </Link>
        </div>
      </section>

      {/* The Problem & Solution */}
      <section className="info-section animate-fade-in stagger-1">
        <div className="split-grid">
          <div className="info-card card glass">
            <h3 style={{ color: "var(--status-critical)", marginBottom: "12px", fontSize: "20px" }}>⚠️ The Problem</h3>
            <p>Most existing reporting systems require a child to explicitly name a problem and escalate it themselves. By the time an adult finds out, the situation has already gotten serious. There's no system today that quietly listens without forcing the child to make the first move.</p>
          </div>
          <div className="info-card card glass">
            <h3 style={{ color: "var(--status-safe)", marginBottom: "12px", fontSize: "20px" }}>💡 Our Solution</h3>
            <p>An AI chat app that acts as a friend. It picks up on signs of mental health distress or bullying through natural conversation. If the situation looks dangerous, it automatically loops in Guardians and Officials. <strong>The chatbot is the detection layer.</strong></p>
          </div>
        </div>
      </section>

      {/* Behavioral Triage */}
      <section className="triage-section animate-fade-in stagger-2">
        <h2 className="section-title text-center">🧠 AI Behavioral Engine</h2>
        <p className="section-subtitle text-center" style={{ marginBottom: "24px" }}>Every conversation is passively analyzed and classified into three tiers.</p>
        <div className="triage-grid">
          {tiers.map(t => (
            <div key={t.name} className="triage-card" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
              <div className="triage-header">
                <span className="triage-icon">{t.icon}</span>
                <h4 style={{ margin: 0, fontSize: "16px", color: t.border }}>{t.name}</h4>
              </div>
              <div className="triage-details">
                <p><strong>Trigger:</strong> {t.trigger}</p>
                <p><strong>Action:</strong> {t.action}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who's Involved */}
      <section className="roles-section animate-fade-in stagger-3">
        <h2 className="section-title text-center">👥 Who is Involved?</h2>
        <div className="roles-grid">
          {roles.map((role, i) => (
            <div key={role.title} className="role-card card">
              <div className="role-icon" style={{ background: `${role.color}20`, color: role.color }}>{role.icon}</div>
              <h3 className="role-title">{role.title}</h3>
              <p className="role-desc">{role.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Access */}
      <section className="quick-section animate-fade-in stagger-4">
        <h2 className="section-title text-center">🚀 Quick Access</h2>
        <div className="quick-grid">
          <Link href="/report" className="quick-card card">
            <span className="quick-icon">📸</span>
            <span className="quick-label">Manual Report</span>
          </Link>
          <Link href="/history" className="quick-card card">
            <span className="quick-icon">📜</span>
            <span className="quick-label">History Logs</span>
          </Link>
          <Link href="/guardian" className="quick-card card">
            <span className="quick-icon">👨‍👩‍👧</span>
            <span className="quick-label">Guardian Dashboard</span>
          </Link>
          <Link href="/official" className="quick-card card">
            <span className="quick-icon">👮</span>
            <span className="quick-label">Official Dashboard</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>Team Runtime Terror</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "16px" }}>
          Harsh Komarpant • Santosh Bothiraja • Ayush Desai • Bhawesh Papanai
        </p>
        <p style={{ fontStyle: "italic", color: "var(--accent-dark)", fontSize: "15px" }}>
          "Because every child deserves to be heard before things escalate."
        </p>
      </footer>

      <style jsx>{`
        .home { max-width: 1000px; margin: 0 auto; padding-bottom: 60px; }
        
        .hero { text-align: center; padding: 48px 0 40px; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 20px; background: rgba(91, 141, 239, 0.1); border: 1px solid rgba(91, 141, 239, 0.2); color: var(--accent-dark); font-size: 13px; font-weight: 600; margin-bottom: 24px; }
        .hero-badge-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); animation: pulse-dot 2s ease-in-out infinite; }
        .hero-title { font-size: 48px; font-weight: 800; margin-bottom: 12px; letter-spacing: -1px; color: #1A1A2E; }
        .hero-subtitle { font-size: 20px; font-weight: 600; color: var(--accent-dark); margin-bottom: 16px; }
        .hero-desc { font-size: 16px; color: var(--text-secondary); max-width: 700px; margin: 0 auto 32px; line-height: 1.6; }
        .hero-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        
        .text-center { text-align: center; }
        .split-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 60px; }
        .info-card { padding: 28px; line-height: 1.6; font-size: 15px; color: var(--text-secondary); }
        
        .triage-section { margin-bottom: 60px; }
        .triage-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .triage-card { padding: 20px; border-radius: 16px; transition: transform 0.2s; }
        .triage-card:hover { transform: translateY(-4px); }
        .triage-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .triage-icon { font-size: 24px; }
        .triage-details p { font-size: 13px; color: var(--text-primary); margin: 6px 0; line-height: 1.4; }
        
        .roles-section { margin-bottom: 60px; }
        .roles-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .role-card { padding: 24px; display: flex; flex-direction: column; align-items: flex-start; }
        .role-icon { width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px; }
        .role-title { font-size: 18px; font-weight: 700; margin-bottom: 8px; color: var(--text-primary); }
        .role-desc { font-size: 14px; color: var(--text-secondary); line-height: 1.5; }

        .quick-section { margin-bottom: 60px; }
        .quick-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .quick-card { padding: 20px; text-align: center; text-decoration: none; transition: 0.2s; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .quick-card:hover { transform: translateY(-4px); background: var(--bg-elevated); }
        .quick-icon { font-size: 32px; }
        .quick-label { font-size: 14px; font-weight: 600; color: var(--text-primary); }
        
        .home-footer { text-align: center; padding: 40px 20px; border-top: 1px solid var(--border-default); background: var(--bg-card); border-radius: 24px; }

        @media (max-width: 768px) {
          .hero-title { font-size: 36px; }
          .split-grid { grid-template-columns: 1fr; }
          .triage-grid { grid-template-columns: 1fr; }
          .roles-grid { grid-template-columns: 1fr; }
          .quick-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
