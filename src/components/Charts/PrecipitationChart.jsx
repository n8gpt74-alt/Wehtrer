import { CloudRain } from 'lucide-react';
import Card from '../common/Card';

const chartSize = { width: 100, height: 56, paddingX: 4, paddingY: 6 };

const getBarColor = (probability) => {
  if (probability > 70) return '#3b82f6';
  if (probability > 40) return '#60a5fa';
  return '#93c5fd';
};

const PrecipitationChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const chartData = data.slice(0, 24).map((item) => ({
    time: item.hour,
    precipitation: item.precipitation,
    probability: item.precipitationProbability,
  }));

  const maxPrecip = Math.max(1, ...chartData.map((item) => item.precipitation));
  const barWidth = (chartSize.width - chartSize.paddingX * 2) / chartData.length;

  return (
    <Card title="Осадки" icon={CloudRain} variant="glass" className="card-gradient-header">
      <div className="sr-only">
        <table>
          <caption>Почасовые осадки и вероятность осадков</caption>
          <thead>
            <tr>
              <th>Время</th>
              <th>Осадки (мм)</th>
              <th>Вероятность (%)</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item) => (
              <tr key={`precipitation-row-${item.time}`}>
                <td>{item.time}</td>
                <td>{item.precipitation}</td>
                <td>{item.probability}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="h-48 rounded-xl border border-slate-600/25 bg-slate-900/25 p-3">
        <svg viewBox={`0 0 ${chartSize.width} ${chartSize.height}`} className="h-full w-full" preserveAspectRatio="none" role="img" aria-label="График осадков">
          {[0, 1, 2, 3].map((step) => {
            const y = chartSize.paddingY + (step / 3) * (chartSize.height - chartSize.paddingY * 2);
            return <line key={`grid-${step}`} x1={chartSize.paddingX} x2={chartSize.width - chartSize.paddingX} y1={y} y2={y} stroke="rgba(148, 163, 184, 0.13)" strokeDasharray="1.4 1.4" />;
          })}

          {chartData.map((item, index) => {
            const x = chartSize.paddingX + index * barWidth + 0.2;
            const barHeight = (item.precipitation / maxPrecip) * (chartSize.height - chartSize.paddingY * 2);
            const y = chartSize.height - chartSize.paddingY - barHeight;

            return (
              <rect
                key={`bar-${item.time}-${index}`}
                x={x}
                y={y}
                width={Math.max(0.35, barWidth - 0.35)}
                height={Math.max(0.8, barHeight)}
                rx="0.35"
                fill={getBarColor(item.probability)}
                opacity="0.92"
              />
            );
          })}
        </svg>
      </div>

      <div className="mt-2 flex justify-center gap-4 text-xs">
        <span className="flex items-center gap-1 text-slate-400"><i className="h-2.5 w-2.5 rounded bg-blue-300" />&lt;40%</span>
        <span className="flex items-center gap-1 text-slate-400"><i className="h-2.5 w-2.5 rounded bg-blue-400" />40–70%</span>
        <span className="flex items-center gap-1 text-slate-400"><i className="h-2.5 w-2.5 rounded bg-blue-500" />&gt;70%</span>
      </div>
    </Card>
  );
};

export default PrecipitationChart;
