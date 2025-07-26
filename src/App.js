import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import ResetPassword from './ResetPassword';
import Chat from './Chat';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import WeatherCard from './components/WeatherCard';
import TodayHighlight from './components/TodayHighlight';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebaseconfig';
import './App.css';
import { getCurrentWeather, getForecast } from './api/weatherApi';
import Forecast from './components/Forecast';
import OtherCities from './components/OtherCities';

function DashboardLayout() {
  const [city, setCity] = useState('hyderabad');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getCurrentWeather(city),
      getForecast(city, 2)
    ])
      .then(([weatherData, forecastData]) => {
        setWeather(weatherData);
        setForecast(forecastData);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch weather data');
        setLoading(false);
      });
  }, [city]);

  return (
    <div className="flex min-h-screen bg-[#151A23]">
      <Sidebar />
      <main className="flex-1 p-8">
        <TopBar city={city} setCity={setCity} />
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 mt-4 w-full">
          {/* First row: WeatherCard | TodayHighlight */}
          <div className="xl:col-span-3">
            <WeatherCard weather={weather} loading={loading} error={error} />
          </div>
          <div className="xl:col-span-2">
            <TodayHighlight weather={weather} loading={loading} error={error} />
          </div>
          {/* Second row: Forecast | OtherCities */}
          <div className="xl:col-span-3">
            <Forecast forecast={forecast} loading={loading} error={error} />
          </div>
          <div className="xl:col-span-2">
            <OtherCities />
          </div>
        </div>
      </main>
    </div>
  );
}

function AppRoutes({ isLoggedIn }) {
  if (isLoggedIn) {
    return <DashboardLayout />;
  }
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <AppRoutes isLoggedIn={isLoggedIn} />
    </Router>
  );
}

export default App;
