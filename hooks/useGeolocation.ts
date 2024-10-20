// File: /src/hooks/useGeolocation.ts

import { useState, useEffect } from "react";

interface Coordinates {
  latitude: number;
  longitude: number;
}

const useGeolocation = () => {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    const success = (position: GeolocationPosition) => {
      setCoords({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setLoading(false);
    };

    const failure = (error: GeolocationPositionError) => {
      setError(error.message);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(success, failure);
  }, []);

  return { coords, error, loading };
};

export default useGeolocation;
