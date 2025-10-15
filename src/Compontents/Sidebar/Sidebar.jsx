import React, { useState } from "react";
import "./Sidebar.css";
import Chats from "../Chats/Chats";
import Logout from "../Logout/Logout";
import cha from '../../assets/Chat.png';
import book from '../../assets/book.png';
import { useNavigate } from "react-router-dom";


const Sidebar = ({ currentPage, showPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="logo"></div>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Menu & Chats */}
      <div className="sidebar-menu">
        <button 
          className={`menu-item ${currentPage === "newChat" ? "active" : ""}`}
          onClick={() => showPage("newChat")}
        >
          <img src={cha} alt="Chat" /> {isOpen && "New Chat"}
        </button>

        <button
          className={`menu-item ${currentPage === "library" ? "active" : ""}`}
          onClick={() => showPage("library")}
        >
          <img src={book} alt="Library" /> {isOpen && "Library"}
        </button>

        <div className="chats-container">
          <Chats />
        </div>
      </div>

      {/* Logout at bottom */}
      <div className="sidebar-logout">
        <Logout />
      </div>
    </div>
  );
};

export default Sidebar;
