// src/layouts/DashboardLayout.jsx
import AdminSidebar from "../components/AdminSidebar";

function DashboardLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ position: "fixed", left: 0, top: 0 }}>
        <AdminSidebar />
      </div>

      <main style={{
        marginLeft: 250,
        padding: 32,
        width: "100%",
        minHeight: "100vh",
        background: "var(--bg-main)"
      }}>
        <div className="page-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
