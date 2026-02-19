/**
 * Утилита для получения цвета температуры
 * @param {number} temp - Температура в °C
 * @returns {Object} { color, label, threshold }
 */
export const getTemperatureColor = (temp) => {
  const colors = [
    { threshold: -20, color: '#6366f1', label: 'extreme-cold', bg: 'bg-indigo-500' },
    { threshold: -10, color: '#3b82f6', label: 'very-cold', bg: 'bg-blue-500' },
    { threshold: 0, color: '#06b6d4', label: 'cold', bg: 'bg-cyan-500' },
    { threshold: 10, color: '#22c55e', label: 'cool', bg: 'bg-green-500' },
    { threshold: 20, color: '#84cc16', label: 'mild', bg: 'bg-lime-500' },
    { threshold: 25, color: '#fbbf24', label: 'warm', bg: 'bg-amber-400' },
    { threshold: 35, color: '#f97316', label: 'hot', bg: 'bg-orange-500' },
    { threshold: Infinity, color: '#ef4444', label: 'extreme-hot', bg: 'bg-red-500' },
  ];
  
  return colors.find(c => temp < c.threshold) || colors[colors.length - 1];
};

/**
 * Получить цвет для фонового элемента
 * @param {number} temp - Температура в °C
 * @returns {string} CSS class
 */
export const getTemperatureBg = (temp) => {
  const { bg } = getTemperatureColor(temp);
  return bg;
};

/**
 * Получить цвет для текста
 * @param {number} temp - Температура в °C
 * @returns {string} CSS class
 */
export const getTemperatureText = (temp) => {
  const { label } = getTemperatureColor(temp);
  return `text-${label}`;
};

export default getTemperatureColor;
