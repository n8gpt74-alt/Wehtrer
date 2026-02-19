import { Droplets } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
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
          <Droplets className="w-4 h-4 text-cyan-400" />
          <p className="text-sm font-semibold text-cyan-400">
            {payload[0].value}%
          </p>
        </div>
      </motion.div>
    );
  }
  return null;
};

const HumidityChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const chartData = data.slice(0, 24).map((item) => ({
    time: item.hour,
    humidity: item.humidity,
  }));

  return (
    <Card title="Влажность" icon={Droplets} variant="glass" className="card-gradient-header">
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={60}
              stroke="#22c55e"
              strokeDasharray="5 5"
              label={{ value: 'Комфорт', fill: '#22c55e', fontSize: 10 }}
            />
            <Area
              type="monotone"
              dataKey="humidity"
              stroke="#06b6d4"
              strokeWidth={3}
              fill="url(#humidityGradient)"
              animationDuration={1500}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <motion.div
        className="mt-2 text-xs text-slate-500 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        💧 Оптимальная влажность: 40-60%
      </motion.div>
    </Card>
  );
};

export default HumidityChart;
