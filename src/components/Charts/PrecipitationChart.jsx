import { CloudRain } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import Card from '../common/Card';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-xl p-3 shadow-2xl"
      >
        <p className="text-slate-300 text-sm font-medium mb-2">{label}</p>
        <div className="flex items-center gap-2">
          <CloudRain className="w-4 h-4 text-blue-400" />
          <p className="text-sm font-semibold text-blue-400">
            {payload[0].value} мм
          </p>
        </div>
        {payload[1] && (
          <p className="text-sm text-slate-400 mt-1">
            Вероятность: {payload[1].value}%
          </p>
        )}
      </motion.div>
    );
  }
  return null;
};

const PrecipitationChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const chartData = data.slice(0, 24).map((item) => ({
    time: item.hour,
    precipitation: item.precipitation,
    probability: item.precipitationProbability,
  }));

  const getBarColor = (probability) => {
    if (probability > 70) return '#3b82f6';
    if (probability > 40) return '#60a5fa';
    return '#93c5fd';
  };

  return (
    <Card title="Осадки" icon={CloudRain} variant="glass" className="card-gradient-header">
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              tickLine={{ stroke: '#475569' }}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              tickLine={{ stroke: '#475569' }}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(value) => `${value}`}
              width={25}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="precipitation" radius={[6, 6, 0, 0]} animationDuration={1200}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.probability)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <motion.div
        className="flex gap-4 mt-2 justify-center text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-300" />
          <span className="text-slate-400">&lt;40%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-400" />
          <span className="text-slate-400">40-70%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span className="text-slate-400">&gt;70%</span>
        </div>
      </motion.div>
    </Card>
  );
};

export default PrecipitationChart;
