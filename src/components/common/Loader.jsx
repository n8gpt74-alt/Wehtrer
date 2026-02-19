import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain } from 'lucide-react';

const Loader = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizes[size]} border-2 border-slate-600 border-t-blue-400 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

export const FullPageLoader = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center gap-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: -10,
            }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 10 : 1000,
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Main loader animation */}
      <div className="relative z-10">
        <motion.div
          className="w-24 h-24 relative"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-slate-700"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
          {/* Inner gradient ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 border-r-cyan-400"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Cloud className="w-10 h-10 text-blue-400" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Loading text */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.p
          className="text-slate-400 text-sm font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Загрузка данных о погоде...
        </motion.p>
        {/* Skeleton loading bars */}
        <div className="mt-4 space-y-2">
          <motion.div
            className="w-48 h-2 bg-slate-700/50 rounded-full overflow-hidden"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          >
            <motion.div
              className="h-full w-1/3 bg-gradient-to-r from-blue-500/50 to-cyan-500/50"
              animate={{ x: ['-100%', '300%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Loader;
