import React from "react";
import { LogOut } from "lucide-react";

const Logout = () => {
  const handleLogout = () => {
    localStorage.removeItem('user');   // clear user data
    window.location.href = '/signin';  // redirect to login
  };

  return (
    <div className="flex justify-start">
      <button
        className="flex items-center gap-3 md:gap-2 p-4 md:p-3 xs:p-2 
                   text-[#2b2b2b] text-sm md:text-sm xs:text-xs font-medium 
                   rounded-lg bg-transparent transition-all duration-200 
                   hover:bg-gray-100"
        onClick={handleLogout}
      >
        <LogOut className="w-7 h-7 md:w-6 md:h-6 xs:w-5 xs:h-5" />
        <p className="m-0">Logout</p>
      </button>
    </div>
  );
};

export default Logout;
