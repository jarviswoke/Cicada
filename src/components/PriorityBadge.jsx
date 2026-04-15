const priorityConfig = {
  critical: { label: "Critical", icon: "🔴", className: "badge-critical" },
  high: { label: "High", icon: "🟠", className: "badge-high" },
  medium: { label: "Medium", icon: "🟡", className: "badge-medium" },
  low: { label: "Low", icon: "🟢", className: "badge-low" },

  Critical: { label: "Critical", icon: "🔴", className: "badge-critical" },
  High: { label: "High", icon: "🟠", className: "badge-high" },
  Medium: { label: "Medium", icon: "🟡", className: "badge-medium" },
  Low: { label: "Low", icon: "🟢", className: "badge-low" },
};
// priority badges for task list, with color coding and icons based on priority level
function PriorityBadge({ priority }) {
  const config = priorityConfig[priority] || {
    label: priority || "Unknown",
    icon: "⚪",
    className: "badge-medium",
  };

  return (
    <span className={`badge ${config.className}`}>
      {config.icon} {config.label}
    </span>
  );
}

export default PriorityBadge;
