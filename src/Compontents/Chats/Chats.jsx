import React, { useState } from "react";
import "./Chats.css";

const Chats = () => {
  const [isOpen, setIsOpen, currentPage, showPage] = useState(false);

  return (
    <div className="chats-container">
      <div className="chats-header" onClick={() => setIsOpen(!isOpen)}>
        <span className="chats-title"></span>
         <button
          className={`menu-item ${currentPage === "Chat" ? "active" : ""}`}
          onClick={() => showPage("Chat")}
        >
          <span> ▼<p>chats</p></span> {isOpen && ""}
        </button>
      </div>
      {isOpen && (
        <div className="dropdown-content">
          <p>No chats yet...</p>
        </div>
      )}
    </div>
  );
};

export default Chats;
