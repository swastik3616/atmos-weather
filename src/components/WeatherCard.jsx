import React from 'react';
import { MapPin } from 'lucide-react';

export default function WeatherCard({ weather, loading, error, unit }) {
  if (loading) {
    return (
      <section className="bg-card-bg rounded-3xl p-4 lg:p-8 shadow-dashboard font-dashboard text-text-primary flex flex-col w-full text-center">
        Loading weather...
      </section>
    );
  }
  if (error || !weather) {
    return (
      <section className="bg-card-bg rounded-3xl p-4 lg:p-8 shadow-dashboard font-dashboard text-red-400 flex flex-col w-full text-center">
        {error || 'No weather data'}
      </section>
    );
  }

  // Extract data from API response
  const {
    location,
    current
  } = weather;

  return (
    <section className="bg-card-bg rounded-3xl p-4 lg:p-8 shadow-dashboard font-dashboard text-text-primary flex flex-col w-full">
      {/* Location */}
      <div className="flex items-center gap-2 lg:gap-4 mb-6 lg:mb-12">
        <span className="bg-accent text-white text-xs font-semibold px-2 lg:px-3 py-1 rounded-full flex items-center gap-1">
          <MapPin size={14} className="lg:w-4 lg:h-4" /> 
          <span className="hidden sm:inline">{location?.name}, {location?.country}</span>
          <span className="sm:hidden">{location?.name}</span>
        </span>
      </div>
      {/* Day, Date, Weather Icon */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 gap-4">
        <div className="flex-1">
          <div className="text-xl lg:text-3xl font-bold">{location?.localtime ? new Date(location.localtime).toLocaleDateString('en-US', { weekday: 'long' }) : ''}</div>
          <div className="text-text-secondary text-xs lg:text-sm mb-2 lg:mb-4">{location?.localtime ? new Date(location.localtime).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}</div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 lg:gap-4">
            <span className="text-4xl lg:text-6xl font-bold">
              {unit === 'celsius' ? `${current.temp_c}°C` : `${current.temp_f}°F`}
            </span>
            <div className="flex flex-col text-xs text-text-secondary">
              <span>Feels Like: {unit === 'celsius' ? `${current.feelslike_c}°C` : `${current.feelslike_f}°F`}</span>
              <span>Humidity: {current.humidity}%</span>
            </div>
          </div>
        </div>
        {/* Weather Icon */}
        <div className="flex flex-col items-center">
          <img src={current.condition.icon} alt={current.condition.text} className="w-16 h-16 lg:w-20 lg:h-20" />
          <span className="text-sm lg:text-lg font-semibold mt-2 text-center">{current.condition.text}</span>
          <span className="text-text-secondary text-xs">Wind: {current.wind_kph} km/h</span>
        </div>
      </div>
    </section>
  );
} 