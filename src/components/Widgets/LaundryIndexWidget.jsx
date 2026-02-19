import { Shirt, Wind, Sun, Droplets, Clock } from 'lucide-react';
import Card from '../common/Card';

/**
 * Laundry Index Widget
 * Прогноз времени высыхания белья на улице
 */
const LaundryIndexWidget = ({ current }) => {
  if (!current) return null;

  const { temperature, humidity, windSpeed, condition } = current;

  // Расчёт времени высыхания (в часах)
  const calculateDryingTime = () => {
    let baseTime = 4; // Базовое время в идеальных условиях

    // Фактор 1: Температура
    if (temperature >= 30) baseTime -= 1;
    else if (temperature >= 20) baseTime -= 0.5;
    else if (temperature >= 15) baseTime += 0;
    else if (temperature >= 10) baseTime += 1;
    else if (temperature >= 5) baseTime += 2;
    else baseTime += 3;

    // Фактор 2: Влажность
    if (humidity <= 30) baseTime -= 1.5;
    else if (humidity <= 50) baseTime -= 1;
    else if (humidity <= 60) baseTime -= 0.5;
    else if (humidity <= 70) baseTime += 0;
    else if (humidity <= 80) baseTime += 1;
    else baseTime += 2;

    // Фактор 3: Ветер
    if (windSpeed >= 10) baseTime -= 1.5;
    else if (windSpeed >= 5) baseTime -= 1;
    else if (windSpeed >= 3) baseTime -= 0.5;
    else if (windSpeed <= 1) baseTime += 1;

    // Фактор 4: Погода
    if (condition?.code === 'rain') baseTime += 4;
    else if (condition?.code === 'snow') baseTime += 3;
    else if (condition?.code === 'fog') baseTime += 2;
    else if (condition?.code === 'cloudy') baseTime += 0.5;
    else if (condition?.code === 'sunny') baseTime -= 0.5;

    // Фактор 5: Ночь/день
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 20;
    if (isNight) baseTime += 2;

    return Math.max(1, Math.round(baseTime * 2) / 2);
  };

  // Оценка условий
  const getConditionsRating = () => {
    const dryingTime = calculateDryingTime();

    if (dryingTime <= 3) {
      return {
        label: 'Отлично',
        color: 'text-green-400',
        bg: 'bg-green-500/20',
        icon: '🌟',
        description: 'Идеальные условия для сушки',
      };
    } else if (dryingTime <= 5) {
      return {
        label: 'Хорошо',
        color: 'text-lime-400',
        bg: 'bg-lime-500/20',
        icon: '👍',
        description: 'Бельё высохнет за разумное время',
      };
    } else if (dryingTime <= 8) {
      return {
        label: 'Нормально',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/20',
        icon: '😐',
        description: 'Будет сохнуть долго',
      };
    } else {
      return {
        label: 'Плохо',
        color: 'text-red-400',
        bg: 'bg-red-500/20',
        icon: '😞',
        description: 'Лучше сушить дома',
      };
    }
  };

  const dryingTime = calculateDryingTime();
  const rating = getConditionsRating();

  // Форматирование времени
  const formatTime = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h >= 10) return `${h} ч`;
    if (m === 0) return `${h} ч`;
    return `${h} ч ${m} мин`;
  };

  // Рекомендации
  const getRecommendations = () => {
    const recs = [];

    if (dryingTime <= 3) {
      recs.push('☀️ Отличный день для сушки на улице');
      recs.push('👕 Можно сушить плотные вещи');
    } else if (dryingTime <= 5) {
      recs.push('🌤️ Хорошие условия');
      recs.push('👔 Лучше сушить лёгкие ткани');
    } else if (dryingTime <= 8) {
      recs.push('⏳ Будет сохнуть весь день');
      recs.push('🏠 Рассмотрите домашнюю сушку');
    } else {
      recs.push('🏠 Сушите дома или в сушилке');
      recs.push('❌ Не рекомендуется на улице');
    }

    if (windSpeed > 10) {
      recs.push('💨 Сильный ветер может сдуть вещи');
    }

    if (humidity > 80) {
      recs.push('💧 Высокая влажность замедлит сушку');
    }

    return recs;
  };

  return (
    <Card title="👕 Сушка белья" icon={Shirt}>
      <div className="space-y-4">
        {/* Основной показатель */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{rating.icon}</span>
            <div>
              <p className="text-sm text-slate-400">Условия</p>
              <p className={`text-lg font-bold ${rating.color}`}>{rating.label}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-slate-100">{formatTime(dryingTime)}</p>
            <p className="text-xs text-slate-500">до высыхания</p>
          </div>
        </div>

        {/* Факторы */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg">
            <Sun className="w-4 h-4 text-orange-400" />
            <div className="flex-1">
              <p className="text-xs text-slate-400">Температура</p>
              <p className="text-sm font-semibold text-slate-200">{Math.round(temperature)}°C</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg">
            <Droplets className="w-4 h-4 text-blue-400" />
            <div className="flex-1">
              <p className="text-xs text-slate-400">Влажность</p>
              <p className="text-sm font-semibold text-slate-200">{humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg">
            <Wind className="w-4 h-4 text-cyan-400" />
            <div className="flex-1">
              <p className="text-xs text-slate-400">Ветер</p>
              <p className="text-sm font-semibold text-slate-200">{Math.round(windSpeed)} м/с</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg">
            <Clock className="w-4 h-4 text-purple-400" />
            <div className="flex-1">
              <p className="text-xs text-slate-400">Время суток</p>
              <p className="text-sm font-semibold text-slate-200">
                {new Date().getHours() >= 6 && new Date().getHours() <= 20 ? 'День' : 'Ночь'}
              </p>
            </div>
          </div>
        </div>

        {/* Прогресс бар */}
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Быстро</span>
            <span>Медленно</span>
          </div>
          <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${
                dryingTime <= 3
                  ? 'from-green-500 to-lime-500'
                  : dryingTime <= 5
                  ? 'from-lime-500 to-yellow-500'
                  : dryingTime <= 8
                  ? 'from-yellow-500 to-orange-500'
                  : 'from-orange-500 to-red-500'
              } transition-all duration-500`}
              style={{ width: `${Math.min(100, (12 - dryingTime) / 12 * 100)}%` }}
            />
          </div>
        </div>

        {/* Рекомендации */}
        <div className={`p-3 rounded-lg ${rating.bg}`}>
          <p className="text-xs text-slate-400 mb-2">{rating.description}</p>
          <ul className="space-y-1">
            {getRecommendations().map((rec, index) => (
              <li key={index} className="text-xs text-slate-300">
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default LaundryIndexWidget;
