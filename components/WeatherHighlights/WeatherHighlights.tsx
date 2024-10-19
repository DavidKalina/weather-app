// File: /src/components/WeatherHighlights/WeatherHighlights.tsx

import React from "react";
import { HighlightsData } from "@/types";
import { motion } from "framer-motion";

interface WeatherHighlightsProps {
  highlights: HighlightsData;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Faster stagger for subtle effect
      delayChildren: 0.2, // Initial delay before animations start
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const WeatherHighlights: React.FC<WeatherHighlightsProps> = ({ highlights }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="weather-highlights mt-8"
    >
      <h2 className="text-2xl font-bold mb-4">Today&apos;s Highlights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* UV Index */}
        <motion.div
          className="highlight-card p-4 bg-white rounded-lg shadow flex justify-between items-center"
          variants={cardVariants}
        >
          <div>
            <h3 className="text-lg font-semibold">UV Index</h3>
            <p className="text-sm">Low to Moderate</p>
          </div>
          <div className="uv-meter">
            <span className="text-3xl">{highlights.uvIndex}</span>
          </div>
        </motion.div>

        {/* Wind Status */}
        <motion.div
          className="highlight-card p-4 bg-white rounded-lg shadow flex justify-between items-center"
          variants={cardVariants}
        >
          <div>
            <h3 className="text-lg font-semibold">Wind Status</h3>
            <p className="text-sm">Wind Direction</p>
          </div>
          <div className="wind-info text-3xl">
            {highlights.windSpeed} km/h
            <span className="text-sm ml-2">{highlights.windDirection}</span>
          </div>
        </motion.div>

        {/* Sunrise & Sunset */}
        <motion.div
          className="highlight-card p-4 bg-white rounded-lg shadow flex justify-between items-center"
          variants={cardVariants}
        >
          <div>
            <h3 className="text-lg font-semibold">Sunrise & Sunset</h3>
          </div>
          <div className="sun-times text-sm">
            <p>🌅 {highlights.sunrise}</p>
            <p>🌇 {highlights.sunset}</p>
          </div>
        </motion.div>

        {/* Humidity */}
        <motion.div
          className="highlight-card p-4 bg-white rounded-lg shadow flex justify-between items-center"
          variants={cardVariants}
        >
          <div>
            <h3 className="text-lg font-semibold">Humidity</h3>
          </div>
          <div className="humidity text-3xl">{highlights.humidity}%</div>
        </motion.div>

        {/* Visibility */}
        <motion.div
          className="highlight-card p-4 bg-white rounded-lg shadow flex justify-between items-center"
          variants={cardVariants}
        >
          <div>
            <h3 className="text-lg font-semibold">Visibility</h3>
          </div>
          <div className="visibility text-3xl">{highlights.visibility} km</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WeatherHighlights;
