import { ForecastData } from "@/types";
import React from "react";

interface WeeklyForecastProps {
  forecast: ForecastData[];
}

const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ forecast }) => {
  return (
    <div className="weekly-forecast grid grid-cols-7 gap-4 mt-6">
      {forecast.map((day, index) => (
        <div key={index} className="day-forecast text-center">
          <p className="font-bold">{day.date}</p>
          <img src={day.icon} alt={day.description} className="mx-auto" />
          <p>{day.temperature}°</p>
        </div>
      ))}
    </div>
  );
};

export default WeeklyForecast;
