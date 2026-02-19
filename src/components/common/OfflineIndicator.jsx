import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Database } from 'lucide-react';

/**
 * Offline Service для управления кэшированием данных
 */
const offlineService = {
  CACHE_NAME: 'weather-dashboard-v3',
  OFFLINE_DATA_KEY: 'weather-offline-data',
  
  // Сохранение данных для offline использования
  async cacheWeatherData(data) {
    try {
      const cache = await caches.open(this.CACHE_NAME);
      await cache.put('/api/weather', new Response(JSON.stringify(data)));
      localStorage.setItem(this.OFFLINE_DATA_KEY, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  },
  
  // Получение кэшированных данных
  async getCachedData() {
    try {
      const cached = localStorage.getItem(this.OFFLINE_DATA_KEY);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      const hoursSinceCache = (Date.now() - timestamp) / (1000 * 60 * 60);
      
      return {
        data,
        isStale: hoursSinceCache > 6,
        hoursSinceCache: hoursSinceCache.toFixed(1),
      };
    } catch (error) {
      console.error('Failed to get cached data:', error);
      return null;
    }
  },
  
  // Проверка онлайн статуса
  isOnline() {
    return navigator.onLine;
  },
  
  // Подписка на изменения онлайн/офлайн статуса
  onStatusChange(callback) {
    const handleOnline = () => callback(true);
    const handleOffline = () => callback(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  },
};

/**
 * Offline Indicator Component
 * Показывает уведомление при отсутствии подключения
 */
const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedData, setCachedData] = useState(null);
  
  useEffect(() => {
    const cleanup = offlineService.onStatusChange(setIsOnline);
    
    if (!isOnline) {
      offlineService.getCachedData().then(setCachedData);
    }
    
    return cleanup;
  }, [isOnline]);
  
  if (isOnline) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-50 safe-area-top px-4"
        role="alert"
        aria-live="assertive"
      >
        <div className="mx-auto max-w-2xl mt-4 p-4 bg-amber-500/90 backdrop-blur-lg rounded-2xl shadow-xl border border-amber-400/30">
          <div className="flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-white flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">
                Нет подключения к интернету
              </p>
              {cachedData && (
                <p className="text-xs text-white/80 mt-1">
                  Показаны данные {cachedData.hoursSinceCache}ч назад
                </p>
              )}
            </div>
            <Database className="w-5 h-5 text-white/80 flex-shrink-0" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OfflineIndicator;
