import React from "react";
import "./Library.css";

const Library = () => {
  return (
    <div className="page active">
      <div className="library-container">
        <div className="empty-state">
          <h2>📚 Library</h2>
          <p>This is your library page. It's currently empty.</p>
        </div>
      </div>
    </div>
  );
};

export default Library;
