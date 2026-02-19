import { Shirt } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../common/Card';

const OutfitWidget = ({ current }) => {
  if (!current) return null;

  const { temperature, windSpeed, condition, uvIndex } = current;

  // Calculate outfit recommendations
  const getOutfitRecommendations = () => {
    const recommendations = [];

    // Temperature-based recommendations
    if (temperature <= -10) {
      recommendations.push({
        icon: '🧥',
        title: 'Тёплая куртка',
        description: 'Пуховик или парка обязательны',
        priority: 'critical',
      });
    } else if (temperature <= 0) {
      recommendations.push({
        icon: '🧥',
        title: 'Зимняя одежда',
        description: 'Тёплое пальто или куртка',
        priority: 'high',
      });
    } else if (temperature <= 10) {
      recommendations.push({
        icon: '🧥',
        title: 'Демисезонная куртка',
        description: 'Лёгкая куртка с подкладкой',
        priority: 'medium',
      });
    } else if (temperature <= 20) {
      recommendations.push({
        icon: '👕',
        title: 'Лёгкая одежда',
        description: 'Джинсовка, свитер, лонгслив',
        priority: 'low',
      });
    } else {
      recommendations.push({
        icon: '👕',
        title: 'Летняя одежда',
        description: 'Футболка, шорты, платье',
        priority: 'low',
      });
    }

    // Wind protection
    if (windSpeed > 15) {
      recommendations.push({
        icon: '🧣',
        title: 'Защита от ветра',
        description: 'Ветровка, шарф, капюшон',
        priority: 'high',
      });
    } else if (windSpeed > 8) {
      recommendations.push({
        icon: '🧣',
        title: 'Ветреная погода',
        description: 'Лёгкая ветровка не помешает',
        priority: 'medium',
      });
    }

    // Precipitation
    if (condition?.code === 'rain' || condition?.code === 'drizzle') {
      recommendations.push({
        icon: '☔',
        title: 'Дождевик или зонт',
        description: 'Не забудьте защиту от дождя',
        priority: 'high',
      });
    }

    if (condition?.code === 'snow') {
      recommendations.push({
        icon: '👢',
        title: 'Зимняя обувь',
        description: 'Непромокаемые ботинки',
        priority: 'high',
      });
    }

    // UV protection
    if (uvIndex >= 6) {
      recommendations.push({
        icon: '🕶️',
        title: 'Защита от солнца',
        description: 'Солнцезащитные очки, крем SPF',
        priority: uvIndex >= 8 ? 'critical' : 'high',
      });
    }

    // Headwear
    if (temperature <= 5) {
      recommendations.push({
        icon: '🧢',
        title: 'Головной убор',
        description: 'Шапка или тёплая кепка',
        priority: 'high',
      });
    } else if (uvIndex >= 5) {
      recommendations.push({
        icon: '🧢',
        title: 'Панама/кепка',
        description: 'Защита головы от солнца',
        priority: 'medium',
      });
    }

    // Gloves
    if (temperature <= 0) {
      recommendations.push({
        icon: '🧤',
        title: 'Перчатки',
        description: 'Тёплые перчатки обязательны',
        priority: 'high',
      });
    }

    // Scarf
    if (temperature <= 5 || windSpeed > 10) {
      recommendations.push({
        icon: '🧣',
        title: 'Шарф',
        description: 'Защита шеи от холода и ветра',
        priority: 'medium',
      });
    }

    return recommendations;
  };

  // General advice
  const getGeneralAdvice = () => {
    const feelsLike = current.feelsLike || temperature;

    if (feelsLike <= -15) {
      return {
        text: 'Экстремально холодно! Минимизируйте время на улице.',
        color: 'text-red-400',
        bg: 'bg-red-500/20',
        border: 'border-red-500/30',
        icon: '❄️',
      };
    } else if (feelsLike <= -5) {
      return {
        text: 'Очень холодно. Оденьтесь максимально тепло.',
        color: 'text-blue-400',
        bg: 'bg-blue-500/20',
        border: 'border-blue-500/30',
        icon: '🥶',
      };
    } else if (feelsLike <= 5) {
      return {
        text: 'Холодно. Тёплая одежда обязательна.',
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/20',
        border: 'border-cyan-500/30',
        icon: '🧥',
      };
    } else if (feelsLike <= 15) {
      return {
        text: 'Прохладно. Лёгкая куртка не помешает.',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/20',
        border: 'border-emerald-500/30',
        icon: '🍃',
      };
    } else if (feelsLike <= 25) {
      return {
        text: 'Комфортная погода. Идеально для прогулок!',
        color: 'text-lime-400',
        bg: 'bg-lime-500/20',
        border: 'border-lime-500/30',
        icon: '😊',
      };
    } else if (feelsLike <= 32) {
      return {
        text: 'Тепло. Лёгкая одежда и вода с собой.',
        color: 'text-amber-400',
        bg: 'bg-amber-500/20',
        border: 'border-amber-500/30',
        icon: '☀️',
      };
    } else {
      return {
        text: 'Жарко! Избегайте пребывания на солнце.',
        color: 'text-orange-400',
        bg: 'bg-orange-500/20',
        border: 'border-orange-500/30',
        icon: '🔥',
      };
    }
  };

  const recommendations = getOutfitRecommendations();
  const generalAdvice = getGeneralAdvice();

  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/15 border-red-500/40 hover:bg-red-500/25';
      case 'high':
        return 'bg-orange-500/15 border-orange-500/40 hover:bg-orange-500/25';
      case 'medium':
        return 'bg-amber-500/15 border-amber-500/40 hover:bg-amber-500/25';
      default:
        return 'bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50';
    }
  };

  return (
    <Card title="Что надеть" icon={Shirt} className="col-span-full lg:col-span-2" size="lg">
      <div className="space-y-5">
        {/* General Advice */}
        <motion.div
          className={`p-5 rounded-2xl ${generalAdvice.bg} ${generalAdvice.border} border ${generalAdvice.color}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center gap-4">
            <motion.span
              className="text-4xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {generalAdvice.icon}
            </motion.span>
            <p className="font-semibold text-base">{generalAdvice.text}</p>
          </div>
        </motion.div>

        {/* Recommendations Grid */}
        <div>
          <motion.h3
            className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="w-8 h-px bg-slate-600" />
            Рекомендации
          </motion.h3>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {recommendations.map((item, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-xl border backdrop-blur-sm transition-all ${getPriorityStyles(item.priority)}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.25 + index * 0.05 }}
                whileHover={{ scale: 1.03, y: -2 }}
              >
                <div className="flex items-start gap-3">
                  <motion.span
                    className="text-2xl"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {item.icon}
                  </motion.span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-100 text-sm">
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {item.description}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Weather Tags */}
        <motion.div
          className="pt-4 border-t border-slate-700/50"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-wrap gap-2">
            {temperature <= 10 && (
              <motion.span
                className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/30"
                whileHover={{ scale: 1.05 }}
              >
                🌡️ {temperature}°C
              </motion.span>
            )}
            {windSpeed > 5 && (
              <motion.span
                className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-500/30"
                whileHover={{ scale: 1.05 }}
              >
                💨 {windSpeed} м/с
              </motion.span>
            )}
            {uvIndex >= 5 && (
              <motion.span
                className="px-3 py-1.5 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded-full border border-amber-500/30"
                whileHover={{ scale: 1.05 }}
              >
                ☀️ УФ {uvIndex}
              </motion.span>
            )}
            {condition?.code === 'rain' && (
              <motion.span
                className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/30"
                whileHover={{ scale: 1.05 }}
              >
                🌧️ Дождь
              </motion.span>
            )}
            {condition?.code === 'snow' && (
              <motion.span
                className="px-3 py-1.5 bg-sky-500/20 text-sky-400 text-xs font-semibold rounded-full border border-sky-500/30"
                whileHover={{ scale: 1.05 }}
              >
                ❄️ Снег
              </motion.span>
            )}
          </div>
        </motion.div>
      </div>
    </Card>
  );
};

export default OutfitWidget;
