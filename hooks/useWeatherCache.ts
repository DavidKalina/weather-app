// File: /src/hooks/useWeatherCache.ts

import { useCallback } from "react";
import { ForecastData } from "@/types";
import { setCachedData, getCachedData } from "@/utils/cacheUtils";
import { WeatherData } from "@/utils/api";

interface CachedWeatherData {
  weather: WeatherData;
  forecast: ForecastData[];
}

const useWeatherCache = () => {
  const getCacheKey = useCallback(
    (coords: { latitude: number; longitude: number }, unit: "C" | "F") => {
      return `weather_${coords.latitude}_${coords.longitude}_${unit}`;
    },
    []
  );

  const getCachedWeather = useCallback(
    (
      coords: { latitude: number; longitude: number },
      unit: "C" | "F"
    ): CachedWeatherData | null => {
      const cacheKey = getCacheKey(coords, unit);
      return getCachedData<CachedWeatherData>(cacheKey);
    },
    [getCacheKey]
  );

  const setCachedWeather = useCallback(
    (coords: { latitude: number; longitude: number }, unit: "C" | "F", data: CachedWeatherData) => {
      const cacheKey = getCacheKey(coords, unit);
      setCachedData(cacheKey, data);
    },
    [getCacheKey]
  );

  return { getCachedWeather, setCachedWeather };
};

export default useWeatherCache;
