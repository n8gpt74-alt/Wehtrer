import { motion } from 'framer-motion';
import {
  Droplets,
  Wind,
  Gauge,
  Eye,
  Thermometer,
  Navigation
} from 'lucide-react';
import Card from '../common/Card';
import WeatherAnimation from '../common/WeatherAnimation';
import {
  formatTemperature,
  formatWind,
  formatPressure,
  formatVisibility
} from '../../utils/formatters';

/**
 * Stat Item Component - Enhanced with glassmorphism
 */
const StatItem = ({ label, value, subValue, icon, delay = 0, color = 'blue' }) => {
  const IconComponent = icon;
  const colorClasses = {
    blue: 'from-blue-500/20 to-cyan-500/20 border-blue-400/30 text-blue-400',
    purple: 'from-purple-500/20 to-pink-500/20 border-purple-400/30 text-purple-400',
    orange: 'from-orange-500/20 to-amber-500/20 border-orange-400/30 text-orange-400',
    green: 'from-green-500/20 to-emerald-500/20 border-green-400/30 text-green-400',
  };

  return (
    <motion.div
      className={`flex flex-col items-center text-center p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-sm min-w-0 card-glass`}
      whileHover={{ scale: 1.08, y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, type: 'spring' }}
    >
      <motion.div
        className="p-2 rounded-xl mb-2 bg-slate-800/50"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        <IconComponent className="w-5 h-5" />
      </motion.div>
      <p className="text-xs text-slate-400 truncate w-full font-medium">{label}</p>
      <p className="text-sm font-bold text-slate-100 truncate w-full font-mono mt-0.5">{value}</p>
      {subValue && (
        <p className="text-xs text-slate-500 truncate w-full mt-0.5">{subValue}</p>
      )}
    </motion.div>
  );
};

const CurrentWeather = ({ data, location }) => {
  if (!data) return null;

  return (
    <Card className="col-span-full lg:col-span-2 card-gradient-header" variant="gradient" size="lg">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Main temperature display */}
        <motion.div
          className="flex items-center gap-5 flex-1"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {/* Weather Icon */}
          <motion.div
            className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-500/25 to-purple-500/25 rounded-3xl overflow-hidden ring-2 ring-white/15 shadow-xl shadow-blue-500/20"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <WeatherAnimation type={data.condition?.animation || 'cloudy'} size={64} />
          </motion.div>
          
          {/* Temperature Info */}
          <div className="min-w-0 flex-1">
            <motion.div
              className="flex items-baseline gap-2"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            >
              <span className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-orange-400 via-pink-400 to-orange-400 bg-clip-text text-transparent font-mono tracking-tighter">
                {formatTemperature(data.temperature, false)}
              </span>
              <span className="text-2xl sm:text-3xl text-slate-400 font-light">°C</span>
            </motion.div>
            
            <motion.p
              className="text-slate-300 mt-2 text-base sm:text-lg font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              {data.condition?.label || 'Загрузка...'}
            </motion.p>
            
            <motion.div
              className="flex items-center gap-2 mt-2 text-sm text-slate-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-1.5 bg-slate-800/50 rounded-lg">
                <Thermometer className="w-4 h-4" />
              </div>
              <span>Ощущется как <span className="font-mono text-slate-200 font-semibold">{formatTemperature(data.feelsLike)}</span></span>
            </motion.div>
          </div>
        </motion.div>

        {/* Location info */}
        <motion.div
          className="flex flex-col justify-center lg:text-left border-t lg:border-t-0 lg:border-l border-slate-700/50 pt-4 lg:pt-0 lg:pl-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <motion.h2
            className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {location?.city || 'Загрузка...'}
          </motion.h2>
          <motion.p
            className="text-sm text-slate-400 mt-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            {location?.country || ''}
          </motion.p>
          <motion.div
            className="flex items-center gap-2 mt-3 text-xs text-slate-500"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.span
              className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>Обновлено: {data.lastUpdated}</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Weather stats grid */}
      <motion.div
        className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 mt-6 lg:mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        <StatItem
          icon={Droplets}
          label="Влажность"
          value={`${data.humidity}%`}
          delay={0.4}
          color="blue"
        />
        <StatItem
          icon={Wind}
          label="Ветер"
          value={formatWind(data.windSpeed)}
          subValue={`до ${formatWind(data.windGust)}`}
          delay={0.45}
          color="purple"
        />
        <StatItem
          icon={Navigation}
          label="Направл."
          value={data.windDirectionLabel}
          subValue={`${data.windDirection}°`}
          delay={0.5}
          color="orange"
        />
        <StatItem
          icon={Gauge}
          label="Давление"
          value={formatPressure(data.pressure)}
          delay={0.55}
          color="green"
        />
        <StatItem
          icon={Eye}
          label="Видимость"
          value={formatVisibility(data.visibility)}
          delay={0.6}
          color="blue"
        />
        <StatItem
          icon={Thermometer}
          label="Т. росы"
          value={formatTemperature(data.dewPoint)}
          delay={0.65}
          color="purple"
        />
      </motion.div>
    </Card>
  );
};

export default CurrentWeather;
