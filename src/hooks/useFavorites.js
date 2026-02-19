import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('favorite_cities');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load favorites:', e);
      }
    }
  }, []);

  const addFavorite = (city) => {
    const updated = [...favorites, { ...city, addedAt: Date.now() }];
    setFavorites(updated);
    localStorage.setItem('favorite_cities', JSON.stringify(updated));
  };

  const removeFavorite = (cityName) => {
    const updated = favorites.filter((f) => f.name !== cityName);
    setFavorites(updated);
    localStorage.setItem('favorite_cities', JSON.stringify(updated));
  };

  const isFavorite = (cityName) => favorites.some((f) => f.name === cityName);

  return { favorites, addFavorite, removeFavorite, isFavorite };
};

export default useFavorites;
