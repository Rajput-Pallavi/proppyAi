import React, { useState } from "react";
import "./Chats.css";

const Chats = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="chats-container">
      <div className="chats-header" onClick={() => setIsOpen(!isOpen)}>
        <span className="chats-title">Chats</span>
        <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>
          ▼
        </span>
        
      </div>

      {/* Optional content (only visible when open) */}
      {isOpen && (
        <div className="dropdown-content">
          <p>No chats yet...</p>
        </div>
      )}
    </div>
  );
};

export default Chats;
