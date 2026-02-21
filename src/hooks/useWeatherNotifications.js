import { useCallback, useEffect, useMemo, useState } from 'react';

const RULES_STORAGE_KEY = 'weather_notification_rules_v2';
const SENT_STORAGE_KEY = 'weather_notification_sent_v2';

const defaultRules = {
  enabled: true,
  quietHoursEnabled: true,
  quietStart: '23:00',
  quietEnd: '07:00',
  cooldownMinutes: 120,
  channels: {
    cold: true,
    heat: true,
    wind: true,
    uv: true,
    official: true,
  },
  thresholds: {
    cold: -10,
    heat: 35,
    wind: 15,
    uv: 8,
  },
};

const parseMinutes = (time = '00:00') => {
  const [h, m] = time.split(':').map((value) => Number(value) || 0);
  return (h * 60) + m;
};

const inQuietHours = (nowDate, rules) => {
  if (!rules.quietHoursEnabled) {
    return false;
  }

  const nowMinutes = (nowDate.getHours() * 60) + nowDate.getMinutes();
  const start = parseMinutes(rules.quietStart);
  const end = parseMinutes(rules.quietEnd);

  if (start === end) {
    return false;
  }

  if (start < end) {
    return nowMinutes >= start && nowMinutes < end;
  }

  return nowMinutes >= start || nowMinutes < end;
};

const getInitialPermission = () => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  return Notification.permission;
};

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const useWeatherNotifications = () => {
  const [permission, setPermission] = useState(getInitialPermission);
  const [rules, setRules] = useState(() => {
    const stored = readJson(RULES_STORAGE_KEY, null);
    return stored
      ? {
          ...defaultRules,
          ...stored,
          channels: { ...defaultRules.channels, ...(stored.channels || {}) },
          thresholds: { ...defaultRules.thresholds, ...(stored.thresholds || {}) },
        }
      : defaultRules;
  });

  useEffect(() => {
    localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(rules));
  }, [rules]);

  const supported = permission !== 'unsupported';

  const requestPermission = useCallback(async () => {
    if (!supported) {
      return false;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  }, [supported]);

  const sendNotification = useCallback((title, options = {}) => {
    if (!supported || permission !== 'granted') {
      return false;
    }

    try {
      new Notification(title, {
        ...options,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
      });
      return true;
    } catch (error) {
      console.error('Notification error:', error);
      return false;
    }
  }, [permission, supported]);

  const evaluateRules = useCallback(({ currentWeather, weatherAlerts = [] }) => {
    if (!supported || permission !== 'granted' || !rules.enabled || !currentWeather) {
      return [];
    }

    if (inQuietHours(new Date(), rules)) {
      return [];
    }

    const candidates = [];
    const temperature = currentWeather.temperature ?? 0;
    const windSpeed = currentWeather.windSpeed ?? 0;
    const uvIndex = currentWeather.uvIndex ?? 0;

    if (rules.channels.cold && temperature <= rules.thresholds.cold) {
      candidates.push({
        key: 'cold-threshold',
        title: 'Погодное предупреждение',
        body: `Температура ${Math.round(temperature)}°C ниже порога ${rules.thresholds.cold}°C.`,
        tag: 'weather-cold-threshold',
      });
    }

    if (rules.channels.heat && temperature >= rules.thresholds.heat) {
      candidates.push({
        key: 'heat-threshold',
        title: 'Погодное предупреждение',
        body: `Температура ${Math.round(temperature)}°C выше порога ${rules.thresholds.heat}°C.`,
        tag: 'weather-heat-threshold',
      });
    }

    if (rules.channels.wind && windSpeed >= rules.thresholds.wind) {
      candidates.push({
        key: 'wind-threshold',
        title: 'Погодное предупреждение',
        body: `Скорость ветра ${Math.round(windSpeed)} м/с выше порога ${rules.thresholds.wind} м/с.`,
        tag: 'weather-wind-threshold',
      });
    }

    if (rules.channels.uv && uvIndex >= rules.thresholds.uv) {
      candidates.push({
        key: 'uv-threshold',
        title: 'Погодное предупреждение',
        body: `УФ-индекс ${uvIndex} выше порога ${rules.thresholds.uv}.`,
        tag: 'weather-uv-threshold',
      });
    }

    if (rules.channels.official && Array.isArray(weatherAlerts)) {
      weatherAlerts
        .filter((alert) => ['severe', 'extreme'].includes(alert.severity))
        .forEach((alert) => {
          candidates.push({
            key: `official-${alert.id}`,
            title: `Официальное предупреждение: ${alert.event}`,
            body: alert.description || 'Подробности доступны в приложении.',
            tag: `official-${alert.id}`,
          });
        });
    }

    const sentRegistry = readJson(SENT_STORAGE_KEY, {});
    const now = Date.now();
    const cooldownMs = Math.max(15, Number(rules.cooldownMinutes) || 120) * 60 * 1000;

    const delivered = [];

    candidates.forEach((candidate) => {
      const lastSentAt = sentRegistry[candidate.key];
      if (lastSentAt && now - lastSentAt < cooldownMs) {
        return;
      }

      const sent = sendNotification(candidate.title, {
        body: candidate.body,
        tag: candidate.tag,
        requireInteraction: false,
      });

      if (sent) {
        sentRegistry[candidate.key] = now;
        delivered.push(candidate);
      }
    });

    localStorage.setItem(SENT_STORAGE_KEY, JSON.stringify(sentRegistry));
    return delivered;
  }, [permission, rules, sendNotification, supported]);

  const updateRules = useCallback((updater) => {
    setRules((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return {
        ...prev,
        ...next,
        channels: {
          ...prev.channels,
          ...(next.channels || {}),
        },
        thresholds: {
          ...prev.thresholds,
          ...(next.thresholds || {}),
        },
      };
    });
  }, []);

  const canSend = useMemo(() => supported && permission === 'granted', [permission, supported]);

  return {
    supported,
    permission,
    canSend,
    rules,
    updateRules,
    requestPermission,
    sendNotification,
    evaluateRules,
  };
};

export default useWeatherNotifications;
