import { Waves, Anchor, Wind } from 'lucide-react';
import Card from '../common/Card';

const TidesWidget = ({ location }) => {
  // Mock данные для демонстрации (реальный API требует ключа)
  const mockTides = {
    high: [{ time: '06:23', height: 1.8 }, { time: '18:45', height: 1.9 }],
    low: [{ time: '00:15', height: 0.3 }, { time: '12:34', height: 0.4 }],
    current: 'rising',
    nextHigh: '18:45',
  };

  const isCoastal = location?.coordinates && Math.abs(location.coordinates.lat) < 60;

  if (!isCoastal) {
    return (
      <Card title="🌊 Приливы" icon={Waves}>
        <div className="text-center py-8 text-slate-400">
          <Waves className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Доступно только для прибрежных городов</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="🌊 Приливы и отливы" icon={Waves}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Текущее состояние</p>
            <p className="text-lg font-bold text-blue-400">
              {mockTides.current === 'rising' ? '📈 Прилив' : '📉 Отлив'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Следующий прилив</p>
            <p className="text-xl font-bold text-slate-100">{mockTides.nextHigh}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <p className="text-xs text-blue-400 mb-2">Высокая вода</p>
            {mockTides.high.map((tide, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-slate-300">{tide.time}</span>
                <span className="text-slate-400">{tide.height} м</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-cyan-500/10 rounded-lg">
            <p className="text-xs text-cyan-400 mb-2">Низкая вода</p>
            {mockTides.low.map((tide, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-slate-300">{tide.time}</span>
                <span className="text-slate-400">{tide.height} м</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500 text-center">
          ⚠️ Данные приблизительные. Для навигации используйте официальные источники.
        </div>
      </div>
    </Card>
  );
};

export default TidesWidget;
