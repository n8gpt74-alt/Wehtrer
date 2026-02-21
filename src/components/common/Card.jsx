import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  title,
  icon: Icon,
  action,
  variant = 'glass',
  gradient = false,
  size = 'md',
  hover = true,
}) => {
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5 sm:p-6',
    full: 'p-4 sm:p-6',
  };

  const variantClasses = {
    glass: 'card-glass',
    default: 'rounded-2xl border border-slate-700/50 bg-slate-800/80 backdrop-blur-sm',
    gradient: 'card-glass card-gradient-header',
    minimal: 'rounded-2xl border border-slate-700/30 bg-transparent',
  };

  const cardClasses = `${variantClasses[variant]} ${gradient ? 'card-gradient-header' : ''} ${sizeClasses[size]} ${hover ? 'card-hover' : ''} ${className}`.trim();

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 16,
      scale: 0.99,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.32,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className={cardClasses}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hover ? { y: -2, transition: { duration: 0.2, ease: 'easeOut' } } : undefined}
      layout
    >
      {(title || Icon || action) && (
        <div className="mb-3 flex min-w-0 items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            {Icon && (
              <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
                <Icon className="h-4 w-4" />
              </span>
            )}
            {title && <h3 className="truncate text-[0.95rem] font-semibold tracking-tight text-slate-100">{title}</h3>}
          </div>
          {action && <div className="ml-2 flex-shrink-0">{action}</div>}
        </div>
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default Card;
