import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

export default function WeatherCard({ weather, loading, error }) {
  const [isCelsius, setIsCelsius] = useState(true);

  if (loading) {
    return (
      <section className="bg-card-bg rounded-3xl p-8 shadow-dashboard font-dashboard text-text-primary flex flex-col w-full max-w-3xl text-center">
        Loading weather...
      </section>
    );
  }
  if (error || !weather) {
    return (
      <section className="bg-card-bg rounded-3xl p-8 shadow-dashboard font-dashboard text-red-400 flex flex-col w-full max-w-3xl text-center">
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
    <section className="bg-card-bg rounded-3xl p-8 shadow-dashboard font-dashboard text-text-primary flex flex-col w-full max-w-3xl">
      {/* Location */}
      <div className="flex items-center gap-4 mb-12">
        <span className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
          <MapPin size={16} /> {location?.name}, {location?.country}
        </span>
        <div className="ml-auto flex items-center gap-2 bg-[#232A3A] rounded-full px-2 py-1">
          <span className={`text-xs font-bold ${isCelsius ? 'text-white' : 'text-gray-400'} cursor-pointer`} onClick={() => setIsCelsius(true)}>C</span>
          <span className="text-gray-500">|</span>
          <span className={`text-xs font-bold ${!isCelsius ? 'text-white' : 'text-gray-400'} cursor-pointer`} onClick={() => setIsCelsius(false)}>F</span>
        </div>
      </div>
      {/* Day, Date, Weather Icon */}
      <div className="flex items-center justify-between mt-2">
        <div>
          <div className="text-3xl font-bold">{location?.localtime ? new Date(location.localtime).toLocaleDateString('en-US', { weekday: 'long' }) : ''}</div>
          <div className="text-text-secondary text-sm mb-4">{location?.localtime ? new Date(location.localtime).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}</div>
          <div className="flex items-center gap-4">
            <span className="text-6xl font-bold">
              {isCelsius ? `${current.temp_c}°C` : `${current.temp_f}°F`}
            </span>
            <div className="flex flex-col text-xs text-text-secondary ml-10">
              <span>Feels Like: {isCelsius ? `${current.feelslike_c}°C` : `${current.feelslike_f}°F`}</span>
              <span>Humidity: {current.humidity}%</span>
            </div>
          </div>
        </div>
        {/* Weather Icon */}
        <div className="flex flex-col items-center">
          <img src={current.condition.icon} alt={current.condition.text} className="w-20 h-20" />
          <span className="text-lg font-semibold mt-2">{current.condition.text}</span>
          <span className="text-text-secondary text-xs">Wind: {current.wind_kph} km/h</span>
        </div>
      </div>
    </section>
  );
} 