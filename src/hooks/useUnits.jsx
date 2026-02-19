import { useState, useEffect, createContext, useContext } from 'react';

// Контекст для единиц измерения
const UnitsContext = createContext(null);

// Значения по умолчанию
const DEFAULT_UNITS = {
  temperature: 'celsius', // celsius | fahrenheit
  windSpeed: 'ms', // ms | kmh | mph | knots
  pressure: 'mmhg', // mmhg | hpa | inHg
  visibility: 'km', // km | miles
  precipitation: 'mm', // mm | inches
};

// Поставщик контекста
export const UnitsProvider = ({ children }) => {
  const [units, setUnits] = useState(DEFAULT_UNITS);

  // Загрузка сохраненных единиц
  useEffect(() => {
    const saved = localStorage.getItem('weather_units');
    if (saved) {
      try {
        setUnits(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load units:', e);
      }
    }
  }, []);

  // Сохранение единиц
  const updateUnits = (newUnits) => {
    const updated = { ...units, ...newUnits };
    setUnits(updated);
    localStorage.setItem('weather_units', JSON.stringify(updated));
  };

  // Конвертация температуры
  const convertTemperature = (value) => {
    if (units.temperature === 'fahrenheit') {
      return Math.round((value * 9/5 + 32) * 10) / 10;
    }
    return Math.round(value * 10) / 10;
  };

  // Конвертация скорости ветра
  const convertWindSpeed = (value) => {
    switch (units.windSpeed) {
      case 'kmh':
        return Math.round(value * 3.6);
      case 'mph':
        return Math.round(value * 2.237);
      case 'knots':
        return Math.round(value * 1.944);
      default: // m/s
        return Math.round(value * 10) / 10;
    }
  };

  // Конвертация давления
  const convertPressure = (value) => {
    switch (units.pressure) {
      case 'hpa':
        return Math.round(value);
      case 'inHg':
        return Math.round(value * 0.02953 * 100) / 100;
      default: // mmHg
        return Math.round(value * 0.750062);
    }
  };

  // Конвертация видимости
  const convertVisibility = (value) => {
    if (units.visibility === 'miles') {
      return Math.round(value * 0.621371 * 100) / 100;
    }
    return Math.round(value * 100) / 100;
  };

  // Конвертация осадков
  const convertPrecipitation = (value) => {
    if (units.precipitation === 'inches') {
      return Math.round(value * 0.0393701 * 100) / 100;
    }
    return Math.round(value * 10) / 10;
  };

  // Получение единиц измерения
  const getUnitLabels = () => ({
    temperature: units.temperature === 'celsius' ? '°C' : '°F',
    windSpeed: {
      ms: 'м/с',
      kmh: 'км/ч',
      mph: 'mph',
      knots: 'узлов',
    }[units.windSpeed],
    pressure: {
      mmhg: 'мм рт.ст.',
      hpa: 'гПа',
      inHg: 'inHg',
    }[units.pressure],
    visibility: units.visibility === 'km' ? 'км' : 'миль',
    precipitation: units.precipitation === 'mm' ? 'мм' : 'дюймов',
  });

  const value = {
    units,
    updateUnits,
    convertTemperature,
    convertWindSpeed,
    convertPressure,
    convertVisibility,
    convertPrecipitation,
    getUnitLabels,
  };

  return (
    <UnitsContext.Provider value={value}>
      {children}
    </UnitsContext.Provider>
  );
};

// Хук для использования единиц измерения
export const useUnits = () => {
  const context = useContext(UnitsContext);
  if (!context) {
    throw new Error('useUnits must be used within a UnitsProvider');
  }
  return context;
};

export default useUnits;
