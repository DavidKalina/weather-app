// File: /src/components/WeeklyForecast/WeeklyForecast.tsx

import React from "react";
import { ForecastData } from "@/types";

interface WeeklyForecastProps {
  forecast: ForecastData[] | null;
}

const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ forecast }) => {
  if (!forecast) return null;

  return (
    <div className="forecast-display p-4 rounded-lg">
      <h3 className="text-xl font-bold mb-4">7-Day Forecast</h3>
      <div className="flex flex-wrap justify-between">
        {forecast.map((day, index) => (
          <div key={index} className="forecast-item flex flex-col items-center w-1/4 md:w-1/7">
            <p className="date font-semibold">{day.date}</p>
            <img src={day.icon} alt="Weather Icon" className="weather-icon-small w-12 h-12" />
            <p className="temp">{day.temperature}°</p>
            <p className="description capitalize text-sm">{day.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyForecast;
