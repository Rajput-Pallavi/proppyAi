import React from "react";
import "./Sidebar.css";

const Sidebar = ({ sidebarOpen, currentPage, showPage, closeSidebar }) => {
  return (
    <>
      <div
        className={`overlay ${sidebarOpen ? "active" : ""}`}
        onClick={closeSidebar}
      ></div>

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
        </div>
        <div className="sidebar-menu">
          <button
            className={`menu-item ${currentPage === "newChat" ? "active" : ""}`}
            onClick={() => showPage("newChat")}
          >
            <span>💬</span> New Chat
          </button>
          <button
            className={`menu-item ${currentPage === "library" ? "active" : ""}`}
            onClick={() => showPage("library")}
          >
            <span>📚</span> Library
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
