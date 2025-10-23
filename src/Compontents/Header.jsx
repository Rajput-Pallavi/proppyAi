import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { TfiVideoClapper } from "react-icons/tfi";
import { PiExam } from "react-icons/pi";
import Logout from '/src/Compontents/Logout.jsx';
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
    <header className="w-full bg-[#f3d993] text-[#131313] flex flex-col md:flex-row items-center md:justify-between p-3 md:p-5 relative font-poppins">
      {/* Logo */}
      <div className="text-2xl font-bold mb-2 md:mb-0 text-center md:text-left">
        Logo
      </div>

      {/* Center Nav */}
      <div className="flex gap-10 justify-center flex-1 mb-2 md:mb-0">
        <button
          className="flex items-center gap-1 text-[#221e1e] text-base md:text-lg cursor-pointer hover:opacity-80"
          onClick={() => navigate("/shorts")}
        >
          <TfiVideoClapper size={24} />
          <span>Mini</span>
        </button>
        <button className="flex items-center gap-1 text-[#221e1e] text-base md:text-lg cursor-pointer hover:opacity-80">
          <PiExam size={30} />
          <span>Test</span>
        </button>
      </div>

      {/* Right Nav / Profile */}
      <div className="relative">
        <button
          className="flex items-center gap-1 text-[#221e1e] text-base md:text-lg cursor-pointer hover:opacity-80"
          onClick={() => setShowProfile(!showProfile)}
        >
          <FaUserCircle size={20} />
          {user?.name || "Profile"}
        </button>

        {showProfile && user && (
          <div className="absolute top-full right-0 mt-2 bg-white text-black p-4 rounded-lg shadow-md w-60 z-50 md:w-60 sm:w-52 xs:w-44">
            <div className="flex items-center gap-2 mb-2">
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-11 h-11 rounded-full object-cover sm:w-10 sm:h-10 xs:w-9 xs:h-9"
              />
              <div>
                <p className="text-base font-semibold sm:text-sm xs:text-xs">{user.name}</p>
                <p className="text-sm text-gray-600 sm:text-xs xs:text-[10px]">{user.email}</p>
              </div>
            </div>
            <hr className="my-2 border-t border-gray-300" />
            <p className="text-sm mb-1"><strong>Age:</strong> {user.age}</p>
            <p className="text-sm mb-1"><strong>Class:</strong> {user.class}</p>
            <p className="text-sm mb-1"><strong>School:</strong> {user.school}</p>
            <p className="text-sm mb-1"><strong>Learning Record:</strong> {user.learningRecord}</p>
            <p className="text-sm mb-1"><strong>Test Score:</strong> {user.testScore}</p>

            {/* Reusable Logout */}
            <Logout />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
