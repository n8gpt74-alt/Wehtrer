import { useState } from 'react';
import { Map, Cloud, Wind } from 'lucide-react';
import Card from '../common/Card';

const WeatherMapWidget = ({ location, coordinates }) => {
  const [mapType, setMapType] = useState('precipitation'); // precipitation, clouds, temperature, wind
  const [isLoading, setIsLoading] = useState(true);

  // Координаты для карты
  const lat = coordinates?.lat || 55.7558;
  const lon = coordinates?.lon || 37.6173;

  // Для демонстрации используем iframe с Windy
  const getEmbedUrl = () => {
    // Windy.com embed
    return `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&zoom=6&level=surface&overlay=${mapType}&product=ecmwf&menu=true&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&detailLat=${lat}&detailLon=${lon}&metric=standard&regions=undefined&placename=undefined&dateType=now&lonLat=${lon},${lat}&iframeNum=0`;
  };

  const mapTypes = [
    { id: 'precipitation', label: 'Осадки', icon: null },
    { id: 'clouds', label: 'Облака', icon: Cloud },
    { id: 'temperature', label: 'Температура', icon: null },
    { id: 'wind', label: 'Ветер', icon: Wind },
  ];

  return (
    <Card title="🗺️ Карта погоды" icon={Map} className="col-span-full">
      {/* Типы карт */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {mapTypes.map(type => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => {
                setMapType(type.id);
                setIsLoading(true);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                mapType === type.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {Icon ? (
                <Icon className="w-4 h-4" />
              ) : (
                <span>{type.id === 'precipitation' ? '💧' : type.id === 'temperature' ? '🌡️' : null}</span>
              )}
              {type.label}
            </button>
          );
        })}
      </div>

      {/* Карта */}
      <div className="relative aspect-video bg-slate-800 rounded-xl overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Загрузка карты...</p>
            </div>
          </div>
        )}
        
        <iframe
          src={getEmbedUrl()}
          className="w-full h-full"
          frameBorder="0"
          onLoad={() => setIsLoading(false)}
          allowFullScreen
          title="Weather Map"
        />
      </div>

      {/* Информация */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>📍 {location?.city || 'Координаты'}: {lat.toFixed(2)}, {lon.toFixed(2)}</span>
        <a
          href={`https://www.windy.com/${lat},${lon}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Открыть на Windy.com →
        </a>
      </div>

      {/* Легенда */}
      <div className="mt-3 p-3 bg-slate-700/30 rounded-lg">
        <div className="text-xs text-slate-400 mb-2">
          {mapType === 'precipitation' && '💧 Карта показывает интенсивность осадков. Синий — дождь, белый — снег.'}
          {mapType === 'clouds' && '☁️ Карта облачности показывает плотность облачного покрова.'}
          {mapType === 'temperature' && '🌡️ Температурная карта с цветовой индикацией.'}
          {mapType === 'wind' && '💨 Карта ветра показывает направление и силу воздушных потоков.'}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Данные:</span>
          <span className="px-2 py-0.5 bg-slate-600 rounded text-slate-300">ECMWF</span>
          <span className="px-2 py-0.5 bg-slate-600 rounded text-slate-300">Windy</span>
        </div>
      </div>
    </Card>
  );
};

export default WeatherMapWidget;
