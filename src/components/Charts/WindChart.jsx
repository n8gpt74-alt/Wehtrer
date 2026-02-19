import { Wind } from 'lucide-react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} м/с
            </p>
          </div>
        ))}
      </motion.div>
    );
  }
  return null;
};

const WindChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const chartData = data.slice(0, 24).map((item) => ({
    time: item.hour,
    windSpeed: item.windSpeed,
    windGust: item.windGust,
  }));

  return (
    <Card title="Ветер" icon={Wind} variant="glass" className="card-gradient-header">
      <div className="sr-only">
        <table>
          <caption>Почасовая скорость и порывы ветра</caption>
          <thead>
            <tr>
              <th>Время</th>
              <th>Скорость ветра (м/с)</th>
              <th>Порывы (м/с)</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item) => (
              <tr key={`wind-row-${item.time}`}>
                <td>{item.time}</td>
                <td>{item.windSpeed}</td>
                <td>{item.windGust}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
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
              width={30}
              label={{ value: 'м/с', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="windSpeed"
              fill="#10b981"
              name="Скорость"
              radius={[4, 4, 0, 0]}
              opacity={0.8}
              animationDuration={1200}
            />
            <Line
              type="monotone"
              dataKey="windGust"
              stroke="#f59e0b"
              strokeWidth={3}
              name="Порывы"
              dot={false}
              animationDuration={1200}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <motion.div
        className="flex gap-4 mt-2 justify-center text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-emerald-500 to-green-400" />
          <span className="text-slate-400">Скорость</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-gradient-to-r from-amber-500 to-orange-400" />
          <span className="text-slate-400">Порывы</span>
        </div>
      </motion.div>
    </Card>
  );
};

export default WindChart;
