import { useState, useEffect } from 'react';

export const useWeatherHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('weather_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
  }, []);

  const addToHistory = (data) => {
    const updated = [{ ...data, timestamp: Date.now() }, ...history].slice(0, 100);
    setHistory(updated);
    localStorage.setItem('weather_history', JSON.stringify(updated));
  };

  const getHistory = (days = 7) => {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return history.filter((h) => h.timestamp > cutoff);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('weather_history');
  };

  return { history, addToHistory, getHistory, clearHistory };
};

export default useWeatherHistory;
