import React from 'react';
import { MapPin, Globe, Building, Home } from 'lucide-react';

export default function LocationInfo({ location, weather }) {
  if (!location || !weather) return null;

  const getLocationType = () => {
    // Determine if this is a district/village based on location data
    if (location.region && location.region !== location.name) {
      return {
        type: 'District/Village',
        icon: <Home className="w-5 h-5 text-blue-400" />,
        description: `${location.name} is a district/village in ${location.region}, ${location.country}`
      };
    }
    return {
      type: 'City',
      icon: <Building className="w-5 h-5 text-green-400" />,
      description: `${location.name} is a city in ${location.country}`
    };
  };

  const locationType = getLocationType();

  return (
    <div className="bg-card-bg rounded-3xl p-4 lg:p-6 shadow-dashboard">
      <div className="flex items-center gap-3 mb-4">
        {locationType.icon}
        <div>
          <h3 className="text-text-primary text-lg lg:text-xl font-semibold">
            {location.name}
          </h3>
          <p className="text-text-secondary text-sm">
            {locationType.type}
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-text-secondary text-sm">
          <MapPin className="w-4 h-4" />
          <span>
            {location.region && location.region !== location.name && `${location.region}, `}
            {location.country}
          </span>
        </div>
        
        {location.lat && location.lon && (
          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <Globe className="w-4 h-4" />
            <span>
              {location.lat.toFixed(4)}°N, {location.lon.toFixed(4)}°E
            </span>
          </div>
        )}
        
        <div className="text-text-primary text-sm leading-relaxed">
          {locationType.description}
        </div>
        
        {weather.current && (
          <div className="pt-3 border-t border-dashboard-bg">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">Current Weather</span>
              <span className="text-text-primary text-lg font-semibold">
                {Math.round(weather.current.temp_c)}°C
              </span>
            </div>
            <div className="text-text-secondary text-sm mt-1">
              {weather.current.condition.text}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
