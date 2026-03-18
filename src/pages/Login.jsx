import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  { id: "admin", label: "Admin", icon: "👑" },
  { id: "manager", label: "Manager", icon: "👔" },
  { id: "developer", label: "Developer", icon: "💻" },
  { id: "tester", label: "Tester", icon: "🧪" },
];

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/dashboard";

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Quick-fill email for role demo
  const fillRole = (roleId) => {
    setForm((prev) => ({ ...prev, email: `${roleId}@ciccado.com` }));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div className="auth-logo">🐞</div>
          <h1 style={{ marginTop: "0.75rem" }}>Ciccado</h1>
          <p className="subtitle">Bug Tracking System</p>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@company.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="input-icon-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Role quick-select from Figma */}
          <div className="form-group">
            <label style={{ marginBottom: "0.5rem", display: "block" }}>
              Quick role select
            </label>
            <div className="role-grid">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => fillRole(role.id)}
                  className={`role-btn${
                    form.email.startsWith(role.id + "@")
                      ? " role-btn--active"
                      : ""
                  }`}
                >
                  <span className="role-btn-icon">{role.icon}</span>
                  <span className="role-btn-label">{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: "0.5rem" }}
          >
            {loading ? "Signing in..." : "Sign in to dashboard"}
          </button>
        </form>

        <p className="auth-switch">
          No account?{" "}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
