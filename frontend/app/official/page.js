"use client";

import IndiaHeatmap from "@/components/IndiaHeatmap";
import { useState } from "react";
import CaseCard from "@/components/CaseCard";

const allCases = [
  { id: "BG-2847", title: "Cyberbullying — social media harassment", status: "AI Report", tier: "distress", date: "Sep 10, 2026", description: "Online harassment detected through chat analysis. Screenshots provided." },
  { id: "BG-2845", title: "Threats received at school", status: "Human Review", tier: "critical", date: "Sep 10, 2026", description: "Child reported physical threats from older students. School authorities notified." },
  { id: "BG-2801", title: "SOS — Unsafe situation at night", status: "Follow-up", tier: "critical", date: "Sep 7, 2026", description: "Emergency SOS triggered. Child was being followed. Police responded." },
  { id: "BG-2798", title: "Emotional distress — family issues", status: "Resolved", tier: "safe", date: "Sep 6, 2026", description: "Child expressed sadness about family conflict. Connected with counselor." },
  { id: "BG-2780", title: "Cyberbullying — group chat exclusion", status: "Resolved", tier: "safe", date: "Sep 4, 2026", description: "Child was being excluded and mocked in class group chats." },
  { id: "BG-2756", title: "Anxiety — exam stress", status: "Resolved", tier: "safe", date: "Sep 3, 2026", description: "Ongoing anxiety about academic performance. Therapist recommended." },
];

export default function OfficialPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");

  const filtered = allCases.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (tierFilter !== "all" && c.tier !== tierFilter) return false;
    return true;
  });

  const statuses = ["all", "AI Report", "Human Review", "Follow-up", "Resolved"];
  const tiers = ["all", "critical", "distress", "safe"];

  return (
    <div className="official-page">
      <div className="animate-fade-in">
        <h1 className="section-title" style={{ fontSize: "24px" }}>👮 Official Dashboard</h1>
        <p className="section-subtitle">Case management and incident monitoring</p>

        {/* Stats */}
        <div className="stats-row">
          <div className="off-stat">
            <div className="off-stat-value" style={{ color: "var(--status-critical)" }}>2</div>
            <div className="off-stat-label">Critical</div>
          </div>
          <div className="off-stat">
            <div className="off-stat-value" style={{ color: "var(--status-distress)" }}>1</div>
            <div className="off-stat-label">Distress</div>
          </div>
          <div className="off-stat">
            <div className="off-stat-value" style={{ color: "var(--accent)" }}>2</div>
            <div className="off-stat-label">In Review</div>
          </div>
          <div className="off-stat">
            <div className="off-stat-value" style={{ color: "var(--status-safe)" }}>3</div>
            <div className="off-stat-label">Resolved</div>
          </div>
          <div className="off-stat">
            <div className="off-stat-value">6</div>
            <div className="off-stat-label">Total</div>
          </div>
        </div>

        <div className="dashboard-grid">

          {/* Active India Heatmap Component */}
          <IndiaHeatmap userRole="official" />

          {/* Case Pipeline */}
          <section className="pipeline-section">
            <h2 className="section-title" style={{ fontSize: "16px" }}>📋 Case Pipeline</h2>
            <p className="section-subtitle" style={{ marginBottom: "12px" }}>Filter and manage active cases</p>

            <div className="filter-row">
              <div className="filter-group">
                <span className="filter-label">Status:</span>
                {statuses.map((s) => (
                  <button
                    key={s}
                    className={`filter-chip ${statusFilter === s ? "filter-chip-active" : ""}`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s === "all" ? "All" : s}
                  </button>
                ))}
              </div>
              <div className="filter-group">
                <span className="filter-label">Tier:</span>
                {tiers.map((t) => (
                  <button
                    key={t}
                    className={`filter-chip ${tierFilter === t ? "filter-chip-active" : ""}`}
                    onClick={() => setTierFilter(t)}
                  >
                    {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="cases-list">
              {filtered.map((c, i) => (
                <div key={c.id} className={`animate-fade-in stagger-${Math.min(i + 1, 5)}`}>
                  <CaseCard caseData={c} />
                </div>
              ))}
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  No cases matching filters
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        .official-page { max-width: 1100px; margin: 0 auto; }

        .stats-row {
          display: flex;
          gap: 12px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .off-stat {
          flex: 1;
          min-width: 100px;
          padding: 16px;
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-default);
          text-align: center;
        }

        .off-stat-value { font-size: 28px; font-weight: 700; }
        .off-stat-label { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .filter-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .filter-label {
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 500;
          min-width: 48px;
        }

        .filter-chip {
          padding: 4px 12px;
          border-radius: var(--radius-full);
          background: var(--bg-card);
          border: 1px solid var(--border-default);
          color: var(--text-secondary);
          font-size: 12px;
          font-family: inherit;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .filter-chip:hover { border-color: var(--accent); }
        .filter-chip-active {
          background: rgba(59, 130, 246, 0.1);
          border-color: var(--accent);
          color: var(--accent-dark);
        }

        .cases-list { display: flex; flex-direction: column; gap: 10px; }

        @media (max-width: 768px) {
          .dashboard-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}