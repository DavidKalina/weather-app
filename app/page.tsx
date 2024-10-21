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
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast, Toaster } from "sonner";

const Home: React.FC = () => {
  // Manage unit state
  const [unit, setUnit] = useState<"C" | "F">("C");
  const lastToastedUnit = useRef<"C" | "F">("C");

  const isInitialMount = useRef(true);

  const [addressState, setAddressState] = useState("");
  const [inputValue, setInputValue] = useState("");

  // Custom hooks
  const { favorites, toggleFavorite } = useFavorites();
  const { weather, forecast, loading, error, handleSearch } = useWeather({
    unit,
    coords: null, // Initially null; will be set based on geolocation or favorites
  });

  const { coords, loading: geoLoading } = useGeolocation();

  const address = useRef("");

  const onAddressChange = useCallback((addy: string) => {
    setInputValue(addy);
  }, []);

  const onAddressUpdate = useCallback((addy: string) => {
    setAddressState(addy);
    setInputValue(addy);
  }, []);

  const handleUnitToggle = useCallback(() => {
    setUnit((prevUnit) => {
      const newUnit = prevUnit === "C" ? "F" : "C";
      if (lastToastedUnit.current !== newUnit) {
        lastToastedUnit.current = newUnit;
        toast.success(`Unit changed to ${newUnit === "C" ? "Celsius" : "Fahrenheit"}!`);
      }
      return newUnit;
    });
  }, []);

  // Handle favorite toggling
  const handleToggleFavorite = useCallback(() => {
    if (!weather) return;

    const currentFavorite: FavoriteLocation = {
      city: addressState,
      coordinates: {
        latitude: weather.coords?.lat || 0,
        longitude: weather.coords?.lon || 0,
      },
    };

    toggleFavorite(currentFavorite);
  }, [addressState, toggleFavorite, weather]);

  const handleSelectFavorite = useCallback(
    async (fav: FavoriteLocation) => {
      setAddressState(fav.city);
      setInputValue(""); // Clear the input value when a favorite is selected
      await handleSearch({
        latitude: fav.coordinates.latitude,
        longitude: fav.coordinates.longitude,
      });
    },
    [handleSearch]
  );

  useEffect(() => {
    if (isInitialMount.current) {
      if (favorites.length > 0) {
        const favorite = favorites[0];
        address.current = favorite.city;
        setAddressState(favorite.city); // Set the address state
        handleSelectFavorite(favorite);
        isInitialMount.current = false;
      } else if (!geoLoading && coords) {
        handleSearch(coords);
        isInitialMount.current = false;
      } else {
        // Fallback to a popular city's coordinates (e.g., New York City)
        const fallbackCoords = { latitude: 40.7128, longitude: -74.006 };
        handleSearch(fallbackCoords);
        setAddressState("New York City");
        address.current = "new York City";
        isInitialMount.current = false;
        toast.info("Using fallback location: New York City.");
      }
    }
  }, [favorites, geoLoading, coords, handleSelectFavorite, handleSearch]);

  useEffect(() => {
    if (weather?.coords?.lat && weather.coords.lon) {
      handleSearch({ latitude: weather.coords.lat, longitude: weather.coords.lon });
    }
  }, [handleSearch, unit, weather?.coords?.lat, weather?.coords?.lon]);

  const isFavorite = useMemo(() => {
    if (!weather?.coords) return false;
    return favorites.some(
      (fav) =>
        fav.coordinates.latitude === weather?.coords?.lat &&
        fav.coordinates.longitude === weather?.coords?.lon
    );
  }, [favorites, weather?.coords]);

  // Memoize highlights
  const highlights = useMemo(
    () => ({
      uvIndex: weather?.uvi || 0,
      windSpeed: weather?.windSpeed || 0,
      windDirection: weather?.windDeg ? getWindDirection(weather.windDeg) : "N/A",
      sunrise: weather?.sunrise || "",
      sunset: weather?.sunset || "",
      humidity: weather?.humidity || 0,
      visibility: weather?.visibility || 0, // Already in km
    }),
    [weather]
  );

  return (
    <>
      <div className="weather-app bg-gray-100 min-h-screen p-10 flex flex-col gap-4">
        <Header
          inputValue={inputValue}
          onAddressChange={onAddressChange}
          onAddressUpdate={onAddressUpdate}
          onSearch={handleSearch}
          onUnitToggle={handleUnitToggle}
          unit={unit}
          favorites={favorites}
          onSelectFavorite={handleSelectFavorite}
        />
        <div className="content-wrapper flex flex-col lg:flex-row gap-4 flex-1">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center text-red-500">{error}</div>
          ) : (
            <>
              <CurrentWeather
                address={addressState || address.current}
                weather={weather}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
              />
              <div className="right-panel w-full lg:w-2/3 p-0 flex flex-col justify-between">
                <WeeklyForecast forecast={forecast} />
                <WeatherHighlights highlights={highlights} />
              </div>
            </>
          )}
        </div>
      </div>
      {coords?.latitude && coords.longitude && (
        <ReverseGeocoding
          onAddressChange={(addy) => {
            setAddressState(addy);
            // setInputValue(addy);
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
