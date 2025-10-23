import React from "react";
import SearchBar from '../Compontents/SearchBar.jsx';
import ChatContainer from '../Compontents/ChatContainer.jsx';

const NewChat = ({ searchValue, setSearchValue, handleSearch, outputText }) => {
  return (
    <div className="block animate-fadeIn">
      <SearchBar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        handleSearch={handleSearch}
      />
      <ChatContainer outputText={outputText} />
      
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease;
        }
      `}</style>
    </div>
  );
};

export default NewChat;