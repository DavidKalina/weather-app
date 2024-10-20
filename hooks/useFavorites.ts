// File: /src/hooks/useFavorites.ts

import { useState, useEffect } from "react";
import { FavoriteLocation } from "@/types";
import { toast } from "sonner";

const FAVORITES_STORAGE_KEY = "favorites";

const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]); // Explicitly type the state

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);

      console.log({ storedFavorites });

      if (storedFavorites) {
        try {
          setFavorites(JSON.parse(storedFavorites));
        } catch (error) {
          console.error("Failed to parse favorites from localStorage:", error);
          setFavorites([]);
        }
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!favorites.length) {
        return;
      }
      console.log(favorites);
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites]);

  // Function to add a favorite
  const addFavorite = (favorite: FavoriteLocation) => {
    setFavorites((prevFavorites) => {
      // Prevent duplicates
      const exists = prevFavorites.some(
        (fav) =>
          fav.coordinates.latitude === favorite.coordinates.latitude &&
          fav.coordinates.longitude === favorite.coordinates.longitude
      );
      if (exists) return prevFavorites;
      return [...prevFavorites, favorite];
    });
  };

  // Function to remove a favorite
  const removeFavorite = (favorite: FavoriteLocation) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter(
        (fav) =>
          fav.coordinates.latitude !== favorite.coordinates.latitude ||
          fav.coordinates.longitude !== favorite.coordinates.longitude
      )
    );
  };

  // Function to toggle favorite
  const toggleFavorite = (favorite: FavoriteLocation) => {
    const exists = favorites.some(
      (fav) =>
        fav.coordinates.latitude === favorite.coordinates.latitude &&
        fav.coordinates.longitude === favorite.coordinates.longitude
    );
    if (exists) {
      removeFavorite(favorite);
      toast.warning(`${favorite.city} Removed!`);
    } else {
      toast.success(`${favorite.city} Saved`);
      addFavorite(favorite);
    }
  };

  return { favorites, addFavorite, removeFavorite, toggleFavorite };
};

export default useFavorites;
