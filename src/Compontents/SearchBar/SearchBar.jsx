import React from "react";
import "./SearchBar.css";
import { RiSearchEyeLine } from "react-icons/ri";

const SearchBar = ({ searchValue, setSearchValue, handleSearch }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search..."
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />
      <button className="search-arrow" onClick={handleSearch}>
        <RiSearchEyeLine size={22} />
      </button>
    </div>
  );
};

export default SearchBar;
