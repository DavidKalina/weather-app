// File: /app/page.tsx

"use client";

import Header from "@/components/Header/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ForecastData, WeatherData, FavoriteLocation } from "@/types";
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

  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]); // New state for favorites

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = useCallback(
    async (coords: { latitude: number; longitude: number }, cityName?: string) => {
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
        await handleSearch({ latitude: 40.7128, longitude: -74.006 }, "New York City"); // New York City coordinates
      }
    };

    fetchInitialData();
  }, []);

  if (error) return <div>Error: {error}</div>;

  // Check if current location is a favorite
  const isFavorite = favorites.some(
    (fav) =>
      fav.coordinates.latitude === currentCoords?.latitude &&
      fav.coordinates.longitude === currentCoords?.longitude
  );

  // Function to toggle favorite
  const toggleFavorite = () => {
    if (!currentCoords || !weather) return;

    if (isFavorite) {
      // Remove from favorites
      setFavorites((prevFavorites) =>
        prevFavorites.filter(
          (fav) =>
            fav.coordinates.latitude !== currentCoords.latitude ||
            fav.coordinates.longitude !== currentCoords.longitude
        )
      );
    } else {
      // Add to favorites
      const newFavorite: FavoriteLocation = {
        city: weather.city,
        coordinates: { ...currentCoords },
      };
      setFavorites((prevFavorites) => [...prevFavorites, newFavorite]);
    }
  };

  return (
    <div className="weather-app bg-gray-100 min-h-screen p-10 flex flex-col gap-4">
      <Header
        onSearch={handleSearch}
        onUnitToggle={handleUnitToggle}
        unit={unit}
        favorites={favorites}
        onSelectFavorite={(fav: any) => handleSearch(fav.coordinates, fav.city)}
      />
      <div className="content-wrapper flex flex-col md:flex-row gap-4 flex-1">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="left-panel w-full md:w-1/3 bg-white p-8 rounded-lg shadow flex items-center justify-center relative">
              <CurrentWeather
                weather={weather}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />
            </div>
            <div className="right-panel w-full md:w-2/3 p-0 flex flex-col justify-between">
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
