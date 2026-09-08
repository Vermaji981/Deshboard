import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar";
import Sidebar from "../component/slidebar";

function Adminlayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="admin-app-layout">
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <div className="admin-body">
        <Sidebar isOpen={sidebarOpen} />
        <main className={`admin-main-content ${sidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}>
          <div className="page-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Adminlayout;
