// Генерация реалистичных тестовых данных о погоде

const generateHourlyData = () => {
  const data = [];
  const now = new Date();
  const baseTemp = 5; // Базовая температура для зимы
  
  for (let i = 0; i < 48; i++) {
    const hour = new Date(now.getTime() + i * 60 * 60 * 1000);
    const hourOfDay = hour.getHours();
    
    // Температура меняется в течение дня
    const tempVariation = Math.sin((hourOfDay - 6) * Math.PI / 12) * 4;
    const temp = baseTemp + tempVariation + (Math.random() - 0.5) * 2;
    
    data.push({
      time: hour.toISOString(),
      hour: `${hourOfDay}:00`,
      temperature: Math.round(temp * 10) / 10,
      feelsLike: Math.round((temp - 2 + Math.random()) * 10) / 10,
      humidity: Math.round(60 + Math.random() * 30),
      precipitation: Math.random() > 0.7 ? Math.round(Math.random() * 5 * 10) / 10 : 0,
      precipitationProbability: Math.round(Math.random() * 100),
      windSpeed: Math.round((8 + Math.random() * 12) * 10) / 10,
      windGust: Math.round((15 + Math.random() * 15) * 10) / 10,
      windDirection: Math.round(Math.random() * 360),
      pressure: Math.round(1013 + (Math.random() - 0.5) * 20),
      visibility: Math.round(8 + Math.random() * 12),
      uvIndex: hourOfDay >= 6 && hourOfDay <= 18 ? Math.round(Math.random() * 6) : 0,
      cloudCover: Math.round(Math.random() * 100),
    });
  }
  
  return data;
};

const generateDailyData = () => {
  const data = [];
  const now = new Date();
  const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const conditions = [
    { code: 'sunny', label: 'Ясно', icon: 'sun' },
    { code: 'partly_cloudy', label: 'Переменная облачность', icon: 'cloud-sun' },
    { code: 'cloudy', label: 'Облачно', icon: 'cloud' },
    { code: 'rain', label: 'Дождь', icon: 'cloud-rain' },
    { code: 'snow', label: 'Снег', icon: 'cloud-snow' },
  ];
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const baseTemp = 3 + Math.sin(i * 0.5) * 3;
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    data.push({
      date: day.toISOString(),
      dayName: weekDays[day.getDay()],
      dayNumber: day.getDate(),
      month: day.toLocaleDateString('ru-RU', { month: 'short' }),
      tempMax: Math.round((baseTemp + 4 + Math.random() * 3) * 10) / 10,
      tempMin: Math.round((baseTemp - 2 + Math.random() * 2) * 10) / 10,
      humidity: Math.round(55 + Math.random() * 35),
      precipitationProbability: Math.round(Math.random() * 100),
      precipitation: Math.random() > 0.5 ? Math.round(Math.random() * 10 * 10) / 10 : 0,
      windSpeed: Math.round((5 + Math.random() * 15) * 10) / 10,
      windDirection: Math.round(Math.random() * 360),
      condition: condition,
      uvIndex: Math.round(Math.random() * 5),
      sunrise: '07:45',
      sunset: '17:30',
    });
  }
  
  return data;
};

const getWindDirectionLabel = (degrees) => {
  const directions = ['С', 'ССВ', 'СВ', 'ВСВ', 'В', 'ВЮВ', 'ЮВ', 'ЮЮВ', 'Ю', 'ЮЮЗ', 'ЮЗ', 'ЗЮЗ', 'З', 'ЗСЗ', 'СЗ', 'ССЗ'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

const generateCurrentWeather = () => {
  const hourlyData = generateHourlyData();
  const current = hourlyData[0];
  const conditions = [
    { code: 'partly_cloudy', label: 'Переменная облачность', icon: 'cloud-sun' },
  ];
  
  return {
    temperature: current.temperature,
    feelsLike: current.feelsLike,
    humidity: current.humidity,
    pressure: current.pressure,
    windSpeed: current.windSpeed,
    windGust: current.windGust,
    windDirection: current.windDirection,
    windDirectionLabel: getWindDirectionLabel(current.windDirection),
    visibility: current.visibility,
    uvIndex: current.uvIndex,
    cloudCover: current.cloudCover,
    condition: conditions[0],
    dewPoint: Math.round((current.temperature - (100 - current.humidity) / 5) * 10) / 10,
    lastUpdated: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
  };
};

const generateWindRoseData = () => {
  const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
  return directions.map((dir, index) => ({
    direction: dir,
    angle: index * 45,
    frequency: Math.round(5 + Math.random() * 20),
    avgSpeed: Math.round((5 + Math.random() * 15) * 10) / 10,
  }));
};

const generateAirQualityData = () => {
  const aqi = Math.round(30 + Math.random() * 70);
  let category, color;
  
  if (aqi <= 50) {
    category = 'Хорошее';
    color = 'green';
  } else if (aqi <= 100) {
    category = 'Умеренное';
    color = 'yellow';
  } else if (aqi <= 150) {
    category = 'Нездоровое для чувствительных';
    color = 'orange';
  } else {
    category = 'Нездоровое';
    color = 'red';
  }
  
  return {
    aqi,
    category,
    color,
    pm25: Math.round(10 + Math.random() * 30),
    pm10: Math.round(20 + Math.random() * 40),
    o3: Math.round(30 + Math.random() * 50),
    no2: Math.round(10 + Math.random() * 30),
  };
};

export const mockWeatherData = {
  location: {
    city: 'Москва',
    country: 'Россия',
    coordinates: { lat: 55.7558, lon: 37.6173 },
    timezone: 'Europe/Moscow',
  },
  current: generateCurrentWeather(),
  hourly: generateHourlyData(),
  daily: generateDailyData(),
  windRose: generateWindRoseData(),
  airQuality: generateAirQualityData(),
};

export const refreshMockData = () => ({
  location: mockWeatherData.location,
  current: generateCurrentWeather(),
  hourly: generateHourlyData(),
  daily: generateDailyData(),
  windRose: generateWindRoseData(),
  airQuality: generateAirQualityData(),
});
