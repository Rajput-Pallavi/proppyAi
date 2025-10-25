import React from "react";
import { RiSearchEyeLine } from "react-icons/ri";

const SearchBar = ({ searchValue, setSearchValue, handleSearch }) => {
  return (
    <div className="flex items-center w-full max-w-sm mx-auto border border-gray-300 rounded-full overflow-hidden shadow-sm
                    px-1 py-0.5
                    sm:px-0 sm:py-0 sm:max-w-md
                    md:max-w-lg
                    lg:max-w-xl">
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search..."
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="flex-1 px-3 py-1.5 text-gray-700 text-xs focus:outline-none
                   sm:px-4 sm:py-2 sm:text-sm
                   md:text-base
                   lg:px-5 lg:py-2.5"
      />
      <button
        onClick={handleSearch}
        className="flex items-center justify-center px-2 py-1.5 bg-gray-100 hover:bg-gray-200 transition-colors
                   sm:px-3 sm:py-2
                   lg:px-4"
      >
        <RiSearchEyeLine size={16} className="text-gray-600 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
      </button>
    </div>
  );
};

export default SearchBar;