// File: /src/hooks/useWeather.ts

import { useState, useCallback, useEffect } from "react";
import { WeatherAPIResponse, ForecastData } from "@/types";
import { fetchWeather, fetchForecast, WeatherData } from "@/utils/api";

interface UseWeatherProps {
  unit: "C" | "F";
  coords: { latitude: number; longitude: number } | null;
}

const useWeather = ({ unit, coords }: UseWeatherProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(
    async (newCoords?: { latitude: number; longitude: number }) => {
      const fetchCoords = newCoords || coords;
      if (!fetchCoords) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch comprehensive weather data including air quality
        const weatherAPIResponse: WeatherAPIResponse = await fetchWeather(fetchCoords, unit);

        // Fetch city name via reverse geocoding

        // Map API data to WeatherData

        console.log(weatherAPIResponse);

        const mappedWeather: WeatherData = {
          city: weatherAPIResponse.city,
          temperature: Math.round(weatherAPIResponse.current.temp),
          unit,
          rainChance: weatherAPIResponse.hourly[0]?.pop * 100 || 0, // Example: using the first hourly pop
          description: weatherAPIResponse.current.weather[0].description,
          icon: weatherAPIResponse.current.weather[0].icon
            ? `http://openweathermap.org/img/wn/${weatherAPIResponse.current.weather[0].icon}.png`
            : "",
          humidity: weatherAPIResponse.current.humidity,
          windSpeed: Math.round(weatherAPIResponse.current.wind_speed * 10) / 10,
          windDeg: weatherAPIResponse.current.wind_deg, // Mapped
          visibility: weatherAPIResponse.current.visibility / 1000, // Converted to km
          uvi: weatherAPIResponse.current.uvi,
          sunrise: new Date(weatherAPIResponse.current.sunrise * 1000).toLocaleTimeString(),
          sunset: new Date(weatherAPIResponse.current.sunset * 1000).toLocaleTimeString(),
          coords: {
            lat: weatherAPIResponse.lat,
            lon: weatherAPIResponse.lon,
          },
          dt: weatherAPIResponse.current.dt,
        };

        // Set current weather
        setWeather(mappedWeather);

        // Fetch and set forecast
        const forecastData: ForecastData[] = await fetchForecast(weatherAPIResponse);
        setForecast(forecastData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        // Added a delay for better UX
        setTimeout(() => {
          setLoading(false);
        }, 400);
      }
    },
    [coords, unit]
  );

  // Fetch weather data when coords or unit change
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return { weather, forecast, loading, error, handleSearch };
};

export default useWeather;
