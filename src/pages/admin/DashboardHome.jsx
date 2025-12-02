// src/pages/admin/DashboardHome.jsx
import DashboardLayout from "../../layouts/DashboardLayout";

function DashboardHome() {
  return (
    <DashboardLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
      </div>

      <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
        <div className="kpi card">
          <div className="label">Total Doctors</div>
          <div className="value">45</div>
        </div>

        <div className="kpi card">
          <div className="label">Today's Patients</div>
          <div className="value">120</div>
        </div>

        <div className="kpi card">
          <div className="label">Pending Reports</div>
          <div className="value">8</div>
        </div>

        <div className="kpi card">
          <div className="label">Avg Patients / Month</div>
          <div className="value">540</div>
        </div>
      </div>

      <section style={{ marginTop: 34 }}>
        <h2>Activity Trends</h2>
        <div className="card" style={{ marginTop: 12, height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* placeholder for chart - you can drop your recharts canvas here */}
          <div style={{ color: "var(--text-muted)" }}>Analytics chart will render here</div>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default DashboardHome;
