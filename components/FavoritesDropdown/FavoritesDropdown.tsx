// File: /components/FavoritesDropdown/FavoritesDropdown.tsx

import React, { useState } from "react";
import { FavoriteLocation } from "@/types";
import { FaChevronDown } from "react-icons/fa";

interface FavoritesDropdownProps {
  favorites: FavoriteLocation[];
  onSelectFavorite: (fav: FavoriteLocation) => void;
}

const FavoritesDropdown: React.FC<FavoritesDropdownProps> = ({ favorites, onSelectFavorite }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="favorites-dropdown relative">
      <button
        className="flex items-center bg-gray-200 px-4 py-2 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        Favorites <FaChevronDown className="ml-2" />
      </button>
      {isOpen && (
        <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {favorites.length === 0 ? (
            <li className="px-4 py-2 text-gray-500">No favorites added.</li>
          ) : (
            favorites.map((fav, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onSelectFavorite(fav);
                  setIsOpen(false);
                }}
              >
                {fav.city}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default FavoritesDropdown;
