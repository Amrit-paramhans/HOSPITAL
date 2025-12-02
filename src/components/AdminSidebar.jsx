// src/components/AdminSidebar.jsx
import { Link, useLocation } from "react-router-dom";

function AdminSidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Doctors", path: "/doctors" },
    { name: "Compare Data", path: "/compare" },
    { name: "Reports", path: "/reports" },
    { name: "Analytics", path: "/analytics" },
  ];

  return (
    <aside
      style={{
        width: 250,
        height: "100vh",
        padding: 20,
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border-soft)",
        position: "fixed",
        left: 0,
        top: 0
      }}
    >
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 8, background: "var(--accent-cyan)"
          }} />
          <h2 style={{ margin: 0, fontSize: 22, color: "var(--text-dark)" }}>
            Hospital Admin
          </h2>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {menu.map((m) => (
          <Link
            key={m.path}
            to={m.path}
            className={"sidebar-link " + (location.pathname === m.path ? "active" : "")}
            style={{ textDecoration: "none" }}
          >
            <span style={{ fontWeight: 600 }}>{m.name}</span>
          </Link>
        ))}

        <div style={{ borderTop: "1px solid var(--border-soft)", marginTop: 18, paddingTop: 12 }}>
          <Link to="/" className="sidebar-link" style={{ color: "#e11d48" }}>
            Logout
          </Link>
        </div>
      </nav>
    </aside>
  );
}

export default AdminSidebar;
