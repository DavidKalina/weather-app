// File: /components/WeatherDisplay/WeatherDisplay.tsx

import { WeatherData } from "@/types";
import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Import heart icons

interface CurrentWeatherProps {
  weather: WeatherData | null;
  isFavorite: boolean; // New prop to indicate if current location is favorite
  onToggleFavorite: () => void; // New prop for toggling favorite
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  weather,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div className="current-weather flex flex-col items-center justify-center">
      {/* Heart Icon */}
      <div
        className="favorite-icon absolute top-4 right-4 cursor-pointer text-red-500"
        onClick={onToggleFavorite}
        title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      >
        {isFavorite ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
      </div>

      <div className="weather-icon text-8xl">
        {/* Replace with appropriate weather icon based on conditions */}
        ☀️
      </div>
      <h1 className="temperature text-8xl font-bold mt-4">
        {weather?.temperature}°{weather?.unit}
      </h1>
      <p className="date-time text-2xl mt-2">
        {new Date().toLocaleString("en-US", {
          weekday: "long",
          hour: "numeric",
          minute: "numeric",
        })}
      </p>
      <div className="conditions flex items-center mt-4">
        <p className="description mr-2">{weather?.description}</p>
        <p className="rain-chance">Rain - {weather?.rainChance}%</p>
      </div>
      <p className="location mt-4">{weather?.city}</p>
    </div>
  );
};

export default CurrentWeather;
