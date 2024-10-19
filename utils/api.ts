import { WeatherData, ForecastData } from "@/types";
import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
// const GEO_URL = "https://api.openweathermap.org/geo/1.0";

// interface Coordinates {
//   lat: number;
//   lon: number;
//   cityName: string;
//   country: string;
// }

// async function getCoordinates(location: string): Promise<Coordinates> {
//   try {
//     const response = await axios.get(`${GEO_URL}/direct`, {
//       params: {
//         q: location,
//         limit: 1,
//         appid: API_KEY,
//       },
//     });

//     if (response.data.length === 0) {
//       throw new Error("Location not found. Please check the spelling and try again.");
//     }

//     const { lat, lon, name: cityName, country } = response.data[0];
//     return { lat, lon, cityName, country };
//   } catch (error) {
//     console.log(error);
//     throw new Error("Failed to fetch location data. Please try again.");
//   }
// }

export async function fetchWeather(
  coords: {
    latitude: number;
    longitude: number;
  },
  unit: "F" | "C"
): Promise<WeatherData> {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat: coords.latitude,
        lon: coords.longitude,
        units: unit === "C" ? "metric" : "imperial",
        appid: API_KEY,
      },
    });

    const { data } = response;

    return {
      city: `${data?.name}`,
      temperature: Math.round(data.main.temp),
      unit,
      rainChance: 0,
      description: data.weather[0].description,
      icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 10) / 10,
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("Location not found")) {
      throw error;
    }
    throw new Error("Failed to fetch weather data. Please try again.");
  }
}

export async function fetchForecast(
  coords: { latitude: number; longitude: number },
  unit: "C" | "F"
): Promise<ForecastData[]> {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat: coords.latitude,
        lon: coords.longitude,
        units: unit === "C" ? "metric" : "imperial",
        appid: API_KEY,
      },
    });

    const { data } = response;
    const dailyForecasts: { [key: string]: ForecastData } = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dailyForecasts[date] || item.main.temp > dailyForecasts[date].temperature) {
        dailyForecasts[date] = {
          date,
          temperature: Math.round(item.main.temp),
          description: item.weather[0].description,
          icon: `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
        };
      }
    });

    return Object.values(dailyForecasts);
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    throw new Error("Failed to fetch forecast data. Please try again.");
  }
}
