"use client";

import Header from "@/components/Header/Header";
import { ForecastData, WeatherData } from "@/types";
import React, { useEffect, useState } from "react";
import CurrentWeather from "../components/WeatherDisplay";
import WeatherHighlights from "../components/WeatherHighlights";
import WeeklyForecast from "../components/WeeklyForecast";
import { fetchForecast, fetchWeather } from "../utils/api";

const Home: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[] | null>(null);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const weatherData = await fetchWeather(query, unit);
      setWeather(weatherData);
      const forecastData = await fetchForecast(query, unit);
      setForecast(forecastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    }
    setLoading(false);
  };

  const handleUnitToggle = () => {
    setUnit((prevUnit) => (prevUnit === "C" ? "F" : "C"));
  };

  useEffect(() => {
    handleSearch("New York"); // Default city
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!weather || !forecast) return null;

  return (
    <div className="weather-app bg-gray-100 min-h-screen">
      <Header onSearch={handleSearch} onUnitToggle={handleUnitToggle} unit={unit} />
      <div className="content-wrapper flex">
        <div className="left-panel w-1/3 bg-white p-8">
          <CurrentWeather weather={weather} />
        </div>
        <div className="right-panel w-2/3 p-8">
          <WeeklyForecast forecast={forecast} />
          <WeatherHighlights
            highlights={{
              uvIndex: 5,
              windSpeed: 7.7,
              windDirection: "WSW",
              sunrise: "6:35 AM",
              sunset: "5:42 PM",
              humidity: 12,
              visibility: 5.2,
              airQuality: 105,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
