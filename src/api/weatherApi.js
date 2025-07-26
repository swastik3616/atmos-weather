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