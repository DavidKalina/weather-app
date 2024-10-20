import React from "react";
import AddressToCoordinates from "../AddressToCoordinates/AddressToCoordinates";
import FavoritesDropdown from "../FavoritesDropdown/FavoritesDropdown";
import { FavoriteLocation } from "@/types";

interface HeaderProps {
  onSearch: (coords?: { latitude: number; longitude: number }) => void;
  onAddressChange: (addy: string) => void;
  onAddressUpdate: (addy: string) => void; // New prop

  onUnitToggle: () => void;
  unit: "C" | "F";
  favorites: FavoriteLocation[];
  onSelectFavorite: (fav: FavoriteLocation) => void;
  inputValue: string;
}

const Header: React.FC<HeaderProps> = ({
  onSearch,
  onAddressChange,
  onAddressUpdate,
  onUnitToggle,
  unit,
  favorites,
  onSelectFavorite,
  inputValue,
}) => {
  return (
    <header className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between items-center">
      <div className="search-bar flex items-center">
        <AddressToCoordinates
          initialAddress={inputValue}
          onCoordinatesChange={(coords) => onSearch(coords)}
          onAddressChange={onAddressChange}
          onAddressUpdate={onAddressUpdate} // New prop
        />
      </div>
      <div className="flex items-center gap-4">
        <FavoritesDropdown favorites={favorites} onSelectFavorite={onSelectFavorite} />
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
