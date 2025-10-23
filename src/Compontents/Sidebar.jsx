import React, { useState } from "react";
import Chats from "./Chats";
import Logout from "./Logout";
import cha from '../assets/chat.png';
import book from '../assets/book.png';

const Sidebar = ({ currentPage, showPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div
      className={`fixed left-0 top-0 h-screen flex flex-col bg-gradient-to-b from-[#ede13a] to-[#f1f83c] shadow-lg transition-all duration-300 overflow-hidden z-50 ${
        isOpen ? "w-56" : "w-16"
      }`}
    >
      {/* Header with toggle */}
      <div className="flex items-center p-4">
        <div className="text-xl font-bold">{isOpen && "Logo"}</div>
        <button
          className="ml-2 text-2xl cursor-pointer transition-transform duration-200 hover:scale-125"
          onClick={toggleSidebar}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Menu */}
      <div className="flex flex-col mt-6 gap-2 px-2">
        <button
          className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer ${
            currentPage === "newChat" ? "font-semibold shadow-md" : ""
          } hover:bg-gray-300 hover:translate-x-1`}
          onClick={() => showPage("newChat")}
        >
          <img src={cha} alt="Chat" className="w-5 h-5" />
          {isOpen && <span>New Chat</span>}
        </button>

        <button
          className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer ${
            currentPage === "library" ? "font-semibold shadow-md" : ""
          } hover:bg-gray-300 hover:translate-x-1`}
          onClick={() => showPage("library")}
        >
          <img src={book} alt="Library" className="w-5 h-5" />
          {isOpen && <span>Library</span>}
        </button>

        <div className="mt-4">
          <Chats />
        </div>
      </div>

      {/* Logout at bottom */}
      <div className="mt-auto p-2 flex items-center">
        <Logout />
      </div>
    </div>
  );
};

export default Sidebar;
