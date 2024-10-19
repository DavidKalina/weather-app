// File: /src/utils/api.ts

import axios from "axios";
import { WeatherAPIResponse, ForecastData } from "@/types";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/3.0/onecall";

// Helper function to convert UNIX timestamp to readable date
const convertUnixToDate = (dt: number): string => {
  const date = new Date(dt * 1000);
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
};

// Helper function to map the API response to ForecastData
const mapDailyToForecast = (daily: WeatherAPIResponse["daily"]): ForecastData[] => {
  return daily.map((day) => ({
    date: convertUnixToDate(day.dt),
    temperature: Math.round(day.temp.day),
    description: day.weather[0].description,
    icon: `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`,
  }));
};

// Interface for Current Weather Data
export interface WeatherData {
  city: string;
  temperature: number;
  unit: "C" | "F";
  rainChance: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  windDeg: number; // Added
  visibility: number; // Added
  uvi: number;
  sunrise: string;
  sunset: string;
  coords?: {
    lat: number;
    lon: number;
  };
  dt?: number;
}

export async function fetchWeather(
  coords: { latitude: number; longitude: number },
  unit: "C" | "F"
): Promise<WeatherAPIResponse> {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        lat: coords.latitude,
        lon: coords.longitude,
        units: unit === "C" ? "metric" : "imperial",
        exclude: "minutely,alerts",
        appid: API_KEY,
      },
    });

    const { data } = response;

    // Fetch air quality separately

    return { ...data };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new Error("Failed to fetch weather data.");
  }
}

// Fetch Forecast Data
export async function fetchForecast(weatherData: WeatherAPIResponse): Promise<ForecastData[]> {
  try {
    const forecast = mapDailyToForecast(weatherData.daily);
    return forecast;
  } catch (error) {
    console.error("Error processing forecast data:", error);
    throw new Error("Failed to process forecast data.");
  }
}
