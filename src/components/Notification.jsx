import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Notification = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose, 
  isVisible = true 
}) => {
  const [isVisibleState, setIsVisibleState] = useState(isVisible);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisibleState(false);
        setTimeout(() => onClose?.(), 300); // Wait for fade out animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-400" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-400" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-400" />;
      case 'info':
      default:
        return <Info size={20} className="text-blue-400" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900/90 border-green-700';
      case 'error':
        return 'bg-red-900/90 border-red-700';
      case 'warning':
        return 'bg-yellow-900/90 border-yellow-700';
      case 'info':
      default:
        return 'bg-blue-900/90 border-blue-700';
    }
  };

  if (!isVisibleState) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2 duration-300">
      <div className={`${getBgColor()} backdrop-blur-sm border rounded-lg p-4 shadow-lg max-w-sm`}>
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="flex-1">
            <p className="text-white font-medium">{message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisibleState(false);
              setTimeout(() => onClose?.(), 300);
            }}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification; 