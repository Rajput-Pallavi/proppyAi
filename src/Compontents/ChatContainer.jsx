import React from "react";
import img from '../assets/img.png';

const ChatContainer = ({ outputText }) => {
  return (
    <div className="relative w-full min-h-[400px] flex items-center justify-center p-5 
                    sm:min-h-[300px] sm:p-2">
      {/* Chat Area */}
      <div className="relative w-3/5 h-[450px] bg-[#2d5a2d] rounded-lg shadow-md flex items-center justify-center p-4 mt-8
                      lg:w-3/4 lg:h-[460px] lg:mt-4 lg:ml-20
                      md:w-4/5 md:h-[280px] md:mt-[-60px] md:ml-9 md:p-3
                      sm:w-3/4 sm:h-[240px] sm:mt-[-40px] sm:p-2
                      xs:w-full xs:h-[200px] xs:mt-[-30px] xs:p-2">
        <div className="text-white text-lg text-center break-words
                        lg:text-base md:text-sm sm:text-[0.9rem] xs:text-[0.85rem]">
          {outputText}
        </div>
      </div>

      {/* Character Placeholder */}
      <div className="absolute right-0 bottom-0 pointer-events-none z-20">
        <img src={img} alt=""
             className="block object-contain h-[480px] mr-16
                        lg:h-[490px] lg:mr-[-16px]
                        md:h-[340px] md:mr-[-18px] md:mb-20
                        sm:h-[250px] sm:mr-[-14px] sm:mb-10
                        xs:h-[150px] xs:mr-[-8px] xs:mb-12" />
      </div>
    </div>
  );
};

export default ChatContainer;
