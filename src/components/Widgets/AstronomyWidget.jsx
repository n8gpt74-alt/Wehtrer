import { Sunrise, Sunset, Moon, Sun, Clock } from 'lucide-react';
import Card from '../common/Card';

const AstronomyWidget = ({ data }) => {
  if (!data) return null;

  const formatDayLength = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}ч ${mins}мин`;
  };

  // Фазы луны с эмодзи
  const moonPhaseEmoji = {
    'Новолуние': '🌑',
    'Молодая луна': '🌒',
    'Первая четверть': '🌓',
    'Прибывающая луна': '🌔',
    'Полнолуние': '🌕',
    'Убывающая луна': '🌖',
    'Последняя четверть': '🌗',
    'Старая луна': '🌘',
  };

  return (
    <Card title="Астрономия" icon={Moon}>
      <div className="space-y-4">
        {/* Солнце */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
            <Sunrise className="w-5 h-5 text-orange-400" />
            <div>
              <p className="text-xs text-slate-400">Восход</p>
              <p className="text-sm font-semibold text-slate-100">{data.sunrise}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
            <Sunset className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-xs text-slate-400">Закат</p>
              <p className="text-sm font-semibold text-slate-100">{data.sunset}</p>
            </div>
          </div>
        </div>

        {/* День */}
        <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
          <Sun className="w-5 h-5 text-yellow-400" />
          <div className="flex-1">
            <div className="flex justify-between">
              <p className="text-xs text-slate-400">Продолжительность дня</p>
              <p className="text-sm font-semibold text-slate-100">{formatDayLength(data.dayLength)}</p>
            </div>
            <div className="mt-2 h-2 bg-slate-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 rounded-full"
                style={{ width: `${(data.dayLength / 1440) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Особые моменты */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-slate-700/30 rounded text-center">
            <p className="text-xs text-slate-500">Рассвет</p>
            <p className="text-sm text-slate-300">{data.dawn}</p>
          </div>
          <div className="p-2 bg-slate-700/30 rounded text-center">
            <p className="text-xs text-slate-500">Сумерки</p>
            <p className="text-sm text-slate-300">{data.dusk}</p>
          </div>
          <div className="p-2 bg-slate-700/30 rounded text-center">
            <p className="text-xs text-slate-500">Полдень</p>
            <p className="text-sm text-slate-300">{data.solarNoon}</p>
          </div>
          <div className="p-2 bg-slate-700/30 rounded text-center">
            <p className="text-xs text-slate-500">Золотой час</p>
            <p className="text-sm text-slate-300">{data.goldenHour}</p>
          </div>
        </div>

        {/* Луна */}
        <div className="p-3 bg-slate-700/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{moonPhaseEmoji[data.moonPhase] || '🌙'}</span>
              <div>
                <p className="text-sm font-medium text-slate-100">{data.moonPhase}</p>
                <p className="text-xs text-slate-400">Освещённость: {data.moonIllumination}%</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Высота</p>
              <p className="text-sm text-slate-300">{data.moonAltitude}°</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AstronomyWidget;
