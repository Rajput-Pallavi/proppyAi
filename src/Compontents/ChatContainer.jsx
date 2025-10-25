import React from "react";
import img from "../assets/img.png";

const ChatContainer = ({ outputText }) => {
  return (
    <div className="relative w-full min-h-[80vh] flex flex-col items-center justify-center bg-white overflow-hidden">
      {/* Chat Area */}
      <div
        className="relative w-[85%] max-w-[800px] bg-[#2d5a2d] rounded-xl shadow-xl flex items-center justify-center p-6
                    text-center transition-all duration-300
                    sm:h-[200px]
                    md:h-[260px]
                    lg:h-[320px]
                    xl:h-[380px]"
      >
        <div className="text-white text-sm sm:text-base md:text-lg lg:text-xl break-words">
          {outputText}
        </div>
      </div>

      {/* Character Image */}
      <div
        className="absolute bottom-0 right-6 md:right-10 lg:right-16 xl:right-20 
                   flex justify-end items-end pointer-events-none z-10"
      >
        <img
          src={img}
          alt="Character"
          className="object-contain 
                     h-[120px]
                     sm:h-[160px]
                     md:h-[220px]
                     lg:h-[280px]
                     xl:h-[340px]
                     translate-y-2 sm:translate-y-4 md:translate-y-6"
        />
      </div>
    </div>
  );
};

export default ChatContainer;
