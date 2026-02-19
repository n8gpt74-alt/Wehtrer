import { Thermometer, Wind, Droplets, AlertCircle, CheckCircle } from 'lucide-react';
import Card from '../common/Card';

/**
 * Cold Index Widget
 * Расчёт риска заболеть в зависимости от погодных условий
 */
const ColdIndexWidget = ({ current }) => {
  if (!current) return null;

  const { temperature, feelsLike, windSpeed, humidity } = current;

  // Расчёт индекса простуды (0-100, где 0 = минимальный риск, 100 = максимальный)
  const calculateColdIndex = () => {
    let risk = 0;
    const details = [];

    // Фактор 1: Температура
    if (temperature < -10) {
      risk += 35;
      details.push({ name: 'Температура', text: 'Экстремально холодно', color: 'red' });
    } else if (temperature < 0) {
      risk += 25;
      details.push({ name: 'Температура', text: 'Очень холодно', color: 'orange' });
    } else if (temperature < 10) {
      risk += 15;
      details.push({ name: 'Температура', text: 'Холодно', color: 'yellow' });
    } else if (temperature < 20) {
      risk += 5;
      details.push({ name: 'Температура', text: 'Комфортно', color: 'green' });
    } else {
      details.push({ name: 'Температура', text: 'Тёпло', color: 'green' });
    }

    // Фактор 2: Ощущаемая температура
    const tempDiff = temperature - feelsLike;
    if (tempDiff > 5) {
      risk += 20;
      details.push({ name: 'Ощущается', text: `На ${tempDiff}° холоднее`, color: 'orange' });
    } else if (tempDiff > 2) {
      risk += 10;
      details.push({ name: 'Ощущается', text: `На ${tempDiff}° холоднее`, color: 'yellow' });
    } else {
      details.push({ name: 'Ощущается', text: 'Нормально', color: 'green' });
    }

    // Фактор 3: Ветер
    if (windSpeed > 15) {
      risk += 20;
      details.push({ name: 'Ветер', text: 'Сильный ветер', color: 'red' });
    } else if (windSpeed > 8) {
      risk += 10;
      details.push({ name: 'Ветер', text: 'Ветрено', color: 'yellow' });
    } else {
      details.push({ name: 'Ветер', text: 'Спокойно', color: 'green' });
    }

    // Фактор 4: Влажность
    if (humidity > 80) {
      risk += 15;
      details.push({ name: 'Влажность', text: 'Очень высокая', color: 'orange' });
    } else if (humidity < 30) {
      risk += 10;
      details.push({ name: 'Влажность', text: 'Сухой воздух', color: 'yellow' });
    } else {
      details.push({ name: 'Влажность', text: 'Нормально', color: 'green' });
    }

    // Фактор 5: Резкие перепады
    if (Math.abs(tempDiff) > 8) {
      risk += 10;
    }

    return {
      risk: Math.min(100, risk),
      details,
    };
  };

  const { risk, details } = calculateColdIndex();

  // Определение уровня риска
  const getRiskLevel = () => {
    if (risk >= 75) {
      return {
        label: 'Высокий риск',
        color: 'text-red-400',
        bg: 'bg-red-500/20 border-red-500/30',
        icon: AlertCircle,
        recommendations: [
          'Оденьтесь максимально тепло',
          'Закройте шею и руки',
          'Избегайте длительного пребывания на улице',
          'Примите витамины',
        ],
      };
    } else if (risk >= 50) {
      return {
        label: 'Средний риск',
        color: 'text-orange-400',
        bg: 'bg-orange-500/20 border-orange-500/30',
        icon: AlertCircle,
        recommendations: [
          'Оденьтесь по погоде',
          'Не забудьте шарф',
          'Пейте тёплые напитки',
        ],
      };
    } else if (risk >= 25) {
      return {
        label: 'Низкий риск',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/20 border-yellow-500/30',
        icon: CheckCircle,
        recommendations: ['Лёгкая куртка не помешает', 'Берегите горло'],
      };
    } else {
      return {
        label: 'Минимальный риск',
        color: 'text-green-400',
        bg: 'bg-green-500/20 border-green-500/30',
        icon: CheckCircle,
        recommendations: ['Отличная погода!', 'Можно одеваться легко'],
      };
    }
  };

  const level = getRiskLevel();
  const IconComponent = level.icon;

  // Прогресс бар
  const getProgressColor = () => {
    if (risk >= 75) return 'from-red-500 to-orange-500';
    if (risk >= 50) return 'from-orange-500 to-yellow-500';
    if (risk >= 25) return 'from-yellow-500 to-lime-500';
    return 'from-lime-500 to-green-500';
  };

  return (
    <Card title="🤒 Индекс простуды" icon={Thermometer}>
      <div className="space-y-4">
        {/* Основной показатель */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconComponent className={`w-8 h-8 ${level.color}`} />
            <div>
              <p className="text-sm text-slate-400">Риск заболеть</p>
              <p className={`text-xl font-bold ${level.color}`}>{level.label}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-slate-100">{risk}</p>
            <p className="text-xs text-slate-500">из 100</p>
          </div>
        </div>

        {/* Прогресс бар */}
        <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getProgressColor()} transition-all duration-500 rounded-full`}
            style={{ width: `${risk}%` }}
          />
        </div>

        {/* Детали по факторам */}
        <div className="grid grid-cols-2 gap-2">
          {details.map((detail, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg ${
                detail.color === 'red'
                  ? 'bg-red-500/10'
                  : detail.color === 'orange'
                  ? 'bg-orange-500/10'
                  : detail.color === 'yellow'
                  ? 'bg-yellow-500/10'
                  : 'bg-green-500/10'
              }`}
            >
              <p className="text-xs text-slate-400">{detail.name}</p>
              <p
                className={`text-sm font-semibold ${
                  detail.color === 'red'
                    ? 'text-red-400'
                    : detail.color === 'orange'
                    ? 'text-orange-400'
                    : detail.color === 'yellow'
                    ? 'text-yellow-400'
                    : 'text-green-400'
                }`}
              >
                {detail.text}
              </p>
            </div>
          ))}
        </div>

        {/* Рекомендации */}
        <div className={`p-3 rounded-lg ${level.bg}`}>
          <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Рекомендации
          </p>
          <ul className="space-y-1">
            {level.recommendations.map((rec, index) => (
              <li key={index} className="text-xs text-slate-300 flex items-start gap-2">
                <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default ColdIndexWidget;
