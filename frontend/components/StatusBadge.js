export default function StatusBadge({ status }) {
  const config = {
    critical: { label: "Critical", className: "badge-critical", icon: "🔴" },
    distress: { label: "Distress", className: "badge-distress", icon: "🟡" },
    safe: { label: "Resolved", className: "badge-safe", icon: "🟢" },
    info: { label: "Info", className: "badge-info", icon: "🔵" },
    pending: { label: "Pending", className: "badge-distress", icon: "⏳" },
    reviewing: { label: "Reviewing", className: "badge-info", icon: "🔍" },
  };

  const { label, className, icon } = config[status] || config.info;

  return (
    <span className={`badge ${className}`}>
      <span style={{ fontSize: "10px" }}>{icon}</span>
      {label}
    </span>
  );
}
