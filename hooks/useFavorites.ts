// File: /src/hooks/useFavorites.ts

import { useState, useEffect } from "react";
import { FavoriteLocation } from "@/types";
import { toast } from "sonner";

const FAVORITES_STORAGE_KEY = "favorites";

const MAX_FAVORITES = 10;

const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]); // Explicitly type the state

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);

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
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites]);

  const addFavorite = (favorite: FavoriteLocation) => {
    setFavorites((prevFavorites) => {
      // Prevent duplicates
      const exists = prevFavorites.some(
        (fav) =>
          fav.coordinates.latitude === favorite.coordinates.latitude &&
          fav.coordinates.longitude === favorite.coordinates.longitude
      );
      if (exists) return prevFavorites;

      // Check if we've reached the maximum number of favorites
      if (prevFavorites.length >= MAX_FAVORITES) {
        toast.error(
          `You can only have ${MAX_FAVORITES} favorites. Please remove one to add a new favorite.`
        );
        return prevFavorites;
      }

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
      if (favorites.length >= MAX_FAVORITES) {
        toast.error(
          `You can only have ${MAX_FAVORITES} favorites. Please remove one to add a new favorite.`
        );
      } else {
        addFavorite(favorite);
        toast.success(`${favorite.city} Saved`);
      }
    }
  };

  return { favorites, addFavorite, removeFavorite, toggleFavorite };
};

export default useFavorites;
