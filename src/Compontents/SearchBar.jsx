import React from "react";
import { RiSearchEyeLine } from "react-icons/ri";

const SearchBar = ({ searchValue, setSearchValue, handleSearch }) => {
  return (
    <div className="flex items-center w-full max-w-sm mx-auto border border-gray-300 rounded-full overflow-hidden shadow-sm">
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search..."
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="flex-1 px-4 py-2 text-gray-700 text-sm focus:outline-none"
      />
      <button
        onClick={handleSearch}
        className="flex items-center justify-center px-3 bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <RiSearchEyeLine size={20} className="text-gray-600" />
      </button>
    </div>
  );
};

export default SearchBar;
