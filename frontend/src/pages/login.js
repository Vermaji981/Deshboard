import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isRegister) {
        // Register API Call
        const response = await api.post("/auth/register", {
          name,
          email,
          password,
          role,
        });

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        if (response.data.user.role === "Admin") {
          navigate("/dashboard");
        } else {
          navigate("/store");
        }
      } else {
        // Login API Call
        const response = await api.post("/auth/login", {
          email,
          password,
        });

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        if (String(response.data.user.role).toLowerCase() === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/store");
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError("Backend server se connect nahi ho pa raha hai. Kripya backend deploy karein aur Environment Variable (REACT_APP_API_URL) set karein.");
      } else {
        setError(err.message || "Authentication failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail("admin@gmail.com");
    setPassword("admin123");
    setName("Admin Manager");
    setRole("Admin");
  };

  return (
    <div className="login-page">
      <div className="auth-card card">
        <div className="auth-header">
          <div className="brand-logo">⚡ AdminHub</div>
          <h2>{isRegister ? "Create Admin/User Account" : "Admin Dashboard Login"}</h2>
          <p>{isRegister ? "Register a new account to access the panel" : "Sign in to manage your products and view store statistics"}</p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button
            className={`tab-btn ${!isRegister ? "active" : ""}`}
            onClick={() => { setIsRegister(false); setError(""); }}
          >
            Login
          </button>
          <button
            className={`tab-btn ${isRegister ? "active" : ""}`}
            onClick={() => { setIsRegister(true); setError(""); }}
          >
            Register
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleAuth} className="auth-form">
          {isRegister && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label>Account Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Admin">Admin (Full Access to Dashboard)</option>
                <option value="User">Regular User (Frontend Store Only)</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Processing..." : isRegister ? "Create Account & Sign In" : "Sign In to Dashboard"}
          </button>
        </form>

        <div className="auth-footer">
          <div className="demo-shortcut">
            <span>Demo Shortcut:</span>
            <button type="button" className="btn-link" onClick={fillDemoAdmin}>
              Auto-fill Demo Admin Credentials
            </button>
          </div>

          <div className="store-link-wrapper">
            <Link to="/store">or Browse Public Store directly →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;