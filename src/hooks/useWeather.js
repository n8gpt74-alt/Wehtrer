import { useState, useEffect, useCallback } from 'react';
import { weatherService } from '../services/weatherService';

export const useWeather = (coords = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  const fetchData = useCallback(async (newCoords = null) => {
    try {
      setLoading(true);
      setError(null);
      const weatherData = await weatherService.getWeatherData(newCoords || coords);
      setData(weatherData);
      setLocation(weatherData.location);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки данных');
      // Fallback to mock location
      setLocation(weatherService.getLocation());
    } finally {
      setLoading(false);
    }
  }, [coords]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback((newCoords = null) => {
    fetchData(newCoords);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    location: location || weatherService.getLocation(),
    hasApiKey: weatherService.hasApiKey(),
    setApiKey: weatherService.setApiKey,
  };
};

export default useWeather;
