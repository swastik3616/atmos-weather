import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import ResetPassword from './ResetPassword';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import WeatherCard from './components/WeatherCard';
import TodayHighlight from './components/TodayHighlight';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from './firebaseconfig';
import './App.css';
import { getCurrentWeather, getForecast } from './api/weatherApi';
import Forecast from './components/Forecast';
import OtherCities from './components/OtherCities';
import { Menu, X, Plus, Play, Pause, RotateCcw, Globe, Timer, Clock, Calendar, Moon, Sun, Cloud, CloudRain, Search, LogOut } from 'lucide-react';

// Light mode palette
const LIGHT_BG = 'bg-[#f6f8fa]';
const LIGHT_CARD = 'bg-white';
const LIGHT_TEXT = 'text-[#232A3A]';
const LIGHT_DASHBOARD = 'bg-[#f0f1f3]';

function DashboardLayout({ isLoggedIn }) {
  // Restore persisted settings
  const getInitial = (key, fallback) => {
    try {
      const val = localStorage.getItem(key);
      if (val === null) return fallback;
      if (val === 'true') return true;
      if (val === 'false') return false;
      return val;
    } catch {
      return fallback;
    }
  };

  const [city, setCity] = useState('hyderabad');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Clock states
  const [clockMode, setClockMode] = useState('local'); // 'local', 'world', 'timer', 'stopwatch'
  const [worldClocks, setWorldClocks] = useState([
    { id: 1, name: 'New York', timezone: 'America/New_York' },
    { id: 2, name: 'London', timezone: 'Europe/London' },
    { id: 3, name: 'Tokyo', timezone: 'Asia/Tokyo' },
  ]);
  const [countdowns, setCountdowns] = useState([]);
  const [stopwatch, setStopwatch] = useState({ running: false, time: 0, laps: [] });

  // World Clock Search states
  const [showWorldClockSearch, setShowWorldClockSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Calendar states
  const [calendarMode, setCalendarMode] = useState('overview'); // 'overview', 'events', 'moon'
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Outdoor Meeting',
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: '10:00 AM',
      weatherDependent: true,
      weatherCondition: 'sunny',
      description: 'Team meeting in the park'
    },
    {
      id: 2,
      title: 'Rain Check',
      date: new Date(Date.now() + 172800000), // Day after tomorrow
      time: '2:00 PM',
      weatherDependent: true,
      weatherCondition: 'rainy',
      description: 'Indoor activity if it rains'
    }
  ]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date(),
    time: '12:00',
    weatherDependent: false,
    weatherCondition: 'sunny',
    description: ''
  });

  // Settings states (with persistence)
  const [unit, setUnit] = useState(() => getInitial('unit', 'celsius'));
  const [notifications, setNotifications] = useState(() => getInitial('notifications', true));
  const [theme, setTheme] = useState(() => getInitial('theme', 'dark'));
  const [user, setUser] = useState(null);

  // Persist settings
  useEffect(() => { localStorage.setItem('unit', unit); }, [unit]);
  useEffect(() => { localStorage.setItem('notifications', notifications); }, [notifications]);
  useEffect(() => { localStorage.setItem('theme', theme); }, [theme]);

  // Common timezone mappings
  const timezoneMap = {
    'new york': 'America/New_York',
    'london': 'Europe/London',
    'tokyo': 'Asia/Tokyo',
    'paris': 'Europe/Paris',
    'berlin': 'Europe/Berlin',
    'moscow': 'Europe/Moscow',
    'beijing': 'Asia/Shanghai',
    'shanghai': 'Asia/Shanghai',
    'sydney': 'Australia/Sydney',
    'melbourne': 'Australia/Melbourne',
    'toronto': 'America/Toronto',
    'vancouver': 'America/Vancouver',
    'chicago': 'America/Chicago',
    'los angeles': 'America/Los_Angeles',
    'miami': 'America/New_York',
    'dubai': 'Asia/Dubai',
    'singapore': 'Asia/Singapore',
    'hong kong': 'Asia/Hong_Kong',
    'seoul': 'Asia/Seoul',
    'mumbai': 'Asia/Kolkata',
    'delhi': 'Asia/Kolkata',
    'bangalore': 'Asia/Kolkata',
    'hyderabad': 'Asia/Kolkata',
    'madrid': 'Europe/Madrid',
    'rome': 'Europe/Rome',
    'amsterdam': 'Europe/Amsterdam',
    'stockholm': 'Europe/Stockholm',
    'oslo': 'Europe/Oslo',
    'copenhagen': 'Europe/Copenhagen',
    'helsinki': 'Europe/Helsinki',
    'warsaw': 'Europe/Warsaw',
    'prague': 'Europe/Prague',
    'budapest': 'Europe/Budapest',
    'vienna': 'Europe/Vienna',
    'zurich': 'Europe/Zurich',
    'brussels': 'Europe/Brussels',
    'dublin': 'Europe/Dublin',
    'edinburgh': 'Europe/London',
    'glasgow': 'Europe/London',
    'manchester': 'Europe/London',
    'birmingham': 'Europe/London',
    'leeds': 'Europe/London',
    'liverpool': 'Europe/London',
    'sheffield': 'Europe/London',
    'bristol': 'Europe/London',
    'cardiff': 'Europe/London',
    'belfast': 'Europe/London',
    'aberdeen': 'Europe/London',
    'dundee': 'Europe/London',
    'perth': 'Europe/London',
    'inverness': 'Europe/London',
    'glasgow': 'Europe/London',
    'edinburgh': 'Europe/London',
    'manchester': 'Europe/London',
    'birmingham': 'Europe/London',
    'leeds': 'Europe/London',
    'liverpool': 'Europe/London',
    'sheffield': 'Europe/London',
    'bristol': 'Europe/London',
    'cardiff': 'Europe/London',
    'belfast': 'Europe/London',
    'aberdeen': 'Europe/London',
    'dundee': 'Europe/London',
    'perth': 'Europe/London',
    'inverness': 'Europe/London',
  };

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

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Stopwatch timer
  useEffect(() => {
    let interval = null;
    if (stopwatch.running) {
      interval = setInterval(() => {
        setStopwatch(prev => ({ ...prev, time: prev.time + 10 }));
      }, 10);
    }
    return () => clearInterval(interval);
  }, [stopwatch.running]);

  // Auth state for account info
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Theme effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  // Clock functions
  const addWorldClock = () => {
    setShowWorldClockSearch(true);
    setSearchQuery('');
    setSearchResults([]);
  };

  const searchCities = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const results = Object.keys(timezoneMap)
        .filter(city => city.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 10)
        .map(city => ({
          name: city.charAt(0).toUpperCase() + city.slice(1),
          timezone: timezoneMap[city]
        }));
      
      setSearchResults(results);
      setSearchLoading(false);
    }, 500);
  };

  const addCityToClocks = (cityName, timezone) => {
    const newClock = {
      id: Date.now(),
      name: cityName,
      timezone: timezone
    };
    setWorldClocks([...worldClocks, newClock]);
    setShowWorldClockSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeWorldClock = (id) => {
    setWorldClocks(worldClocks.filter(clock => clock.id !== id));
  };

  const addCountdown = () => {
    const newCountdown = {
      id: Date.now(),
      name: 'New Countdown',
      targetTime: new Date(Date.now() + 3600000), // 1 hour from now
      running: false
    };
    setCountdowns([...countdowns, newCountdown]);
  };

  const removeCountdown = (id) => {
    setCountdowns(countdowns.filter(countdown => countdown.id !== id));
  };

  const toggleStopwatch = () => {
    setStopwatch(prev => ({ ...prev, running: !prev.running }));
  };

  const resetStopwatch = () => {
    setStopwatch({ running: false, time: 0, laps: [] });
  };

  const addLap = () => {
    setStopwatch(prev => ({ ...prev, laps: [...prev.laps, prev.time] }));
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  // Calendar functions
  const addEvent = () => {
    if (newEvent.title.trim()) {
      const event = {
        id: Date.now(),
        ...newEvent,
        date: new Date(newEvent.date)
      };
      setEvents([...events, event]);
      setNewEvent({
        title: '',
        date: new Date(),
        time: '12:00',
        weatherDependent: false,
        weatherCondition: 'sunny',
        description: ''
      });
      setShowAddEvent(false);
    }
  };

  const removeEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny': return <Sun size={16} className="text-yellow-400" />;
      case 'rainy': return <CloudRain size={16} className="text-blue-400" />;
      case 'cloudy': return <Cloud size={16} className="text-gray-400" />;
      default: return <Sun size={16} className="text-yellow-400" />;
    }
  };

  const getMoonPhase = () => {
    // Simple moon phase calculation (not 100% accurate but good for demo)
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Simple lunar phase calculation
    const phase = ((year * 12 + month) * 29.53 + day) % 29.53;
    
    if (phase < 3.69) return { name: 'New Moon', icon: '🌑' };
    if (phase < 7.38) return { name: 'Waxing Crescent', icon: '🌒' };
    if (phase < 11.07) return { name: 'First Quarter', icon: '🌓' };
    if (phase < 14.76) return { name: 'Waxing Gibbous', icon: '🌔' };
    if (phase < 18.45) return { name: 'Full Moon', icon: '🌕' };
    if (phase < 22.14) return { name: 'Waning Gibbous', icon: '🌖' };
    if (phase < 25.83) return { name: 'Last Quarter', icon: '🌗' };
    if (phase < 29.53) return { name: 'Waning Crescent', icon: '🌘' };
    return { name: 'New Moon', icon: '🌑' };
  };

  // Settings handlers
  const handleUnitToggle = () => setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius');
  const handleNotificationsToggle = () => setNotifications((n) => !n);
  const handleThemeToggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const handleLogout = () => {
    const auth = getAuth(app);
    signOut(auth);
  };

  // TopBar handlers
  const handleSettings = () => setCurrentPage('settings');

  // Only show dashboard if not logged in
  const renderPageContent = () => {
    if (!isLoggedIn && currentPage !== 'dashboard') {
      setCurrentPage('dashboard');
      return null;
    }
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className={`grid grid-cols-1 lg:grid-cols-5 gap-4 mt-4 w-full`}>
            <div className="lg:col-span-3">
              <WeatherCard weather={weather} loading={loading} error={error} unit={unit} />
            </div>
            <div className="lg:col-span-2">
              <TodayHighlight weather={weather} loading={loading} error={error} unit={unit} />
            </div>
            <div className="lg:col-span-3">
              <Forecast forecast={forecast} loading={loading} error={error} unit={unit} />
            </div>
            <div className="lg:col-span-2">
              <OtherCities unit={unit} />
            </div>
          </div>
        );
      case 'clock':
        return (
          <div className="bg-card-bg rounded-3xl p-4 lg:p-8 shadow-dashboard font-dashboard text-text-primary w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-text-primary text-base lg:text-lg font-semibold">Clock</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setClockMode('local')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    clockMode === 'local' ? 'bg-violet-600 text-white' : 'bg-dashboard-bg text-text-secondary'
                  }`}
                >
                  Local
                </button>
                <button 
                  onClick={() => setClockMode('world')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    clockMode === 'world' ? 'bg-violet-600 text-white' : 'bg-dashboard-bg text-text-secondary'
                  }`}
                >
                  World
                </button>
                <button 
                  onClick={() => setClockMode('timer')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    clockMode === 'timer' ? 'bg-violet-600 text-white' : 'bg-dashboard-bg text-text-secondary'
                  }`}
                >
                  Timer
                </button>
                <button 
                  onClick={() => setClockMode('stopwatch')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    clockMode === 'stopwatch' ? 'bg-violet-600 text-white' : 'bg-dashboard-bg text-text-secondary'
                  }`}
                >
                  Stopwatch
                </button>
              </div>
            </div>

            {clockMode === 'local' && (
              <div className="text-center">
                <div className="text-4xl lg:text-6xl font-bold text-text-primary mb-4">
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="text-text-secondary text-lg">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="mt-8 bg-dashboard-bg rounded-2xl p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-text-secondary text-sm">Hours</div>
                      <div className="text-text-primary text-2xl font-bold">{currentTime.getHours().toString().padStart(2, '0')}</div>
                    </div>
                    <div>
                      <div className="text-text-secondary text-sm">Minutes</div>
                      <div className="text-text-primary text-2xl font-bold">{currentTime.getMinutes().toString().padStart(2, '0')}</div>
                    </div>
                    <div>
                      <div className="text-text-secondary text-sm">Seconds</div>
                      <div className="text-text-primary text-2xl font-bold">{currentTime.getSeconds().toString().padStart(2, '0')}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {clockMode === 'world' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-text-primary font-semibold">World Clocks</h3>
                  <button 
                    onClick={addWorldClock}
                    className="bg-violet-600 text-white p-2 rounded-full hover:bg-violet-700 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {worldClocks.map((clock) => (
                    <div key={clock.id} className="bg-dashboard-bg rounded-2xl p-4 relative">
                      <button 
                        onClick={() => removeWorldClock(clock.id)}
                        className="absolute top-2 right-2 text-text-secondary hover:text-red-400 transition-colors"
                      >
                        <X size={16} />
                      </button>
                      <div className="text-center">
                        <div className="text-text-secondary text-sm mb-2">{clock.name}</div>
                        <div className="text-text-primary text-2xl font-bold">
                          {new Date().toLocaleTimeString('en-US', { 
                            timeZone: clock.timezone,
                            hour12: false 
                          })}
                        </div>
                        <div className="text-text-secondary text-xs mt-1">
                          {new Date().toLocaleDateString('en-US', { 
                            timeZone: clock.timezone,
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* World Clock Search Modal */}
                {showWorldClockSearch && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-card-bg rounded-3xl p-6 w-full max-w-md">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-text-primary font-semibold">Add World Clock</h3>
                        <button 
                          onClick={() => setShowWorldClockSearch(false)}
                          className="text-text-secondary hover:text-white transition-colors"
                        >
                          <X size={24} />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
                          <input
                            type="text"
                            placeholder="Search for a city..."
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              searchCities(e.target.value);
                            }}
                            className="w-full bg-dashboard-bg text-text-primary px-10 py-3 rounded-lg outline-none"
                            autoFocus
                          />
                        </div>
                        
                        {searchLoading && (
                          <div className="text-center text-text-secondary">
                            Searching...
                          </div>
                        )}
                        
                        {searchResults.length > 0 && (
                          <div className="max-h-60 overflow-y-auto space-y-2">
                            {searchResults.map((result, index) => (
                              <button
                                key={index}
                                onClick={() => addCityToClocks(result.name, result.timezone)}
                                className="w-full bg-dashboard-bg text-left p-3 rounded-lg hover:bg-gray-700 transition-colors"
                              >
                                <div className="text-text-primary font-medium">{result.name}</div>
                                <div className="text-text-secondary text-sm">
                                  {new Date().toLocaleTimeString('en-US', { 
                                    timeZone: result.timezone,
                                    hour12: false 
                                  })} - {result.timezone}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {searchQuery.length > 0 && searchResults.length === 0 && !searchLoading && (
                          <div className="text-center text-text-secondary">
                            No cities found. Try a different search term.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {clockMode === 'timer' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-text-primary font-semibold">Countdown Timers</h3>
                  <button 
                    onClick={addCountdown}
                    className="bg-violet-600 text-white p-2 rounded-full hover:bg-violet-700 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {countdowns.map((countdown) => (
                    <div key={countdown.id} className="bg-dashboard-bg rounded-2xl p-4 relative">
                      <button 
                        onClick={() => removeCountdown(countdown.id)}
                        className="absolute top-2 right-2 text-text-secondary hover:text-red-400 transition-colors"
                      >
                        <X size={16} />
                      </button>
                      <div className="text-center">
                        <div className="text-text-secondary text-sm mb-2">{countdown.name}</div>
                        <div className="text-text-primary text-2xl font-bold">
                          {Math.max(0, Math.floor((countdown.targetTime - currentTime) / 1000))}s
                        </div>
                        <button className="mt-2 bg-violet-600 text-white px-4 py-1 rounded-full text-sm hover:bg-violet-700 transition-colors">
                          {countdown.running ? 'Pause' : 'Start'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {clockMode === 'stopwatch' && (
              <div className="text-center space-y-6">
                <div className="text-6xl lg:text-8xl font-bold text-text-primary font-mono">
                  {formatTime(stopwatch.time)}
                </div>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={toggleStopwatch}
                    className="bg-violet-600 text-white px-6 py-3 rounded-full hover:bg-violet-700 transition-colors flex items-center gap-2"
                  >
                    {stopwatch.running ? <Pause size={20} /> : <Play size={20} />}
                    {stopwatch.running ? 'Pause' : 'Start'}
                  </button>
                  <button 
                    onClick={resetStopwatch}
                    className="bg-dashboard-bg text-text-primary px-6 py-3 rounded-full hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <RotateCcw size={20} />
                    Reset
                  </button>
                  <button 
                    onClick={addLap}
                    className="bg-dashboard-bg text-text-primary px-6 py-3 rounded-full hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Clock size={20} />
                    Lap
                  </button>
                </div>
                {stopwatch.laps.length > 0 && (
                  <div className="bg-dashboard-bg rounded-2xl p-4">
                    <h4 className="text-text-primary font-semibold mb-3">Laps</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {stopwatch.laps.map((lap, index) => (
                        <div key={index} className="flex justify-between text-text-secondary">
                          <span>Lap {index + 1}</span>
                          <span className="font-mono">{formatTime(lap)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case 'location':
        return (
          <div className="bg-card-bg rounded-3xl p-4 lg:p-8 shadow-dashboard font-dashboard text-text-primary w-full">
            <h2 className="text-text-primary text-base lg:text-lg font-semibold mb-4 lg:mb-6">Location</h2>
            <div className="space-y-4">
              <div className="bg-dashboard-bg rounded-2xl p-4">
                <h3 className="text-text-primary font-semibold mb-2">Current Location</h3>
                <p className="text-text-secondary">{city}</p>
              </div>
              <div className="bg-dashboard-bg rounded-2xl p-4">
                <h3 className="text-text-primary font-semibold mb-2">Weather Details</h3>
                {weather && (
                  <div className="text-text-secondary">
                    <p>Country: {weather.location.country}</p>
                    <p>Region: {weather.location.region}</p>
                    <p>Latitude: {weather.location.lat}</p>
                    <p>Longitude: {weather.location.lon}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="bg-card-bg rounded-3xl p-4 lg:p-8 shadow-dashboard font-dashboard text-text-primary w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-text-primary text-base lg:text-lg font-semibold">Calendar</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCalendarMode('overview')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    calendarMode === 'overview' ? 'bg-violet-600 text-white' : 'bg-dashboard-bg text-text-secondary'
                  }`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setCalendarMode('events')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    calendarMode === 'events' ? 'bg-violet-600 text-white' : 'bg-dashboard-bg text-text-secondary'
                  }`}
                >
                  Events
                </button>
                <button 
                  onClick={() => setCalendarMode('moon')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    calendarMode === 'moon' ? 'bg-violet-600 text-white' : 'bg-dashboard-bg text-text-secondary'
                  }`}
                >
                  Moon
                </button>
              </div>
            </div>

            {calendarMode === 'overview' && (
              <div className="text-center">
                <div className="text-2xl lg:text-4xl font-bold text-text-primary mb-4">
                  {currentTime.getDate()}
                </div>
                <div className="text-text-secondary text-lg mb-4">
                  {currentTime.toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </div>
                <div className="bg-dashboard-bg rounded-2xl p-4">
                  <p className="text-text-secondary">Calendar functionality coming soon...</p>
                </div>
              </div>
            )}

            {calendarMode === 'events' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-text-primary font-semibold">Weather-Dependent Events</h3>
                  <button 
                    onClick={() => setShowAddEvent(true)}
                    className="bg-violet-600 text-white p-2 rounded-full hover:bg-violet-700 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                {showAddEvent && (
                  <div className="bg-dashboard-bg rounded-2xl p-4 space-y-4">
                    <h4 className="text-text-primary font-semibold">Add New Event</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Event Title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                        className="bg-card-bg text-text-primary px-3 py-2 rounded-lg outline-none"
                      />
                      <input
                        type="date"
                        value={newEvent.date.toISOString().split('T')[0]}
                        onChange={(e) => setNewEvent({...newEvent, date: new Date(e.target.value)})}
                        className="bg-card-bg text-text-primary px-3 py-2 rounded-lg outline-none"
                      />
                      <input
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                        className="bg-card-bg text-text-primary px-3 py-2 rounded-lg outline-none"
                      />
                      <select
                        value={newEvent.weatherCondition}
                        onChange={(e) => setNewEvent({...newEvent, weatherCondition: e.target.value})}
                        className="bg-card-bg text-text-primary px-3 py-2 rounded-lg outline-none"
                      >
                        <option value="sunny">Sunny</option>
                        <option value="rainy">Rainy</option>
                        <option value="cloudy">Cloudy</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Event Description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                      className="bg-card-bg text-text-primary px-3 py-2 rounded-lg outline-none w-full h-20"
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={addEvent}
                        className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
                      >
                        Add Event
                      </button>
                      <button 
                        onClick={() => setShowAddEvent(false)}
                        className="bg-dashboard-bg text-text-primary px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={event.id} className="bg-dashboard-bg rounded-2xl p-4 relative">
                      <button 
                        onClick={() => removeEvent(event.id)}
                        className="absolute top-2 right-2 text-text-secondary hover:text-red-400 transition-colors"
                      >
                        <X size={16} />
                      </button>
                      <div className="flex items-center gap-3">
                        {getWeatherIcon(event.weatherCondition)}
                        <div className="flex-1">
                          <div className="text-text-primary font-semibold">{event.title}</div>
                          <div className="text-text-secondary text-sm">
                            {event.date.toLocaleDateString()} at {event.time}
                          </div>
                          {event.description && (
                            <div className="text-text-secondary text-sm mt-1">{event.description}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {calendarMode === 'moon' && (
              <div className="text-center space-y-6">
                <div className="text-6xl lg:text-8xl mb-4">
                  {getMoonPhase().icon}
                </div>
                <div className="text-text-primary text-xl font-semibold">
                  {getMoonPhase().name}
                </div>
                <div className="bg-dashboard-bg rounded-2xl p-4">
                  <h4 className="text-text-primary font-semibold mb-3">Moon Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-text-secondary">Phase</div>
                      <div className="text-text-primary">{getMoonPhase().name}</div>
                    </div>
                    <div>
                      <div className="text-text-secondary">Visibility</div>
                      <div className="text-text-primary">Good</div>
                    </div>
                    <div>
                      <div className="text-text-secondary">Rise Time</div>
                      <div className="text-text-primary">6:30 PM</div>
                    </div>
                    <div>
                      <div className="text-text-secondary">Set Time</div>
                      <div className="text-text-primary">7:45 AM</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'settings':
        return (
          <div className={`${theme === 'dark' ? 'bg-card-bg dark:bg-[#232A3A] text-white' : LIGHT_CARD + ' ' + LIGHT_TEXT} rounded-3xl p-4 lg:p-8 shadow-dashboard font-dashboard w-full max-w-2xl mx-auto`}>
            <h2 className={`text-base lg:text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : LIGHT_TEXT}`}>Settings</h2>
            <div className="space-y-6">
              {/* Units Toggle */}
              <div className={`${theme === 'dark' ? 'bg-dashboard-bg dark:bg-[#232A3A]' : LIGHT_DASHBOARD} flex items-center justify-between rounded-2xl p-4`}>
                <span className={`font-medium ${theme === 'dark' ? 'text-white' : LIGHT_TEXT}`}>Units</span>
                <button
                  onClick={() => setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius')}
                  className="px-4 py-2 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors"
                >
                  {unit === 'celsius' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
                </button>
              </div>
              {/* Notifications Toggle */}
              <div className={`${theme === 'dark' ? 'bg-dashboard-bg dark:bg-[#232A3A]' : LIGHT_DASHBOARD} flex items-center justify-between rounded-2xl p-4`}>
                <span className={`font-medium ${theme === 'dark' ? 'text-white' : LIGHT_TEXT}`}>Notifications</span>
                <button
                  onClick={() => setNotifications((n) => !n)}
                  className={`w-16 h-9 flex items-center rounded-full p-1 transition-colors ${notifications ? 'bg-violet-600' : 'bg-gray-400'}`}
                >
                  <span
                    className={`w-7 h-7 bg-white rounded-full shadow transform transition-transform ${notifications ? 'translate-x-7' : ''}`}
                  />
                </button>
              </div>
              {/* Theme Toggle */}
              <div className={`${theme === 'dark' ? 'bg-dashboard-bg dark:bg-[#232A3A]' : LIGHT_DASHBOARD} flex items-center justify-between rounded-2xl p-4`}>
                <span className={`font-medium ${theme === 'dark' ? 'text-white' : LIGHT_TEXT}`}>Theme</span>
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="px-4 py-2 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors"
                >
                  {theme === 'dark' ? 'Dark' : 'Light'}
                </button>
              </div>
              {/* Account Info */}
              <div className={`${theme === 'dark' ? 'bg-dashboard-bg dark:bg-[#232A3A]' : LIGHT_DASHBOARD} rounded-2xl p-4 flex items-center justify-between`}>
                {user ? (
                  <>
                    <div>
                      <div className={`font-medium ${theme === 'dark' ? 'text-white' : LIGHT_TEXT}`}>Account</div>
                      <div className="text-text-secondary text-xs">{user.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        const auth = getAuth(app);
                        signOut(auth);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                ) : (
                  <div className="text-text-secondary text-sm">Not logged in</div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Apply theme classes to root div
  return (
    <div className={`flex min-h-screen mobile-safe-area transition-colors duration-300 ${theme === 'dark' ? 'bg-[#151A23]' : LIGHT_BG}`}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden mobile-tap-highlight"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div className={`fixed lg:relative z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300 ease-in-out`}>
        <Sidebar 
          onClose={() => setSidebarOpen(false)} 
          currentPage={currentPage}
          onNavigation={page => setCurrentPage(page)}
          isLoggedIn={isLoggedIn}
        />
      </div>
      <main className="flex-1 p-4 lg:p-8 w-full overflow-x-hidden">
        <TopBar 
          city={city} 
          setCity={setCity} 
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
          onSettings={handleSettings}
          onLogout={handleLogout}
          isLoggedIn={isLoggedIn}
        />
        {renderPageContent()}
      </main>
    </div>
  );
}

function AppRoutes({ isLoggedIn }) {
  return (
    <Routes>
      <Route path="/*" element={<DashboardLayout isLoggedIn={isLoggedIn} />} />
      <Route path="/" element={<DashboardLayout isLoggedIn={isLoggedIn} />} />
      {!isLoggedIn && <Route path="/login" element={<Login />} />}
      {!isLoggedIn && <Route path="/signup" element={<Signup />} />}
      {!isLoggedIn && <Route path="/reset-password" element={<ResetPassword />} />}
      {!isLoggedIn && <Route path="*" element={<Navigate to="/" replace />} />}
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
