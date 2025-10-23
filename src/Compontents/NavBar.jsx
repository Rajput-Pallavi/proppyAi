import React from 'react';

const NavBar = () => {
  return (
    <nav className="w-full bg-[#f3d993] text-[#131313] flex items-center justify-between p-4 md:p-5 font-poppins shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold">Logo</div>

      {/* Navigation Links */}
      <div className="hidden md:flex gap-6">
        <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
        <a href="/about" className="hover:text-blue-600 transition-colors">About</a>
        <a href="/contact" className="hover:text-blue-600 transition-colors">Contact</a>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button className="text-xl">☰</button>
      </div>
    </nav>
  );
};

export default NavBar;
