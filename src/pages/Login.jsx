

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const users = [
  { phone: "9999", password: "admin123", role: "admin", name: "Hospital Admin" },
  { phone: "7777", password: "store123", role: "store", name: "Ravi Kumar" }
];

function Login() {
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const login = () => {
    const user = users.find(
      (u) => u.phone === phone && u.password === pass
    );

    if (!user) {
      alert("Invalid login");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));

    if (user.role === "admin") navigate("/dashboard");
    else navigate("/store");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>
      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />
      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;
