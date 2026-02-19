import { useState, useEffect } from 'react';
import { Download, Bell, Check, X } from 'lucide-react';

const PWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [notificationSupported, setNotificationSupported] = useState(false);

  useEffect(() => {
    // Проверка установки PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isStandaloneWindow = window.navigator.standalone === true;
    setIsInstalled(isStandalone || isStandaloneWindow);

    // Проверка поддержки уведомлений
    setNotificationSupported('Notification' in window);
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Обработчик события beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      // Показываем подсказку через 2 секунды
      setTimeout(() => setShowPrompt(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Обработчик установки
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Установка PWA
  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
    } catch (err) {
      console.error('Install error:', err);
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  // Запрос прав на уведомления
  const requestNotificationPermission = async () => {
    if (!notificationSupported) {
      alert('Уведомления не поддерживаются вашим браузером');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        // Проверка работы уведомлений
        new Notification('Метеостанция', {
          body: 'Уведомления включены! Вы будете получать предупреждения о погоде.',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          vibrate: [100, 50, 100],
        });
      }
    } catch (err) {
      console.error('Notification error:', err);
    }
  };

  // Отправка тестового уведомления
  const sendTestNotification = () => {
    if (Notification.permission !== 'granted') return;

    try {
      new Notification('Метеостанция', {
        body: 'Это тестовое уведомление. Здесь будет информация о погоде!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: 'test-notification',
        requireInteraction: true,
      });
    } catch (err) {
      console.error('Notification error:', err);
    }
  };

  // Закрытие подсказки
  const dismissPrompt = () => {
    setShowPrompt(false);
  };

  // Если уже установлено - ничего не показываем
  if (isInstalled) return null;

  return (
    <>
      {/* Кнопка установки в хедере */}
      {isInstallable && !showPrompt && (
        <button
          onClick={handleInstall}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
          title="Установить приложение"
          aria-label="Установить приложение"
        >
          <Download className="w-5 h-5 text-slate-300" />
        </button>
      )}

      {/* Всплывающая подсказка установки */}
      {showPrompt && isInstallable && (
        <div 
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up"
          role="dialog"
          aria-labelledby="install-dialog-title"
        >
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                <Download className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 id="install-dialog-title" className="font-semibold text-slate-100 mb-1 text-sm">
                  Установите приложение
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  Быстрый доступ к погоде с главного экрана
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleInstall}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Установить
                  </button>
                  <button
                    onClick={dismissPrompt}
                    className="px-3 py-2 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    Позже
                  </button>
                </div>
              </div>
              <button
                onClick={dismissPrompt}
                className="p-2 min-h-[44px] min-w-[44px] text-slate-400 hover:text-slate-300 flex-shrink-0 rounded-lg transition-colors"
                aria-label="Закрыть"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Кнопка уведомлений - плавающая */}
      <div className="fixed bottom-20 right-4 z-40 md:bottom-4">
        {notificationSupported && (
          <button
            onClick={notificationPermission === 'granted' ? sendTestNotification : requestNotificationPermission}
            className={`p-3 rounded-full border shadow-lg transition-all active:scale-95 ${
              notificationPermission === 'granted'
                ? 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
            }`}
            title={notificationPermission === 'granted' ? 'Тестовое уведомление' : 'Включить уведомления'}
            aria-label={notificationPermission === 'granted' ? 'Тестовое уведомление' : 'Включить уведомления'}
          >
            <Bell className={`w-5 h-5 ${
              notificationPermission === 'granted' ? 'text-green-400' : 'text-slate-300'
            }`} />
          </button>
        )}
      </div>

      {/* Тестовое уведомление (если уже включено) */}
      {notificationPermission === 'granted' && (
        <div className="fixed bottom-4 right-4 z-40 hidden md:block">
          <button
            onClick={sendTestNotification}
            className="p-3 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors shadow-lg active:scale-95"
            title="Тестовое уведомление"
            aria-label="Тестовое уведомление"
          >
            <Bell className="w-5 h-5 text-green-400" />
          </button>
        </div>
      )}
    </>
  );
};

export default PWAInstall;
