import React from 'react';
import { Home, Clock, MapPin, Calendar, Settings, LogOut, Moon, X } from 'lucide-react';

const navItems = [
  { icon: <Home size={24} />, label: 'Dashboard' },
  { icon: <Clock size={24} />, label: 'Clock' },
  { icon: <MapPin size={24} />, label: 'Location' },
  { icon: <Calendar size={24} />, label: 'Calendar' },
  { icon: <Settings size={24} />, label: 'Settings' },
];

export default function Sidebar({ onClose }) {
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
        {navItems.map((item, idx) => (
          <button key={idx} className="text-gray-400 hover:text-white transition-colors flex flex-col items-center group mobile-tap-highlight">
            {item.icon}
            <span className="text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{item.label}</span>
          </button>
        ))}
      </nav>
      
      {/* Logout and Dark Mode Toggle */}
      <div className="flex flex-col gap-6 items-center mb-2">
        <button className="text-gray-400 hover:text-white mobile-tap-highlight">
          <LogOut size={24} />
        </button>
        <button className="bg-[#232A3A] p-2 rounded-full text-gray-400 hover:text-white mobile-tap-highlight">
          <Moon size={20} />
        </button>
      </div>
    </aside>
  );
} 