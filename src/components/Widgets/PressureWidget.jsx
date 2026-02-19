import { Gauge, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../common/Card';

/**
 * Trend Icon Component
 */
const TrendIcon = ({ trend }) => {
  const icons = {
    rising: { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    falling: { icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-500/20' },
    stable: { icon: Minus, color: 'text-slate-400', bg: 'bg-slate-500/20' },
  };
  
  const { icon: Icon, color, bg } = icons[trend] || icons.stable;
  
  return (
    <motion.div
      className={`p-2 rounded-xl ${bg}`}
      whileHover={{ scale: 1.1, rotate: trend === 'rising' ? 5 : trend === 'falling' ? -5 : 0 }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      <Icon className={`w-5 h-5 ${color}`} />
    </motion.div>
  );
};

const PressureWidget = ({ data, history = [] }) => {
  if (!data) return null;

  // Determine pressure trend
  const getTrend = () => {
    if (history.length < 2) return 'stable';
    const diff = data - history[history.length - 2];
    if (diff > 1) return 'rising';
    if (diff < -1) return 'falling';
    return 'stable';
  };

  const trend = getTrend();

  // Normal pressure (760 mmHg at sea level)
  const normalPressure = 760;
  const deviation = Math.round(data - normalPressure);

  // Pressure status
  const getPressureStatus = () => {
    if (data < 740) return { label: 'Низкое', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' };
    if (data < 760) return { label: 'Пониженное', color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/30' };
    if (data < 770) return { label: 'Нормальное', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' };
    if (data < 780) return { label: 'Повышенное', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' };
    return { label: 'Высокое', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
  };

  const status = getPressureStatus();

  // Convert to different units
  const mmHg = Math.round(data * 0.750062);
  const inHg = Math.round(data * 0.02953 * 100) / 100;
  const hPa = Math.round(data);

  return (
    <Card title="Давление" icon={Gauge}>
      <div className="space-y-5">
        {/* Main Value */}
        <motion.div
          className="text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
        >
          <motion.div
            className="text-4xl font-bold text-slate-100 font-mono"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.15, type: 'spring' }}
          >
            {mmHg}
            <span className="text-base text-slate-500 ml-2 font-normal">мм рт.ст.</span>
          </motion.div>
          <motion.div
            className={`inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full text-sm font-semibold ${status.bg} ${status.color} border ${status.border}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="w-2 h-2 rounded-full bg-current opacity-60" />
            {status.label}
          </motion.div>
        </motion.div>

        {/* Trend Indicator */}
        <motion.div
          className="flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <TrendIcon trend={trend} />
          <span className={`text-sm font-medium ${
            trend === 'rising' ? 'text-emerald-400' :
            trend === 'falling' ? 'text-red-400' :
            'text-slate-400'
          }`}>
            {trend === 'rising' ? 'Растёт' : trend === 'falling' ? 'Падает' : 'Стабильно'}
          </span>
        </motion.div>

        {/* Units Grid */}
        <motion.div
          className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center p-2.5 bg-slate-700/30 rounded-xl border border-slate-600/30 backdrop-blur-sm">
            <div className="text-xs text-slate-500 font-medium mb-1">гПа</div>
            <div className="text-lg font-bold text-slate-200 font-mono">{hPa}</div>
          </div>
          <div className="text-center p-2.5 bg-slate-700/30 rounded-xl border border-slate-600/30 backdrop-blur-sm">
            <div className="text-xs text-slate-500 font-medium mb-1">inHg</div>
            <div className="text-lg font-bold text-slate-200 font-mono">{inHg}</div>
          </div>
          <div className="text-center p-2.5 bg-slate-700/30 rounded-xl border border-slate-600/30 backdrop-blur-sm">
            <div className="text-xs text-slate-500 font-medium mb-1">Δ</div>
            <div className={`text-lg font-bold font-mono ${deviation >= 0 ? 'text-emerald-400' : 'text-blue-400'}`}>
              {deviation >= 0 ? '+' : ''}{deviation}
            </div>
          </div>
          <div className="text-center p-2.5 bg-slate-700/30 rounded-xl border border-slate-600/30 backdrop-blur-sm">
            <div className="text-xs text-slate-500 font-medium mb-1">Норма</div>
            <div className="text-lg font-bold text-slate-200 font-mono">{normalPressure}</div>
          </div>
        </motion.div>

        {/* Health Advisory */}
        <motion.div
          className={`p-3 rounded-xl text-center text-sm ${
            Math.abs(deviation) > 10
              ? 'bg-red-500/10 border border-red-500/30 text-red-400'
              : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
          }`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          whileHover={{ scale: 1.02 }}
        >
          {Math.abs(deviation) > 10 && '🔴 Возможны метеозависимые реакции'}
          {Math.abs(deviation) <= 10 && '🟢 Комфортное давление для здоровья'}
        </motion.div>
      </div>
    </Card>
  );
};

export default PressureWidget;
