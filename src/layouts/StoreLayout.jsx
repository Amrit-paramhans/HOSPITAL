import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function StoreLayout() {
  const { user, logout } = useAuth();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "240px",
          background: "#1e293b",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>Store Panel</h2>

        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <Link to="/store" style={{ color: "white", textDecoration: "none" }}>
            📊 Dashboard
          </Link>

          <Link to="/store/verify" style={{ color: "white", textDecoration: "none" }}>
            ✔️ Verify Entries
          </Link>

          <button
            onClick={logout}
            style={{
              marginTop: "30px",
              padding: "10px",
              background: "red",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Dynamic Page Content */}
      <div style={{ flex: 1, padding: "30px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default StoreLayout;
