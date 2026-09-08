import React from "react";
import { Link } from "react-router-dom";

function Notfound() {
  return (
    <div className="notfound-page">
      <div className="card text-center" style={{ padding: "3rem" }}>
        <h1 style={{ fontSize: "4rem", color: "#6366f1" }}>404</h1>
        <h2>Page Not Found</h2>
        <p style={{ margin: "1rem 0" }}>The page you are looking for does not exist or has been moved.</p>
        <Link to="/dashboard" className="btn btn-primary">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default Notfound;
