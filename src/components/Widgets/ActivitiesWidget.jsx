import { Activity, Bike, Fish, Footprints, Sun } from 'lucide-react';
import Card from '../common/Card';

const ActivitiesWidget = ({ current }) => {
  if (!current) return null;

  const { temperature, windSpeed, humidity, uvIndex, condition } = current;

  // Расчёт индексов для активностей (0-100)
  const calculateActivityIndex = (type) => {
    let score = 50;

    switch (type) {
      case 'running': {
        // Бег: идеально 10-20°C, слабый ветер, нет дождя
        if (temperature >= 10 && temperature <= 20) score += 30;
        else if (temperature >= 5 && temperature <= 25) score += 15;
        else score -= 20;

        if (windSpeed <= 5) score += 15;
        else if (windSpeed <= 10) score += 5;
        else score -= 15;

        if (condition?.code === 'rain' || condition?.code === 'snow') score -= 30;
        if (uvIndex >= 6) score -= 15;
        if (humidity > 80) score -= 10;
        break;
      }

      case 'cycling': {
        // Велосипед: 15-25°C, слабый ветер, нет осадков
        if (temperature >= 15 && temperature <= 25) score += 30;
        else if (temperature >= 10 && temperature <= 30) score += 15;
        else score -= 20;

        if (windSpeed <= 5) score += 20;
        else if (windSpeed <= 10) score += 10;
        else if (windSpeed <= 15) score -= 10;
        else score -= 25;

        if (condition?.code === 'rain' || condition?.code === 'snow') score -= 35;
        if (uvIndex >= 7) score -= 15;
        break;
      }

      case 'hiking': {
        // Поход: 10-25°C, умеренный ветер
        if (temperature >= 10 && temperature <= 25) score += 30;
        else if (temperature >= 5 && temperature <= 30) score += 15;
        else score -= 20;

        if (windSpeed <= 10) score += 15;
        else if (windSpeed <= 20) score -= 10;
        else score -= 25;

        if (condition?.code === 'thunderstorm') score -= 50;
        if (condition?.code === 'rain') score -= 25;
        if (uvIndex >= 8) score -= 20;
        break;
      }

      case 'beach': {
        // Пляж: 25-35°C, слабый ветер, солнечно
        if (temperature >= 25 && temperature <= 35) score += 35;
        else if (temperature >= 20 && temperature <= 38) score += 20;
        else score -= 25;

        if (windSpeed <= 5) score += 15;
        else if (windSpeed <= 10) score += 5;
        else score -= 10;

        if (condition?.code === 'sunny' || condition?.code === 'partly-cloudy') score += 20;
        if (condition?.code === 'rain') score -= 40;
        if (uvIndex >= 5 && uvIndex <= 8) score += 10;
        else if (uvIndex < 3) score -= 15;
        break;
      }

      case 'fishing': {
        // Рыбалка: 15-25°C, умеренный ветер, облачно
        if (temperature >= 15 && temperature <= 25) score += 25;
        else if (temperature >= 10 && temperature <= 30) score += 10;

        if (windSpeed >= 3 && windSpeed <= 10) score += 20;
        else if (windSpeed <= 15) score += 5;
        else score -= 15;

        if (condition?.code === 'cloudy' || condition?.code === 'partly-cloudy') score += 15;
        if (condition?.code === 'thunderstorm') score -= 40;
        break;
      }

      case 'photography': {
        // Фотография: интересно при облаках, рассвете/закате
        if (condition?.code === 'partly-cloudy') score += 30;
        if (condition?.code === 'cloudy') score += 20;
        if (condition?.code === 'sunny') score += 10;
        if (condition?.code === 'rain') score -= 20;
        if (condition?.code === 'fog') score += 25; // Атмосферно!

        // Золотой час
        const hour = new Date().getHours();
        if ((hour >= 6 && hour <= 8) || (hour >= 18 && hour <= 20)) score += 15;
        break;
      }

      default:
        score = 50;
    }

    return Math.max(0, Math.min(100, score));
  };

  const activities = [
    { id: 'running', label: 'Бег', icon: Footprints, color: 'text-red-400' },
    { id: 'cycling', label: 'Велосипед', icon: Bike, color: 'text-green-400' },
    { id: 'hiking', label: 'Поход', icon: Activity, color: 'text-orange-400' },
    { id: 'beach', label: 'Пляж', icon: Sun, color: 'text-yellow-400' },
    { id: 'fishing', label: 'Рыбалка', icon: Fish, color: 'text-blue-400' },
    { id: 'photography', label: 'Фото', icon: null, color: 'text-purple-400' },
  ];

  const getIndexColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-lime-400';
    if (score >= 40) return 'text-yellow-400';
    if (score >= 20) return 'text-orange-400';
    return 'text-red-400';
  };

  const getIndexBg = (score) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-lime-500/20 border-lime-500/30';
    if (score >= 40) return 'bg-yellow-500/20 border-yellow-500/30';
    if (score >= 20) return 'bg-orange-500/20 border-orange-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const getRecommendation = (score) => {
    if (score >= 80) return 'Отлично!';
    if (score >= 60) return 'Хорошо';
    if (score >= 40) return 'Нормально';
    if (score >= 20) return 'Не рекомендуется';
    return 'Плохо';
  };

  return (
    <Card title="🏃 Активности" icon={Activity} className="col-span-full lg:col-span-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {activities.map(activity => {
          const score = calculateActivityIndex(activity.id);
          const Icon = activity.icon;
          
          return (
            <div
              key={activity.id}
              className={`p-3 rounded-lg border ${getIndexBg(score)} transition-all card-hover`}
            >
              <div className="flex items-center gap-2 mb-2">
                {Icon ? (
                  <Icon className={`w-5 h-5 ${activity.color}`} />
                ) : (
                  <span className="text-lg">📷</span>
                )}
                <span className="text-sm font-medium text-slate-100">{activity.label}</span>
              </div>
              
              <div className="flex items-end justify-between">
                <div className={`text-2xl font-bold ${getIndexColor(score)}`}>
                  {score}
                </div>
                <div className="text-xs text-slate-400">
                  {getRecommendation(score)}
                </div>
              </div>
              
              {/* Мини-прогресс бар */}
              <div className="mt-2 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    score >= 80 ? 'bg-green-500' :
                    score >= 60 ? 'bg-lime-500' :
                    score >= 40 ? 'bg-yellow-500' :
                    score >= 20 ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Общая рекомендация */}
      <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">
            {calculateActivityIndex('running') >= 60 ? '👍' : '🏠'}
          </span>
          <div className="text-sm text-slate-300">
            {calculateActivityIndex('running') >= 60 && calculateActivityIndex('cycling') >= 60 ? (
              'Отличный день для активного отдыха на свежем воздухе!'
            ) : calculateActivityIndex('hiking') >= 40 ? (
              'Подходит для спокойных прогулок и походов.'
            ) : (
              'Лучше остаться дома или выбрать занятия в помещении.'
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ActivitiesWidget;
