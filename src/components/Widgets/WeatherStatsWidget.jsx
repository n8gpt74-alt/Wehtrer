import { useState } from 'react';
import { Trophy, TrendingUp, Calendar, Thermometer, Droplets } from 'lucide-react';
import Card from '../common/Card';
import { useWeatherHistory } from '../../hooks/useWeatherHistory';

const WeatherStatsWidget = ({ location }) => {
  const { records, getStats, clearHistory } = useWeatherHistory(location);
  const [period, setPeriod] = useState(7);

  const stats = getStats(period);

  if (!stats && !records) {
    return (
      <Card title="📊 Статистика" icon={TrendingUp}>
        <div className="text-center py-8 text-slate-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Нет данных за выбранный период</p>
          <p className="text-xs mt-2">Продолжайте пользоваться приложением</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="📊 Статистика погоды" icon={TrendingUp} className="col-span-full">
      {/* Период */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {[7, 14, 30].map(days => (
            <button
              key={days}
              onClick={() => setPeriod(days)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                period === days
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {days} дн
            </button>
          ))}
        </div>
        <button
          onClick={clearHistory}
          className="px-3 py-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors"
        >
          Очистить
        </button>
      </div>

      {stats && (
        <>
          {/* Основная статистика */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-3 bg-slate-700/30 rounded-lg text-center">
              <Thermometer className="w-5 h-5 mx-auto mb-2 text-orange-400" />
              <div className="text-xs text-slate-400">Средняя t°</div>
              <div className="text-lg font-bold text-slate-100">{stats.avgTemp}°C</div>
            </div>
            <div className="p-3 bg-slate-700/30 rounded-lg text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-2 text-red-400" />
              <div className="text-xs text-slate-400">Макс. t°</div>
              <div className="text-lg font-bold text-slate-100">{stats.maxTemp}°C</div>
            </div>
            <div className="p-3 bg-slate-700/30 rounded-lg text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-2 text-blue-400" />
              <div className="text-xs text-slate-400">Мин. t°</div>
              <div className="text-lg font-bold text-slate-100">{stats.minTemp}°C</div>
            </div>
            <div className="p-3 bg-slate-700/30 rounded-lg text-center">
              <Droplets className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
              <div className="text-xs text-slate-400">Средняя влажность</div>
              <div className="text-lg font-bold text-slate-100">{stats.avgHumidity}%</div>
            </div>
          </div>
        </>
      )}

      {/* Рекорды */}
      {records && (
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            Рекорды
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg">
              <div className="text-xs text-orange-400 mb-1">Макс. температура</div>
              <div className="text-xl font-bold text-slate-100">{records.maxTemp.value}°C</div>
              <div className="text-xs text-slate-500 mt-1">
                {records.maxTemp.date ? new Date(records.maxTemp.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) : '—'}
              </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg">
              <div className="text-xs text-blue-400 mb-1">Мин. температура</div>
              <div className="text-xl font-bold text-slate-100">{records.minTemp.value}°C</div>
              <div className="text-xs text-slate-500 mt-1">
                {records.minTemp.date ? new Date(records.minTemp.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) : '—'}
              </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg">
              <div className="text-xs text-purple-400 mb-1">Макс. ветер</div>
              <div className="text-xl font-bold text-slate-100">{records.maxWind.value} м/с</div>
              <div className="text-xs text-slate-500 mt-1">
                {records.maxWind.date ? new Date(records.maxWind.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) : '—'}
              </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg">
              <div className="text-xs text-yellow-400 mb-1">Макс. УФ-индекс</div>
              <div className="text-xl font-bold text-slate-100">{records.maxUV.value}</div>
              <div className="text-xs text-slate-500 mt-1">
                {records.maxUV.date ? new Date(records.maxUV.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) : '—'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Информация о данных */}
      {stats && (
        <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-500 flex items-center justify-between">
          <span>Записей в истории: {stats.entries}</span>
          <span>Период: последние {period} дн</span>
        </div>
      )}
    </Card>
  );
};

export default WeatherStatsWidget;
