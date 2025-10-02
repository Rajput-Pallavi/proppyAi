import React from "react";
import "./SearchBar.css";

const SearchBar = ({ searchValue, setSearchValue, handleSearch }) => {
  return (
    <div className="search-bar">
      <input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search..."
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />
      <button className="search-arrow" onClick={handleSearch} tabIndex={-1}>
        &gt;
      </button>
    </div>
  );
};

export default SearchBar;
