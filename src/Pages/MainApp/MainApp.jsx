import React, { useState } from "react";
import Header from '../../Compontents/Header/Header.jsx';
import Sidebar from '../../Compontents/Sidebar/Sidebar.jsx';
import NewChat from "../NewChat/NewChat";
import Library from "../Library/Library";
import "./MainApp.css";

const MainApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("newChat");
  const [searchValue, setSearchValue] = useState("");
  const [outputText, setOutputText] = useState("");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const showPage = (page) => {
    setCurrentPage(page);
    closeSidebar();
  };

  const handleSearch = async () => {
    if (!searchValue) return;
    try {
      const response = await fetch("http://localhost:5000/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchValue }),
      });
      const data = await response.json();
      setOutputText(data.result);
    } catch (error) {
      setOutputText("Error connecting to backend.");
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        sidebarOpen={sidebarOpen}
        currentPage={currentPage}
        showPage={showPage}
        closeSidebar={closeSidebar}
      />
      <Header toggleSidebar={toggleSidebar} />

      <div className="main-content">
        {currentPage === "newChat" && (
          <NewChat
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            handleSearch={handleSearch}
            outputText={outputText}
          />
        )}
        {currentPage === "library" && <Library />}
      </div>
    </div>
  );
};

export default MainApp;
