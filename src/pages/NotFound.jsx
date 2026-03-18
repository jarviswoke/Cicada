 import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div style={{ textAlign: "center" }}>
        <div className="notfound-icon">🐞</div>
        <h1 className="notfound-code">404</h1>
        <h2 style={{ marginBottom: "0.75rem" }}>Page Not Found</h2>
        <p className="muted-text" style={{ marginBottom: "2rem", maxWidth: "360px", margin: "0 auto 2rem" }}>
          Looks like you've encountered a bug! The page you're looking for
          doesn't exist.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/dashboard")}
        >
          🏠 Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default NotFound;
