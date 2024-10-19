"use client";
import React, { useState } from "react";

interface WeatherFormProps {
  onSearch: (location: string, unit: "C" | "F") => void;
}

const WeatherForm: React.FC<WeatherFormProps> = ({ onSearch }) => {
  const [city, setCity] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [unit, setUnit] = useState<"C" | "F">("C");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const location = [city, stateCode, countryCode].filter(Boolean).join(",");
    onSearch(location, unit);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Anytime Weather</h2>
      <p>Enter location details below</p>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="City Name (required)"
        required
      />
      <input
        type="text"
        value={stateCode}
        onChange={(e) => setStateCode(e.target.value)}
        placeholder="State Code (optional)"
      />
      <input
        type="text"
        value={countryCode}
        onChange={(e) => setCountryCode(e.target.value)}
        placeholder="Country Code (optional)"
      />
      <div className="radio-group">
        <label>
          <input type="radio" value="C" checked={unit === "C"} onChange={() => setUnit("C")} />
          °C
        </label>
        <label>
          <input type="radio" value="F" checked={unit === "F"} onChange={() => setUnit("F")} />
          °F
        </label>
      </div>
      <button type="submit">Get Weather</button>
    </form>
  );
};

export default WeatherForm;
