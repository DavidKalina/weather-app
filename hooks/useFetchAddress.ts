import axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";
import debounce from "lodash/debounce";

const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const CACHE_KEY_PREFIX = "CACHED_ADDRESS_";
const MAX_CACHE_SIZE = 50; // Maximum number of cached addresses
const CACHE_INDEX_KEY = "CACHED_ADDRESS_INDEX";
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const DISTANCE_THRESHOLD = 100; // meters
const DEBOUNCE_DELAY = 5000; // 5 seconds

interface PlaceInfo {
  address: string;
  pointOfInterest?: string;
  category?: string;
}

const roundCoordinate = (coord: number | null): number | null => {
  return coord ? Number(coord.toFixed(4)) : null;
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const useFetchAddress = (longitude: number | null, latitude: number | null) => {
  const [placeInfo, setPlaceInfo] = useState<PlaceInfo>({ address: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const lastFetchedCoordsRef = useRef<{ lat: number; lon: number } | null>(null);

  const fetchAddress = useCallback(async (roundedLon: number, roundedLat: number) => {
    setIsLoading(true);

    const cacheKey = `${CACHE_KEY_PREFIX}${roundedLon}_${roundedLat}`;

    try {
      const cachedData = await localStorage.getItem(cacheKey);
      if (cachedData) {
        const { placeInfo: cachedPlaceInfo, timestamp } = JSON.parse(cachedData);
        const isValid = Date.now() - timestamp < CACHE_EXPIRY_TIME;

        if (isValid) {
          setPlaceInfo(cachedPlaceInfo);
          setIsLoading(false);
          return;
        }
      }

      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${roundedLon},${roundedLat}.json?access_token=${MAPBOX_API_KEY}`
      );

      const feature = response.data.features[2];

      const newPlaceInfo: PlaceInfo = {
        address: feature?.place_name || "Address not found",
        pointOfInterest: feature?.text,
        category: feature?.properties?.category,
      };

      setPlaceInfo(newPlaceInfo);

      // Cache the new place info with timestamp
      const cacheData = JSON.stringify({
        placeInfo: newPlaceInfo,
        timestamp: Date.now(),
      });
      await localStorage.setItem(cacheKey, cacheData);

      // Update cache index
      await updateCacheIndex(cacheKey);

      lastFetchedCoordsRef.current = { lat: roundedLat, lon: roundedLon };
    } catch (error) {
      console.error("Error fetching address:", error);
      setPlaceInfo({ address: "Error fetching address" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetchAddress = useCallback(debounce(fetchAddress, DEBOUNCE_DELAY), [fetchAddress]);

  useEffect(() => {
    const roundedLon = roundCoordinate(longitude);
    const roundedLat = roundCoordinate(latitude);

    if (roundedLon === null || roundedLat === null) {
      return;
    }

    if (lastFetchedCoordsRef.current) {
      const distance = calculateDistance(
        roundedLat,
        roundedLon,
        lastFetchedCoordsRef.current.lat,
        lastFetchedCoordsRef.current.lon
      );
      if (distance < DISTANCE_THRESHOLD) {
        return; // Skip fetching if the distance is below the threshold
      }
    }

    debouncedFetchAddress(roundedLon, roundedLat);
  }, [latitude, longitude, debouncedFetchAddress]);

  const updateCacheIndex = async (newKey: string) => {
    let index: string[] = [];
    const storedIndex = await localStorage.getItem(CACHE_INDEX_KEY);

    if (storedIndex) {
      index = JSON.parse(storedIndex);
    }

    // Add new key to the beginning of the index
    index.unshift(newKey);

    // Remove duplicates
    index = Array.from(new Set(index));

    // Trim the index if it exceeds the maximum cache size
    if (index.length > MAX_CACHE_SIZE) {
      const keysToRemove = index.slice(MAX_CACHE_SIZE);
      index = index.slice(0, MAX_CACHE_SIZE);

      // Remove excess items from localStorage
      for (const key of keysToRemove) {
        await localStorage.removeItem(key);
      }
    }

    // Update the index in localStorage
    await localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(index));
  };

  return { placeInfo, isLoading };
};
