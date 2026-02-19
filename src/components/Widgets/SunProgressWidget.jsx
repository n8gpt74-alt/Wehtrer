import { Sun, Sunrise, Sunset } from 'lucide-react';
import Card from '../common/Card';

const SunProgressWidget = ({ astronomy }) => {
  if (!astronomy) return null;

  const { sunrise, sunset, solarNoon, dayLength } = astronomy;

  // Расчёт прогресса дня
  const calculateDayProgress = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    // Парсим время восхода и заката
    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    const sunriseMinutes = parseTime(sunrise);
    const sunsetMinutes = parseTime(sunset);
    const totalDayLength = sunsetMinutes - sunriseMinutes;
    
    // Прогресс от восхода до заката
    let progress = 0;
    let status = '';
    
    if (currentTime < sunriseMinutes) {
      status = 'before-sunrise';
      progress = 0;
    } else if (currentTime > sunsetMinutes) {
      status = 'after-sunset';
      progress = 100;
    } else {
      progress = ((currentTime - sunriseMinutes) / totalDayLength) * 100;
      status = currentTime < parseTime(solarNoon) ? 'morning' : 'afternoon';
    }
    
    // Время до следующего события
    let nextEvent = '';
    let timeUntil = '';
    
    if (status === 'before-sunrise') {
      nextEvent = 'Восход';
      const diff = sunriseMinutes - currentTime;
      timeUntil = `${Math.floor(diff / 60)}ч ${diff % 60}мин`;
    } else if (status === 'after-sunset') {
      nextEvent = 'Следующий восход';
      const tomorrowSunrise = sunriseMinutes + 24 * 60;
      const diff = tomorrowSunrise - currentTime;
      timeUntil = `${Math.floor(diff / 60)}ч ${diff % 60}мин`;
    } else if (status === 'morning') {
      nextEvent = 'Закат';
      const diff = sunsetMinutes - currentTime;
      timeUntil = `${Math.floor(diff / 60)}ч ${diff % 60}мин`;
    } else {
      nextEvent = 'Закат';
      const diff = sunsetMinutes - currentTime;
      timeUntil = `${Math.floor(diff / 60)}ч ${diff % 60}мин`;
    }
    
    return { progress, status, nextEvent, timeUntil, isDay: status !== 'before-sunrise' && status !== 'after-sunset' };
  };

  const { progress, nextEvent, timeUntil, isDay: currentIsDay } = calculateDayProgress();

  // Позиция солнца на дуге
  const sunPosition = {
    cx: 20 + (progress / 100) * 160, // От 20 до 180
    cy: 100 - Math.sin((progress / 100) * Math.PI) * 80, // Дуга вверх
  };

  return (
    <Card title="Солнце" icon={Sun}>
      <div className="space-y-4">
        {/* Визуализация пути солнца */}
        <div className="relative h-32 bg-gradient-to-b from-slate-700/50 to-slate-800/50 rounded-xl overflow-hidden">
          <svg viewBox="0 0 200 120" className="w-full h-full">
            {/* Путь солнца (дуга) */}
            <path
              d="M 20 100 Q 100 0 180 100"
              fill="none"
              stroke="rgba(148, 163, 184, 0.3)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            
            {/* Горизонт */}
            <line
              x1="0"
              y1="100"
              x2="200"
              y2="100"
              stroke="rgba(148, 163, 184, 0.5)"
              strokeWidth="1"
            />
            
            {/* Градиент неба */}
            <defs>
              <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={currentIsDay ? '#3b82f6' : '#1e3a5f'} stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="200" height="100" fill="url(#skyGradient)" />
            
            {/* Солнце */}
            <circle
              cx={sunPosition.cx}
              cy={sunPosition.cy}
              r="8"
              fill="#fbbf24"
              className="animate-pulse"
            >
              <animate
                attributeName="opacity"
                values="0.8;1;0.8"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            
            {/* Свечение солнца */}
            <circle
              cx={sunPosition.cx}
              cy={sunPosition.cy}
              r="12"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              opacity="0.3"
            />
            
            {/* Маркеры восхода и заката */}
            <circle cx="20" cy="100" r="4" fill="#f97316" />
            <circle cx="180" cy="100" r="4" fill="#f97316" />
            
            {/* Подписи */}
            <text x="20" y="115" textAnchor="middle" fill="#94a3b8" fontSize="8">
              {sunrise}
            </text>
            <text x="180" y="115" textAnchor="middle" fill="#94a3b8" fontSize="8">
              {sunset}
            </text>
            <text x="100" y="115" textAnchor="middle" fill="#94a3b8" fontSize="8">
              {solarNoon}
            </text>
          </svg>
        </div>

        {/* Прогресс дня */}
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Восход: {sunrise}</span>
            <span>Зенит: {solarNoon}</span>
            <span>Закат: {sunset}</span>
          </div>
          <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 transition-all duration-300`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>

        {/* Информация */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg">
            <Sunrise className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-xs text-slate-400">Восход</div>
              <div className="text-sm font-semibold text-slate-100">{sunrise}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg">
            <Sunset className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-xs text-slate-400">Закат</div>
              <div className="text-sm font-semibold text-slate-100">{sunset}</div>
            </div>
          </div>
        </div>

        {/* Следующее событие */}
        <div className="p-3 bg-slate-700/30 rounded-lg text-center">
          <div className="text-xs text-slate-400 mb-1">До события</div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">{nextEvent === 'Восход' ? '🌅' : nextEvent === 'Закат' ? '🌇' : '🌙'}</span>
            <span className="text-sm font-semibold text-slate-100">{nextEvent}</span>
            <span className="text-xs text-slate-400">через {timeUntil}</span>
          </div>
        </div>

        {/* Длина дня */}
        {dayLength && (
          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-700">
            Продолжительность дня: <span className="text-slate-100 font-medium">{Math.floor(dayLength / 60)}ч {dayLength % 60}мин</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SunProgressWidget;
