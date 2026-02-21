import { Thermometer } from 'lucide-react';
import Card from '../common/Card';

const chartSize = { width: 100, height: 64, paddingX: 4, paddingY: 6 };

const TemperatureChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const chartData = data.slice(0, 24).map((item) => ({
    time: item.hour,
    temperature: item.temperature,
    feelsLike: item.feelsLike,
  }));

  const temps = chartData.flatMap((item) => [item.temperature, item.feelsLike]);
  const minTemp = Math.floor(Math.min(...temps)) - 1;
  const maxTemp = Math.ceil(Math.max(...temps)) + 1;
  const range = Math.max(1, maxTemp - minTemp);

  const getX = (index) => chartSize.paddingX + (index / Math.max(chartData.length - 1, 1)) * (chartSize.width - chartSize.paddingX * 2);
  const getY = (value) => {
    const normalized = (value - minTemp) / range;
    return chartSize.height - chartSize.paddingY - normalized * (chartSize.height - chartSize.paddingY * 2);
  };

  const tempPoints = chartData.map((item, index) => `${getX(index)},${getY(item.temperature)}`).join(' ');
  const feelsPoints = chartData.map((item, index) => `${getX(index)},${getY(item.feelsLike)}`).join(' ');
  const tempArea = `${tempPoints} ${getX(chartData.length - 1)},${chartSize.height - chartSize.paddingY} ${getX(0)},${chartSize.height - chartSize.paddingY}`;
  const feelsArea = `${feelsPoints} ${getX(chartData.length - 1)},${chartSize.height - chartSize.paddingY} ${getX(0)},${chartSize.height - chartSize.paddingY}`;

  return (
    <Card title="Температура" icon={Thermometer} className="col-span-full lg:col-span-2 card-gradient-header" variant="gradient">
      <div className="sr-only">
        <table>
          <caption>Почасовая температура и ощущаемая температура</caption>
          <thead>
            <tr>
              <th>Время</th>
              <th>Температура</th>
              <th>Ощущается как</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item) => (
              <tr key={`temp-row-${item.time}`}>
                <td>{item.time}</td>
                <td>{item.temperature}°C</td>
                <td>{item.feelsLike}°C</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="h-64 rounded-xl border border-slate-600/25 bg-slate-900/25 p-3">
        <svg viewBox={`0 0 ${chartSize.width} ${chartSize.height}`} className="h-full w-full" preserveAspectRatio="none" role="img" aria-label="График температуры">
          {[0, 1, 2, 3].map((step) => {
            const y = chartSize.paddingY + (step / 3) * (chartSize.height - chartSize.paddingY * 2);
            return <line key={`grid-${step}`} x1={chartSize.paddingX} x2={chartSize.width - chartSize.paddingX} y1={y} y2={y} stroke="rgba(148, 163, 184, 0.18)" strokeDasharray="1.5 1.5" />;
          })}

          <polygon points={tempArea} fill="rgba(249, 115, 22, 0.2)" />
          <polygon points={feelsArea} fill="rgba(59, 130, 246, 0.16)" />

          <polyline points={tempPoints} fill="none" stroke="#fb923c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={feelsPoints} fill="none" stroke="#60a5fa" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <span>Мин: {minTemp}°</span>
        <span>Макс: {maxTemp}°</span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-orange-400" />Температура</span>
          <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-blue-400" />Ощущается</span>
        </div>
      </div>
    </Card>
  );
};

export default TemperatureChart;
