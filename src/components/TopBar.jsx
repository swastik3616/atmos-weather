import React, { useState } from 'react';
import { Search, ChevronDown, Menu } from 'lucide-react';

export default function TopBar({ city, setCity, onMenuClick }) {
  const [input, setInput] = useState(city);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      setCity(input.trim());
    }
  };

  return (
    <header className="flex items-center justify-between w-full mb-4 lg:mb-8">
      {/* Mobile Menu Button */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden text-white p-2 hover:bg-[#232A3A] rounded-lg transition-colors mobile-tap-highlight"
      >
        <Menu size={24} />
      </button>
      
      {/* Search Bar */}
      <div className="flex items-center bg-[#232A3A] rounded-full px-4 py-2 w-full max-w-sm lg:max-w-md">
        <Search className="text-gray-400 mr-2 flex-shrink-0" size={20} />
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search City...."
          className="bg-transparent outline-none text-white placeholder-gray-400 flex-1 text-sm lg:text-base mobile-tap-highlight"
        />
      </div>
      
      {/* User Profile */}
      <div className="hidden sm:flex items-center gap-2 bg-[#232A3A] rounded-full px-3 lg:px-4 py-2">
        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">
          <span className="text-sm lg:text-lg">U</span>
        </div>
        <span className="text-white text-xs lg:text-sm font-medium hidden md:block">User Name</span>
        <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
      </div>
    </header>
  );
} 