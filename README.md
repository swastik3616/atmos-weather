# Atmos Weather Dashboard

A modern, responsive weather dashboard built with React, Tailwind CSS, and WeatherAPI. Inspired by Figma community designs, this app features a beautiful UI, real-time weather data, smart notifications, and a clean, professional layout.

## Features

### 🌤️ Weather Features
- **Live Weather Data:** Powered by [WeatherAPI](https://www.weatherapi.com/)
- **City Search:** Instantly view weather for any city
- **Current Weather Card:** Prominent, bold display of temperature, conditions, and details
- **Today Highlight:** Key metrics (rain, UV, wind, humidity) in a 2x2 grid
- **Today/Week Forecast:** Hourly forecast row, tomorrow's weather, sunrise/sunset/length of day
- **Other Cities:** 2x2 grid of world cities with live weather

### 🔔 Smart Notifications
- **Welcome Popup:** Personalized welcome message when users login
- **Weather Alerts:** Automatic notifications for extreme weather conditions
- **Smart Notifications:** Success, error, warning, and info notifications
- **Settings Feedback:** Confirmations for theme, unit, and notification changes
- **Test Notifications:** Try all notification types in the settings

### 🎨 UI/UX Features
- **Modern UI:** Responsive, dark mode, glassmorphism, and Figma-inspired design
- **Authentication:** Google and email/password login with Firebase
- **Settings Panel:** Customize units, theme, and notifications
- **Clock & Calendar:** World clocks, timers, stopwatch, and weather-dependent events
- **Mobile Optimized:** Touch-friendly interface with mobile-specific enhancements

### 🌍 Additional Features
- **World Clocks:** Add and manage multiple timezone clocks
- **Timer & Stopwatch:** Built-in time tracking tools
- **Calendar Events:** Weather-dependent event planning
- **Moon Phase:** Current moon phase information
- **Responsive Design:** Works perfectly on desktop, tablet, and mobile

## Tech Stack
- **Frontend:** React, Tailwind CSS (with custom design tokens)
- **Backend:** Firebase Authentication
- **Weather API:** WeatherAPI (for weather data)
- **Icons:** Lucide React
- **Animations:** Custom CSS animations and transitions
- **State Management:** React Context for notifications

## Getting Started

1. **Clone the repo:**
   ```bash
   git clone <your-repo-url>
   cd atmos-weather/atmos-weather
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Google and Email/Password)
   - Add your Firebase config in `src/firebaseconfig.js`

4. **Set up WeatherAPI:**
   - Get a free API key from [WeatherAPI](https://www.weatherapi.com/)
   - Add your API key in `src/api/weatherApi.js`:
     ```js
     const API_KEY = 'YOUR_API_KEY_HERE';
     ```

5. **Start the app:**
   ```bash
   npm start
   ```

6. **Open in browser:**
   - Visit [http://localhost:3000](http://localhost:3000)

## Features in Detail

### 🔔 Notification System
The app includes a comprehensive notification system with four types:
- **Success** (Green): For successful actions like login, settings changes
- **Error** (Red): For errors like failed login, API errors
- **Warning** (Yellow): For important warnings like extreme weather
- **Info** (Blue): For general information like city changes

### 👋 Welcome Popup
- Personalized welcome message with user's name
- Beautiful animated weather icons
- Auto-dismiss after 5 seconds
- Manual close option

### 🌤️ Weather Alerts
- **Temperature Alerts:** High (>35°C) and low (<0°C) temperature warnings
- **Weather Condition Alerts:** Storm, rain, and sunny day notifications
- **Real-time Updates:** Automatic alerts when weather data changes

### ⚙️ Settings & Customization
- **Units:** Toggle between Celsius and Fahrenheit
- **Theme:** Switch between dark and light modes
- **Notifications:** Enable/disable notification system
- **Test Notifications:** Try all notification types

### 🕐 Clock & Calendar Features
- **Local Clock:** Current time with detailed breakdown
- **World Clocks:** Add multiple timezone clocks
- **Timer:** Countdown timers for events
- **Stopwatch:** With lap functionality
- **Calendar Events:** Weather-dependent event planning
- **Moon Phase:** Current lunar phase information

## Customizing Cities
- The "Other Cities" section can be customized in `src/components/OtherCities.jsx`:
  ```js
  const cityList = [
    'New York',
    'London',
    'Tokyo',
    'Sydney',
  ];
  ```
- Add or remove cities as you like!

## File Structure
```
src/
├── components/
│   ├── Notification.jsx          # Notification component
│   ├── WelcomePopup.jsx          # Welcome popup component
│   ├── WeatherCard.jsx           # Main weather display
│   ├── TodayHighlight.jsx        # Weather metrics
│   ├── Forecast.jsx              # Weather forecast
│   ├── OtherCities.jsx           # Other cities weather
│   ├── Sidebar.jsx               # Navigation sidebar
│   └── TopBar.jsx                # Top navigation bar
├── context/
│   └── NotificationContext.jsx    # Global notification management
├── api/
│   └── weatherApi.js             # Weather API integration
├── Login.js                      # Authentication
├── App.js                        # Main application
└── App.css                       # Custom styles and animations
```

## Contributing
Feel free to contribute to this project by:
- Adding new weather features
- Improving the UI/UX
- Adding more notification types
- Enhancing mobile experience
- Adding new calendar features

## License
This project is open source and available under the MIT License.

---

**Enjoy your beautiful, modern weather dashboard with smart notifications!** 🌤️✨
