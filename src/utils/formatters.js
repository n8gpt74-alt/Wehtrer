// Утилиты форматирования данных

export const formatTemperature = (temp, showUnit = true) => {
  const rounded = Math.round(temp);
  return showUnit ? `${rounded}°C` : `${rounded}°`;
};

export const formatWind = (speed, unit = 'м/с') => {
  return `${Math.round(speed)} ${unit}`;
};

export const formatPressure = (pressure, unit = 'мм рт.ст.') => {
  // Конвертация из гПа в мм рт.ст.
  const mmHg = Math.round(pressure * 0.750062);
  return `${mmHg} ${unit}`;
};

export const formatVisibility = (km) => {
  return `${Math.round(km)} км`;
};

export const getUVIndexLevel = (index) => {
  if (index <= 2) return { level: 'Низкий', color: 'text-green-400' };
  if (index <= 5) return { level: 'Умеренный', color: 'text-yellow-400' };
  if (index <= 7) return { level: 'Высокий', color: 'text-orange-400' };
  if (index <= 10) return { level: 'Очень высокий', color: 'text-red-400' };
  return { level: 'Экстремальный', color: 'text-purple-400' };
};

export const getWindSpeedLevel = (speed) => {
  if (speed < 5) return { level: 'Штиль', color: 'text-green-400' };
  if (speed < 10) return { level: 'Слабый', color: 'text-blue-400' };
  if (speed < 20) return { level: 'Умеренный', color: 'text-yellow-400' };
  if (speed < 30) return { level: 'Сильный', color: 'text-orange-400' };
  return { level: 'Штормовой', color: 'text-red-400' };
};

export const getAQILevel = (aqi) => {
  if (aqi <= 50) return { level: 'Хорошее', color: 'bg-green-500' };
  if (aqi <= 100) return { level: 'Умеренное', color: 'bg-yellow-500' };
  if (aqi <= 150) return { level: 'Нездоровое для чувствительных', color: 'bg-orange-500' };
  if (aqi <= 200) return { level: 'Нездоровое', color: 'bg-red-500' };
  return { level: 'Опасное', color: 'bg-purple-500' };
};
