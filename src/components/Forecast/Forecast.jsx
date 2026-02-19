import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, CloudRain, Droplets, Sun } from 'lucide-react';
import Card from '../common/Card';
import { formatTemperature } from '../../utils/formatters';

/**
 * Get weather icon based on precipitation
 */
const getWeatherIcon = (precipitation, size = 6) => {
  const iconClass = `w-${size} h-${size}`;
  if (precipitation > 0.5) {
    return <CloudRain className={`${iconClass} text-blue-400`} />;
  }
  return <Sun className={`${iconClass} text-amber-400`} />;
};

/**
 * Hourly Forecast Item
 */
const HourlyItem = ({ data, isNow, index }) => (
  <motion.div
    className={`flex flex-col items-center p-3 sm:p-3.5 rounded-2xl min-w-[72px] sm:min-w-[84px] transition-all backdrop-blur-sm ${
      isNow
        ? 'bg-gradient-to-br from-blue-500/40 to-cyan-500/40 border border-blue-400/50 shadow-xl shadow-blue-500/25'
        : 'bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 card-glass'
    }`}
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay: index * 0.03, duration: 0.35, type: 'spring' }}
    whileHover={{ scale: 1.08, y: -4 }}
    layout
  >
    <span className={`text-xs font-medium ${isNow ? 'text-blue-300' : 'text-slate-400'}`}>
      {isNow ? 'Сейчас' : data.hour}
    </span>
    
    <motion.div
      className="my-2"
      whileHover={{ scale: 1.15, rotate: 10 }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      {getWeatherIcon(data.precipitation)}
    </motion.div>
    
    <span className="text-base font-bold text-slate-100 font-mono">
      {formatTemperature(data.temperature, false)}°
    </span>
    
    {data.precipitationProbability > 20 && (
      <motion.div
        className="flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-blue-500/20 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.03 + 0.2, type: 'spring' }}
      >
        <Droplets className="w-3 h-3 text-blue-400" />
        <span className="text-xs text-blue-300 font-mono font-semibold">{data.precipitationProbability}%</span>
      </motion.div>
    )}
  </motion.div>
);

/**
 * Daily Forecast Item
 */
const DailyItem = ({ data, isToday, index }) => (
  <motion.div
    className={`flex items-center justify-between p-4 sm:p-4.5 rounded-2xl gap-4 transition-all backdrop-blur-sm ${
      isToday
        ? 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border border-blue-400/50 shadow-xl shadow-blue-500/20'
        : 'bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 card-glass'
    }`}
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05, duration: 0.4 }}
    whileHover={{ x: 6, scale: 1.01 }}
    layout
  >
    {/* Day Info */}
    <div className="flex items-center gap-3 sm:gap-4 min-w-[90px] sm:min-w-[120px]">
      <motion.div
        className="text-left"
        whileHover={{ scale: 1.05 }}
      >
        <p className="text-sm sm:text-base font-semibold text-slate-100">{data.dayName}</p>
        <p className="text-xs text-slate-400 mt-0.5">{data.dayNumber} {data.month}</p>
      </motion.div>
    </div>

    {/* Precipitation */}
    <div className="flex items-center gap-2">
      {data.precipitationProbability > 20 && (
        <motion.div
          className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/20 rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.05 + 0.15, type: 'spring' }}
        >
          <Droplets className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-blue-300 font-mono font-semibold">{data.precipitationProbability}%</span>
        </motion.div>
      )}
    </div>

    {/* Temperature Range */}
    <div className="flex items-center gap-3 sm:gap-4">
      <span className="text-sm text-slate-400 w-10 text-right font-mono">
        {formatTemperature(data.tempMin, false)}°
      </span>
      
      {/* Temperature Bar */}
      <div className="hidden sm:block w-24 md:w-32 h-3 bg-slate-700/60 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-400 via-cyan-400 to-amber-400 rounded-full"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '100%', opacity: 1 }}
          transition={{ delay: index * 0.05 + 0.25, duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      
      <span className="text-sm font-bold text-slate-100 w-10 font-mono">
        {formatTemperature(data.tempMax, false)}°
      </span>
    </div>
  </motion.div>
);

/**
 * Forecast Component - Main
 */
const Forecast = ({ hourlyData, dailyData }) => {
  const [activeTab, setActiveTab] = useState('hourly');

  if (!hourlyData || !dailyData) return null;

  // Tab variants
  const tabVariants = {
    inactive: { scale: 1, backgroundColor: 'rgba(51, 65, 85, 0.5)' },
    active: { 
      scale: 1.02,
      backgroundColor: 'rgba(59, 130, 246, 0.9)',
      boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
    },
  };

  return (
    <Card className="col-span-full" variant="gradient" size="lg">
      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        <motion.button
          onClick={() => setActiveTab('hourly')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all backdrop-blur-sm border ${
            activeTab === 'hourly'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 border-blue-400/50'
              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border-slate-600/30'
          }`}
          variants={tabVariants}
          animate={activeTab === 'hourly' ? 'active' : 'inactive'}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <Clock className="w-4 h-4" />
          Почасовой
        </motion.button>
        <motion.button
          onClick={() => setActiveTab('daily')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all backdrop-blur-sm border ${
            activeTab === 'daily'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 border-blue-400/50'
              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border-slate-600/30'
          }`}
          variants={tabVariants}
          animate={activeTab === 'daily' ? 'active' : 'inactive'}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <Calendar className="w-4 h-4" />
          На неделю
        </motion.button>
      </div>

      {/* Content with AnimatePresence for smooth transitions */}
      <AnimatePresence mode="wait">
        {activeTab === 'hourly' ? (
          <motion.div
            key="hourly"
            className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-thin"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {hourlyData.slice(0, 24).map((hour, index) => (
              <HourlyItem key={index} data={hour} isNow={index === 0} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="daily"
            className="flex flex-col gap-2.5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {dailyData.map((day, index) => (
              <DailyItem key={index} data={day} isToday={index === 0} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default Forecast;
