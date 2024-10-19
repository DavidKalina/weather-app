import { WeatherData, ForecastData } from "@/types";
import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

interface Coordinates {
  lat: number;
  lon: number;
  cityName: string;
  country: string;
}

async function getCoordinates(location: string): Promise<Coordinates> {
  try {
    const response = await axios.get(`${GEO_URL}/direct`, {
      params: {
        q: location,
        limit: 1,
        appid: API_KEY,
      },
    });

    if (response.data.length === 0) {
      throw new Error("Location not found. Please check the spelling and try again.");
    }

    const { lat, lon, name: cityName, country } = response.data[0];
    return { lat, lon, cityName, country };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch location data. Please try again.");
  }
}

export async function fetchWeather(location: string, unit: "C" | "F"): Promise<WeatherData> {
  try {
    const { lat, lon, cityName, country } = await getCoordinates(location);
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        units: unit === "C" ? "metric" : "imperial",
        appid: API_KEY,
      },
    });

    const { data } = response;
    return {
      city: `${cityName}, ${country}`,
      temperature: Math.round(data.main.temp),
      unit,
      rainChance: 0,
      description: data.weather[0].description,
      icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 10) / 10,
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("Location not found")) {
      throw error;
    }
    throw new Error("Failed to fetch weather data. Please try again.");
  }
}

export async function fetchForecast(location: string, unit: "C" | "F"): Promise<ForecastData[]> {
  try {
    const { lat, lon } = await getCoordinates(location);
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        units: unit === "C" ? "metric" : "imperial",
        appid: API_KEY,
      },
    });

    const { data } = response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.list.slice(0, 5).map((item: any) => ({
      date: new Date(item.dt * 1000).toLocaleDateString(),
      temperature: Math.round(item.main.temp),
      description: item.weather[0].description,
      icon: `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
    }));
  } catch (error) {
    if (error instanceof Error && error.message.includes("Location not found")) {
      throw error;
    }
    throw new Error("Failed to fetch forecast data. Please try again.");
  }
}
