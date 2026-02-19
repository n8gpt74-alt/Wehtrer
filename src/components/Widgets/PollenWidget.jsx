import { Flower2, AlertTriangle, Check } from 'lucide-react';
import Card from '../common/Card';

const PollenWidget = ({ data }) => {
  if (!data) return null;

  const getLevelColor = (level) => {
    switch (level) {
      case 'Низкий': return 'bg-green-500';
      case 'Умеренный': return 'bg-yellow-500';
      case 'Высокий': return 'bg-orange-500';
      case 'Очень высокий': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getLevelTextColor = (level) => {
    switch (level) {
      case 'Низкий': return 'text-green-400';
      case 'Умеренный': return 'text-yellow-400';
      case 'Высокий': return 'text-orange-400';
      case 'Очень высокий': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <Card title="Пыльца и аллергены" icon={Flower2}>
      <div className="space-y-4">
        {/* Общий индекс */}
        <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
          <div>
            <p className="text-xs text-slate-400">Общий уровень</p>
            <p className={`text-lg font-bold ${getLevelTextColor(data.overall)}`}>
              {data.overall}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-100">{data.overallIndex}</p>
            <p className="text-xs text-slate-500">из 100</p>
          </div>
        </div>

        {/* Шкала */}
        <div className="h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500 relative">
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-slate-800 shadow"
            style={{ left: `${Math.min(data.overallIndex, 100)}%` }}
          />
        </div>

        {/* Типы пыльцы */}
        <div className="space-y-2">
          {data.types.map((type, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getLevelColor(type.level)}`} />
                <span className="text-sm text-slate-300">{type.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs ${getLevelTextColor(type.level)}`}>
                  {type.level}
                </span>
                <span className="text-sm font-medium text-slate-200 w-8 text-right">
                  {type.index}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Прогноз */}
        <div className="flex gap-2">
          {data.forecast.map((day, index) => (
            <div 
              key={index}
              className="flex-1 p-2 bg-slate-700/30 rounded text-center"
            >
              <p className="text-xs text-slate-500">{day.day}</p>
              <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${getLevelColor(day.level)}`} />
            </div>
          ))}
        </div>

        {/* Рекомендации */}
        <div className="p-3 bg-slate-700/30 rounded-lg">
          <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Рекомендации
          </p>
          <ul className="space-y-1">
            {data.recommendations.map((rec, index) => (
              <li key={index} className="text-xs text-slate-300 flex items-start gap-2">
                <Check className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default PollenWidget;
