import { Sprout, Calendar, Droplets } from 'lucide-react';
import Card from '../common/Card';

const GardeningCalendarWidget = ({ agriculture, current }) => {
  if (!agriculture || !current) return null;

  const { conditions, soilMoisture, frostRisk, irrigationNeed } = agriculture;
  const { temperature } = current;

  const getTodayTasks = () => {
    const tasks = [];

    if (conditions.status === 'Отличные' || conditions.status === 'Хорошие') {
      tasks.push({ icon: '🌱', text: 'Хороший день для посадки', priority: 'high' });
    }

    if (irrigationNeed === 'Требуется') {
      tasks.push({ icon: '💧', text: 'Необходим полив', priority: 'high' });
    } else if (irrigationNeed === 'Скоро') {
      tasks.push({ icon: '💧', text: 'Полив скоро понадобится', priority: 'medium' });
    }

    if (frostRisk === 'Высокий') {
      tasks.push({ icon: '❄️', text: 'Защитите растения от заморозков', priority: 'critical' });
    }

    if (soilMoisture > 80) {
      tasks.push({ icon: '🚫', text: 'Избегайте полива (переувлажнение)', priority: 'medium' });
    }

    if (temperature > 30) {
      tasks.push({ icon: '☂️', text: 'Притените растения', priority: 'medium' });
    }

    if (tasks.length === 0) {
      tasks.push({ icon: '✅', text: 'День для отдыха', priority: 'low' });
    }

    return tasks;
  };

  const getBestCrops = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return ['Рассада', 'Зелень', 'Редис'];
    if (month >= 5 && month <= 7) return ['Томаты', 'Огурцы', 'Перец'];
    if (month >= 8 && month <= 10) return ['Капуста', 'Морковь', 'Свёкла'];
    return ['Зелень', 'Редис', 'Лук'];
  };

  const tasks = getTodayTasks();
  const bestCrops = getBestCrops();

  return (
    <Card title="🌿 Календарь садовода" icon={Sprout}>
      <div className="space-y-4">
        <div className={`p-3 rounded-lg ${conditions.color === 'green' ? 'bg-green-500/20' : conditions.color === 'yellow' ? 'bg-yellow-500/20' : 'bg-red-500/20'}`}>
          <p className="text-sm text-slate-400">Условия для роста</p>
          <p className={`text-lg font-bold ${conditions.color === 'green' ? 'text-green-400' : conditions.color === 'yellow' ? 'text-yellow-400' : 'text-red-400'}`}>
            {conditions.status}
          </p>
          <p className="text-xs text-slate-300 mt-1">{conditions.description}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Задачи на сегодня
          </p>
          <div className="space-y-2">
            {tasks.map((task, i) => (
              <div key={i} className={`p-2 rounded-lg flex items-center gap-2 ${task.priority === 'critical' ? 'bg-red-500/20' : task.priority === 'high' ? 'bg-orange-500/20' : 'bg-slate-700/30'}`}>
                <span className="text-lg">{task.icon}</span>
                <span className="text-sm text-slate-200 flex-1">{task.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-slate-400 mb-2 flex items-center gap-2">
            <Droplets className="w-4 h-4" /> Что сажать
          </p>
          <div className="flex flex-wrap gap-2">
            {bestCrops.map((crop, i) => (
              <span key={i} className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                {crop}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GardeningCalendarWidget;
