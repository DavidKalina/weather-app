"use client";

import Header from "@/components/Header/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ForecastData, WeatherData } from "@/types";
import React, { useCallback, useEffect, useState } from "react";
import CurrentWeather from "../components/WeatherDisplay";
import WeatherHighlights from "../components/WeatherHighlights";
import WeeklyForecast from "../components/WeeklyForecast";
import { fetchForecast, fetchWeather } from "../utils/api";

const Home: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[] | null>(null);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCoords, setCurrentCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const handleSearch = useCallback(
    async (coords: { latitude: number; longitude: number }) => {
      setCurrentCoords(coords);
      setLoading(true);
      setError(null);
      try {
        const weatherData = await fetchWeather(coords, unit);
        setWeather(weatherData);
        const forecastData = await fetchForecast(coords, unit);
        setForecast(forecastData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 400);
      }
    },
    [unit]
  );

  const handleUnitToggle = () => {
    setUnit((prevUnit) => (prevUnit === "C" ? "F" : "C"));
  };

  useEffect(() => {
    if (currentCoords) {
      handleSearch(currentCoords);
    }
  }, [unit, currentCoords, handleSearch]);

  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      }
    });
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const coords = await getCurrentLocation();
        await handleSearch(coords);
      } catch (error) {
        console.error("Error getting location:", error);
        // Fallback to a default location if geolocation fails
        handleSearch({ latitude: 40.7128, longitude: -74.006 }); // New York City coordinates
      }
    };

    fetchInitialData();
  }, [handleSearch]);

  if (error) return <div>Error: {error}</div>;
  // if (!weather || !forecast) return null;

  return (
    <div className="weather-app bg-gray-100 min-h-screen p-10 flex flex-col gap-4">
      <Header onSearch={handleSearch} onUnitToggle={handleUnitToggle} unit={unit} />
      <div className="content-wrapper flex gap-4 flex-1">
        {loading ? (
          <div className="flex-1 flex items-center justify-center bo">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="left-panel w-1/3 bg-white p-8 rounded-lg shadow flex items-center justify-center">
              <CurrentWeather weather={weather} />
            </div>
            <div className="right-panel w-2/3 p-0">
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
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
