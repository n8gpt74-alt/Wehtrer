import { useState } from 'react';
import { Moon, Calendar, Info } from 'lucide-react';
import Card from '../common/Card';

const LunarCalendarWidget = ({ astronomy }) => {
  const [selectedPhase, setSelectedPhase] = useState(null);

  if (!astronomy) return null;

  const { moonIllumination } = astronomy;

  const moonPhases = [
    { name: 'Новолуние', icon: '🌑', illumination: 0, influence: 'Период отдыха и восстановления. Хорошее время для планирования.' },
    { name: 'Молодая луна', icon: '🌒', illumination: 25, influence: 'Начало новых дел. Энергия растёт.' },
    { name: 'Первая четверть', icon: '🌓', illumination: 50, influence: 'Время активных действий. Преодоление препятствий.' },
    { name: 'Прибывающая', icon: '🌔', illumination: 75, influence: 'Пик энергии. Завершение начатого.' },
    { name: 'Полнолуние', icon: '🌕', illumination: 100, influence: 'Максимум энергии. Эмоциональный пик.' },
    { name: 'Убывающая', icon: '🌖', illumination: 75, influence: 'Период освобождения. Избавление от лишнего.' },
    { name: 'Последняя четверть', icon: '🌗', illumination: 50, influence: 'Анализ результатов. Подведение итогов.' },
    { name: 'Старая луна', icon: '🌘', illumination: 25, influence: 'Завершение цикла. Отдых перед новым.' },
  ];

  const currentPhase = moonPhases.find(p => Math.abs(p.illumination - moonIllumination) <= 12.5) || moonPhases[0];

  const getDayInfluence = () => {
    if (moonIllumination < 10) return { type: 'rest', text: 'День отдыха', color: 'blue' };
    if (moonIllumination < 40) return { type: 'growth', text: 'Рост энергии', color: 'green' };
    if (moonIllumination < 60) return { type: 'action', text: 'Активные действия', color: 'yellow' };
    if (moonIllumination < 90) return { type: 'peak', text: 'Пик активности', color: 'orange' };
    return { type: 'maximum', text: 'Максимум энергии', color: 'red' };
  };

  const influence = getDayInfluence();

  return (
    <Card title="Лунный календарь" icon={Moon}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{currentPhase.icon}</span>
            <div>
              <p className="text-sm text-slate-400">Фаза луны</p>
              <p className="text-lg font-bold text-slate-100">{currentPhase.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-100">{moonIllumination}%</p>
            <p className="text-xs text-slate-500">освещённость</p>
          </div>
        </div>

        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-slate-600 to-slate-200" style={{ width: `${moonIllumination}%` }} />
        </div>

        <div className={`p-3 rounded-lg bg-${influence.color}-500/10 border border-${influence.color}-500/30`}>
          <div className="flex items-center gap-2 mb-1">
            <Info className={`w-4 h-4 text-${influence.color}-400`} />
            <span className={`text-sm font-semibold text-${influence.color}-400`}>{influence.text}</span>
          </div>
          <p className="text-xs text-slate-300">{currentPhase.influence}</p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {moonPhases.slice(0, 8).map((phase, i) => (
            <button key={i} onClick={() => setSelectedPhase(phase)} className={`p-2 rounded-lg text-center transition-all ${selectedPhase?.name === phase.name ? 'bg-slate-600' : 'bg-slate-700/30 hover:bg-slate-700/50'}`}>
              <span className="text-xl">{phase.icon}</span>
              <p className="text-xs text-slate-400 mt-1">{phase.name}</p>
            </button>
          ))}
        </div>

        {selectedPhase && (
          <div className="p-3 bg-slate-700/30 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Влияние:</p>
            <p className="text-sm text-slate-200">{selectedPhase.influence}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LunarCalendarWidget;
