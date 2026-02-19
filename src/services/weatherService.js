// Сервис для получения данных о погоде
// Поддержка OpenWeatherMap API и mock данных

import { mockWeatherData, refreshMockData } from '../data/mockWeatherData';
import SunCalc from 'suncalc';

const API_BASE = 'https://api.openweathermap.org/data/2.5';
const API_BASE_3 = 'https://api.openweathermap.org/data/3.0';

// Хранение API ключа в localStorage
const getApiKey = () => localStorage.getItem('owm_api_key');
const setApiKey = (key) => localStorage.setItem('owm_api_key', key);
const hasApiKey = () => !!getApiKey();

// Получение координат через геолокацию
const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Геолокация не поддерживается'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      }),
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
};

// Маппинг кодов погоды OpenWeatherMap
const mapWeatherCondition = (weatherId, icon) => {
  const isNight = icon?.includes('n');
  
  if (weatherId >= 200 && weatherId < 300) {
    return { code: 'thunderstorm', label: 'Гроза', icon: 'cloud-lightning', animation: 'thunderstorm' };
  } else if (weatherId >= 300 && weatherId < 400) {
    return { code: 'drizzle', label: 'Морось', icon: 'cloud-drizzle', animation: 'rain' };
  } else if (weatherId >= 500 && weatherId < 600) {
    return { code: 'rain', label: 'Дождь', icon: 'cloud-rain', animation: 'rain' };
  } else if (weatherId >= 600 && weatherId < 700) {
    return { code: 'snow', label: 'Снег', icon: 'cloud-snow', animation: 'snow' };
  } else if (weatherId >= 700 && weatherId < 800) {
    return { code: 'mist', label: 'Туман', icon: 'cloud-fog', animation: 'fog' };
  } else if (weatherId === 800) {
    return isNight 
      ? { code: 'clear_night', label: 'Ясно', icon: 'moon', animation: 'clear-night' }
      : { code: 'sunny', label: 'Ясно', icon: 'sun', animation: 'sunny' };
  } else if (weatherId === 801) {
    return { code: 'partly_cloudy', label: 'Малооблачно', icon: 'cloud-sun', animation: 'partly-cloudy' };
  } else if (weatherId >= 802) {
    return { code: 'cloudy', label: 'Облачно', icon: 'cloud', animation: 'cloudy' };
  }
  
  return { code: 'unknown', label: 'Неизвестно', icon: 'cloud', animation: 'cloudy' };
};

// Получение направления ветра
const getWindDirectionLabel = (degrees) => {
  const directions = ['С', 'ССВ', 'СВ', 'ВСВ', 'В', 'ВЮВ', 'ЮВ', 'ЮЮВ', 'Ю', 'ЮЮЗ', 'ЮЗ', 'ЗЮЗ', 'З', 'ЗСЗ', 'СЗ', 'ССЗ'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

// Вычисление астрономических данных
const calculateAstronomy = (lat, lon, date = new Date()) => {
  const times = SunCalc.getTimes(date, lat, lon);
  const moonIllum = SunCalc.getMoonIllumination(date);
  const moonPos = SunCalc.getMoonPosition(date, lat, lon);
  const sunPos = SunCalc.getPosition(date, lat, lon);
  
  const moonPhaseNames = [
    'Новолуние', 'Молодая луна', 'Первая четверть', 'Прибывающая луна',
    'Полнолуние', 'Убывающая луна', 'Последняя четверть', 'Старая луна'
  ];
  const phaseIndex = Math.round(moonIllum.phase * 8) % 8;
  
  return {
    sunrise: times.sunrise?.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) || '--:--',
    sunset: times.sunset?.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) || '--:--',
    solarNoon: times.solarNoon?.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) || '--:--',
    goldenHour: times.goldenHour?.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) || '--:--',
    dawn: times.dawn?.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) || '--:--',
    dusk: times.dusk?.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) || '--:--',
    moonPhase: moonPhaseNames[phaseIndex],
    moonIllumination: Math.round(moonIllum.fraction * 100),
    moonAltitude: Math.round(moonPos.altitude * 180 / Math.PI),
    sunAltitude: Math.round(sunPos.altitude * 180 / Math.PI),
    dayLength: times.sunset && times.sunrise 
      ? Math.round((times.sunset - times.sunrise) / 1000 / 60) 
      : 0,
  };
};

// Генерация данных о пыльце (mock - OpenWeatherMap не предоставляет эти данные бесплатно)
const generatePollenData = () => {
  const month = new Date().getMonth();
  const isSpring = month >= 2 && month <= 4;
  const isSummer = month >= 5 && month <= 7;
  const isAutumn = month >= 8 && month <= 10;
  
  return {
    overall: isSpring || isSummer ? 'Умеренный' : 'Низкий',
    overallIndex: isSpring || isSummer ? Math.round(40 + Math.random() * 40) : Math.round(10 + Math.random() * 20),
    types: [
      { 
        name: 'Деревья', 
        level: isSpring ? 'Высокий' : 'Низкий',
        index: isSpring ? Math.round(60 + Math.random() * 30) : Math.round(5 + Math.random() * 15),
        species: ['Берёза', 'Ольха', 'Орешник']
      },
      { 
        name: 'Травы', 
        level: isSummer ? 'Высокий' : 'Низкий',
        index: isSummer ? Math.round(50 + Math.random() * 40) : Math.round(5 + Math.random() * 10),
        species: ['Тимофеевка', 'Мятлик', 'Овсяница']
      },
      { 
        name: 'Сорняки', 
        level: isAutumn ? 'Умеренный' : 'Низкий',
        index: isAutumn ? Math.round(30 + Math.random() * 30) : Math.round(5 + Math.random() * 10),
        species: ['Амброзия', 'Полынь', 'Лебеда']
      },
      { 
        name: 'Плесень', 
        level: 'Низкий',
        index: Math.round(10 + Math.random() * 20),
        species: ['Alternaria', 'Cladosporium']
      },
    ],
    forecast: [
      { day: 'Сегодня', level: isSpring || isSummer ? 'Умеренный' : 'Низкий' },
      { day: 'Завтра', level: isSpring || isSummer ? 'Умеренный' : 'Низкий' },
      { day: 'Послезавтра', level: isSpring || isSummer ? 'Высокий' : 'Низкий' },
    ],
    recommendations: isSpring || isSummer 
      ? ['Ограничьте время на улице', 'Держите окна закрытыми', 'Примите антигистаминные']
      : ['Риск аллергии низкий'],
  };
};

// Генерация сельхоз данных
const generateAgricultureData = (temp, humidity, rain) => {
  const soilMoisture = Math.min(100, Math.max(0, humidity * 0.7 + (rain > 0 ? 20 : 0)));
  const evapotranspiration = Math.max(0, (temp * 0.3 + (100 - humidity) * 0.05)).toFixed(1);
  
  const getGrowingConditions = () => {
    if (temp < 5) return { status: 'Плохие', color: 'red', description: 'Слишком холодно для роста' };
    if (temp > 35) return { status: 'Плохие', color: 'red', description: 'Тепловой стресс растений' };
    if (humidity < 30) return { status: 'Умеренные', color: 'yellow', description: 'Требуется полив' };
    if (temp >= 15 && temp <= 25 && humidity >= 50) {
      return { status: 'Отличные', color: 'green', description: 'Оптимальные условия' };
    }
    return { status: 'Хорошие', color: 'lime', description: 'Благоприятные условия' };
  };

  const conditions = getGrowingConditions();
  
  return {
    soilMoisture: Math.round(soilMoisture),
    soilTemperature: Math.round(temp * 0.8),
    evapotranspiration: parseFloat(evapotranspiration),
    growingDegreeDays: Math.max(0, Math.round((temp - 10) * 1)),
    frostRisk: temp < 3 ? 'Высокий' : temp < 7 ? 'Умеренный' : 'Низкий',
    frostRiskPercent: temp < 0 ? 100 : temp < 3 ? 70 : temp < 7 ? 30 : 5,
    irrigationNeed: soilMoisture < 40 ? 'Требуется' : soilMoisture < 60 ? 'Скоро' : 'Не требуется',
    irrigationAmount: Math.max(0, Math.round((60 - soilMoisture) * 0.5)),
    conditions,
    crops: [
      { name: 'Пшеница', status: temp > 5 && temp < 30 ? 'Благоприятно' : 'Неблагоприятно' },
      { name: 'Картофель', status: temp > 10 && temp < 25 ? 'Благоприятно' : 'Неблагоприятно' },
      { name: 'Томаты', status: temp > 15 && temp < 30 ? 'Благоприятно' : 'Неблагоприятно' },
      { name: 'Яблони', status: temp > 5 ? 'Благоприятно' : 'Риск заморозков' },
    ],
    sprayingConditions: {
      suitable: humidity < 80 && temp > 10 && temp < 30,
      reason: humidity >= 80 ? 'Высокая влажность' : temp <= 10 ? 'Низкая температура' : 'Условия подходящие',
    },
  };
};

// Парсинг ответа OpenWeatherMap
const parseCurrentWeather = (data) => {
  const condition = mapWeatherCondition(data.weather[0].id, data.weather[0].icon);
  
  return {
    temperature: Math.round(data.main.temp * 10) / 10,
    feelsLike: Math.round(data.main.feels_like * 10) / 10,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: Math.round(data.wind.speed * 10) / 10,
    windGust: data.wind.gust ? Math.round(data.wind.gust * 10) / 10 : data.wind.speed * 1.3,
    windDirection: data.wind.deg || 0,
    windDirectionLabel: getWindDirectionLabel(data.wind.deg || 0),
    visibility: data.visibility ? Math.round(data.visibility / 1000) : 10,
    uvIndex: data.uvi || 0,
    cloudCover: data.clouds?.all || 0,
    condition,
    dewPoint: Math.round((data.main.temp - (100 - data.main.humidity) / 5) * 10) / 10,
    lastUpdated: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    description: data.weather[0].description,
  };
};

const parseHourlyForecast = (list) => {
  return list.slice(0, 48).map(item => {
    const date = new Date(item.dt * 1000);
    return {
      time: date.toISOString(),
      hour: `${date.getHours()}:00`,
      temperature: Math.round(item.main.temp * 10) / 10,
      feelsLike: Math.round(item.main.feels_like * 10) / 10,
      humidity: item.main.humidity,
      precipitation: item.rain?.['3h'] || item.snow?.['3h'] || 0,
      precipitationProbability: Math.round((item.pop || 0) * 100),
      windSpeed: Math.round(item.wind.speed * 10) / 10,
      windGust: item.wind.gust ? Math.round(item.wind.gust * 10) / 10 : item.wind.speed * 1.3,
      windDirection: item.wind.deg || 0,
      pressure: item.main.pressure,
      visibility: item.visibility ? Math.round(item.visibility / 1000) : 10,
      uvIndex: item.uvi || 0,
      cloudCover: item.clouds?.all || 0,
      condition: mapWeatherCondition(item.weather[0].id, item.weather[0].icon),
    };
  });
};

const parseDailyForecast = (list) => {
  const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const dailyMap = new Map();
  
  list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toDateString();
    
    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, {
        date: date.toISOString(),
        dayName: weekDays[date.getDay()],
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('ru-RU', { month: 'short' }),
        temps: [],
        humidity: [],
        precipitation: 0,
        precipitationProbability: 0,
        windSpeed: [],
        windDirection: [],
        condition: null,
      });
    }
    
    const day = dailyMap.get(dateKey);
    day.temps.push(item.main.temp);
    day.humidity.push(item.main.humidity);
    day.precipitation += item.rain?.['3h'] || item.snow?.['3h'] || 0;
    day.precipitationProbability = Math.max(day.precipitationProbability, (item.pop || 0) * 100);
    day.windSpeed.push(item.wind.speed);
    day.windDirection.push(item.wind.deg || 0);
    
    if (!day.condition || item.weather[0].id < 800) {
      day.condition = mapWeatherCondition(item.weather[0].id, item.weather[0].icon);
    }
  });
  
  return Array.from(dailyMap.values()).slice(0, 7).map(day => ({
    date: day.date,
    dayName: day.dayName,
    dayNumber: day.dayNumber,
    month: day.month,
    tempMax: Math.round(Math.max(...day.temps) * 10) / 10,
    tempMin: Math.round(Math.min(...day.temps) * 10) / 10,
    humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
    precipitation: Math.round(day.precipitation * 10) / 10,
    precipitationProbability: Math.round(day.precipitationProbability),
    windSpeed: Math.round((day.windSpeed.reduce((a, b) => a + b, 0) / day.windSpeed.length) * 10) / 10,
    windDirection: Math.round(day.windDirection.reduce((a, b) => a + b, 0) / day.windDirection.length),
    condition: day.condition,
    uvIndex: Math.round(Math.random() * 6),
  }));
};

const parseAirQuality = (data) => {
  const aqi = data.list[0].main.aqi;
  const components = data.list[0].components;
  
  const aqiLabels = ['', 'Хорошее', 'Удовлетворительное', 'Умеренное', 'Плохое', 'Очень плохое'];
  const aqiColors = ['', 'bg-green-500', 'bg-lime-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500'];
  
  return {
    aqi: aqi * 50, // Конвертация в стандартную шкалу 0-500
    category: aqiLabels[aqi] || 'Неизвестно',
    color: aqiColors[aqi] || 'bg-gray-500',
    pm25: Math.round(components.pm2_5),
    pm10: Math.round(components.pm10),
    o3: Math.round(components.o3),
    no2: Math.round(components.no2),
    so2: Math.round(components.so2),
    co: Math.round(components.co),
  };
};

const generateWindRoseData = (hourlyData) => {
  const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
  const buckets = directions.map(() => ({ count: 0, totalSpeed: 0 }));
  
  hourlyData.forEach(hour => {
    const dirIndex = Math.round(hour.windDirection / 45) % 8;
    buckets[dirIndex].count++;
    buckets[dirIndex].totalSpeed += hour.windSpeed;
  });
  
  const total = hourlyData.length;
  
  return directions.map((dir, index) => ({
    direction: dir,
    angle: index * 45,
    frequency: total > 0 ? Math.round((buckets[index].count / total) * 100) : 0,
    avgSpeed: buckets[index].count > 0 
      ? Math.round((buckets[index].totalSpeed / buckets[index].count) * 10) / 10 
      : 0,
  }));
};

export const weatherService = {
  // API Key management
  getApiKey,
  setApiKey,
  hasApiKey,
  
  // Геолокация
  getCurrentPosition,
  
  // Получить все данные о погоде
  async getWeatherData(coords = null) {
    const apiKey = getApiKey();
    
    // Если нет API ключа, используем mock данные
    if (!apiKey) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const mock = refreshMockData();
      return {
        ...mock,
        astronomy: calculateAstronomy(mock.location.coordinates.lat, mock.location.coordinates.lon),
        pollen: generatePollenData(),
        agriculture: generateAgricultureData(
          mock.current.temperature,
          mock.current.humidity,
          mock.hourly[0]?.precipitation || 0
        ),
      };
    }
    
    try {
      // Получаем координаты
      let { lat, lon } = coords || {};
      if (!lat || !lon) {
        try {
          const pos = await getCurrentPosition();
          lat = pos.lat;
          lon = pos.lon;
        } catch {
          // Дефолтная локация - Москва
          lat = 55.7558;
          lon = 37.6173;
        }
      }
      
      // Параллельные запросы к API
      const [currentRes, forecastRes, airRes] = await Promise.all([
        fetch(`${API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ru`),
        fetch(`${API_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ru`),
        fetch(`${API_BASE}/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`),
        fetch(`${API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ru`),
      ]);
      
      if (!currentRes.ok) {
        throw new Error('Ошибка API: ' + currentRes.status);
      }
      
      const [currentData, forecastData, airData] = await Promise.all([
        currentRes.json(),
        forecastRes.json(),
        airRes.json(),
      ]);
      
      const current = parseCurrentWeather(currentData, lat, lon);
      const hourly = parseHourlyForecast(forecastData.list);
      const daily = parseDailyForecast(forecastData.list);
      const airQuality = parseAirQuality(airData);
      const windRose = generateWindRoseData(hourly);
      const astronomy = calculateAstronomy(lat, lon);
      const pollen = generatePollenData();
      const agriculture = generateAgricultureData(current.temperature, current.humidity, hourly[0]?.precipitation || 0);
      
      return {
        location: {
          city: currentData.name,
          country: currentData.sys.country,
          coordinates: { lat, lon },
          timezone: currentData.timezone,
        },
        current,
        hourly,
        daily,
        airQuality,
        windRose,
        astronomy,
        pollen,
        agriculture,
      };
    } catch (error) {
      console.error('Weather API error:', error);
      throw error;
    }
  },
  
  // Поиск города
  async searchCity(query) {
    const apiKey = getApiKey();
    if (!apiKey) return [];
    
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`
      );
      const data = await res.json();
      return data.map(item => ({
        name: item.local_names?.ru || item.name,
        country: item.country,
        lat: item.lat,
        lon: item.lon,
        state: item.state,
      }));
    } catch (error) {
      console.error('City search error:', error);
      return [];
    }
  },

  // Получить информацию о локации (для обратной совместимости)
  getLocation() {
    return mockWeatherData.location;
  },
};

export default weatherService;
