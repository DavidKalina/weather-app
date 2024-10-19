// File: /src/components/WeeklyForecast/WeeklyForecast.tsx

import React from "react";
import { ForecastData } from "@/types";

interface WeeklyForecastProps {
  forecast: ForecastData[] | null;
}

const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ forecast }) => {
  if (!forecast) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">7-Day Forecast</h2>
      <div className="weekly-forecast grid grid-cols-2 md:grid-cols-4 gap-4">
        {forecast.map((day, index) => (
          <div key={index} className="day-forecast text-center bg-white p-4 rounded-lg shadow">
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

// interface WeeklyForecastProps {
//   forecast: ForecastData[] | null;
// }

// const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ forecast }) => {
//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">6-Day Forecast</h2>
//       <div className="weekly-forecast grid grid-cols-2 md:grid-cols-4 gap-4">
//         {forecast?.map((day, index) => (
//           <div key={index} className="day-forecast text-center bg-white p-4 rounded-lg shadow">
//             <p className="font-bold">{day.date}</p>
//             <img src={day.icon} alt={day.description} className="mx-auto" />
//             <p>{day.temperature}°</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default WeeklyForecast;

export default WeeklyForecast;
