import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, X, Thermometer, Wind, Droplets, Sun } from 'lucide-react';
import Card from '../common/Card';

/**
 * Weather Alerts Widget
 * Отображает предупреждения о неблагоприятных погодных условиях
 */
const WeatherAlerts = ({ alerts = [], current }) => {
  const [dismissed, setDismissed] = useState([]);
  
  // Генерация автоматических предупреждений на основе текущих данных
  const generateAutoAlerts = () => {
    const autoAlerts = [];
    
    if (!current) return autoAlerts;
    
    // Температурные предупреждения
    if (current.temperature <= -20) {
      autoAlerts.push({
        id: 'extreme-cold',
        event: 'Экстремальный холод',
        description: `Температура ${Math.round(current.temperature)}°C. Опасно для здоровья.`,
        severity: 'extreme',
        icon: Thermometer,
        expires: 'До потепления',
      });
    } else if (current.temperature <= -10) {
      autoAlerts.push({
        id: 'very-cold',
        event: 'Сильный мороз',
        description: `Температура ${Math.round(current.temperature)}°C. Оденьтесь тепло.`,
        severity: 'severe',
        icon: Thermometer,
        expires: 'До потепления',
      });
    } else if (current.temperature >= 35) {
      autoAlerts.push({
        id: 'extreme-heat',
        event: 'Аномальная жара',
        description: `Температура ${Math.round(current.temperature)}°C. Избегайте солнца.`,
        severity: 'extreme',
        icon: Thermometer,
        expires: 'До похолодания',
      });
    }
    
    // Ветер
    if (current.windSpeed >= 25) {
      autoAlerts.push({
        id: 'storm-warning',
        event: 'Штормовое предупреждение',
        description: `Ветер ${Math.round(current.windSpeed)} м/с. Возможны повреждения.`,
        severity: 'extreme',
        icon: Wind,
        expires: 'До ослабления ветра',
      });
    } else if (current.windSpeed >= 15) {
      autoAlerts.push({
        id: 'wind-warning',
        event: 'Сильный ветер',
        description: `Ветер ${Math.round(current.windSpeed)} м/с. Будьте осторожны.`,
        severity: 'moderate',
        icon: Wind,
        expires: 'До ослабления ветра',
      });
    }
    
    // УФ-индекс
    if (current.uvIndex >= 8) {
      autoAlerts.push({
        id: 'uv-extreme',
        event: 'Экстремальный УФ-индекс',
        description: `УФ-индекс ${current.uvIndex}. Максимальная защита необходима.`,
        severity: 'extreme',
        icon: Sun,
        expires: 'До захода солнца',
      });
    } else if (current.uvIndex >= 6) {
      autoAlerts.push({
        id: 'uv-high',
        event: 'Высокий УФ-индекс',
        description: `УФ-индекс ${current.uvIndex}. Используйте SPF защиту.`,
        severity: 'moderate',
        icon: Sun,
        expires: 'До захода солнца',
      });
    }
    
    // Осадки
    if (current.condition?.code === 'thunderstorm') {
      autoAlerts.push({
        id: 'thunderstorm',
        event: 'Гроза',
        description: 'Ожидается гроза. Оставайтесь в помещении.',
        severity: 'severe',
        icon: AlertTriangle,
        expires: 'До окончания грозы',
      });
    }
    
    return autoAlerts;
  };
  
  // Объединение пользовательских и автоматических предупреждений
  const allAlerts = [...(alerts || []), ...generateAutoAlerts()];
  const visibleAlerts = allAlerts.filter(a => !dismissed.includes(a.id));
  
  const getSeverityIcon = (severity, IconComponent) => {
    if (IconComponent) return IconComponent;
    switch (severity) {
      case 'extreme': return AlertTriangle;
      case 'severe': return AlertCircle;
      default: return Info;
    }
  };
  
  const getSeverityColor = (severity) => {
    const colors = {
      extreme: 'from-red-500/30 to-orange-500/30 border-red-500/50 text-red-400',
      severe: 'from-orange-500/30 to-amber-500/30 border-orange-500/50 text-orange-400',
      moderate: 'from-yellow-500/30 border-yellow-500/50 text-yellow-400',
      minor: 'from-blue-500/30 border-blue-500/50 text-blue-400',
    };
    return colors[severity] || colors.minor;
  };
  
  const getSeverityBg = (severity) => {
    const colors = {
      extreme: 'bg-red-500/20',
      severe: 'bg-orange-500/20',
      moderate: 'bg-yellow-500/20',
      minor: 'bg-blue-500/20',
    };
    return colors[severity] || colors.minor;
  };
  
  if (visibleAlerts.length === 0) {
    return (
      <Card title="Предупреждения" icon={AlertCircle}>
        <div className="flex items-center justify-center py-8 text-slate-400">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center">
              <Info className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-sm">Нет активных предупреждений</p>
            <p className="text-xs mt-1">Погода благоприятная</p>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card title="⚠️ Предупреждения" icon={AlertTriangle} className="col-span-full">
      <div className="space-y-3">
        <AnimatePresence>
          {visibleAlerts.map((alert) => {
            const Icon = getSeverityIcon(alert.severity, alert.icon);
            return (
              <motion.div
                key={alert.id}
                className={`p-4 rounded-xl bg-gradient-to-r border ${getSeverityColor(alert.severity)} ${getSeverityBg(alert.severity)}`}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 300, scale: 0.9 }}
                layout
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm">
                      {alert.event}
                    </h4>
                    <p className="text-xs opacity-90 mt-1 line-clamp-2">
                      {alert.description}
                    </p>
                    {alert.expires && (
                      <p className="text-xs opacity-75 mt-2 font-mono">
                        ⏰ {alert.expires}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setDismissed([...dismissed, alert.id])}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                    aria-label="Закрыть предупреждение"
                  >
                    <X className="w-4 h-4" />
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
