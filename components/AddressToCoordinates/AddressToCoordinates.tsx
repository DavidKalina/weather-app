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
  onAddressChange: (address: string) => void;
  onAddressUpdate: (address: string) => void; // New prop
}

const AddressToCoordinates: React.FC<AddressToCoordinatesProps> = ({
  initialAddress = "",
  onCoordinatesChange,
  onAddressChange,
  onAddressUpdate,
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
    setSuggestions([]); // Clear suggestions when initialAddress changes
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
    onAddressUpdate(suggestion.place_name); // Use onAddressUpdate instead of onAddressChange
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
          onAddressChange(text); // Use onAddressChange for input changes
          setHasStartedTyping(true);
        }}
        onClearAddress={() => {
          setFetch(true);
          setAddress("");
          onAddressChange(""); // Use onAddressChange when clearing the input
          setSuggestions([]);
          setError("");
          setCoordinates(null);
          setHasStartedTyping(false);
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
