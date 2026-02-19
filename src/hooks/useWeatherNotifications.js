import { useState, useEffect } from 'react';

export const useWeatherNotifications = () => {
  const [permission, setPermission] = useState(Notification.permission);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) return false;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  };

  const sendNotification = (title, options = {}) => {
    if (permission !== 'granted') return;
    new Notification(title, {
      ...options,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
    });
  };

  const checkWeatherAlerts = (weather) => {
    const newAlerts = [];

    if (weather.temperature < -20) {
      newAlerts.push({ type: 'cold', message: 'Экстремальный холод!' });
    }
    if (weather.windSpeed > 20) {
      newAlerts.push({ type: 'wind', message: 'Штормовое предупреждение!' });
    }
    if (weather.uvIndex > 7) {
      newAlerts.push({ type: 'uv', message: 'Опасный УФ-индекс!' });
    }

    setAlerts(newAlerts);

    if (newAlerts.length > 0) {
      sendNotification('⚠️ Предупреждение о погоде', {
        body: newAlerts.map((a) => a.message).join(' '),
        tag: 'weather-alert',
      });
    }
  };

  return { permission, requestPermission, sendNotification, checkWeatherAlerts, alerts };
};

export default useWeatherNotifications;
