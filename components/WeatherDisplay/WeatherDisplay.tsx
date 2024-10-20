// File: /src/components/WeatherDisplay/WeatherDisplay.tsx

import { WeatherData } from "@/utils/api";
import { motion } from "framer-motion";
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delay between each child animation
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -50, y: 50 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
      },
    },
    hover: {
      scale: 1.01, // Slightly enlarge the card
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)", // Enhanced shadow
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300,
      },
    },
  };

  if (!weather) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      whileHover="hover"
      className="left-panel w-full lg:w-1/3 bg-white p-8 rounded-lg shadow flex items-center justify-center relative"
    >
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
    </motion.div>
  );
};

export default CurrentWeather;
