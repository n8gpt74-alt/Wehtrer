import { Wind } from 'lucide-react';
import Card from '../common/Card';

const chartSize = { width: 100, height: 56, paddingX: 4, paddingY: 6 };

const WindChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const chartData = data.slice(0, 24).map((item) => ({
    time: item.hour,
    windSpeed: item.windSpeed,
    windGust: item.windGust,
  }));

  const maxValue = Math.max(1, ...chartData.map((item) => Math.max(item.windSpeed, item.windGust)));
  const barWidth = (chartSize.width - chartSize.paddingX * 2) / chartData.length;

  const getY = (value) => chartSize.height - chartSize.paddingY - (value / maxValue) * (chartSize.height - chartSize.paddingY * 2);
  const gustPoints = chartData
    .map((item, index) => {
      const x = chartSize.paddingX + index * barWidth + barWidth / 2;
      return `${x},${getY(item.windGust)}`;
    })
    .join(' ');

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

      <div className="h-48 rounded-xl border border-slate-600/25 bg-slate-900/25 p-3">
        <svg viewBox={`0 0 ${chartSize.width} ${chartSize.height}`} className="h-full w-full" preserveAspectRatio="none" role="img" aria-label="График ветра">
          {[0, 1, 2, 3].map((step) => {
            const y = chartSize.paddingY + (step / 3) * (chartSize.height - chartSize.paddingY * 2);
            return <line key={`grid-${step}`} x1={chartSize.paddingX} x2={chartSize.width - chartSize.paddingX} y1={y} y2={y} stroke="rgba(148, 163, 184, 0.13)" strokeDasharray="1.4 1.4" />;
          })}

          {chartData.map((item, index) => {
            const x = chartSize.paddingX + index * barWidth + 0.2;
            const barHeight = (item.windSpeed / maxValue) * (chartSize.height - chartSize.paddingY * 2);
            const y = chartSize.height - chartSize.paddingY - barHeight;

            return (
              <rect
                key={`speed-${item.time}-${index}`}
                x={x}
                y={y}
                width={Math.max(0.35, barWidth - 0.35)}
                height={Math.max(0.8, barHeight)}
                rx="0.35"
                fill="#34d399"
                opacity="0.78"
              />
            );
          })}

          <polyline points={gustPoints} fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="mt-2 flex justify-center gap-4 text-xs">
        <span className="flex items-center gap-1 text-slate-400"><i className="h-2.5 w-2.5 rounded bg-emerald-400" />Скорость</span>
        <span className="flex items-center gap-1 text-slate-400"><i className="h-0.5 w-4 bg-amber-400" />Порывы</span>
      </div>
    </Card>
  );
};

export default WindChart;
