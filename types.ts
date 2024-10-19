export interface WeatherData {
  city: string;
  temperature: number;
  unit: "C" | "F";
  description: string;
  rainChance: number;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface ForecastData {
  date: string;
  temperature: number;
  description: string;
  icon: string;
}

export interface Favorite {
  city: string;
  unit: "C" | "F";
}
