import { WeatherData } from "@/types";
import React from "react";

interface CurrentWeatherProps {
  weather: WeatherData | null;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather }) => {
  return (
    <div className="current-weather flex flex-col items-center justify-center">
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
