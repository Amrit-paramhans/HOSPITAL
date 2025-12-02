import { useAuth } from "../../context/AuthContext";

function StoreDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p style={{ marginTop: "10px", fontSize: "18px" }}>
        You are logged in as <b>Store Manager</b>.
      </p>

      <div style={{ marginTop: "40px" }}>
        <h2>Pending Tasks</h2>
        <ul>
          <li>Verify nurse entries for today's date.</li>
          <li>Check stock mismatch reports.</li>
        </ul>
      </div>
    </div>
  );
}

export default StoreDashboard;
