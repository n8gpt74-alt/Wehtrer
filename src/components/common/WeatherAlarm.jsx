import { useState, useEffect } from 'react';
import { Bell, Clock, X, Plus, Trash2 } from 'lucide-react';

const WeatherAlarm = ({ isOpen, onClose, currentWeather, location }) => {
  const [alarms, setAlarms] = useState([]);
  const [newTime, setNewTime] = useState('07:00');
  const [newMessage, setNewMessage] = useState('morning'); // morning, evening, custom

  // Загрузка будильников
  useEffect(() => {
    const saved = localStorage.getItem('weather_alarms');
    if (saved) {
      setAlarms(JSON.parse(saved));
    }
  }, []);

  // Сохранение будильников
  useEffect(() => {
    localStorage.setItem('weather_alarms', JSON.stringify(alarms));
  }, [alarms]);

  // Проверка будильников каждую минуту
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      alarms.forEach(alarm => {
        if (alarm.enabled && alarm.time === currentTime && !alarm.triggeredToday) {
          triggerAlarm(alarm);
          // Пометить как сработавший сегодня
          updateAlarmTriggered(alarm.id);
        }
      });
      
      // Сброс triggeredToday в полночь
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        resetTriggers();
      }
    }, 60000); // Проверка каждую минуту

    return () => clearInterval(interval);
  }, [alarms]);

  // Срабатывание будильника
  const triggerAlarm = (alarm) => {
    if (Notification.permission === 'granted') {
      const messages = {
        morning: `☀️ Доброе утро! Погода на сегодня: ${Math.round(currentWeather?.temperature || 0)}°C`,
        evening: `🌙 Добрый вечер! Завтра ожидается: ${Math.round(currentWeather?.temperature || 0)}°C`,
        custom: alarm.customMessage || '⏰ Будильник погоды!',
      };

      new Notification('Метеостанция', {
        body: messages[alarm.messageType] || messages.morning,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        tag: `alarm-${alarm.id}`,
        requireInteraction: true,
      });
    }
  };

  // Добавление будильника
  const addAlarm = () => {
    const newAlarm = {
      id: Date.now(),
      time: newTime,
      messageType: newMessage,
      customMessage: newMessage === 'custom' ? 'Проверьте погоду!' : '',
      enabled: true,
      triggeredToday: false,
      createdAt: new Date().toISOString(),
    };
    
    setAlarms([...alarms, newAlarm]);
  };

  // Удаление будильника
  const deleteAlarm = (id) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };

  // Переключение включения
  const toggleAlarm = (id) => {
    setAlarms(alarms.map(a => 
      a.id === id ? { ...a, enabled: !a.enabled } : a
    ));
  };

  // Сброс триггеров
  const resetTriggers = () => {
    setAlarms(alarms.map(a => ({ ...a, triggeredToday: false })));
  };

  // Обновление триггера
  const updateAlarmTriggered = (id) => {
    setAlarms(alarms.map(a => 
      a.id === id ? { ...a, triggeredToday: true } : a
    ));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-xl w-full max-w-md shadow-2xl border border-slate-700 animate-modal-open"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-slate-100">Будильник погоды</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Добавление нового */}
          <div className="bg-slate-700/30 rounded-lg p-3 space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Clock className="w-4 h-4" />
              <span>Новый будильник</span>
            </div>
            
            <div className="flex gap-2">
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              />
              <select
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="morning">☀️ Утро</option>
                <option value="evening">🌙 Вечер</option>
                <option value="custom">⏰ Своё</option>
              </select>
            </div>
            
            <button
              onClick={addAlarm}
              className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Добавить
            </button>
          </div>

          {/* Список будильников */}
          {alarms.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-slate-500 uppercase tracking-wider">
                Ваши будильники
              </div>
              
              {alarms.map(alarm => (
                <div
                  key={alarm.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                    alarm.enabled && !alarm.triggeredToday
                      ? 'bg-blue-500/10 border-blue-500/30'
                      : alarm.triggeredToday
                      ? 'bg-slate-700/30 border-slate-600/30 opacity-50'
                      : 'bg-slate-700/30 border-slate-600/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      alarm.enabled ? 'bg-blue-500/20' : 'bg-slate-600/20'
                    }`}>
                      <Clock className={`w-4 h-4 ${
                        alarm.enabled ? 'text-blue-400' : 'text-slate-400'
                      }`} />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-slate-100">
                        {alarm.time}
                      </div>
                      <div className="text-xs text-slate-400">
                        {alarm.messageType === 'morning' && '☀️ Утренний прогноз'}
                        {alarm.messageType === 'evening' && '🌙 Вечерний прогноз'}
                        {alarm.messageType === 'custom' && '⏰ Пользовательский'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleAlarm(alarm.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        alarm.enabled
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-600 text-slate-300'
                      }`}
                    >
                      {alarm.enabled ? 'ВКЛ' : 'ВЫКЛ'}
                    </button>
                    <button
                      onClick={() => deleteAlarm(alarm.id)}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {alarms.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Нет активных будильников</p>
              <p className="text-xs mt-1">Добавьте первый будильник выше</p>
            </div>
          )}

          {/* Информация */}
          <div className="p-3 bg-slate-700/30 rounded-lg text-xs text-slate-400">
            <p>💡 Будильник сработает только если разрешены уведомления</p>
            <p className="mt-1">🔔 В полночь все будильники сбрасываются</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherAlarm;
