import React, { useCallback, useEffect, useState } from "react";
import AddressInput from "../AddressInput";
import useAddressSuggestions from "@/hooks/useAddressSuggestions";
import SuggestionList from "../SuggestionsList/SuggestionsList";

export interface Suggestion {
  id: string;
  place_name: string;
  center: [number, number];
}

export interface AddressToCoordinatesProps {
  initialAddress?: string;
  onCoordinatesChange: (coordinates: { latitude: number; longitude: number }) => void;
  onAddressChange?: (address: string) => void;
}

const AddressToCoordinates: React.FC<AddressToCoordinatesProps> = ({
  initialAddress = "",
  onCoordinatesChange,
  onAddressChange,
}) => {
  const [address, setAddress] = useState<string>(initialAddress);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(
    null
  );
  const [hasStartedTyping, setHasStartedTyping] = useState<boolean>(false);

  const [fetch, setFetch] = useState(true);

  const { suggestions, error, setSuggestions, setError } = useAddressSuggestions(
    address,
    hasStartedTyping,
    fetch
  );

  useEffect(() => {
    setAddress(initialAddress);
    setSuggestions([]); // Clear suggestions if there's an initial address
  }, [initialAddress, setSuggestions]);

  const handleCoordinatesChange = useCallback(
    (coords: { latitude: number; longitude: number }) => {
      if (
        !coordinates ||
        coordinates.latitude !== coords.latitude ||
        coordinates.longitude !== coords.longitude
      ) {
        setCoordinates(coords);
        onCoordinatesChange(coords);
      }
    },
    [coordinates, onCoordinatesChange]
  );

  useEffect(() => {
    if (coordinates) {
      handleCoordinatesChange(coordinates);
    }
  }, [coordinates, handleCoordinatesChange]);

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    const [longitude, latitude] = suggestion.center;
    setFetch(false);
    handleCoordinatesChange({ latitude, longitude });
    setAddress(suggestion.place_name);
    onAddressChange?.(suggestion.place_name);
    setSuggestions([]);
    setError("");
  };

  return (
    <div className="container">
      <AddressInput
        address={address}
        onChangeAddress={(text) => {
          setFetch(true);
          setAddress(text);
          setHasStartedTyping(true); // User has started typing
        }}
        onClearAddress={() => {
          setFetch(true);
          setAddress("");
          onAddressChange?.("");
          setSuggestions([]);
          setError("");
          setCoordinates(null);
          setHasStartedTyping(false); // Reset typing state
        }}
      />

      {suggestions.length > 0 && (
        <SuggestionList suggestions={suggestions} onSelectSuggestion={handleSelectSuggestion} />
      )}
      {error && (
        <div style={{ marginTop: 16 }}>
          <p style={{ color: "red" }}>{error}</p>
        </div>
      )}
    </div>
  );
};

export default AddressToCoordinates;
