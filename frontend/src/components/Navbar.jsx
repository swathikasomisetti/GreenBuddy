import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/ai-doctor", label: "AI Doctor 🩺", highlight: true },
    { to: "/add-plant", label: "Add Plant" },
    { to: "/journal", label: "My Journal" },
    { to: "/profile", label: "My Profile" },
    { to: "/calendar", label: "Calendar" },
  ];

  return (
    <nav className="app-navbar">
      <Link to="/dashboard" className="app-logo">
        <span className="app-logo-mark" aria-hidden="true">
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

      <div className="app-nav-links">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`${isActive(l.to) ? "is-active" : ""} ${l.highlight ? "nav-ai-highlight" : ""}`}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <button className="app-logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;