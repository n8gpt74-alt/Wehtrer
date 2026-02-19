import { Wind } from 'lucide-react';
import Card from '../common/Card';
import { motion } from 'framer-motion';
import { getAQILevel } from '../../utils/formatters';

const AirQuality = ({ data }) => {
  if (!data) return null;

  const { level, color } = getAQILevel(data.aqi);
  const maxAQI = 300;
  const percentage = Math.min((data.aqi / maxAQI) * 100, 100);
  
  // Calculate circle stroke
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card title="Качество воздуха" icon={Wind} variant="glass">
      <div className="flex flex-col items-center py-2">
        {/* Circular progress with AQI value */}
        <div className="relative w-28 h-28">
          <motion.svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 110 110"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Background circle */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              fill="none"
              stroke="rgba(148, 163, 184, 0.2)"
              strokeWidth="10"
            />
            {/* Progress circle with dynamic color */}
            <motion.circle
              cx="55"
              cy="55"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={color.replace('bg-', 'text-')}
            />
          </motion.svg>
          
          {/* Center value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-3xl font-bold font-mono text-slate-100"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              {data.aqi}
            </motion.span>
          </div>
        </div>

        {/* Level indicator */}
        <motion.div
          className={`mt-2 px-3 py-1 rounded-full text-xs font-medium text-white ${color}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {level}
        </motion.div>

        {/* Pollutants grid */}
        <div className="grid grid-cols-2 gap-2 w-full mt-4">
          <motion.div
            className="bg-slate-700/40 backdrop-blur-sm rounded-lg p-2 text-center card-glass"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs text-slate-400">PM2.5</p>
            <p className="text-sm font-semibold text-slate-200">{data.pm25}</p>
          </motion.div>
          <motion.div
            className="bg-slate-700/40 backdrop-blur-sm rounded-lg p-2 text-center card-glass"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
          >
            <p className="text-xs text-slate-400">PM10</p>
            <p className="text-sm font-semibold text-slate-200">{data.pm10}</p>
          </motion.div>
          <motion.div
            className="bg-slate-700/40 backdrop-blur-sm rounded-lg p-2 text-center card-glass"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xs text-slate-400">O₃</p>
            <p className="text-sm font-semibold text-slate-200">{data.o3}</p>
          </motion.div>
          <motion.div
            className="bg-slate-700/40 backdrop-blur-sm rounded-lg p-2 text-center card-glass"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.65 }}
          >
            <p className="text-xs text-slate-400">NO₂</p>
            <p className="text-sm font-semibold text-slate-200">{data.no2}</p>
          </motion.div>
        </div>
      </div>
    </Card>
  );
};

export default AirQuality;
