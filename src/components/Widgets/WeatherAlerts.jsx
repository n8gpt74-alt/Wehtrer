import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, X, Thermometer, Wind, Sun, ShieldAlert } from 'lucide-react';
import Card from '../common/Card';

const SEVERITY_META = {
  extreme: {
    icon: AlertTriangle,
    cardClass: 'from-red-500/25 to-orange-500/20 border-red-400/50 text-red-200',
    badgeClass: 'bg-red-500/25 text-red-200 border-red-400/40',
    rank: 4,
    label: 'Критично',
  },
  severe: {
    icon: AlertCircle,
    cardClass: 'from-orange-500/25 to-amber-500/20 border-orange-400/50 text-orange-100',
    badgeClass: 'bg-orange-500/25 text-orange-100 border-orange-300/40',
    rank: 3,
    label: 'Серьёзно',
  },
  moderate: {
    icon: ShieldAlert,
    cardClass: 'from-yellow-500/20 to-amber-400/15 border-yellow-300/45 text-yellow-100',
    badgeClass: 'bg-yellow-500/20 text-yellow-100 border-yellow-300/35',
    rank: 2,
    label: 'Умеренно',
  },
  minor: {
    icon: Info,
    cardClass: 'from-blue-500/20 to-cyan-400/15 border-blue-300/45 text-blue-100',
    badgeClass: 'bg-blue-500/20 text-blue-100 border-blue-300/35',
    rank: 1,
    label: 'Инфо',
  },
};

const buildAutoAlerts = (current) => {
  if (!current) return [];

  const autoAlerts = [];

  if (current.temperature <= -20) {
    autoAlerts.push({
      id: 'auto-extreme-cold',
      event: 'Экстремальный холод',
      description: `Температура ${Math.round(current.temperature)}°C. Минимизируйте время на улице.`,
      severity: 'extreme',
      icon: Thermometer,
      expires: 'До потепления',
      source: 'Локальный анализ',
      official: false,
    });
  } else if (current.temperature <= -10) {
    autoAlerts.push({
      id: 'auto-very-cold',
      event: 'Сильный мороз',
      description: `Температура ${Math.round(current.temperature)}°C. Требуется тёплая экипировка.`,
      severity: 'severe',
      icon: Thermometer,
      expires: 'До потепления',
      source: 'Локальный анализ',
      official: false,
    });
  } else if (current.temperature >= 35) {
    autoAlerts.push({
      id: 'auto-extreme-heat',
      event: 'Аномальная жара',
      description: `Температура ${Math.round(current.temperature)}°C. Пейте воду и избегайте прямого солнца.`,
      severity: 'extreme',
      icon: Thermometer,
      expires: 'До похолодания',
      source: 'Локальный анализ',
      official: false,
    });
  }

  if (current.windSpeed >= 25) {
    autoAlerts.push({
      id: 'auto-storm-wind',
      event: 'Штормовой ветер',
      description: `Ветер ${Math.round(current.windSpeed)} м/с. Ограничьте перемещения.`,
      severity: 'extreme',
      icon: Wind,
      expires: 'До ослабления ветра',
      source: 'Локальный анализ',
      official: false,
    });
  } else if (current.windSpeed >= 15) {
    autoAlerts.push({
      id: 'auto-strong-wind',
      event: 'Сильный ветер',
      description: `Ветер ${Math.round(current.windSpeed)} м/с. Возможны сложности на открытых участках.`,
      severity: 'moderate',
      icon: Wind,
      expires: 'До ослабления ветра',
      source: 'Локальный анализ',
      official: false,
    });
  }

  if (current.uvIndex >= 8) {
    autoAlerts.push({
      id: 'auto-uv-extreme',
      event: 'Опасный УФ-индекс',
      description: `УФ-индекс ${current.uvIndex}. Используйте SPF и ограничьте пребывание на солнце.`,
      severity: 'severe',
      icon: Sun,
      expires: 'До захода солнца',
      source: 'Локальный анализ',
      official: false,
    });
  }

  if (current.condition?.code === 'thunderstorm') {
    autoAlerts.push({
      id: 'auto-thunderstorm',
      event: 'Гроза',
      description: 'Ожидается гроза. Рекомендуется оставаться в помещении.',
      severity: 'severe',
      icon: AlertTriangle,
      expires: 'До окончания грозы',
      source: 'Локальный анализ',
      official: false,
    });
  }

  return autoAlerts;
};

const normalizeIncomingAlerts = (alerts = []) => {
  return alerts.map((alert, index) => ({
    id: alert.id || `official-${index}`,
    event: alert.event || 'Официальное предупреждение',
    description: alert.description || 'Подробности отсутствуют',
    severity: alert.severity || 'moderate',
    icon: alert.icon,
    expires: alert.expires || 'До обновления',
    source: alert.source || 'OpenWeatherMap',
    official: alert.official !== false,
    startsAt: alert.startsAt,
    endsAt: alert.endsAt,
    tags: alert.tags || [],
  }));
};

const WeatherAlerts = ({ alerts = [], current }) => {
  const [dismissed, setDismissed] = useState([]);

  const visibleAlerts = useMemo(() => {
    const official = normalizeIncomingAlerts(alerts);
    const auto = buildAutoAlerts(current);

    const uniqueByKey = new Map();
    [...official, ...auto].forEach((alert) => {
      const key = `${alert.event}-${alert.severity}-${alert.source || ''}`;
      if (!uniqueByKey.has(key)) {
        uniqueByKey.set(key, alert);
      }
    });

    const merged = Array.from(uniqueByKey.values())
      .filter((alert) => !dismissed.includes(alert.id))
      .sort((a, b) => {
        if ((b.official ? 1 : 0) !== (a.official ? 1 : 0)) {
          return (b.official ? 1 : 0) - (a.official ? 1 : 0);
        }

        const rankA = SEVERITY_META[a.severity]?.rank || 1;
        const rankB = SEVERITY_META[b.severity]?.rank || 1;
        return rankB - rankA;
      });

    return merged;
  }, [alerts, current, dismissed]);

  if (visibleAlerts.length === 0) {
    return (
      <Card title="Предупреждения" icon={AlertCircle}>
        <div className="flex items-center justify-center py-8 text-slate-400">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
              <Info className="h-6 w-6 text-green-400" />
            </div>
            <p className="text-sm">Нет активных предупреждений</p>
            <p className="mt-1 text-xs">Погода благоприятная</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Предупреждения" icon={AlertTriangle} className="col-span-full">
      <div className="space-y-3">
        <AnimatePresence>
          {visibleAlerts.map((alert) => {
            const meta = SEVERITY_META[alert.severity] || SEVERITY_META.minor;
            const Icon = alert.icon || meta.icon;

            return (
              <motion.div
                key={alert.id}
                className={`rounded-xl border bg-gradient-to-r p-4 ${meta.cardClass}`}
                initial={{ opacity: 0, y: -14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 240, scale: 0.95 }}
                layout
              >
                <div className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-semibold">{alert.event}</h4>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${meta.badgeClass}`}>
                        {meta.label}
                      </span>
                      {alert.official && (
                        <span className="rounded-full border border-slate-300/35 bg-slate-800/25 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-100">
                          Официально
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs leading-relaxed opacity-95">{alert.description}</p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] opacity-85">
                      <span>Источник: {alert.source}</span>
                      <span>До: {alert.expires}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setDismissed((prev) => [...prev, alert.id])}
                    className="flex min-h-[44px] min-w-[44px] flex-shrink-0 items-center justify-center rounded-lg p-2 transition-colors hover:bg-white/10"
                    aria-label="Скрыть предупреждение"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default WeatherAlerts;
