// File: /src/components/WeatherDisplay/WeatherDisplay.tsx

import { WeatherData } from "@/utils/api";
import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface CurrentWeatherProps {
  address: string;
  weather: WeatherData | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  weather,
  isFavorite,
  address,
  onToggleFavorite,
}) => {
  if (!weather) return null;

  return (
    <div className="current-weather flex flex-col items-center justify-center">
      {/* Favorite Icon */}
      <div
        className="favorite-icon absolute top-4 right-4 cursor-pointer text-red-500"
        onClick={onToggleFavorite}
        title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      >
        {isFavorite ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
      </div>

      {/* Weather Icon */}
      <img src={weather.icon} alt="Weather Icon" className="weather-icon text-8xl" />

      {/* Temperature */}
      <h1 className="temperature text-4xl md:text-6xl font-bold mt-4">
        {weather.temperature}°{weather.unit}
      </h1>

      {/* Date and Time */}
      <p className="date-time text-2xl mt-2">
        {new Date((weather?.dt ?? 0) * 1000).toLocaleString(undefined, {
          weekday: "long",
          hour: "numeric",
          minute: "numeric",
        })}
      </p>

      {/* Weather Description */}
      <div className="conditions flex items-center mt-4">
        <p className="description mr-2 capitalize">{weather.description}</p>
        <p className="rain-chance">Precipitation: {weather.rainChance}%</p>
      </div>

      {/* Location */}
      <p className="location mt-4 text-xl font-semibold">{address}</p>
    </div>
  );
};

export default CurrentWeather;
