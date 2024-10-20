import axios from "axios";
import { useEffect, useState } from "react";

const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const CACHE_KEY_PREFIX = "CACHED_ADDRESS_";
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const MAX_CACHE_SIZE = 50; // Maximum number of cached addresses
const CACHE_INDEX_KEY = "CACHED_ADDRESS_INDEX";

interface PlaceInfo {
  address: string;
  pointOfInterest?: string;
  category?: string;
}

export const useFetchAddress = (longitude: number | null, latitude: number | null) => {
  const [placeInfo, setPlaceInfo] = useState<PlaceInfo>({ address: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!longitude || !latitude) {
        return;
      }

      setIsLoading(true);

      const cacheKey = `${CACHE_KEY_PREFIX}${longitude}_${latitude}`;

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
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_API_KEY}`
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
      } catch (error) {
        console.error("Error fetching address:", error);
        setPlaceInfo({ address: "Error fetching address" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddress();
  }, [latitude, longitude]);

  const updateCacheIndex = async (newKey: string) => {
    // ... (rest of the updateCacheIndex function remains the same)
  };

  return { placeInfo, isLoading };
};
