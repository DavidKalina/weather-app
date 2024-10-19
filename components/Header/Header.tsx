// File: /src/components/Header/Header.tsx

import React from "react";
import AddressToCoordinates from "../AddressToCoordinates/AddressToCoordinates";
import FavoritesDropdown from "../FavoritesDropdown/FavoritesDropdown";
import { FavoriteLocation } from "@/types";

interface HeaderProps {
  onSearch: (coords?: { latitude: number; longitude: number }) => void;
  onAddressChange: (addy: string) => void;
  onUnitToggle: () => void;
  unit: "C" | "F";
  favorites: FavoriteLocation[];
  onSelectFavorite: (fav: FavoriteLocation) => void;
}

const Header: React.FC<HeaderProps> = ({
  onSearch,
  onAddressChange,
  onUnitToggle,
  unit,
  favorites,
  onSelectFavorite,
}) => {
  return (
    <header className="flex justify-between items-center">
      <div className="search-bar flex items-center">
        <AddressToCoordinates
          onCoordinatesChange={(coords) => onSearch(coords)}
          onAddressChange={(addy) => onAddressChange(addy)}
        />
        <button
          className="bg-gray-200 p-2 rounded-r-lg ml-2"
          onClick={() => onSearch()}
          title="Use Current Location"
        >
          🔄
        </button>
      </div>
      <div className="flex items-center gap-4">
        <FavoritesDropdown
          favorites={favorites}
          onSelectFavorite={onSelectFavorite}
          // onRemoveFavorite={() => {}} // Implement if removal is handled within the dropdown
        />
        <div className="unit-toggle flex">
          <button
            className={`px-2 py-1 rounded-l-lg ${
              unit === "C" ? "bg-black text-white" : "bg-gray-200"
            }`}
            onClick={() => unit === "F" && onUnitToggle()}
            title="Celsius"
          >
            °C
          </button>
          <button
            className={`px-2 py-1 rounded-r-lg ${
              unit === "F" ? "bg-black text-white" : "bg-gray-200"
            }`}
            onClick={() => unit === "C" && onUnitToggle()}
            title="Fahrenheit"
          >
            °F
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
