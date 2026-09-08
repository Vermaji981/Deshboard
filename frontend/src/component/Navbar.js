import React from "react";
import { useNavigate, Link } from "react-router-dom";

function Navbar({ toggleSidebar, sidebarOpen }) {
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : { name: "Admin User", role: "Admin", email: "admin@dashboard.com" };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="toggle-btn" onClick={toggleSidebar} title="Toggle Sidebar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div className="header-brand">
          <span className="brand-dot"></span>
          <h2>Control Panel</h2>
        </div>
      </div>

      <div className="header-right">
        <Link to="/store" className="store-link-btn" title="View Public Store front where data is displayed">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          <span>Live Store Front</span>
        </Link>

        <div className="user-profile-badge">
          <div className="avatar">{user.name ? user.name.charAt(0).toUpperCase() : "A"}</div>
          <div className="user-info">
            <span className="user-name">{user.name || "Admin"}</span>
            <span className="user-role">{user.role || "Admin"}</span>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
