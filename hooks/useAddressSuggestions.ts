import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import debounce from "lodash/debounce";
import { Suggestion } from "@/components/AddressToCoordinates/AddressToCoordinates";

const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const useAddressSuggestions = (address: string, hasStartedTyping: boolean, fetch?: boolean) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string>("");

  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query || !fetch) return;

      try {
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${MAPBOX_API_KEY}`
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const suggestions = response.data.features.map((feature: any) => ({
          id: feature.id,
          place_name: feature.place_name,
          center: feature.center,
        }));
        setSuggestions(suggestions);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setError("Error fetching suggestions");
      }
    }, 300),
    [fetch]
  );

  useEffect(() => {
    if (hasStartedTyping) {
      fetchSuggestions(address);
    }
  }, [address, hasStartedTyping, fetchSuggestions]);

  return { suggestions, error, setSuggestions, setError };
};

export default useAddressSuggestions;
