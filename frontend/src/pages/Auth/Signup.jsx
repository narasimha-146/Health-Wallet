import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./auth.css";
import illustration from "./illustration.png";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", form);
      alert("Account created successfully!");
      window.location.href = "/login";
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Left */}
        <div className="auth-left">
          <img src={illustration} alt="Signup Illustration" />
        </div>

        {/* Right */}
        <div className="auth-right">
          <h2 className="auth-title">Create Account</h2>

          <form onSubmit={handleSignup}>
            <input
              className="auth-input"
              placeholder="Full Name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <input
              className="auth-input"
              placeholder="Phone (+91XXXXXXXXXX)"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />

            <button className="auth-btn" type="submit">
              SIGN UP
            </button>
          </form>

          <div className="auth-link">
            <Link to="/login">Already have an account? Login →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
