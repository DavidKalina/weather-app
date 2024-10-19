import { WeatherData } from "@/types";
import React from "react";

interface CurrentWeatherProps {
  weather: WeatherData | null;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather }) => {
  console.log("Weather", weather);
  return (
    <div className="current-weather flex flex-col items-center">
      <div className="weather-icon text-9xl">
        {/* Replace with appropriate weather icon based on conditions */}
        ☀️
      </div>
      <h1 className="temperature text-8xl font-bold mt-4">{weather?.temperature}°C</h1>
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
