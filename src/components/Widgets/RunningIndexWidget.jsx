import { Footprints, Thermometer, Droplets, Wind, Sun, AlertCircle } from 'lucide-react';
import Card from '../common/Card';

const RunningIndexWidget = ({ current }) => {
  if (!current) return null;

  const { temperature, humidity, windSpeed, uvIndex, condition } = current;

  const calculateRunningIndex = () => {
    let score = 50;
    const factors = [];

    // Температура (идеально 10-18°C для бега)
    if (temperature >= 10 && temperature <= 18) {
      score += 30;
      factors.push({ name: 'Температура', value: `${Math.round(temperature)}°C`, text: 'Идеально', color: 'green' });
    } else if (temperature >= 5 && temperature <= 22) {
      score += 20;
      factors.push({ name: 'Температура', value: `${Math.round(temperature)}°C`, text: 'Хорошо', color: 'lime' });
    } else if (temperature >= 0 && temperature <= 25) {
      score += 5;
      factors.push({ name: 'Температура', value: `${Math.round(temperature)}°C`, text: 'Нормально', color: 'yellow' });
    } else {
      score -= 15;
      factors.push({ name: 'Температура', value: `${Math.round(temperature)}°C`, text: 'Плохо', color: 'red' });
    }

    // Влажность (идеально 40-60%)
    if (humidity >= 40 && humidity <= 60) {
      score += 20;
      factors.push({ name: 'Влажность', value: `${humidity}%`, text: 'Оптимально', color: 'green' });
    } else if (humidity >= 30 && humidity <= 70) {
      score += 10;
      factors.push({ name: 'Влажность', value: `${humidity}%`, text: 'Нормально', color: 'lime' });
    } else if (humidity > 80) {
      score -= 20;
      factors.push({ name: 'Влажность', value: `${humidity}%`, text: 'Опасно!', color: 'red' });
    } else {
      score -= 10;
      factors.push({ name: 'Влажность', value: `${humidity}%`, text: 'Сухо', color: 'orange' });
    }

    // Ветер
    if (windSpeed <= 3) {
      score += 15;
      factors.push({ name: 'Ветер', value: `${Math.round(windSpeed)} м/с`, text: 'Штиль', color: 'green' });
    } else if (windSpeed <= 7) {
      score += 5;
      factors.push({ name: 'Ветер', value: `${Math.round(windSpeed)} м/с`, text: 'Лёгкий', color: 'lime' });
    } else if (windSpeed > 12) {
      score -= 15;
      factors.push({ name: 'Ветер', value: `${Math.round(windSpeed)} м/с`, text: 'Сильный', color: 'red' });
    } else {
      factors.push({ name: 'Ветер', value: `${Math.round(windSpeed)} м/с`, text: 'Умеренный', color: 'yellow' });
    }

    // Осадки
    if (condition?.code === 'rain') {
      score -= 25;
      factors.push({ name: 'Погода', value: 'Дождь', text: 'Мокро', color: 'red' });
    } else if (condition?.code === 'snow') {
      score -= 20;
      factors.push({ name: 'Погода', value: 'Снег', text: 'Скользко', color: 'orange' });
    } else if (condition?.code === 'thunderstorm') {
      score -= 40;
      factors.push({ name: 'Погода', value: 'Гроза', text: 'Опасно!', color: 'red' });
    } else if (condition?.code === 'sunny') {
      score += 10;
      factors.push({ name: 'Погода', value: 'Солнечно', text: 'Отлично', color: 'green' });
    } else {
      factors.push({ name: 'Погода', value: 'Облачно', text: 'Нормально', color: 'yellow' });
    }

    // УФ-индекс
    if (uvIndex >= 6) {
      score -= 15;
      factors.push({ name: 'УФ', value: uvIndex.toString(), text: 'Высокий', color: 'red' });
    } else if (uvIndex >= 3) {
      score -= 5;
      factors.push({ name: 'УФ', value: uvIndex.toString(), text: 'Средний', color: 'yellow' });
    } else {
      factors.push({ name: 'УФ', value: uvIndex.toString(), text: 'Низкий', color: 'green' });
    }

    return { score: Math.max(0, Math.min(100, score)), factors };
  };

  const { score, factors } = calculateRunningIndex();

  const getLevel = () => {
    if (score >= 80) return { label: 'Отлично', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (score >= 60) return { label: 'Хорошо', color: 'text-lime-400', bg: 'bg-lime-500/20' };
    if (score >= 40) return { label: 'Нормально', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { label: 'Плохо', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  const level = getLevel();

  return (
    <Card title="🏃 Индекс бега" icon={Footprints}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Для пробежки</p>
            <p className={`text-xl font-bold ${level.color}`}>{level.label}</p>
          </div>
          <p className="text-4xl font-bold text-slate-100">{score}</p>
        </div>

        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${score >= 60 ? 'from-green-500 to-lime-500' : score >= 40 ? 'from-yellow-500 to-orange-500' : 'from-orange-500 to-red-500'}`} style={{ width: `${score}%` }} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {factors.map((f, i) => (
            <div key={i} className={`p-2 rounded-lg ${f.color === 'red' ? 'bg-red-500/10' : f.color === 'orange' ? 'bg-orange-500/10' : f.color === 'yellow' ? 'bg-yellow-500/10' : f.color === 'lime' ? 'bg-lime-500/10' : 'bg-green-500/10'}`}>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">{f.name}</span>
                <span className="text-xs font-mono text-slate-500">{f.value}</span>
              </div>
              <p className={`text-sm font-semibold ${f.color === 'red' ? 'text-red-400' : f.color === 'orange' ? 'text-orange-400' : f.color === 'yellow' ? 'text-yellow-400' : f.color === 'lime' ? 'text-lime-400' : 'text-green-400'}`}>{f.text}</p>
            </div>
          ))}
        </div>

        {score < 40 && (
          <div className="flex items-start gap-2 p-2 bg-red-500/10 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-300">Будьте осторожны! Погода может быть опасна для интенсивных тренировок.</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RunningIndexWidget;
