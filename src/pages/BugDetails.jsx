import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  assignBugRequest,
  changeBugStatusRequest,
  getBugByIdRequest,
  getDevelopersRequest,
} from "../api/api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";

const STATUS_OPTIONS = [
  "New", "Assigned", "In Progress", "Fixed", "Testing", "Closed", "Reopened",
];

function BugDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bug, setBug] = useState(null);
  const [status, setStatus] = useState("");
  const [developers, setDevelopers] = useState([]);
  const [assigneeId, setAssigneeId] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const canAssign = user?.role === "admin" || user?.role === "manager";

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getBugByIdRequest(id);
        setBug(data);
        setStatus(data.status);
        setAssigneeId(data.assignedTo?._id || "");
        if (canAssign) {
          const devs = await getDevelopersRequest();
          setDevelopers(devs);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load bug");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, canAssign]);

  const onStatusUpdate = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await changeBugStatusRequest(id, status);
      const refreshed = await getBugByIdRequest(id);
      setBug(refreshed);
      setStatus(refreshed.status);
      setMessage("Status updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const onAssign = async () => {
    if (!assigneeId) { setError("Please select a developer"); return; }
    setAssigning(true);
    setError("");
    setMessage("");
    try {
      const updated = await assignBugRequest(id, assigneeId);
      setBug(updated);
      setStatus(updated.status);
      setAssigneeId(updated.assignedTo?._id || assigneeId);
      setMessage("Bug assigned successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign bug");
    } finally {
      setAssigning(false);
    }
  };

  const onAddComment = (e) => {
    e.preventDefault();
    // TODO: wire to POST /api/bugs/:id/comments endpoint
    if (comment.trim()) {
      setMessage("Comment added! (Note: wire to addCommentRequest API)");
      setComment("");
    }
  };

  if (loading) return <div className="page-feedback">Loading bug details...</div>;
  if (error && !bug) return <div className="page-feedback error-text">{error}</div>;

  return (
    <section>
      {/* Back button */}
      <button
        className="btn btn-outline"
        onClick={() => navigate("/bugs")}
        style={{ marginBottom: "1rem" }}
      >
        ← Back to bugs
      </button>

      {/* Two-column layout */}
      <div className="detail-grid">
        {/* LEFT: Main content */}
        <div>
          {/* Bug header */}
          <div className="card" style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
              <StatusBadge status={bug.status} />
              <PriorityBadge priority={bug.priority} />
            </div>
            <h2>{bug.title}</h2>
            <p className="muted-text" style={{ marginTop: "0.75rem", whiteSpace: "pre-line" }}>
              {bug.description}
            </p>

            <div className="detail-list" style={{ marginTop: "1rem" }}>
              <p><strong>Severity:</strong> {bug.severity}</p>
              <p><strong>Priority:</strong> {bug.priority}</p>
              <p><strong>Project:</strong> {bug.project?.name || "-"}</p>
              <p>
                <strong>Reporter:</strong>{" "}
                {bug.reportedBy?.name || "Unknown"}
              </p>
            </div>
          </div>

          {/* Activity Timeline (from Figma) */}
          {bug.comments && bug.comments.length > 0 && (
            <div className="card" style={{ marginBottom: "1rem" }}>
              <h3 style={{ marginBottom: "1rem" }}>🕐 Activity</h3>
              <div className="timeline">
                {bug.comments.map((c, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-avatar">
                      {c.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-meta">
                        <strong>{c.user?.name || "User"}</strong>
                        <span className="muted-text" style={{ fontSize: "0.8rem" }}>
                          {new Date(c.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.9rem" }}>{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Comment (from Figma) */}
          <div className="card">
            <h3 style={{ marginBottom: "0.75rem" }}>💬 Add Comment</h3>
            <form onSubmit={onAddComment}>
              <div className="form-group">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your comment..."
                  rows={3}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setComment("")}
                  disabled={!comment.trim()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!comment.trim()}
                >
                  Add Comment
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT: Sidebar actions */}
        <div>
          {/* Status Update */}
          <div className="card" style={{ marginBottom: "1rem" }}>
            <h3 style={{ marginBottom: "0.75rem" }}>Update Status</h3>
            <div className="form-group">
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary btn-block" onClick={onStatusUpdate} disabled={saving}>
              {saving ? "Saving..." : "Save Status"}
            </button>
          </div>

          {/* Assign Developer */}
          {canAssign && (
            <div className="card" style={{ marginBottom: "1rem" }}>
              <h3 style={{ marginBottom: "0.75rem" }}>Assign Developer</h3>
              <div className="form-group">
                <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
                  <option value="">Select developer</option>
                  {developers.map((dev) => (
                    <option key={dev._id} value={dev._id}>
                      {dev.name} ({dev.email})
                    </option>
                  ))}
                </select>
              </div>
              <button className="btn btn-primary btn-block" onClick={onAssign} disabled={assigning}>
                {assigning ? "Assigning..." : "Assign"}
              </button>
            </div>
          )}

          {/* Bug Metadata (from Figma) */}
          <div className="card">
            <h3 style={{ marginBottom: "0.75rem" }}>Details</h3>
            <div className="detail-list">
              <div>
                <p className="muted-text" style={{ fontSize: "0.75rem", textTransform: "uppercase" }}>
                  Assigned To
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                  <div className="avatar-circle">
                    {bug.assignedTo?.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <span>{bug.assignedTo?.name || "Unassigned"}</span>
                </div>
              </div>
              <div style={{ marginTop: "0.75rem" }}>
                <p className="muted-text" style={{ fontSize: "0.75rem", textTransform: "uppercase" }}>
                  Reporter
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                  <div className="avatar-circle avatar-circle--purple">
                    {bug.reportedBy?.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <span>{bug.reportedBy?.name || "Unknown"}</span>
                </div>
              </div>
              <div style={{ marginTop: "0.75rem" }}>
                <p className="muted-text" style={{ fontSize: "0.75rem", textTransform: "uppercase" }}>Created</p>
                <p style={{ marginTop: "0.25rem" }}>{new Date(bug.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {message && <p className="success-text" style={{ marginTop: "1rem" }}>{message}</p>}
          {error && <p className="error-text" style={{ marginTop: "1rem" }}>{error}</p>}
        </div>
      </div>
    </section>
  );
}

export default BugDetails;
