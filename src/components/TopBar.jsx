import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Menu, LogOut, Settings as SettingsIcon, MapPin, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchLocations } from '../api/weatherApi';

export default function TopBar({ city, setCity, onMenuClick, user, onSettings, onLogout, isLoggedIn }) {
  const [input, setInput] = useState(city);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (input.trim().length > 2) {
        performSearch(input.trim());
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [input]);

  const performSearch = async (query) => {
    if (query.length < 3) return;
    
    setSearchLoading(true);
    try {
      const results = await searchLocations(query);
      setSearchSuggestions(results || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchSuggestions([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      setCity(input.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const locationName = suggestion.name;
    if (suggestion.region && suggestion.region !== suggestion.name) {
      setCity(`${locationName}, ${suggestion.region}`);
    } else {
      setCity(locationName);
    }
    setInput(locationName);
    setShowSuggestions(false);
  };

  const getLocationTypeIcon = (suggestion) => {
    if (suggestion.country && suggestion.region) {
      return <Globe className="w-4 h-4 text-blue-400" />;
    }
    return <MapPin className="w-4 h-4 text-green-400" />;
  };

  const getLocationTypeText = (suggestion) => {
    if (suggestion.country && suggestion.region) {
      return 'District/Village';
    }
    return 'City';
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      
      {/* Enhanced Search Bar with Autocomplete */}
      <div className="relative flex-1 max-w-[200px] sm:max-w-xs lg:max-w-md" ref={searchRef}>
        <div className="flex items-center bg-[#232A3A] rounded-xl px-3 py-2.5 w-full shadow-lg">
          <Search className="text-gray-400 mr-2 flex-shrink-0" size={18} />
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => input.trim().length > 2 && setShowSuggestions(true)}
            placeholder="Search City, District, Village..."
            className="bg-transparent outline-none text-white placeholder-gray-400 flex-1 text-sm lg:text-base mobile-tap-highlight min-h-[20px]"
          />
          {searchLoading && (
            <div className="ml-2 w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
        
        {/* Search Suggestions Dropdown */}
        {showSuggestions && searchSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#232A3A] rounded-xl shadow-2xl border border-[#2d3340] z-50 max-h-60 overflow-y-auto">
            {searchSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-[#2d3340] transition-colors border-b border-[#2d3340] last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  {getLocationTypeIcon(suggestion)}
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">
                      {suggestion.name}
                    </div>
                    <div className="text-gray-400 text-xs flex items-center gap-2">
                      <span>{getLocationTypeText(suggestion)}</span>
                      {suggestion.region && suggestion.region !== suggestion.name && (
                        <>
                          <span>•</span>
                          <span>{suggestion.region}</span>
                        </>
                      )}
                      {suggestion.country && (
                        <>
                          <span>•</span>
                          <span>{suggestion.country}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* User Profile or Login - Better mobile alignment */}
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