import React from "react";
import { LogOut } from "lucide-react";
import "./Logout.css";

const Logout = () => {
  const handleLogout = () => {
    localStorage.removeItem('user');   // clear user data
    window.location.href = '/signin';  // redirect to login
  };

  return (
    <div className="logout-container">
      <button className="logout-btn" onClick={handleLogout}>
        <LogOut className="icon" />
        <p>Logout</p>
      </button>
    </div>
  );
};

export default Logout;
