import React from 'react';
import { Droplet, Sun, Wind, Cloud } from 'lucide-react';

export default function TodayHighlight({ weather, loading, error, className = '' }) {
  if (loading) {
    return (
      <section className={`bg-card-bg rounded-3xl p-8 shadow-dashboard font-dashboard text-text-primary flex flex-col w-full max-w-xl text-center ${className}`}>
        Loading highlights...
      </section>
    );
  }
  if (error || !weather) {
    return (
      <section className={`bg-card-bg rounded-3xl p-8 shadow-dashboard font-dashboard text-red-400 flex flex-col w-full max-w-xl text-center ${className}`}>
        {error || 'No weather data'}
      </section>
    );
  }

  const { current } = weather;

  const highlights = [
    {
      title: 'Chance of Rain',
      value: current.precip_mm ? `${current.precip_mm} mm` : '0 mm',
      icon: <Droplet size={24} className="text-blue-400" />,
    },
    {
      title: 'UV Index',
      value: current.uv ? `UV ${current.uv}` : 'N/A',
      icon: <Sun size={24} className="text-accent" />,
    },
    {
      title: 'Wind Status',
      value: current.wind_kph ? `${current.wind_kph} km/h` : 'N/A',
      icon: <Wind size={24} className="text-cyan-400" />,
    },
    {
      title: 'Humidity',
      value: current.humidity ? `${current.humidity}%` : 'N/A',
      icon: <Cloud size={24} className="text-text-secondary" />,
    },
  ];

  return (
    <section className={`bg-card-bg rounded-3xl p-8 shadow-dashboard font-dashboard flex flex-col w-full max-w-xl ${className}`}>
      <h2 className="text-text-primary text-lg font-semibold mb-4">Today Highlight</h2>
      <div className="grid grid-cols-2 gap-3">
        {highlights.map((item, idx) => (
          <div key={idx} className="bg-dashboard-bg rounded-2xl flex flex-col items-center justify-center p-4">
            {item.icon}
            <div className="text-text-primary text-lg font-bold mt-2">{item.value}</div>
            <div className="text-text-secondary text-xs mt-1">{item.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
} 