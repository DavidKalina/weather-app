// File: /components/FavoritesDropdown/FavoritesDropdown.tsx

import React, { useState, useEffect, useRef } from "react";
import { FavoriteLocation } from "@/types";
import { FaChevronDown } from "react-icons/fa";

interface FavoritesDropdownProps {
  favorites: FavoriteLocation[];
  onSelectFavorite: (fav: FavoriteLocation) => void;
}

const FavoritesDropdown: React.FC<FavoritesDropdownProps> = ({ favorites, onSelectFavorite }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="favorites-dropdown relative" ref={dropdownRef}>
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
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                onClick={() => {
                  onSelectFavorite(fav);
                  setIsOpen(false);
                }}
              >
                <span>{fav.city}</span>
                {/* Optionally, add a remove button */}
                {/* <FaTimes
                  size={14}
                  className="text-red-500 ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Implement remove favorite logic here if needed
                  }}
                /> */}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default FavoritesDropdown;
