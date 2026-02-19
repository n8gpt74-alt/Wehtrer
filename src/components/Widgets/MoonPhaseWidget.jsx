import { Moon } from 'lucide-react';
import Card from '../common/Card';

const MoonPhaseWidget = ({ astronomy }) => {
  if (!astronomy) return null;

  const { moonPhase, moonIllumination } = astronomy;

  // Определение фазы луны
  const getMoonPhase = () => {
    const phases = [
      { name: 'Новолуние', icon: '🌑', illumination: 0 },
      { name: 'Молодая луна', icon: '🌒', illumination: 25 },
      { name: 'Первая четверть', icon: '🌓', illumination: 50 },
      { name: 'Прибывающая', icon: '🌔', illumination: 75 },
      { name: 'Полнолуние', icon: '🌕', illumination: 100 },
      { name: 'Убывающая', icon: '🌖', illumination: 75 },
      { name: 'Последняя четверть', icon: '🌗', illumination: 50 },
      { name: 'Старая луна', icon: '🌘', illumination: 25 },
    ];

    // Находим ближайшую фазу
    const phaseIndex = Math.round((moonIllumination / 100) * 7) % 8;
    return phases[phaseIndex] || phases[0];
  };

  const phase = getMoonPhase();

  // Визуализация освещённости
  const illuminationPercent = moonIllumination || 0;

  return (
    <Card title="🌙 Луна" icon={Moon}>
      <div className="space-y-4">
        {/* Визуализация луны */}
        <div className="flex items-center justify-center gap-6">
          {/* Графическое изображение */}
          <div className="relative w-24 h-24">
            {/* Тёмная сторона */}
            <div className="absolute inset-0 rounded-full bg-slate-700" />
            
            {/* Освещённая часть */}
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-200 to-slate-300 overflow-hidden"
              style={{
                clipPath: `inset(0 ${100 - illuminationPercent}% 0 0)`,
              }}
            />
            
            {/* Кратеры */}
            <div className="absolute inset-0 rounded-full opacity-30">
              <div className="absolute w-3 h-3 bg-slate-400 rounded-full top-3 left-6" />
              <div className="absolute w-2 h-2 bg-slate-400 rounded-full top-8 left-10" />
              <div className="absolute w-4 h-4 bg-slate-400 rounded-full bottom-4 left-4" />
              <div className="absolute w-2 h-2 bg-slate-400 rounded-full top-5 right-6" />
            </div>
            
            {/* Свечение */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow: `0 0 ${20 + illuminationPercent * 0.3}px rgba(226, 232, 240, ${0.2 + illuminationPercent * 0.005})`,
              }}
            />
          </div>

          {/* Информация */}
          <div className="text-center">
            <div className="text-4xl mb-1">{phase.icon}</div>
            <div className="text-sm font-semibold text-slate-100">{phase.name}</div>
            <div className="text-xs text-slate-400">Освещённость</div>
            <div className="text-lg font-bold text-slate-100">{illuminationPercent}%</div>
          </div>
        </div>

        {/* Прогресс бар освещённости */}
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>0%</span>
            <span>Освещённость</span>
            <span>100%</span>
          </div>
          <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-slate-400 to-slate-200 transition-all duration-500"
              style={{ width: `${illuminationPercent}%` }}
            />
          </div>
        </div>

        {/* Фазы луны */}
        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-700">
          <div className={`text-center p-2 rounded-lg ${phase.name === 'Новолуние' ? 'bg-slate-600' : 'bg-slate-700/30'}`}>
            <div className="text-xl">🌑</div>
            <div className="text-xs text-slate-400 mt-1">Новолуние</div>
          </div>
          <div className={`text-center p-2 rounded-lg ${['Молодая луна', 'Первая четверть', 'Прибывающая'].includes(phase.name) ? 'bg-slate-600' : 'bg-slate-700/30'}`}>
            <div className="text-xl">🌓</div>
            <div className="text-xs text-slate-400 mt-1">Растёт</div>
          </div>
          <div className={`text-center p-2 rounded-lg ${phase.name === 'Полнолуние' ? 'bg-slate-600' : 'bg-slate-700/30'}`}>
            <div className="text-xl">🌕</div>
            <div className="text-xs text-slate-400 mt-1">Полнолуние</div>
          </div>
          <div className={`text-center p-2 rounded-lg ${['Убывающая', 'Последняя четверть', 'Старая луна'].includes(phase.name) ? 'bg-slate-600' : 'bg-slate-700/30'}`}>
            <div className="text-xl">🌗</div>
            <div className="text-xs text-slate-400 mt-1">Убывает</div>
          </div>
        </div>

        {/* Влияние на человека */}
        <div className="p-3 bg-slate-700/30 rounded-lg">
          <div className="text-xs text-slate-400 mb-2">📊 Влияние</div>
          <div className="space-y-1 text-sm">
            {illuminationPercent < 10 && (
              <div className="text-slate-300">💤 Хорошее время для отдыха и восстановления</div>
            )}
            {illuminationPercent >= 10 && illuminationPercent < 50 && (
              <div className="text-slate-300">⚡ Период роста энергии, начинайте новые дела</div>
            )}
            {illuminationPercent >= 50 && illuminationPercent < 90 && (
              <div className="text-slate-300">🔥 Пик активности, завершайте проекты</div>
            )}
            {illuminationPercent >= 90 && (
              <div className="text-slate-300">🌕 Максимум энергии, время важных решений</div>
            )}
          </div>
        </div>

        {/* Название фазы */}
        {moonPhase && (
          <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-700">
            Фаза: <span className="text-slate-100 font-medium">{moonPhase}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MoonPhaseWidget;
