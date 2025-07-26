# Atmos Weather Dashboard

A modern, responsive weather dashboard built with React, Tailwind CSS, and WeatherAPI. Inspired by Figma community designs, this app features a beautiful UI, real-time weather data, and a clean, professional layout.

## Features

- **Live Weather Data:** Powered by [WeatherAPI](https://www.weatherapi.com/)
- **City Search:** Instantly view weather for any city
- **Current Weather Card:** Prominent, bold display of temperature, conditions, and details
- **Today Highlight:** Key metrics (rain, UV, wind, humidity) in a 2x2 grid
- **Today/Week Forecast:** Hourly forecast row, tomorrow's weather, sunrise/sunset/length of day
- **Other Cities:** 2x2 grid of world cities with live weather
- **Modern UI:** Responsive, dark mode, glassmorphism, and Figma-inspired design

## Tech Stack
- React
- Tailwind CSS (with custom design tokens)
- WeatherAPI (for weather data)
- Lucide React (for icons)
- Framer Motion (for optional animations)

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
3. **Set up WeatherAPI:**
   - Get a free API key from [WeatherAPI](https://www.weatherapi.com/)
   - Add your API key in `src/api/weatherApi.js`:
     ```js
     const API_KEY = 'YOUR_API_KEY_HERE';
     ```
4. **Start the app:**
   ```bash
   npm start
   ```
5. **Open in browser:**
   - Visit [http://localhost:3000](http://localhost:3000)

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


**Enjoy your beautiful, modern weather dashboard!**
