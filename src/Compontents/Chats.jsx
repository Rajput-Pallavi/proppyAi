import React, { useState } from "react";

const Chats = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(""); // fixed state usage

  return (
    <div className="rounded-lg font-poppins transition-all duration-300 text-center">
      <div
        className="flex items-center justify-between cursor-pointer p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-baseline pl-0"> {/* matches your span styling */}
          <button
            className={`px-3 py-1 rounded-md ${
              currentPage === "Chat"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentPage("Chat");
            }}
          >
            <span className="flex items-center gap-1">
              ▼ <p className="pl-5 m-0">chats</p>
            </span>
          </button>
        </span>
      </div>

      {isOpen && (
        <div className="mt-2 bg-gray-100 rounded-md shadow-md p-2">
          <p className="m-0">No chats yet...</p>
        </div>
      )}
    </div>
  );
};

export default Chats;
