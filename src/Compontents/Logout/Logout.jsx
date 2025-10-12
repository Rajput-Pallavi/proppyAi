import React from "react";
import { LogOut } from "lucide-react"; // icon
import "./Logout.css";

const LogoutButton = () => {
  return (
    <div className="logout-container">
      <button className="logout-btn">
        <LogOut className="icon" />
       <p> Logout</p>
      </button>
    </div>
  );
};

export default LogoutButton;
