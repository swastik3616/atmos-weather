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
    <aside className="flex flex-col items-center bg-[#181E2A] h-screen w-20 lg:w-20 py-6 rounded-2xl m-2 shadow-lg relative z-50">
      {/* Mobile Close Button - Enhanced positioning and touch target */}
      <div className="lg:hidden absolute top-4 right-4 z-10">
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors mobile-tap-highlight p-2 rounded-lg hover:bg-[#232A3A] min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>
      </div>
      
      {/* Logo - Enhanced mobile spacing */}
      <div className="mb-8 lg:mb-10 flex flex-col items-center mt-8 lg:mt-0">
        <div className="bg-violet-600 rounded-full p-2 mb-2">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M12 2L15 8H9L12 2Z" fill="#fff"/>
            <circle cx="12" cy="16" r="6" fill="#fff" fillOpacity="0.2"/>
          </svg>
        </div>
        <span className="text-xs text-white font-bold">SkySense</span>
      </div>
      
      {/* Navigation - Enhanced mobile touch targets and spacing */}
      <nav className="flex flex-col gap-6 lg:gap-8 flex-1 w-full px-2">
        {visibleNavItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button 
              key={item.id} 
              onClick={() => onNavigation(item.id)}
              className={`transition-all duration-200 flex flex-col items-center group mobile-tap-highlight min-h-[60px] lg:min-h-[50px] w-full rounded-xl p-2 ${
                isActive 
                  ? 'text-white bg-violet-600/20 border border-violet-600/30' 
                  : 'text-gray-400 hover:text-white hover:bg-[#232A3A]/50'
              }`}
              aria-label={`Navigate to ${item.label}`}
            >
              <div className="flex items-center justify-center w-8 h-8 mb-1">
                {item.icon}
              </div>
              <span className={`text-[10px] font-medium transition-opacity duration-200 ${
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 lg:group-hover:opacity-100'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
      
      {/* Mobile bottom spacing */}
      <div className="h-4 lg:hidden"></div>
    </aside>
  );
} 