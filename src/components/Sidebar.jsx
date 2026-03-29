import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Bug,
  FilePlus,
  FolderOpen,
  BarChart3,
  Users,
  Lock,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Shield,
} from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/bugs", label: "Bugs", icon: Bug },
  { to: "/create-bug", label: "Create Bug", icon: FilePlus },
  { to: "/projects", label: "Projects", icon: FolderOpen },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/team", label: "Team", icon: Users },
  { to: "/change-password", label: "Change Password", icon: Lock },
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
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
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
        {/* Brand — always rendered, CSS handles hiding */}
        <div className="sidebar-brand">
          <div className="sidebar-logo-box">
            <Shield size={20} strokeWidth={2.2} />
          </div>
          <div className="sidebar-brand-text">
            <h1>Ciccado</h1>
            <p>Bug Tracker</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav-wrapper">
          <ul className="sidebar-nav">
            {links.map((link) => {
              const IconComponent = link.icon;
              return (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `sidebar-nav-link${isActive ? " active" : ""}`
                    }
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? link.label : undefined}
                  >
                    <span className="sidebar-nav-icon">
                      <IconComponent size={20} strokeWidth={1.8} />
                    </span>
                    <span className="sidebar-nav-label">{link.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse toggle - desktop only */}
        <div className="sidebar-footer">
          <button
            className="sidebar-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight size={16} strokeWidth={2} />
            ) : (
              <>
                <ChevronLeft size={16} strokeWidth={2} />
                <span className="sidebar-collapse-label">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
