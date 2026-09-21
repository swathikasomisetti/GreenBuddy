import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "";
      if (err.response?.status === 409 || msg.includes("Duplicate") || msg.includes("already") || err.response?.status === 500) {
        setError("This email is already registered. Please login with your password.");
      } else {
        setError(msg || "Couldn't create your account. Please try again or login.");
      }
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="auth-page">
      {/* ══════ IMAGE PANEL ══════ */}
      <div className="auth-visual">
        <div className="auth-visual-bg" aria-hidden="true" />
        <div className="auth-visual-vignette" aria-hidden="true" />

        <Link to="/" className="auth-logo">
          <span className="auth-logo-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 22V13M12 13C12 13 4 12 4 4C12 4 12 13 12 13ZM12 13C12 13 20 12 20 4C12 4 12 13 12 13Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          GreenBuddy
        </Link>

        <div className="auth-visual-quote">
          <p className="auth-eyebrow">A field guide for the plants you keep</p>
          <h2>
            Start the
            <br />
            <em>record</em>
            <br />
            today.
          </h2>
        </div>
      </div>

      {/* ══════ FORM PANEL ══════ */}
      <div className="auth-form-panel">
        <div className="auth-form-wrap">
          <p className="auth-form-eyebrow">Get started</p>
          <h1>Create your account</h1>
          <p className="auth-subtitle">
            Start tracking watering, light, and growth — one plant at a time.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}

            <label className="auth-field">
              <span>Name</span>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label className="auth-field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                placeholder="At least 8 characters"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Creating account…" : "Register"}
            </button>
          </form>

          <p className="auth-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;