import { Sun } from 'lucide-react';
import Card from '../common/Card';
import { motion } from 'framer-motion';
import { getUVIndexLevel } from '../../utils/formatters';

const UVIndex = ({ value }) => {
  const { level, color } = getUVIndexLevel(value);
  const maxUV = 11;
  const percentage = Math.min((value / maxUV) * 100, 100);
  
  // Calculate circle stroke
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card title="УФ-индекс" icon={Sun} variant="glass">
      <div className="flex flex-col items-center py-2">
        {/* Animated circular progress */}
        <div className="relative w-32 h-32">
          <motion.svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 120 120"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="rgba(148, 163, 184, 0.2)"
              strokeWidth="12"
            />
            {/* Progress circle with gradient */}
            <defs>
              <linearGradient id="uvGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="25%" stopColor="#eab308" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="75%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="url(#uvGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </motion.svg>
          
          {/* Center value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-4xl font-bold font-mono text-slate-100"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              {value}
            </motion.span>
          </div>
        </div>

        {/* Level indicator */}
        <motion.div
          className={`mt-3 text-sm font-semibold ${color}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {level}
        </motion.div>

        {/* Recommendations */}
        <motion.div
          className="mt-3 text-xs text-slate-400 text-center px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {value <= 2 && '☀️ Защита не требуется'}
          {value > 2 && value <= 5 && '🧴 Рекомендуется крем SPF 30+'}
          {value > 5 && value <= 7 && '🕶️ Необходима защита кожи и глаз'}
          {value > 7 && value <= 10 && '🏠 Избегайте пребывания на солнце'}
          {value > 10 && '⚠️ Экстремальная опасность!'}
        </motion.div>
      </div>
    </Card>
  );
};

export default UVIndex;
