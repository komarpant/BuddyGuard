"use client";

import Link from "next/link";

const features = [
  {
    icon: "💬",
    title: "AI Chat Companion",
    desc: "Talk to Buddy like a friend. No forms, no pressure — just a safe conversation.",
    color: "var(--accent)",
  },
  {
    icon: "🧠",
    title: "Smart Detection",
    desc: "Buddy quietly understands when something's wrong and connects you with the right help.",
    color: "var(--status-distress)",
  },
  {
    icon: "🚨",
    title: "SOS Emergency",
    desc: "One tap to alert your emergency contacts and officials when you're in real danger.",
    color: "var(--status-critical)",
  },
  {
    icon: "🛡️",
    title: "Privacy First",
    desc: "Chat anonymously. Your identity stays hidden unless you choose to share it.",
    color: "var(--status-safe)",
  },
];

const stats = [
  { value: "24/7", label: "Always Available" },
  { value: "100%", label: "Private & Secure" },
  { value: "3-Tier", label: "Smart Triage" },
  { value: "Instant", label: "SOS Response" },
];

export default function HomePage() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero animate-fade-in">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Bit N Build Hackathon — Bal Suraksha Track
        </div>
        <h1 className="hero-title">
          Your AI companion for
          <span className="hero-gradient"> safety & well-being</span>
        </h1>
        <p className="hero-desc">
          Buddy Guard is a friendly AI chatbot that listens, understands, and
          protects. Talk about anything — if something's wrong, Buddy quietly
          connects you with the right people.
        </p>
        <div className="hero-actions">
          <Link href="/chat" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: "16px" }}>
            💬 Start Chatting
          </Link>
          <Link href="/sos" className="btn btn-danger" style={{ padding: "14px 32px", fontSize: "16px" }}>
            🚨 SOS Emergency
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-grid animate-fade-in stagger-2">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card glass">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="features-section">
        <h2 className="section-title" style={{ fontSize: "24px", textAlign: "center", marginBottom: "4px" }}>
          How Buddy Guard Protects You
        </h2>
        <p className="section-subtitle" style={{ textAlign: "center", marginBottom: "32px" }}>
          Everything a child needs to feel safe, in one app
        </p>
        <div className="features-grid">
          {features.map((feature, i) => (
            <div key={feature.title} className={`feature-card card animate-fade-in stagger-${i + 1}`}>
              <div className="feature-icon" style={{ background: `${feature.color}20`, color: feature.color }}>
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Access */}
      <section className="quick-section animate-fade-in">
        <h2 className="section-title" style={{ fontSize: "24px", textAlign: "center", marginBottom: "32px" }}>
          Quick Access
        </h2>
        <div className="quick-grid">
          <Link href="/report" className="quick-card card">
            <span className="quick-icon">📸</span>
            <span className="quick-label">Report Incident</span>
            <span className="quick-desc">Upload screenshots of bullying</span>
          </Link>
          <Link href="/history" className="quick-card card">
            <span className="quick-icon">📜</span>
            <span className="quick-label">View History</span>
            <span className="quick-desc">Past conversations & reports</span>
          </Link>
          <Link href="/guardian" className="quick-card card">
            <span className="quick-icon">👨‍👩‍👧</span>
            <span className="quick-label">Guardian View</span>
            <span className="quick-desc">Dashboard for trusted adults</span>
          </Link>
          <Link href="/official" className="quick-card card">
            <span className="quick-icon">👮</span>
            <span className="quick-label">Official View</span>
            <span className="quick-desc">Case management & heatmap</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>Built with ❤️ by <strong>Team Runtime Terror</strong></p>
        <p style={{ fontSize: "12px", marginTop: "4px" }}>Harsh Komarpant • Santosh Bothiraja • Ayush Desai • Bhawesh Papanai</p>
      </footer>

      <style jsx>{`
        .home {
          max-width: 900px;
          margin: 0 auto;
          padding-bottom: 60px;
        }

        .hero {
          text-align: center;
          padding: 48px 0 40px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: var(--radius-full);
          background: rgba(91, 141, 239, 0.1);
          border: 1px solid rgba(91, 141, 239, 0.2);
          color: var(--accent-light);
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 24px;
        }

        .hero-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          animation: pulse-dot 2s ease-in-out infinite;
        }

        .hero-title {
          font-size: 42px;
          font-weight: 700;
          line-height: 1.15;
          margin-bottom: 16px;
          letter-spacing: -1px;
        }

        .hero-gradient {
          background: linear-gradient(135deg, var(--accent) 0%, var(--status-safe-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-desc {
          font-size: 17px;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto 32px;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 48px;
        }

        .stat-card {
          padding: 20px;
          border-radius: var(--radius-lg);
          text-align: center;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--accent-light);
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 13px;
          color: var(--text-muted);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 48px;
        }

        .feature-card {
          padding: 24px;
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          margin-bottom: 14px;
        }

        .feature-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .feature-desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .quick-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 48px;
        }

        .quick-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 24px;
          text-decoration: none;
          text-align: center;
        }

        .quick-icon {
          font-size: 32px;
          margin-bottom: 4px;
        }

        .quick-label {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .quick-desc {
          font-size: 13px;
          color: var(--text-muted);
        }

        .home-footer {
          text-align: center;
          padding-top: 32px;
          border-top: 1px solid var(--border-default);
          color: var(--text-muted);
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 28px; }
          .hero-desc { font-size: 15px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .features-grid { grid-template-columns: 1fr; }
          .quick-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
