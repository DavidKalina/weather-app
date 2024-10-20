// File: /app/page.tsx

"use client";

import Header from "@/components/Header/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import ReverseGeocoding from "@/components/ReverseGeocoding";
import CurrentWeather from "@/components/WeatherDisplay/WeatherDisplay";
import WeatherHighlights from "@/components/WeatherHighlights/WeatherHighlights";
import WeeklyForecast from "@/components/WeeklyForecast/WeeklyForecast";
import useFavorites from "@/hooks/useFavorites";
import useGeolocation from "@/hooks/useGeolocation";
import useWeather from "@/hooks/useWeather";
import { FavoriteLocation } from "@/types";
import { getWindDirection } from "@/utils/getWindDirection";
import React, { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";

const Home: React.FC = () => {
  // Manage unit state
  const [unit, setUnit] = useState<"C" | "F">("C");
  const lastToastedUnit = useRef<"C" | "F">("C");

  const isInitialMount = useRef(true);

  const [addressState, setAddressState] = useState("");

  // Custom hooks
  const { favorites, toggleFavorite } = useFavorites();
  const { weather, forecast, loading, error, handleSearch } = useWeather({
    unit,
    coords: null, // Initially null; will be set based on geolocation or favorites
  });

  const { coords, loading: geoLoading } = useGeolocation();

  const address = useRef("");

  const handleUnitToggle = () => {
    setUnit((prevUnit) => {
      const newUnit = prevUnit === "C" ? "F" : "C";
      if (lastToastedUnit.current !== newUnit) {
        lastToastedUnit.current = newUnit;
        toast.success(`Unit changed to ${newUnit === "C" ? "Celsius" : "Fahrenheit"}!`);
      }
      return newUnit;
    });
  };

  // Handle favorite toggling
  const handleToggleFavorite = () => {
    if (!weather) return;

    const currentFavorite: FavoriteLocation = {
      city: addressState,
      coordinates: {
        latitude: weather.coords?.lat || 0,
        longitude: weather.coords?.lon || 0,
      },
    };

    console.log(currentFavorite);

    toggleFavorite(currentFavorite);
  };

  const handleSelectFavorite = async (fav: FavoriteLocation) => {
    address.current = fav.city;
    setAddressState(fav.city); // Set the address state
    await handleSearch({
      latitude: fav.coordinates.latitude,
      longitude: fav.coordinates.longitude,
    });
  };

  useEffect(() => {
    if (isInitialMount.current) {
      if (favorites.length > 0) {
        const favorite = favorites[0];
        address.current = favorite.city;
        setAddressState(favorite.city); // Set the address state
        handleSelectFavorite(favorite);
        isInitialMount.current = false;
      } else {
        if (!geoLoading && coords) {
          handleSearch(coords);
        }
      }
    }
  }, [favorites, geoLoading, coords]);

  useEffect(() => {
    if (weather?.coords?.lat && weather.coords.lon) {
      handleSearch({ latitude: weather.coords.lat, longitude: weather.coords.lon });
    }
  }, [unit]);

  return (
    <>
      <div className="weather-app bg-gray-100 min-h-screen p-10 flex flex-col gap-4">
        <Header
          onAddressChange={(addy) => {
            if (addy) {
              setAddressState(addy);
              address.current = addy;
            }
          }}
          onSearch={handleSearch}
          onUnitToggle={handleUnitToggle}
          unit={unit}
          favorites={favorites}
          onSelectFavorite={handleSelectFavorite}
        />
        <div className="content-wrapper flex flex-col md:flex-row gap-4 flex-1">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center text-red-500">{error}</div>
          ) : (
            <>
              <div className="left-panel w-full md:w-1/3 bg-white p-8 rounded-lg shadow flex items-center justify-center relative">
                <CurrentWeather
                  address={addressState}
                  weather={weather}
                  isFavorite={
                    weather?.coords
                      ? favorites.some(
                          (fav) =>
                            fav.coordinates.latitude === weather?.coords?.lat ||
                            (0 && fav.coordinates.longitude === weather?.coords?.lon) ||
                            0
                        )
                      : false
                  }
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
              <div className="right-panel w-full md:w-2/3 p-0 flex flex-col justify-between">
                <WeeklyForecast forecast={forecast} />
                <WeatherHighlights
                  highlights={{
                    uvIndex: weather?.uvi || 0,
                    windSpeed: weather?.windSpeed || 0,
                    windDirection: weather?.windDeg ? getWindDirection(weather.windDeg) : "N/A",
                    sunrise: weather?.sunrise || "",
                    sunset: weather?.sunset || "",
                    humidity: weather?.humidity || 0,
                    visibility: weather?.visibility || 0, // Already in km
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
      {coords?.latitude && coords.longitude && (
        <ReverseGeocoding
          onAddressChange={(addy) => {
            console.log({ addy });
            setAddressState(addy);
          }}
          location={{
            latitude: coords?.latitude,
            longitude: coords?.longitude,
          }}
        />
      )}
      <Toaster position="top-center" richColors theme="light" />{" "}
    </>
  );
};

export default Home;
