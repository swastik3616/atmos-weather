import React from 'react';

export default function Forecast({ forecast, loading, error }) {
  if (loading) {
    return (
      <section className="bg-card-bg rounded-3xl p-8 shadow-dashboard font-dashboard text-text-primary w-full max-w-3xl text-center min-h-[340px]">
        Loading forecast...
      </section>
    );
  }
  if (error || !forecast) {
    return (
      <section className="bg-card-bg rounded-3xl p-8 shadow-dashboard font-dashboard text-red-400 w-full max-w-3xl text-center min-h-[340px]">
        {error || 'No forecast data'}
      </section>
    );
  }

  const today = forecast.forecast.forecastday[0];
  const tomorrow = forecast.forecast.forecastday[1];
  // Get current local hour for the city
  const localTime = forecast.location.localtime; // e.g., '2025-07-26 13:00'
  const currentHour = Number(localTime.split(' ')[1].split(':')[0]);
  // Show the next 7 hours from current hour
  const hours = today.hour.slice(currentHour, currentHour + 5);
  const sunrise = today.astro.sunrise;
  const sunset = today.astro.sunset;
  // Calculate length of day in hours and minutes
  const [sunriseHour, sunriseMin] = sunrise.split(' ')[0].split(':').map(Number);
  const [sunsetHour, sunsetMin] = sunset.split(' ')[0].split(':').map(Number);
  const sunrisePM = sunrise.includes('PM');
  const sunsetPM = sunset.includes('PM');
  let start = sunriseHour + (sunrisePM && sunriseHour !== 12 ? 12 : 0) + sunriseMin / 60;
  let end = sunsetHour + (sunsetPM && sunsetHour !== 12 ? 12 : 0) + sunsetMin / 60;
  let length = end - start;
  const lengthHours = Math.floor(length);
  const lengthMins = Math.round((length - lengthHours) * 60);

  return (
    <section className="bg-card-bg rounded-3xl p-8 shadow-dashboard font-dashboard w-full max-w-3xl min-h-[340px]">
      <h2 className="text-text-primary text-lg font-semibold mb-6">Today / Week</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Left: Hourly and Tomorrow */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Hourly Forecast Row */}
          <div className="flex gap-4 bg-dashboard-bg rounded-2xl p-4 mb-2 overflow-x-auto">
            {hours.map((h, idx) => (
              <div key={idx} className="flex flex-col items-center bg-card-bg rounded-xl px-4 py-2 shadow-dashboard min-w-[70px]">
                <span className="text-xs text-text-secondary mb-1">{new Date(h.time).getHours()} {new Date(h.time).getHours() < 12 ? 'AM' : 'PM'}</span>
                <img src={h.condition.icon} alt={h.condition.text} className="w-8 h-8" />
                <span className="text-base text-text-primary mt-1 font-semibold">{Math.round(h.temp_c)}°</span>
              </div>
            ))}
          </div>
          {/* Tomorrow Card */}
          {tomorrow && (
            <div className="flex items-center bg-gradient-to-r from-dashboard-bg to-card-bg rounded-2xl p-4 mt-2 shadow-dashboard">
              <div className="flex-1">
                <div className="text-text-secondary text-xs">Tomorrow</div>
                <div className="text-text-primary text-2xl font-bold">{Math.round(tomorrow.day.avgtemp_c)}°</div>
                <div className="text-text-secondary text-xs">{tomorrow.day.condition.text}</div>
              </div>
              <img src={tomorrow.day.condition.icon} alt={tomorrow.day.condition.text} className="w-12 h-12" />
            </div>
          )}
        </div>
        {/* Right: Sunrise/Sunset/Length of Day */}
        <div className="bg-dashboard-bg rounded-2xl p-6 flex flex-col justify-center items-center min-h-[260px] w-full">
          <div className="text-text-secondary text-base mb-2">Sunrise</div>
          <div className="text-text-primary text-3xl font-bold mb-4">{sunrise} <span className="text-base font-normal text-text-secondary">AM</span></div>
          <div className="text-text-secondary text-base mb-2">Sunset</div>
          <div className="text-text-primary text-3xl font-bold mb-4">{sunset} <span className="text-base font-normal text-text-secondary">PM</span></div>
          <div className="text-text-secondary text-base mb-2">Length of day</div>
          <div className="text-text-primary text-2xl font-bold">{lengthHours}h {lengthMins}m</div>
        </div>
      </div>
    </section>
  );
} 