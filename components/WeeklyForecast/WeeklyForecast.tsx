// File: /src/components/WeeklyForecast/WeeklyForecast.tsx

import React from "react";
import { ForecastData } from "@/types";
import { motion } from "framer-motion";
import { useDelayedHover } from "@/hooks/useDelayedHover";

interface WeeklyForecastProps {
  forecast: ForecastData[] | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Delay between each child animation
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: -50, y: 50 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 50,
    },
  },
  hover: {
    scale: 1.05, // Slightly enlarge the card
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)", // Enhanced shadow
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 300,
    },
  },
};

const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ forecast }) => {
  const canHover = useDelayedHover(1500); // Delay hover by 1.5 seconds

  if (!forecast) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="weekly-forecast-container p-4"
    >
      <h2 className="text-2xl font-bold mb-4">7-Day Forecast</h2>
      <motion.div
        className="weekly-forecast grid grid-cols-2 md:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        {forecast.slice(1).map((day, index) => (
          <motion.div
            key={index}
            className="day-forecast text-center bg-white p-4 rounded-lg shadow cursor-pointer"
            variants={cardVariants}
            whileHover={canHover ? "hover" : undefined}
          >
            <p className="date font-semibold">{day.date}</p>
            <img
              src={day.icon}
              alt="Weather Icon"
              className="weather-icon-small w-12 h-12 mx-auto"
            />
            <p className="temp text-lg font-medium">{day.temperature}°</p>
            <p className="description capitalize text-sm">{day.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default React.memo(WeeklyForecast);
