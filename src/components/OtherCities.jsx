import React, { useEffect, useState } from 'react';
import { getCurrentWeather } from '../api/weatherApi';
import { MapPin, Globe, Building, Home } from 'lucide-react';

// Enhanced city list with districts and villages
const locationList = [
  'New York',
  'London',
  'Tokyo',
  'Sydney',
  'Mumbai, Maharashtra', // District example
  'Bangalore, Karnataka', // District example
  'Chennai, Tamil Nadu', // District example
];

export default function OtherCities({ unit }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all(locationList.map(location => getCurrentWeather(location).catch(() => null)))
      .then(results => {
        setLocations(results.filter(Boolean));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch other locations weather');
        setLoading(false);
      });
  }, []);

  const getLocationTypeIcon = (location) => {
    // Determine if this is a district/village based on location data
    if (location.location.region && location.location.region !== location.location.name) {
      return <Home className="w-4 h-4 text-blue-400" />;
    }
    return <Building className="w-4 h-4 text-green-400" />;
  };

  const getLocationTypeText = (location) => {
    if (location.location.region && location.location.region !== location.location.name) {
      return 'District/Village';
    }
    return 'City';
  };

  const getLocationDisplayName = (location) => {
    if (location.location.region && location.location.region !== location.location.name) {
      return `${location.location.name}, ${location.location.region}`;
    }
    return location.location.name;
  };

  if (loading) {
    return (
      <section className="bg-card-bg rounded-3xl p-4 lg:p-8 shadow-dashboard font-dashboard text-text-primary w-full text-center">
        Loading other locations...
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
        <h2 className="text-text-primary text-base lg:text-lg font-semibold">Other Locations</h2>
        <button className="bg-dashboard-bg text-text-secondary text-xs lg:text-sm px-3 lg:px-4 py-1 rounded-full opacity-70 cursor-pointer hover:opacity-100 transition">Show All</button>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:gap-5">
        {locations.map((location, idx) => (
          <div key={idx} className="bg-dashboard-bg rounded-2xl p-4 lg:p-6 flex flex-col justify-between min-h-[120px] lg:min-h-[140px] shadow-dashboard">
            <div className="flex items-center justify-between">
              <span className="text-text-primary text-2xl lg:text-3xl font-bold">
                {unit === 'celsius' ? Math.round(location.current.temp_c) + '°C' : Math.round(location.current.temp_f) + '°F'}
              </span>
              <img src={location.current.condition.icon} alt={location.current.condition.text} className="w-10 h-10 lg:w-12 lg:h-12" />
            </div>
            <div className="flex items-center text-xs text-text-secondary mt-2 mb-1">
              H{unit === 'celsius' ? Math.round(location.current.temp_c + 3) + '°C' : Math.round(location.current.temp_f + 5) + '°F'}&nbsp;L{unit === 'celsius' ? Math.round(location.current.temp_c - 3) + '°C' : Math.round(location.current.temp_f - 5) + '°F'}
            </div>
            <div className="text-text-primary text-sm lg:text-base font-medium">
              {getLocationDisplayName(location)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              {getLocationTypeIcon(location)}
              <span className="text-text-secondary text-xs">
                {getLocationTypeText(location)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 