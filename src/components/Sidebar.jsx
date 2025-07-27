import React from 'react';
import { Home, Clock, MapPin, Calendar, Settings, X } from 'lucide-react';

const navItems = [
  { id: 'dashboard', icon: <Home size={24} />, label: 'Dashboard' },
  { id: 'clock', icon: <Clock size={24} />, label: 'Clock' },
  { id: 'location', icon: <MapPin size={24} />, label: 'Location' },
  { id: 'calendar', icon: <Calendar size={24} />, label: 'Calendar' },
  { id: 'settings', icon: <Settings size={24} />, label: 'Settings' },
];

export default function Sidebar({ onClose, currentPage, onNavigation, isLoggedIn }) {
  const visibleNavItems = isLoggedIn ? navItems : navItems.filter(item => item.id === 'dashboard');
  return (
    <aside className="flex flex-col items-center bg-[#181E2A] h-screen w-20 lg:w-20 py-6 rounded-2xl m-2 shadow-lg">
      {/* Mobile Close Button */}
      <div className="lg:hidden absolute top-4 right-4">
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors mobile-tap-highlight"
        >
          <X size={24} />
        </button>
      </div>
      {/* Logo */}
      <div className="mb-10 flex flex-col items-center">
        <div className="bg-violet-600 rounded-full p-2 mb-2">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M12 2L15 8H9L12 2Z" fill="#fff"/>
            <circle cx="12" cy="16" r="6" fill="#fff" fillOpacity="0.2"/>
          </svg>
        </div>
        <span className="text-xs text-white font-bold">SkySense</span>
      </div>
      {/* Navigation */}
      <nav className="flex flex-col gap-8 flex-1">
        {visibleNavItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button 
              key={item.id} 
              onClick={() => onNavigation(item.id)}
              className={`transition-colors flex flex-col items-center group mobile-tap-highlight ${
                isActive 
                  ? 'text-white bg-violet-600/20 rounded-lg p-2' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.icon}
              <span className={`text-[10px] mt-1 transition-opacity ${
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
} 