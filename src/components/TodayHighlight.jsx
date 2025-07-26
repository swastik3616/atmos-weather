import React from 'react';
import { Droplet, Sun, Wind, Cloud } from 'lucide-react';

export default function TodayHighlight({ weather, loading, error, className = '' }) {
  if (loading) {
    return (
      <section className={`bg-card-bg rounded-3xl p-4 lg:p-8 shadow-dashboard font-dashboard text-text-primary flex flex-col w-full text-center ${className}`}>
        Loading highlights...
      </section>
    );
  }
  if (error || !weather) {
    return (
      <section className={`bg-card-bg rounded-3xl p-4 lg:p-8 shadow-dashboard font-dashboard text-red-400 flex flex-col w-full text-center ${className}`}>
        {error || 'No weather data'}
      </section>
    );
  }

  const { current } = weather;

  const highlights = [
    {
      title: 'Chance of Rain',
      value: current.precip_mm ? `${current.precip_mm} mm` : '0 mm',
      icon: <Droplet size={20} className="text-blue-400 lg:w-6 lg:h-6" />,
    },
    {
      title: 'UV Index',
      value: current.uv ? `UV ${current.uv}` : 'N/A',
      icon: <Sun size={20} className="text-accent lg:w-6 lg:h-6" />,
    },
    {
      title: 'Wind Status',
      value: current.wind_kph ? `${current.wind_kph} km/h` : 'N/A',
      icon: <Wind size={20} className="text-cyan-400 lg:w-6 lg:h-6" />,
    },
    {
      title: 'Humidity',
      value: current.humidity ? `${current.humidity}%` : 'N/A',
      icon: <Cloud size={20} className="text-text-secondary lg:w-6 lg:h-6" />,
    },
  ];

  return (
    <section className={`bg-card-bg rounded-3xl p-4 lg:p-8 shadow-dashboard font-dashboard flex flex-col w-full ${className}`}>
      <h2 className="text-text-primary text-base lg:text-lg font-semibold mb-3 lg:mb-4">Today Highlight</h2>
      <div className="grid grid-cols-2 gap-2 lg:gap-3">
        {highlights.map((item, idx) => (
          <div key={idx} className="bg-dashboard-bg rounded-2xl flex flex-col items-center justify-center p-3 lg:p-4">
            {item.icon}
            <div className="text-text-primary text-sm lg:text-lg font-bold mt-1 lg:mt-2">{item.value}</div>
            <div className="text-text-secondary text-xs mt-1 text-center">{item.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
} 