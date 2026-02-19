import { motion } from 'framer-motion';

/**
 * Skeleton Card Component
 * Отображает состояние загрузки для виджетов
 */
export const SkeletonCard = ({ className = '', title = false }) => (
  <div className={`card-glass p-4 ${className}`}>
    {title && (
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 rounded-lg animate-skeleton bg-slate-700/50" />
        <div className="h-4 w-24 animate-skeleton bg-slate-700/50 rounded" />
      </div>
    )}
    <div className="space-y-2">
      <div className="h-8 w-32 animate-skeleton bg-slate-700/50 rounded" />
      <div className="h-4 w-48 animate-skeleton bg-slate-700/50 rounded" />
    </div>
  </div>
);

/**
 * Skeleton для графиков
 */
export const SkeletonChart = ({ className = '', title: _title = 'График' }) => (
  <div className={`card-glass p-4 ${className}`}>
    <div className="flex items-center gap-2 mb-4">
      <div className="w-5 h-5 rounded-lg animate-skeleton bg-slate-700/50" />
      <div className="h-4 w-20 animate-skeleton bg-slate-700/50 rounded" />
    </div>
    <div className="h-48 w-full animate-skeleton bg-slate-700/50 rounded-xl" />
  </div>
);

/**
 * Skeleton для прогноза погоды
 */
export const SkeletonForecast = () => (
  <div className="card-glass p-4">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-5 h-5 rounded-lg animate-skeleton bg-slate-700/50" />
      <div className="h-4 w-20 animate-skeleton bg-slate-700/50 rounded" />
    </div>
    <div className="flex gap-2 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div 
          key={i}
          className="flex-shrink-0 w-16 card-glass p-3"
        >
          <div className="h-3 w-10 animate-skeleton bg-slate-700/50 rounded mx-auto mb-3" />
          <div className="h-8 w-8 animate-skeleton bg-slate-700/50 rounded-full mx-auto mb-2" />
          <div className="h-4 w-8 animate-skeleton bg-slate-700/50 rounded mx-auto" />
        </div>
      ))}
    </div>
  </div>
);

/**
 * Skeleton для 3D глобуса
 */
export const SkeletonGlobe = () => (
  <div className="card-glass p-4 h-80 flex items-center justify-center">
    <div className="text-center">
      <motion.div
        className="w-16 h-16 border-4 border-slate-700 border-t-blue-400 rounded-full mx-auto mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p className="text-sm text-slate-400">Загрузка 3D...</p>
    </div>
  </div>
);

/**
 * Skeleton для виджета с иконкой
 */
export const SkeletonWidget = ({ title: _title = 'Виджет' }) => (
  <div className="card-glass p-4">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-5 h-5 rounded-lg animate-skeleton bg-slate-700/50" />
      <div className="h-4 w-24 animate-skeleton bg-slate-700/50 rounded" />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="h-16 animate-skeleton bg-slate-700/50 rounded-lg" />
      <div className="h-16 animate-skeleton bg-slate-700/50 rounded-lg" />
    </div>
  </div>
);

/**
 * Wrapper компонент для отображения loading state
 */
export const WidgetWithLoading = ({ 
  loading, 
  children, 
  skeleton,
  className = ''
}) => {
  if (loading) {
    return skeleton || <SkeletonCard className={className} />;
  }
  return children;
};

export default SkeletonCard;
