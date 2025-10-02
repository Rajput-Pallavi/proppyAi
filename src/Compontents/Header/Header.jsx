import React from "react";
import "./Header.css";

const Header = ({ toggleSidebar }) => {
  return (
    <div className="header">
      <button className="menu-btn" onClick={toggleSidebar}>
        ☰ Menu
      </button>
      <div className="logo">Proppy Ai</div>
    </div>
  );
};

export default Header;
