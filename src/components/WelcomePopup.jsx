import React, { useEffect, useState } from 'react';
import { X, Sun, Cloud, CloudRain } from 'lucide-react';

const WelcomePopup = ({ username, isVisible, onClose }) => {
  const [isVisibleState, setIsVisibleState] = useState(isVisible);

  useEffect(() => {
    setIsVisibleState(isVisible);
    if (isVisible) {
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        setIsVisibleState(false);
        setTimeout(() => onClose?.(), 500);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisibleState) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="text-center">
          {/* Weather Icons Animation */}
          <div className="flex justify-center gap-4 mb-6">
            <Sun size={32} className="text-yellow-500 animate-bounce" />
            <Cloud size={32} className="text-gray-400 animate-pulse" />
            <CloudRain size={32} className="text-blue-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>
          
          {/* Welcome Message */}
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome back!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Hello <span className="font-semibold text-indigo-600 dark:text-indigo-400">{username}</span>, 
            welcome to <span className="font-semibold text-indigo-600 dark:text-indigo-400">Atmos Weather</span>
          </p>
          
          {/* Subtitle */}
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Your personal weather companion is ready to keep you informed about the weather conditions around the world.
          </p>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsVisibleState(false);
                setTimeout(() => onClose?.(), 500);
              }}
              className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={() => {
                setIsVisibleState(false);
                setTimeout(() => onClose?.(), 500);
              }}
              className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup; 