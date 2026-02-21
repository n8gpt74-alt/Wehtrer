import { Droplets } from 'lucide-react';
import Card from '../common/Card';

const chartSize = { width: 100, height: 56, paddingX: 4, paddingY: 6 };

const HumidityChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const chartData = data.slice(0, 24).map((item) => ({
    time: item.hour,
    humidity: item.humidity,
  }));

  const getX = (index) => chartSize.paddingX + (index / Math.max(chartData.length - 1, 1)) * (chartSize.width - chartSize.paddingX * 2);
  const getY = (value) => chartSize.height - chartSize.paddingY - (value / 100) * (chartSize.height - chartSize.paddingY * 2);

  const points = chartData.map((item, index) => `${getX(index)},${getY(item.humidity)}`).join(' ');
  const area = `${points} ${getX(chartData.length - 1)},${chartSize.height - chartSize.paddingY} ${getX(0)},${chartSize.height - chartSize.paddingY}`;
  const avgHumidity = Math.round(chartData.reduce((sum, item) => sum + item.humidity, 0) / chartData.length);

  return (
    <Card title="Влажность" icon={Droplets} variant="glass" className="card-gradient-header">
      <div className="sr-only">
        <table>
          <caption>Почасовая влажность воздуха</caption>
          <thead>
            <tr>
              <th>Время</th>
              <th>Влажность</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item) => (
              <tr key={`humidity-row-${item.time}`}>
                <td>{item.time}</td>
                <td>{item.humidity}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="h-48 rounded-xl border border-slate-600/25 bg-slate-900/25 p-3">
        <svg viewBox={`0 0 ${chartSize.width} ${chartSize.height}`} className="h-full w-full" preserveAspectRatio="none" role="img" aria-label="График влажности">
          {[0, 25, 50, 75, 100].map((tick) => {
            const y = getY(tick);
            return <line key={`tick-${tick}`} x1={chartSize.paddingX} x2={chartSize.width - chartSize.paddingX} y1={y} y2={y} stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="1.5 1.5" />;
          })}

          <line
            x1={chartSize.paddingX}
            x2={chartSize.width - chartSize.paddingX}
            y1={getY(60)}
            y2={getY(60)}
            stroke="rgba(34, 197, 94, 0.5)"
            strokeDasharray="1.2 1.2"
          />

          <polygon points={area} fill="rgba(6, 182, 212, 0.22)" />
          <polyline points={points} fill="none" stroke="#22d3ee" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="mt-2 text-center text-xs text-slate-400">
        Средняя влажность: <span className="font-semibold text-slate-200">{avgHumidity}%</span> • Оптимум: 40–60%
      </div>
    </Card>
  );
};

export default HumidityChart;
