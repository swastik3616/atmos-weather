import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

export default function TopBar({ city, setCity }) {
  const [input, setInput] = useState(city);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      setCity(input.trim());
    }
  };

  return (
    <header className="flex items-center justify-between w-full mb-8">
      {/* Search Bar */}
      <div className="flex items-center bg-[#232A3A] rounded-full px-4 py-2 w-96">
        <Search className="text-gray-400 mr-2" size={20} />
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search City...."
          className="bg-transparent outline-none text-white placeholder-gray-400 flex-1"
        />
      </div>
      {/* User Profile */}
      <div className="flex items-center gap-2 bg-[#232A3A] rounded-full px-4 py-2">
        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">
          <span className="text-lg">U</span>
        </div>
        <span className="text-white text-sm font-medium">User Name</span>
        <ChevronDown className="text-gray-400" size={20} />
      </div>
    </header>
  );
} 