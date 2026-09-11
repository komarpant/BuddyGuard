export default function CaseCard({ caseData }) {
  const {
    id,
    title,
    status,
    tier,
    date,
    description,
  } = caseData;

  const tierColors = {
    critical: { border: "var(--status-critical)", bg: "var(--bg-card)" },
    distress: { border: "var(--status-distress)", bg: "var(--bg-card)" },
    safe: { border: "var(--status-safe)", bg: "var(--bg-card)" },
  };

  const colors = tierColors[tier] || tierColors.safe;

  return (
    <div className="case-card" style={{ borderLeftColor: colors.border, background: colors.bg }}>
      <div className="case-header">
        <span className="case-id">#{id}</span>
        <span className={`badge badge-${tier || "info"}`}>
          {status}
        </span>
      </div>
      <h3 className="case-title">{title}</h3>
      {description && <p className="case-desc">{description}</p>}
      <div className="case-footer">
        <span className="case-date">{date}</span>
      </div>

      <style jsx>{`
        .case-card {
          padding: 16px 20px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-default);
          border-left: 4px solid;
          transition: all var(--transition-normal);
        }
        .case-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-1px);
        }
        .case-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .case-id {
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 500;
        }
        .case-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .case-desc {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 12px;
          line-height: 1.4;
        }
        .case-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .case-date {
          font-size: 12px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
