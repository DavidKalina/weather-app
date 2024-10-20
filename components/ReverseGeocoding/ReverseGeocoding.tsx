import { useFetchAddress } from "@/hooks/useFetchAddress";
import React, { useEffect } from "react";

interface ReverseGeocodingProps {
  location: { latitude: number; longitude: number };
  onAddressChange?: (address: string) => void;
}

const ReverseGeocoding: React.FC<ReverseGeocodingProps> = ({ location, onAddressChange }) => {
  const { placeInfo } = useFetchAddress(location.longitude, location.latitude);

  useEffect(() => {
    if (onAddressChange) {
      onAddressChange(placeInfo.address);
    }
  }, [placeInfo.address]);

  return <></>;
};

export default ReverseGeocoding;
