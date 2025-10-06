import React, { useState } from "react";
import "./Sidebar.css";
import profilePic from "../../assets/img1.png"; // make sure you have an image in /assets/

const Sidebar = ({ currentPage, showPage }) => {
  const [isOpen, setIsOpen] = useState(true); // Sidebar open/close state

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <div className="logo"></div>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      <div className="sidebar-menu">
        <button
          className={`menu-item ${currentPage === "newChat" ? "active" : ""}`}
          onClick={() => showPage("newChat")}
        >
          <span>💬</span> {isOpen && "New Chat"}
        </button>

        <button
          className={`menu-item ${currentPage === "library" ? "active" : ""}`}
          onClick={() => showPage("library")}
        >
          <span>📚</span> {isOpen && "Library"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

