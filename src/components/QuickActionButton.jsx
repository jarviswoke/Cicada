 import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateBugModal from "./CreateBugModal";

const actions = [
  { icon: "🐞", label: "New Bug",      color: "fab-action-btn--blue",   key: "bug" },
  { icon: "👥", label: "Team",         color: "fab-action-btn--purple",  key: "team" },
  { icon: "📈", label: "Reports",      color: "fab-action-btn--green",   key: "reports" },
];

function QuickActionButton() {
  const [open, setOpen] = useState(false);
  const [createBugOpen, setCreateBugOpen] = useState(false);
  const navigate = useNavigate();

  const handleAction = (key) => {
    setOpen(false);
    if (key === "bug") setCreateBugOpen(true);
    if (key === "team") navigate("/team");
    if (key === "reports") navigate("/reports");
  };

  return (
    <>
      <div className="fab-container">
        {open && (
          <div className="fab-actions">
            {actions.map((action) => (
              <button
                key={action.key}
                className={`fab-action-btn ${action.color}`}
                onClick={() => handleAction(action.key)}
              >
                <span>{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        )}

        <button
          className={`fab-main ${open ? "fab-main--red" : "fab-main--blue"}`}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Quick actions"}
        >
          <span className={`fab-icon${open ? " fab-icon--rotated" : ""}`}>
            {open ? "✕" : "＋"}
          </span>
        </button>
      </div>

      <CreateBugModal open={createBugOpen} onOpenChange={setCreateBugOpen} />
    </>
  );
}

export default QuickActionButton;
