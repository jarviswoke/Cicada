import { useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/bugs", label: "Bugs", icon: "🐞" },
  { to: "/create-bug", label: "Create Bug", icon: "➕" },
  { to: "/projects", label: "Projects", icon: "📁" },
  { to: "/reports", label: "Reports", icon: "📈" },
  { to: "/team", label: "Team", icon: "👥" },
  { to: "/change-password", label: "Change Password", icon: "🔐" },
];

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="sidebar-mobile-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar${collapsed ? " sidebar--collapsed" : ""}${
          mobileOpen ? " sidebar--mobile-open" : ""
        }`}
      >
        <div className="sidebar-brand">
          <span className="sidebar-brand-icon">🐞</span>
          {!collapsed && (
            <span className="sidebar-brand-text">Ciccado</span>
          )}
        </div>

        <nav>
          <ul className="sidebar-nav">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="sidebar-nav-icon">{link.icon}</span>
                  {!collapsed && <span>{link.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Collapse toggle - desktop only */}
        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "›" : "‹"}
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
