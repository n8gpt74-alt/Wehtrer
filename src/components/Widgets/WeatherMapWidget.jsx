import { useMemo, useState } from 'react';
import { Map, Cloud, Wind, Thermometer, Droplets, Gauge } from 'lucide-react';
import Card from '../common/Card';
const MAP_LAYERS = [
  { id: 'rain', label: 'Осадки', icon: Droplets },
  { id: 'clouds', label: 'Облака', icon: Cloud },
  { id: 'wind', label: 'Ветер', icon: Wind },
  { id: 'temp', label: 'Температура', icon: Thermometer },
  { id: 'pressure', label: 'Давление', icon: Gauge },
];

const FORECAST_MODELS = [
  { id: 'ecmwf', label: 'ECMWF' },
  { id: 'gfs', label: 'GFS' },
  { id: 'icon', label: 'ICON' },
];

const MAP_DESCRIPTIONS = {
  rain: 'Осадки и радарная картина по выбранной модели.',
  clouds: 'Плотность и структура облачности.',
  wind: 'Направление и скорость ветра.',
  temp: 'Распределение температуры по региону.',
  pressure: 'Атмосферное давление и барические зоны.',
};
const WeatherMapWidget = ({ location, coordinates }) => {
  const [mapLayer, setMapLayer] = useState('rain');
  const [forecastModel, setForecastModel] = useState('ecmwf');
  const [isLoading, setIsLoading] = useState(true);
  const lat = coordinates?.lat || 55.7558;
  const lon = coordinates?.lon || 37.6173;
  const embedUrl = useMemo(() => {
    return `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&zoom=6&level=surface&overlay=${mapLayer}&product=${forecastModel}&menu=true&message=true&marker=true&calendar=now&type=map&location=coordinates&detail=true&detailLat=${lat}&detailLon=${lon}&metric=metricWind&pressure=true`;
  }, [lat, lon, mapLayer, forecastModel]);

  return (
    <Card title="Карта погоды" icon={Map} className="col-span-full">
      <div className="flex flex-wrap gap-2 mb-3">
        {MAP_LAYERS.map((layer) => {
          const Icon = layer.icon;
          const isActive = mapLayer === layer.id;

          return (
            <button
              key={layer.id}
              onClick={() => {
                setMapLayer(layer.id);
                setIsLoading(true);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {layer.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {FORECAST_MODELS.map((model) => {
          const isActive = forecastModel === model.id;

          return (
            <button
              key={model.id}
              onClick={() => {
                setForecastModel(model.id);
                setIsLoading(true);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-slate-700/70 text-slate-300 hover:bg-slate-600/80'
              }`}
            >
              {model.label}
            </button>
          );
        })}
      </div>
      <div className="relative aspect-video bg-slate-800 rounded-xl overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800/95 z-10">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Загрузка слоя карты...</p>
            </div>
          </div>
        )}
        <iframe
          src={embedUrl}
          className="w-full h-full"
          frameBorder="0"
          onLoad={() => setIsLoading(false)}
          allowFullScreen
          title="Weather Map"
        />
      </div>

      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500">
        <span>{location?.city || 'Координаты'}: {lat.toFixed(2)}, {lon.toFixed(2)}</span>
        <a
          href={`https://www.windy.com/${lat},${lon}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Открыть полноэкранно на Windy.com →
        </a>
      </div>
      <div className="mt-3 p-3 bg-slate-700/30 rounded-lg">
        <div className="text-xs text-slate-300 mb-2">{MAP_DESCRIPTIONS[mapLayer]}</div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Модель:</span>
          <span className="px-2 py-0.5 bg-slate-600 rounded text-slate-200 uppercase">{forecastModel}</span>
          <span className="px-2 py-0.5 bg-slate-600 rounded text-slate-300">Windy</span>
        </div>
      </div>
    </Card>
  );
};
export default WeatherMapWidget;