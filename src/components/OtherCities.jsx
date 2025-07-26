import React, { useEffect, useState } from 'react';
import { getCurrentWeather } from '../api/weatherApi';

const cityList = [
  'New York',
  'London',
  'Tokyo',
  'Sydney',
];

export default function OtherCities() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all(cityList.map(city => getCurrentWeather(city).catch(() => null)))
      .then(results => {
        setCities(results.filter(Boolean));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch other cities weather');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="bg-card-bg rounded-3xl p-4 lg:p-8 shadow-dashboard font-dashboard text-text-primary w-full text-center">
        Loading other cities...
      </section>
    );
  }
  if (error) {
    return (
      <section className="bg-card-bg rounded-3xl p-4 lg:p-8 shadow-dashboard font-dashboard text-red-400 w-full text-center">
        {error}
      </section>
    );
  }

  return (
    <section className="bg-card-bg rounded-3xl p-4 lg:p-8 shadow-dashboard font-dashboard w-full">
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <h2 className="text-text-primary text-base lg:text-lg font-semibold">Other Cities</h2>
        <button className="bg-dashboard-bg text-text-secondary text-xs lg:text-sm px-3 lg:px-4 py-1 rounded-full opacity-70 cursor-pointer hover:opacity-100 transition">Show All</button>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:gap-5">
        {cities.map((city, idx) => (
          <div key={idx} className="bg-dashboard-bg rounded-2xl p-4 lg:p-6 flex flex-col justify-between min-h-[120px] lg:min-h-[140px] shadow-dashboard">
            <div className="flex items-center justify-between">
              <span className="text-text-primary text-2xl lg:text-3xl font-bold">{Math.round(city.current.temp_c)}°</span>
              <img src={city.current.condition.icon} alt={city.current.condition.text} className="w-10 h-10 lg:w-12 lg:h-12" />
            </div>
            <div className="flex items-center text-xs text-text-secondary mt-2 mb-1">
              H{Math.round(city.current.temp_c + 3)}°&nbsp;L{Math.round(city.current.temp_c - 3)}°
            </div>
            <div className="text-text-primary text-sm lg:text-base font-medium">{city.location.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
} 