import { ForecastData } from "@/types";
import React from "react";

interface ForecastDisplayProps {
  forecast: ForecastData[] | null;
  unit: "C" | "F";
}

const ForecastDisplay: React.FC<ForecastDisplayProps> = ({ forecast, unit }) => {
  if (!forecast) return null;

  return (
    <div className="forecast-display">
      <h3>5-Day Forecast</h3>
      <div className="forecast-list">
        {forecast.map((day) => (
          <div key={day.date} className="forecast-item">
            <p>{day.date}</p>
            <img src={day.icon} alt="Weather icon" className="weather-icon-small" />
            <p>
              {day.temperature}°{unit}
            </p>
            <p>{day.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastDisplay;
