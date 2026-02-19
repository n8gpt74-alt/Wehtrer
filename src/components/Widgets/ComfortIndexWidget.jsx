import { Thermometer, Droplets, Wind, Smile, Frown, Meh } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../common/Card';

const ComfortIndexWidget = ({ current }) => {
  if (!current) return null;

  const { temperature, feelsLike, humidity, windSpeed } = current;

  // Calculate comfort index (0-100)
  const calculateComfortIndex = () => {
    let score = 100;
    const details = [];

    // Temperature (ideal 18-24°C)
    if (temperature >= 18 && temperature <= 24) {
      details.push({ name: 'Температура', score: 100, text: 'Идеально' });
    } else if (temperature >= 15 && temperature <= 28) {
      score -= 10;
      details.push({ name: 'Температура', score: 90, text: 'Комфортно' });
    } else if (temperature >= 10 && temperature <= 32) {
      score -= 25;
      details.push({ name: 'Температура', score: 75, text: 'Нормально' });
    } else if (temperature >= 5 && temperature <= 35) {
      score -= 40;
      details.push({ name: 'Температура', score: 60, text: 'Неидеально' });
    } else {
      score -= 60;
      details.push({ name: 'Температура', score: 40, text: 'Экстремально' });
    }

    // Humidity (ideal 40-60%)
    if (humidity >= 40 && humidity <= 60) {
      details.push({ name: 'Влажность', score: 100, text: 'Оптимально' });
    } else if (humidity >= 30 && humidity <= 70) {
      score -= 10;
      details.push({ name: 'Влажность', score: 90, text: 'Нормально' });
    } else if (humidity >= 20 && humidity <= 80) {
      score -= 25;
      details.push({ name: 'Влажность', score: 75, text: 'Сухо/влажно' });
    } else {
      score -= 40;
      details.push({ name: 'Влажность', score: 60, text: 'Дискомфорт' });
    }

    // Wind (comfortable 0-5 m/s)
    if (windSpeed <= 5) {
      details.push({ name: 'Ветер', score: 100, text: 'Штиль' });
    } else if (windSpeed <= 8) {
      score -= 10;
      details.push({ name: 'Ветер', score: 90, text: 'Лёгкий' });
    } else if (windSpeed <= 12) {
      score -= 25;
      details.push({ name: 'Ветер', score: 75, text: 'Умеренный' });
    } else if (windSpeed <= 18) {
      score -= 40;
      details.push({ name: 'Ветер', score: 60, text: 'Сильный' });
    } else {
      score -= 60;
      details.push({ name: 'Ветер', score: 40, text: 'Шторм' });
    }

    // Feels like temperature
    const tempDiff = Math.abs(feelsLike - temperature);
    if (tempDiff <= 2) {
      details.push({ name: 'Ощущается', score: 100, text: 'Как ожидается' });
    } else if (tempDiff <= 5) {
      score -= 5;
      details.push({ name: 'Ощущается', score: 95, text: 'Небольшое отличие' });
    } else {
      score -= 15;
      details.push({ name: 'Ощущается', score: 85, text: 'Существенное отличие' });
    }

    score = Math.max(0, Math.min(100, score));
    return { score, details };
  };

  const { score, details } = calculateComfortIndex();

  // Determine comfort level
  const getComfortLevel = () => {
    if (score >= 80) {
      return {
        label: 'Отлично',
        icon: Smile,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/20',
        border: 'border-emerald-500/30',
        gradient: 'from-emerald-500 to-green-400',
        description: 'Идеальные условия для активного отдыха!',
        emoji: '🌟',
      };
    } else if (score >= 60) {
      return {
        label: 'Хорошо',
        icon: Smile,
        color: 'text-lime-400',
        bg: 'bg-lime-500/20',
        border: 'border-lime-500/30',
        gradient: 'from-lime-500 to-green-400',
        description: 'Комфортные условия с небольшими оговорками.',
        emoji: '👍',
      };
    } else if (score >= 40) {
      return {
        label: 'Нормально',
        icon: Meh,
        color: 'text-amber-400',
        bg: 'bg-amber-500/20',
        border: 'border-amber-500/30',
        gradient: 'from-amber-500 to-yellow-400',
        description: 'Условия приемлемые, но есть дискомфорт.',
        emoji: '⚠️',
      };
    } else if (score >= 20) {
      return {
        label: 'Плохо',
        icon: Frown,
        color: 'text-orange-400',
        bg: 'bg-orange-500/20',
        border: 'border-orange-500/30',
        gradient: 'from-orange-500 to-amber-400',
        description: 'Некомфортные условия для пребывания на улице.',
        emoji: '🏠',
      };
    } else {
      return {
        label: 'Ужасно',
        icon: Frown,
        color: 'text-red-400',
        bg: 'bg-red-500/20',
        border: 'border-red-500/30',
        gradient: 'from-red-500 to-orange-400',
        description: 'Экстремальные условия! Оставайтесь дома.',
        emoji: '🚨',
      };
    }
  };

  const level = getComfortLevel();
  const IconComponent = level.icon;

  return (
    <Card title="Индекс комфорта" icon={Smile}>
      <div className="space-y-5">
        {/* Main Score Display */}
        <motion.div
          className="text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <motion.div
              className={`p-3 rounded-2xl ${level.bg} ${level.border} border`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <IconComponent className={`w-10 h-10 ${level.color}`} />
            </motion.div>
            <div className="text-left">
              <motion.div
                className="text-4xl font-bold text-slate-100 font-mono"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                {score}
                <span className="text-lg text-slate-500 ml-1">/100</span>
              </motion.div>
              <motion.div
                className={`inline-block px-4 py-1.5 rounded-full ${level.bg} ${level.color} font-semibold text-sm mt-1`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                {level.emoji} {level.label}
              </motion.div>
            </div>
          </div>
          <motion.p
            className="text-sm text-slate-400 mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {level.description}
          </motion.p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="relative h-4 bg-slate-700/60 rounded-full overflow-hidden shadow-inner"
          initial={{ opacity: 0, scaleX: 0.9 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.35 }}
        >
          <motion.div
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${level.gradient} transition-all duration-700 rounded-full shadow-lg`}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
          />
          {/* Markers */}
          <div className="absolute inset-0 flex justify-between px-3">
            {[0, 25, 50, 75, 100].map((mark) => (
              <div key={mark} className="w-px bg-slate-500/50 h-full" />
            ))}
          </div>
        </motion.div>

        {/* Details Grid */}
        <motion.div
          className="grid grid-cols-2 gap-2.5 pt-4 border-t border-slate-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          {details.map((detail, index) => (
            <motion.div
              key={index}
              className="p-2.5 bg-slate-700/30 rounded-xl border border-slate-600/30 backdrop-blur-sm"
              whileHover={{ scale: 1.03, backgroundColor: 'rgba(71, 85, 99, 0.4)' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{detail.name}</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    detail.score >= 90
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : detail.score >= 75
                      ? 'bg-lime-500/20 text-lime-400'
                      : detail.score >= 60
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {detail.text}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recommendation */}
        <motion.div
          className={`p-4 rounded-xl ${level.bg} ${level.border} border ${level.color} text-sm text-center font-medium`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          whileHover={{ scale: 1.02 }}
        >
          {score >= 80 && '🌟 Отличный день для прогулок, спорта и отдыха на природе!'}
          {score >= 60 && '👍 Хорошая погода для большинства активностей.'}
          {score >= 40 && '⚠️ Возьмите дополнительную одежду и зонт.'}
          {score >= 20 && '🏠 Лучше остаться дома или сократить время на улице.'}
          {score < 20 && '🚨 Экстремальные условия! Избегайте пребывания на улице.'}
        </motion.div>
      </div>
    </Card>
  );
};

export default ComfortIndexWidget;
