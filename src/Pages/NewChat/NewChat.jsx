import React from "react";
import SearchBar from '../../Compontents/SearchBar/SearchBar.jsx';
import ChatContainer from '../../Compontents/ChatContainer/ChatContainer.jsx';
import "./NewChat.css";

const NewChat = ({ searchValue, setSearchValue, handleSearch, outputText }) => {
  return (
    <div className="page active">
      <SearchBar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        handleSearch={handleSearch}
      />
      <ChatContainer outputText={outputText} />
    </div>
  );
};

export default NewChat;
