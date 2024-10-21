import { FavoriteLocation } from "@/types";
import React from "react";

interface FavoritesListProps {
  favorites: FavoriteLocation[];
  onSelectFavorite: (fav: FavoriteLocation) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, onSelectFavorite }) => {
  if (favorites.length === 0) return null;

  return (
    <div className="favorites-list">
      <h3>Favorites</h3>
      <ul>
        {favorites.map((fav) => (
          <li key={`${fav.coordinates.latitude}-${fav.coordinates.longitude}`}>
            <button onClick={() => onSelectFavorite(fav)}>{fav.city}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(FavoritesList);
