// File: /src/components/WeatherHighlights/WeatherHighlights.tsx

import React from "react";
import { HighlightsData } from "@/types";

interface WeatherHighlightsProps {
  highlights: HighlightsData;
}

const WeatherHighlights: React.FC<WeatherHighlightsProps> = ({ highlights }) => {
  return (
    <div className="weather-highlights mt-8">
      <h2 className="text-2xl font-bold mb-4">Today&apos;s Highlights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* UV Index */}
        <div className="highlight-card p-4 bg-white rounded-lg shadow flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">UV Index</h3>
            <p className="text-sm">Low to Moderate</p>
          </div>
          <div className="uv-meter">
            <span className="text-3xl">{highlights.uvIndex}</span>
          </div>
        </div>

        {/* Wind Status */}
        <div className="highlight-card p-4 bg-white rounded-lg shadow flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Wind Status</h3>
            <p className="text-sm">Wind Direction</p>
          </div>
          <div className="wind-info text-3xl">
            {highlights.windSpeed} km/h
            <span className="text-sm ml-2">{highlights.windDirection}</span>
          </div>
        </div>

        {/* Sunrise & Sunset */}
        <div className="highlight-card p-4 bg-white rounded-lg shadow flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Sunrise & Sunset</h3>
          </div>
          <div className="sun-times text-sm">
            <p>🌅 {highlights.sunrise}</p>
            <p>🌇 {highlights.sunset}</p>
          </div>
        </div>

        {/* Humidity */}
        <div className="highlight-card p-4 bg-white rounded-lg shadow flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Humidity</h3>
          </div>
          <div className="humidity text-3xl">{highlights.humidity}%</div>
        </div>

        {/* Visibility */}
        <div className="highlight-card p-4 bg-white rounded-lg shadow flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Visibility</h3>
          </div>
          <div className="visibility text-3xl">{highlights.visibility} km</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherHighlights;
