import React from "react";

interface HighlightsData {
  uvIndex: number;
  windSpeed: number;
  windDirection: string;
  sunrise: string;
  sunset: string;
  humidity: number;
  visibility: number;
  airQuality: number;
}

interface WeatherHighlightsProps {
  highlights: HighlightsData;
}

const WeatherHighlights: React.FC<WeatherHighlightsProps> = ({ highlights }) => {
  return (
    <div className="weather-highlights mt-8">
      <h2 className="text-2xl font-bold mb-4">Today&apos;s Highlights</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="highlight-card p-4 bg-white rounded-lg shadow">
          <h3>UV Index</h3>
          <div className="uv-meter">
            {/* Implement UV meter visualization */}
            <span className="text-3xl">{highlights.uvIndex}</span>
          </div>
        </div>
        <div className="highlight-card p-4 bg-white rounded-lg shadow">
          <h3>Wind Status</h3>
          <p className="text-3xl">{highlights.windSpeed} km/h</p>
          <p>{highlights.windDirection}</p>
        </div>
        <div className="highlight-card p-4 bg-white rounded-lg shadow">
          <h3>Sunrise & Sunset</h3>
          <p>🌅 {highlights.sunrise}</p>
          <p>🌇 {highlights.sunset}</p>
        </div>
        <div className="highlight-card p-4 bg-white rounded-lg shadow">
          <h3>Humidity</h3>
          <p className="text-3xl">{highlights.humidity}%</p>
          <p>Normal 👍</p>
        </div>
        <div className="highlight-card p-4 bg-white rounded-lg shadow">
          <h3>Visibility</h3>
          <p className="text-3xl">{highlights.visibility} km</p>
          <p>Average 😐</p>
        </div>
        <div className="highlight-card p-4 bg-white rounded-lg shadow">
          <h3>Air Quality</h3>
          <p className="text-3xl">{highlights.airQuality}</p>
          <p>Unhealthy 👎</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherHighlights;
