import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./auth.css";
import illustration from "./illustration.png"; // add your image

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      window.location.href = "/";
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Left */}
        <div className="auth-left">
          <img src={illustration} alt="Login Illustration" />
        </div>

        {/* Right */}
        <div className="auth-right">
          <h2 className="auth-title">Member Login</h2>

          <form onSubmit={handleLogin}>
            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="auth-btn" type="submit">
              LOGIN
            </button>
          </form>

          <div className="auth-link">
            <Link to="/signup">Create your Account →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
