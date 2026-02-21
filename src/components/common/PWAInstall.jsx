import { useEffect, useState } from 'react';
import { Bell, BellRing, Check, Download, SlidersHorizontal, X } from 'lucide-react';
import useWeatherNotifications from '../../hooks/useWeatherNotifications';

const PWAInstall = ({ currentWeather, weatherAlerts = [] }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const {
    supported,
    permission,
    canSend,
    rules,
    updateRules,
    requestPermission,
    sendNotification,
    evaluateRules,
  } = useWeatherNotifications();

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isStandaloneWindow = window.navigator.standalone === true;
    setIsInstalled(isStandalone || isStandaloneWindow);

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setIsInstallable(true);
      setTimeout(() => setShowPrompt(true), 2000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    if (!canSend || !currentWeather) {
      return;
    }

    evaluateRules({ currentWeather, weatherAlerts });
  }, [canSend, currentWeather, weatherAlerts, evaluateRules]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } catch (error) {
      console.error('Install error:', error);
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleNotificationButtonClick = async () => {
    if (!supported) {
      return;
    }

    if (!canSend) {
      await requestPermission();
      return;
    }

    setShowRules((prev) => !prev);
  };

  const handleTestNotification = () => {
    sendNotification('Метеостанция', {
      body: 'Тест уведомлений включён. Персональные правила активны.',
      tag: 'weather-test-notification',
    });
  };

  const updateThreshold = (key, value) => {
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      return;
    }

    updateRules((prev) => ({
      thresholds: {
        ...prev.thresholds,
        [key]: numericValue,
      },
    }));
  };

  if (isInstalled) return null;

  return (
    <>
      {isInstallable && !showPrompt && (
        <button
          onClick={handleInstall}
          className="rounded-lg bg-slate-700 p-2 transition-colors hover:bg-slate-600"
          title="Установить приложение"
          aria-label="Установить приложение"
        >
          <Download className="h-5 w-5 text-slate-300" />
        </button>
      )}

      {showPrompt && isInstallable && (
        <div
          className="animate-slide-up fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
          role="dialog"
          aria-labelledby="install-dialog-title"
        >
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 rounded-lg bg-blue-500/20 p-2">
                <Download className="h-5 w-5 text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 id="install-dialog-title" className="mb-1 text-sm font-semibold text-slate-100">
                  Установите приложение
                </h3>
                <p className="mb-3 text-xs text-slate-400">
                  Быстрый доступ к погоде с главного экрана и офлайн-режим.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleInstall}
                    className="flex-1 rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                  >
                    Установить
                  </button>
                  <button
                    onClick={() => setShowPrompt(false)}
                    className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-600"
                  >
                    Позже
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowPrompt(false)}
                className="flex min-h-[44px] min-w-[44px] flex-shrink-0 items-center justify-center rounded-lg p-2 text-slate-400 transition-colors hover:text-slate-300"
                aria-label="Закрыть"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {supported && (
        <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-2 md:bottom-4">
          <button
            onClick={handleNotificationButtonClick}
            className="rounded-full border border-slate-700 bg-slate-800 p-3 shadow-lg transition-all active:scale-95 hover:bg-slate-700"
            title={canSend ? 'Настроить уведомления' : 'Включить уведомления'}
            aria-label={canSend ? 'Настроить уведомления' : 'Включить уведомления'}
          >
            {canSend ? <BellRing className="h-5 w-5 text-green-400" /> : <Bell className="h-5 w-5 text-slate-300" />}
          </button>

          {showRules && canSend && (
            <div className="w-[320px] rounded-xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-lg">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-100">
                  <SlidersHorizontal className="h-4 w-4 text-blue-300" />
                  <span className="text-sm font-semibold">Правила уведомлений</span>
                </div>
                <button
                  onClick={() => setShowRules(false)}
                  className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-200"
                  aria-label="Закрыть панель уведомлений"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <label className="flex items-center justify-between rounded-lg border border-slate-700/80 bg-slate-800/60 px-3 py-2">
                  <span>Включить уведомления</span>
                  <input
                    type="checkbox"
                    checked={rules.enabled}
                    onChange={(event) => updateRules({ enabled: event.target.checked })}
                  />
                </label>

                <label className="flex items-center justify-between rounded-lg border border-slate-700/80 bg-slate-800/60 px-3 py-2">
                  <span>Тихие часы</span>
                  <input
                    type="checkbox"
                    checked={rules.quietHoursEnabled}
                    onChange={(event) => updateRules({ quietHoursEnabled: event.target.checked })}
                  />
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <label className="rounded-lg border border-slate-700/80 bg-slate-800/60 p-2">
                    <span className="block text-[11px] text-slate-400">Тихие часы с</span>
                    <input
                      type="time"
                      value={rules.quietStart}
                      onChange={(event) => updateRules({ quietStart: event.target.value })}
                      className="mt-1 w-full rounded bg-slate-700 px-2 py-1 text-slate-100"
                    />
                  </label>
                  <label className="rounded-lg border border-slate-700/80 bg-slate-800/60 p-2">
                    <span className="block text-[11px] text-slate-400">Тихие часы до</span>
                    <input
                      type="time"
                      value={rules.quietEnd}
                      onChange={(event) => updateRules({ quietEnd: event.target.value })}
                      className="mt-1 w-full rounded bg-slate-700 px-2 py-1 text-slate-100"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <label className="rounded-lg border border-slate-700/80 bg-slate-800/60 p-2">
                    <span className="block text-[11px] text-slate-400">Мороз ≤ °C</span>
                    <input
                      type="number"
                      value={rules.thresholds.cold}
                      onChange={(event) => updateThreshold('cold', event.target.value)}
                      className="mt-1 w-full rounded bg-slate-700 px-2 py-1 text-slate-100"
                    />
                  </label>
                  <label className="rounded-lg border border-slate-700/80 bg-slate-800/60 p-2">
                    <span className="block text-[11px] text-slate-400">Жара ≥ °C</span>
                    <input
                      type="number"
                      value={rules.thresholds.heat}
                      onChange={(event) => updateThreshold('heat', event.target.value)}
                      className="mt-1 w-full rounded bg-slate-700 px-2 py-1 text-slate-100"
                    />
                  </label>
                  <label className="rounded-lg border border-slate-700/80 bg-slate-800/60 p-2">
                    <span className="block text-[11px] text-slate-400">Ветер ≥ м/с</span>
                    <input
                      type="number"
                      value={rules.thresholds.wind}
                      onChange={(event) => updateThreshold('wind', event.target.value)}
                      className="mt-1 w-full rounded bg-slate-700 px-2 py-1 text-slate-100"
                    />
                  </label>
                  <label className="rounded-lg border border-slate-700/80 bg-slate-800/60 p-2">
                    <span className="block text-[11px] text-slate-400">УФ ≥</span>
                    <input
                      type="number"
                      value={rules.thresholds.uv}
                      onChange={(event) => updateThreshold('uv', event.target.value)}
                      className="mt-1 w-full rounded bg-slate-700 px-2 py-1 text-slate-100"
                    />
                  </label>
                </div>

                <label className="block rounded-lg border border-slate-700/80 bg-slate-800/60 p-2">
                  <span className="block text-[11px] text-slate-400">Повтор уведомления (мин)</span>
                  <input
                    type="number"
                    min="15"
                    value={rules.cooldownMinutes}
                    onChange={(event) => updateRules({ cooldownMinutes: Number(event.target.value) || 120 })}
                    className="mt-1 w-full rounded bg-slate-700 px-2 py-1 text-slate-100"
                  />
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    ['cold', 'Мороз'],
                    ['heat', 'Жара'],
                    ['wind', 'Ветер'],
                    ['uv', 'УФ'],
                    ['official', 'Офиц. алерты'],
                  ].map(([key, label]) => (
                    <label key={key} className="flex items-center justify-between rounded-lg border border-slate-700/80 bg-slate-800/60 px-2 py-1.5">
                      <span>{label}</span>
                      <input
                        type="checkbox"
                        checked={rules.channels[key]}
                        onChange={(event) => updateRules({ channels: { [key]: event.target.checked } })}
                      />
                    </label>
                  ))}
                </div>

                <button
                  onClick={handleTestNotification}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                >
                  <Check className="h-4 w-4" />
                  Проверить уведомление
                </button>
                <p className="text-[11px] text-slate-400">Статус: {permission === 'granted' ? 'включены' : permission}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PWAInstall;
