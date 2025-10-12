import React from "react";
import "./ChatContainer.css";
import img from '../../assets/img.png';


const ChatContainer = ({ outputText }) => {
  return (
    <div className="chat-container">
      <div className="chat-area">
        <div className="output-text">{outputText}</div>
      </div>
      <div className="character-placeholder">
        <img src={img} alt="" />
      </div>
    
    </div>
  );
};

export default ChatContainer;
