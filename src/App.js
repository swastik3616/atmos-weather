import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import ResetPassword from './ResetPassword';
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
import { Menu, X } from 'lucide-react';

function DashboardLayout() {
  const [city, setCity] = useState('hyderabad');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="flex min-h-screen bg-[#151A23] mobile-safe-area">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden mobile-tap-highlight"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:relative z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300 ease-in-out`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      <main className="flex-1 p-4 lg:p-8 w-full overflow-x-hidden">
        <TopBar 
          city={city} 
          setCity={setCity} 
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-4 w-full">
          {/* First row: WeatherCard | TodayHighlight */}
          <div className="lg:col-span-3">
            <WeatherCard weather={weather} loading={loading} error={error} />
          </div>
          <div className="lg:col-span-2">
            <TodayHighlight weather={weather} loading={loading} error={error} />
          </div>
          {/* Second row: Forecast | OtherCities */}
          <div className="lg:col-span-3">
            <Forecast forecast={forecast} loading={loading} error={error} />
          </div>
          <div className="lg:col-span-2">
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
