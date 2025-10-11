import React, { useState } from "react";
import "./Sidebar.css";
import Chats from "../Chats/Chats";
import Logout from "../Logout/Logout";
import cha from '../../assets/Chat.png'
import book from '../../assets/book.png'
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
          <img src={cha} alt="" />{isOpen && "New Chat"}
        </button>

        <button
          className={`menu-item ${currentPage === "library" ? "active" : ""}`}
          onClick={() => showPage("library")}
        >
          <img  className='lib'src={book} alt="" /> {isOpen && "Library"}
        </button>
         <Chats/>  
      </div>
      <div>
        <Logout/>
      </div>
      
    </div>
  );
};

export default Sidebar;

