import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Menu, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ city, setCity, onMenuClick, user, onSettings, onLogout, isLoggedIn }) {
  const [input, setInput] = useState(city);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      setCity(input.trim());
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const username = user?.email ? user.email.split('@')[0] : 'User';

  return (
    <header className="flex items-center justify-between w-full mb-4 lg:mb-8 gap-2">
      {/* Mobile Menu Button */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden text-white p-2 hover:bg-[#232A3A] rounded-lg transition-colors mobile-tap-highlight min-w-[44px] min-h-[44px]"
        aria-label="Open sidebar menu"
      >
        <Menu size={24} />
      </button>
      {/* Search Bar */}
      <div className="flex items-center bg-[#232A3A] rounded-full px-4 py-2 w-full max-w-xs sm:max-w-sm lg:max-w-md">
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
      {/* User Profile or Login/Signup */}
      <div className="relative flex-shrink-0" ref={dropdownRef}>
        {isLoggedIn ? (
          <>
            <button
              className="flex items-center gap-2 bg-[#232A3A] rounded-full px-3 sm:px-4 py-2 hover:bg-[#2d3340] transition-colors min-w-[44px] min-h-[44px]"
              onClick={() => setDropdownOpen((open) => !open)}
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">
                <span className="text-sm lg:text-lg">{username[0]?.toUpperCase()}</span>
              </div>
              <span className="text-white text-xs lg:text-sm font-medium hidden md:block">{username}</span>
              <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-[#232A3A] rounded-xl shadow-lg py-2 z-50 min-w-[160px]">
                <button
                  className="flex items-center w-full px-4 py-3 text-sm text-white hover:bg-violet-600 transition-colors gap-2 min-h-[44px] text-left"
                  onClick={() => { setDropdownOpen(false); onSettings && onSettings(); }}
                >
                  <SettingsIcon size={16} /> Settings
                </button>
                <button
                  className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-600 hover:text-white transition-colors gap-2 min-h-[44px] text-left"
                  onClick={() => { setDropdownOpen(false); onLogout && onLogout(); }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <button
            className="bg-violet-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-violet-700 transition-colors w-full sm:w-auto min-h-[44px] min-w-[120px] text-center"
            onClick={() => navigate('/login')}
          >
            Login / Signup
          </button>
        )}
      </div>
    </header>
  );
} 