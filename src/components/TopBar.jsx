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
    <header className="flex items-center justify-between w-full mb-4 lg:mb-8 gap-2 sm:gap-3 lg:gap-4">
      {/* Mobile Menu Button - Enhanced touch target and positioning */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden text-white p-2.5 hover:bg-[#232A3A] rounded-xl transition-all duration-200 mobile-tap-highlight min-w-[44px] min-h-[44px] flex items-center justify-center shadow-lg flex-shrink-0"
        aria-label="Open sidebar menu"
      >
        <Menu size={22} />
      </button>
      
      {/* Search Bar - Reduced mobile size and better responsiveness */}
      <div className="flex items-center bg-[#232A3A] rounded-xl px-3 py-2.5 w-full max-w-[200px] sm:max-w-xs lg:max-w-md shadow-lg">
        <Search className="text-gray-400 mr-2 flex-shrink-0" size={18} />
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search City..."
          className="bg-transparent outline-none text-white placeholder-gray-400 flex-1 text-sm lg:text-base mobile-tap-highlight min-h-[20px]"
        />
      </div>
      
      {/* User Profile or Login/Signup - Better mobile alignment */}
      <div className="relative flex-shrink-0" ref={dropdownRef}>
        {isLoggedIn ? (
          <>
            <button
              className="flex items-center gap-2 bg-[#232A3A] rounded-xl px-3 py-2.5 hover:bg-[#2d3340] transition-all duration-200 min-w-[44px] min-h-[44px] shadow-lg mobile-tap-highlight"
              onClick={() => setDropdownOpen((open) => !open)}
              aria-label="User menu"
            >
              <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold shadow-md">
                <span className="text-xs lg:text-sm">{username[0]?.toUpperCase()}</span>
              </div>
              <span className="text-white text-xs lg:text-sm font-medium hidden sm:block">{username}</span>
              <ChevronDown className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} size={18} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-[#232A3A] rounded-2xl shadow-2xl py-2 z-50 border border-[#2d3340]">
                <button
                  className="flex items-center w-full px-4 py-3 text-sm text-white hover:bg-violet-600 transition-colors gap-3 min-h-[44px] text-left rounded-lg mx-2"
                  onClick={() => { setDropdownOpen(false); onSettings && onSettings(); }}
                >
                  <SettingsIcon size={16} /> Settings
                </button>
                <button
                  className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-600 hover:text-white transition-colors gap-3 min-h-[44px] text-left rounded-lg mx-2"
                  onClick={() => { setDropdownOpen(false); onLogout && onLogout(); }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <button
            className="bg-violet-600 text-white px-3 sm:px-4 py-2.5 rounded-xl font-semibold hover:bg-violet-700 transition-all duration-200 min-h-[44px] min-w-[80px] text-center shadow-lg mobile-tap-highlight flex-shrink-0"
            onClick={() => navigate('/login')}
          >
            <span className="hidden sm:inline text-sm">Login</span>
            <span className="sm:hidden text-sm">Login</span>
          </button>
        )}
      </div>
    </header>
  );
} 