import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
      const response = await loginUser(form);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch {
      setError("Incorrect email or password. Try again.");
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
            Every leaf
            <br />
            <em>tells you</em>
            <br />
            something.
          </h2>
        </div>
      </div>

      {/* ══════ FORM PANEL ══════ */}
      <div className="auth-form-panel">
        <div className="auth-form-wrap">
          <p className="auth-form-eyebrow">Welcome back</p>
          <h1>Login to your collection</h1>
          <p className="auth-subtitle">
            Pick up right where you left off with your plants.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}

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
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Logging in…" : "Login"}
            </button>
          </form>

          <p className="auth-link">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;