import { FavoriteLocation } from "@/types";
import React from "react";

interface FavoritesListProps {
  favorites: FavoriteLocation[];
  onSelectFavorite: (city: string) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, onSelectFavorite }) => {
  if (favorites.length === 0) return null;

  return (
    <div className="favorites-list">
      <h3>Favorites</h3>
      <ul>
        {favorites.map((fav, index) => (
          <li key={index}>
            <button onClick={() => onSelectFavorite(fav.city)}>
              {fav.city} ({}°)
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesList;
