import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { TfiVideoClapper } from "react-icons/tfi";
import { PiExam } from "react-icons/pi";
import Logout from '../Logout/Logout';   // ✅ Reusable logout
import './Header.css';
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    } else {
      setUser({
        name: "Not yet",
        email: "Smtg is wrong",
        age: 16,
        class: "10th Grade",
        school: "ABC School",
        learningRecord: "Completed 15 lessons",
        testScore: "85%",
      });
    }
  }, []);

  return (
    <header className="top-nav">
      {/* Left: Logo */}
      <div className="logo"></div>

      {/* Center: Mini + Test */}
      <div className="center-nav">
        <button className="nav-btn" onClick={() => navigate("/shorts")}>
          <TfiVideoClapper size={24} />
          <span>Mini</span>
        </button>
        <button className="nav-btn">
          <PiExam size={30} />
          <span>Test</span>
        </button>
      </div>

      {/* Right: Profile */}
      <div className="right-nav">
        <button
          className="nav-btn"
          onClick={() => setShowProfile(!showProfile)}
        >
          <FaUserCircle size={20} /> {user?.name || "Profile"}
        </button>

        {showProfile && user && (
          <div className="profile-dropdown">
            <div className="profile-header">
              <img src={user.avatar} alt="User Avatar" className="profile-avatar" />
              <div>
                <p className="profile-name">{user.name}</p>
                <p className="profile-email">{user.email}</p>
              </div>
            </div>
            <hr />
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Class:</strong> {user.class}</p>
            <p><strong>School:</strong> {user.school}</p>
            <p><strong>Learning Record:</strong> {user.learningRecord}</p>
            <p><strong>Test Score:</strong> {user.testScore}</p>

            {/* ✅ Use the reusable Logout component */}
            <Logout />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
