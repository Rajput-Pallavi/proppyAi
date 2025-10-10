import React from "react";
import { LogOut } from "lucide-react"; // icon
import "./Logout.css";

const LogoutButton = () => {
  return (
    <div className="logout-container">
      <button className="logout-btn">
        <LogOut className="icon" />
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
