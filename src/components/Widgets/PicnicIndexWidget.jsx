import { Sun, Umbrella, Wind, Thermometer, Smile, Frown } from 'lucide-react';
import Card from '../common/Card';

/**
 * Picnic Index Widget
 * Оценка пригодности погоды для пикника
 */
const PicnicIndexWidget = ({ current }) => {
  if (!current) return null;

  const { temperature, feelsLike, windSpeed, humidity, condition, uvIndex } = current;

  // Расчёт индекса пикника (0-100)
  const calculatePicnicIndex = () => {
    let score = 50;
    const factors = [];

    // Температура (идеально 18-25°C)
    if (temperature >= 18 && temperature <= 25) {
      score += 25;
      factors.push({ name: 'Температура', text: 'Идеально', color: 'green' });
    } else if (temperature >= 15 && temperature <= 28) {
      score += 15;
      factors.push({ name: 'Температура', text: 'Комфортно', color: 'lime' });
    } else if (temperature >= 10 && temperature <= 30) {
      score += 5;
      factors.push({ name: 'Температура', text: 'Нормально', color: 'yellow' });
    } else if (temperature >= 5 && temperature <= 35) {
      score -= 10;
      factors.push({ name: 'Температура', text: 'Неидеально', color: 'orange' });
    } else {
      score -= 25;
      factors.push({ name: 'Температура', text: 'Экстремально', color: 'red' });
    }

    // Ощущаемая температура
    const tempDiff = Math.abs(feelsLike - temperature);
    if (tempDiff <= 2) {
      factors.push({ name: 'Ощущается', text: 'Как ожидается', color: 'green' });
    } else if (tempDiff <= 5) {
      factors.push({ name: 'Ощущается', text: 'Небольшое отличие', color: 'yellow' });
    } else {
      score -= 5;
      factors.push({ name: 'Ощущается', text: 'Существенное отличие', color: 'orange' });
    }

    // Ветер (комфортно 0-5 м/с)
    if (windSpeed <= 5) {
      score += 15;
      factors.push({ name: 'Ветер', text: 'Штиль', color: 'green' });
    } else if (windSpeed <= 10) {
      score += 5;
      factors.push({ name: 'Ветер', text: 'Лёгкий', color: 'lime' });
    } else if (windSpeed <= 15) {
      score -= 10;
      factors.push({ name: 'Ветер', text: 'Умеренный', color: 'yellow' });
    } else {
      score -= 20;
      factors.push({ name: 'Ветер', text: 'Сильный', color: 'red' });
    }

    // Осадки
    if (condition?.code === 'rain' || condition?.code === 'drizzle') {
      score -= 30;
      factors.push({ name: 'Осадки', text: 'Дождь', color: 'red' });
    } else if (condition?.code === 'snow') {
      score -= 25;
      factors.push({ name: 'Осадки', text: 'Снег', color: 'red' });
    } else if (condition?.code === 'thunderstorm') {
      score -= 40;
      factors.push({ name: 'Осадки', text: 'Гроза', color: 'red' });
    } else if (condition?.code === 'fog') {
      score -= 15;
      factors.push({ name: 'Осадки', text: 'Туман', color: 'orange' });
    } else if (condition?.code === 'sunny' || condition?.code === 'partly-cloudy') {
      score += 15;
      factors.push({ name: 'Осадки', text: 'Ясно', color: 'green' });
    } else {
      factors.push({ name: 'Осадки', text: 'Облачно', color: 'yellow' });
    }

    // Влажность (комфортно 40-60%)
    if (humidity >= 40 && humidity <= 60) {
      score += 10;
      factors.push({ name: 'Влажность', text: 'Оптимально', color: 'green' });
    } else if (humidity >= 30 && humidity <= 70) {
      score += 5;
      factors.push({ name: 'Влажность', text: 'Нормально', color: 'lime' });
    } else if (humidity >= 20 && humidity <= 80) {
      factors.push({ name: 'Влажность', text: 'Приемлемо', color: 'yellow' });
    } else {
      score -= 10;
      factors.push({ name: 'Влажность', text: 'Дискомфорт', color: 'orange' });
    }

    // УФ-индекс
    if (uvIndex >= 3 && uvIndex <= 6) {
      score += 5;
      factors.push({ name: 'УФ-индекс', text: 'Комфортно', color: 'green' });
    } else if (uvIndex < 3) {
      factors.push({ name: 'УФ-индекс', text: 'Низкий', color: 'lime' });
    } else if (uvIndex <= 8) {
      score -= 5;
      factors.push({ name: 'УФ-индекс', text: 'Высокий', color: 'yellow' });
    } else {
      score -= 15;
      factors.push({ name: 'УФ-индекс', text: 'Опасный', color: 'red' });
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      factors,
    };
  };

  const { score, factors } = calculatePicnicIndex();

  // Определение уровня
  const getLevel = () => {
    if (score >= 80) {
      return {
        label: 'Отлично для пикника!',
        color: 'text-green-400',
        bg: 'bg-green-500/20',
        icon: Smile,
        description: 'Идеальная погода для отдыха на природе!',
        tips: [
          '🧺 Берите плед и наслаждайтесь',
          '🥗 Отличное время для свежих салатов',
          '⚽ Можно планировать активные игры',
        ],
      };
    } else if (score >= 60) {
      return {
        label: 'Хорошо',
        color: 'text-lime-400',
        bg: 'bg-lime-500/20',
        icon: Smile,
        description: 'Хорошие условия с небольшими оговорками.',
        tips: [
          '🧥 Возьмите лёгкую куртку',
          '🌳 Выберите место в тени или на солнце',
          '💧 Не забудьте напитки',
        ],
      };
    } else if (score >= 40) {
      return {
        label: 'Нормально',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/20',
        icon: null,
        description: 'Условия приемлемые, но есть дискомфорт.',
        tips: [
          '⛔ Рассмотрите крытое место',
          '🌂 Возьмите зонт на всякий случай',
          '🕐 Лучше выбрать другое время',
        ],
      };
    } else {
      return {
        label: 'Плохо для пикника',
        color: 'text-red-400',
        bg: 'bg-red-500/20',
        icon: Frown,
        description: 'Лучше остаться дома или перенести.',
        tips: [
          '🏠 Рассмотрите домашние мероприятия',
          '📅 Перенесите на другой день',
          '🍕 Закажите еду вместо готовки на огне',
        ],
      };
    }
  };

  const level = getLevel();
  const IconComponent = level.icon;

  return (
    <Card title="🧺 Индекс пикника" icon={Sun}>
      <div className="space-y-4">
        {/* Основной показатель */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {IconComponent && <IconComponent className={`w-8 h-8 ${level.color}`} />}
            <div>
              <p className="text-sm text-slate-400">Для пикника</p>
              <p className={`text-lg font-bold ${level.color}`}>{level.label}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-slate-100">{score}</p>
            <p className="text-xs text-slate-500">из 100</p>
          </div>
        </div>

        {/* Прогресс бар */}
        <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${
              score >= 80
                ? 'from-green-500 to-lime-500'
                : score >= 60
                ? 'from-lime-500 to-yellow-500'
                : score >= 40
                ? 'from-yellow-500 to-orange-500'
                : 'from-orange-500 to-red-500'
            } transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Факторы */}
        <div className="grid grid-cols-2 gap-2">
          {factors.map((factor, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg ${
                factor.color === 'red'
                  ? 'bg-red-500/10'
                  : factor.color === 'orange'
                  ? 'bg-orange-500/10'
                  : factor.color === 'yellow'
                  ? 'bg-yellow-500/10'
                  : factor.color === 'lime'
                  ? 'bg-lime-500/10'
                  : 'bg-green-500/10'
              }`}
            >
              <p className="text-xs text-slate-400">{factor.name}</p>
              <p
                className={`text-sm font-semibold ${
                  factor.color === 'red'
                    ? 'text-red-400'
                    : factor.color === 'orange'
                    ? 'text-orange-400'
                    : factor.color === 'yellow'
                    ? 'text-yellow-400'
                    : factor.color === 'lime'
                    ? 'text-lime-400'
                    : 'text-green-400'
                }`}
              >
                {factor.text}
              </p>
            </div>
          ))}
        </div>

        {/* Советы */}
        <div className={`p-3 rounded-lg ${level.bg}`}>
          <p className="text-xs text-slate-400 mb-2">{level.description}</p>
          <ul className="space-y-1">
            {level.tips.map((tip, index) => (
              <li key={index} className="text-xs text-slate-300">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default PicnicIndexWidget;
