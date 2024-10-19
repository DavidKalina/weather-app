import { ForecastData } from "@/types";
import React from "react";

interface WeeklyForecastProps {
  forecast: ForecastData[] | null;
}

const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ forecast }) => {
  return (
    <div className="weekly-forecast grid grid-cols-4 gap-4">
      {forecast?.map((day, index) => (
        <div key={index} className="day-forecast text-center bg-white p-4 rounded-lg shadow">
          <p className="font-bold">{day.date}</p>
          <img src={day.icon} alt={day.description} className="mx-auto" />
          <p>{day.temperature}°</p>
        </div>
      ))}
    </div>
  );
};

export default WeeklyForecast;
