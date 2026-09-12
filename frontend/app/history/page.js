"use client";

import { useState, useEffect } from "react";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/components/AuthProvider";
import api from "@/lib/api";

const typeIcons = {
  conversation: "💬",
  report: "📸",
  sos: "🚨",
};

export default function HistoryPage() {
  const [filter, setFilter] = useState("all");
  const [history, setHistory] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const response = await api.get(`/api/history/${user.id}`);
      setHistory(response.history || []);
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = filter === "all"
    ? history
    : history.filter((h) => h.type === filter);

  return (
    <div className="history-page">
      <div className="animate-fade-in">
        <h1 className="section-title" style={{ fontSize: "24px" }}>📜 History</h1>
        <p className="section-subtitle">
          Your past conversations, reports, and incidents. Share with a doctor or therapist if needed.
        </p>

        {/* Filters */}
        <div className="filter-bar">
          {["all", "conversation", "report", "sos"].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "filter-active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f === "sos" ? "🚨 SOS" : `${typeIcons[f]} ${f.charAt(0).toUpperCase() + f.slice(1)}s`}
            </button>
          ))}
        </div>

        {/* History List */}
        <div className="history-list">
          {filtered.map((item, i) => (
            <div key={item.id} className={`history-item card-flat animate-fade-in stagger-${Math.min(i + 1, 5)}`}>
              <div className="history-icon">{typeIcons[item.type]}</div>
              <div className="history-content">
                <div className="history-header">
                  <h3 className="history-title">{item.title}</h3>
                  <StatusBadge status={item.status} />
                </div>
                <p className="history-preview">{item.preview}</p>
                <div className="history-meta">
                  <span>{item.date} at {item.time}</span>
                  {item.messages && <span>• {item.messages} messages</span>}
                  {item.caseId && <span>• Case #{item.caseId}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>No {filter} history yet</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .history-page { max-width: 800px; margin: 0 auto; }

        .filter-bar {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 8px 16px;
          border-radius: var(--radius-full);
          background: var(--bg-card);
          border: 1px solid var(--border-default);
          color: var(--text-secondary);
          font-size: 13px;
          font-family: inherit;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .filter-btn:hover { border-color: var(--accent); color: var(--text-primary); }
        .filter-active {
          background: rgba(91, 141, 239, 0.1);
          border-color: var(--accent);
          color: var(--accent-light);
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .history-item {
          display: flex;
          gap: 16px;
          padding: 20px;
          cursor: pointer;
          transition: all var(--transition-normal);
        }

        .history-item:hover {
          background: var(--bg-elevated);
          transform: translateX(4px);
        }

        .history-icon {
          font-size: 24px;
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-secondary);
          border-radius: var(--radius-md);
        }

        .history-content { flex: 1; min-width: 0; }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 6px;
        }

        .history-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .history-preview {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.4;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .history-meta {
          display: flex;
          gap: 8px;
          font-size: 12px;
          color: var(--text-muted);
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-muted);
        }

        .empty-icon { font-size: 48px; display: block; margin-bottom: 12px; }
      `}</style>
    </div>
  );
}
