import axios from 'axios';

const API_KEY = 'a8ef39c17aab476dae773753252607';
const BASE_URL = 'https://api.weatherapi.com/v1';

export async function getCurrentWeather(city) {
  const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}`;
  const response = await axios.get(url);
  return response.data;
}

export async function getForecast(city, days = 2) {
  const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=${days}&aqi=no&alerts=no`;
  const response = await axios.get(url);
  return response.data;
}

// New function to search for locations (cities, districts, villages)
export async function searchLocations(query) {
  try {
    const url = `${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}

// Function to get weather for specific coordinates (useful for districts/villages)
export async function getWeatherByCoordinates(lat, lon) {
  try {
    const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error getting weather by coordinates:', error);
    throw error;
  }
}

// Function to get detailed location info
export async function getLocationInfo(query) {
  try {
    const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(query)}`;
    const response = await axios.get(url);
    return {
      location: response.data.location,
      current: response.data.current
    };
  } catch (error) {
    console.error('Error getting location info:', error);
    throw error;
  }
} 