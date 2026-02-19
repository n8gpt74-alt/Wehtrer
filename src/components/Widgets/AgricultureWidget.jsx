import { Tractor, Droplets, Thermometer, Snowflake, Sprout } from 'lucide-react';
import Card from '../common/Card';

const AgricultureWidget = ({ data }) => {
  if (!data) return null;

  const getConditionColor = (color) => {
    switch (color) {
      case 'green': return 'text-green-400 bg-green-500/20';
      case 'lime': return 'text-lime-400 bg-lime-500/20';
      case 'yellow': return 'text-yellow-400 bg-yellow-500/20';
      case 'orange': return 'text-orange-400 bg-orange-500/20';
      case 'red': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Низкий': return 'text-green-400';
      case 'Умеренный': return 'text-yellow-400';
      case 'Высокий': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <Card title="Сельское хозяйство" icon={Tractor} className="col-span-full lg:col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Общие условия */}
        <div className={`p-4 rounded-lg ${getConditionColor(data.conditions.color)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Условия для роста</span>
            <Sprout className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold">{data.conditions.status}</p>
          <p className="text-xs opacity-80 mt-1">{data.conditions.description}</p>
        </div>

        {/* Показатели */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-400">Влажность почвы</span>
            </div>
            <p className="text-lg font-bold text-slate-100">{data.soilMoisture}%</p>
          </div>
          <div className="p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Thermometer className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-slate-400">Темп. почвы</span>
            </div>
            <p className="text-lg font-bold text-slate-100">{data.soilTemperature}°C</p>
          </div>
          <div className="p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Snowflake className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-slate-400">Риск заморозков</span>
            </div>
            <p className={`text-lg font-bold ${getRiskColor(data.frostRisk)}`}>
              {data.frostRisk}
            </p>
          </div>
          <div className="p-3 bg-slate-700/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-400">Испарение</span>
            </div>
            <p className="text-lg font-bold text-slate-100">{data.evapotranspiration} мм</p>
          </div>
        </div>

        {/* Полив */}
        <div className="p-4 bg-slate-700/50 rounded-lg">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Полив</h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Статус:</span>
            <span className={`text-sm font-medium ${
              data.irrigationNeed === 'Требуется' ? 'text-red-400' :
              data.irrigationNeed === 'Скоро' ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {data.irrigationNeed}
            </span>
          </div>
          {data.irrigationAmount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Рекомендуемый объём:</span>
              <span className="text-sm text-slate-200">{data.irrigationAmount} л/м²</span>
            </div>
          )}
          <div className="mt-2 h-2 bg-slate-600 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                data.soilMoisture > 60 ? 'bg-green-500' :
                data.soilMoisture > 40 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${data.soilMoisture}%` }}
            />
          </div>
        </div>

        {/* Опрыскивание */}
        <div className="p-4 bg-slate-700/50 rounded-lg">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Опрыскивание</h4>
          <div className={`p-2 rounded ${
            data.sprayingConditions.suitable ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            <p className={`text-sm font-medium ${
              data.sprayingConditions.suitable ? 'text-green-400' : 'text-red-400'
            }`}>
              {data.sprayingConditions.suitable ? 'Условия подходящие' : 'Не рекомендуется'}
            </p>
            <p className="text-xs text-slate-400 mt-1">{data.sprayingConditions.reason}</p>
          </div>
        </div>

        {/* Культуры */}
        <div className="col-span-full">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Состояние культур</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {data.crops.map((crop, index) => (
              <div 
                key={index}
                className={`p-2 rounded text-center ${
                  crop.status === 'Благоприятно' ? 'bg-green-500/20' : 'bg-orange-500/20'
                }`}
              >
                <p className="text-sm font-medium text-slate-200">{crop.name}</p>
                <p className={`text-xs ${
                  crop.status === 'Благоприятно' ? 'text-green-400' : 'text-orange-400'
                }`}>
                  {crop.status}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* GDD */}
        <div className="col-span-full p-3 bg-slate-700/30 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Градусо-дни роста (GDD)</span>
            <span className="text-sm font-medium text-slate-200">
              {data.growingDegreeDays} °D
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AgricultureWidget;
