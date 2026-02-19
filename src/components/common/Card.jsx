import { motion } from 'framer-motion';

/**
 * Enhanced Card Component with Modern Glassmorphism
 * 
 * @param {ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 * @param {string} title - Card title (optional)
 * @param {ReactComponent} icon - Icon component (optional)
 * @param {ReactNode} action - Action element (optional)
 * @param {string} variant - Card variant: 'glass' | 'default' | 'gradient'
 * @param {boolean} gradient - Enable gradient header effect
 * @param {string} size - Card size: 'sm' | 'md' | 'lg' | 'full'
 */
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
    default: 'bg-slate-800/80 border border-slate-700/50 backdrop-blur-sm',
    gradient: 'card-glass card-gradient-header',
    minimal: 'bg-transparent border border-slate-700/30',
  };

  const hoverClasses = hover ? 'card-hover' : '';
  const cardClasses = `${variantClasses[variant]} ${gradient ? 'card-gradient-header' : ''} ${sizeClasses[size]} ${hoverClasses} ${className}`.trim();

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 24,
      scale: 0.98,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  };

  return (
    <motion.div
      className={cardClasses}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hover ? { 
        y: -6,
        transition: { duration: 0.25, ease: 'easeOut' }
      } : undefined}
      layout
    >
      {/* Header Section */}
      {(title || Icon || action) && (
        <div className="flex items-center justify-between mb-4 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* Icon with glow effect */}
            {Icon && (
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-blue-500/30 blur-lg rounded-full opacity-60" />
                <Icon className="w-5 h-5 text-blue-400 relative z-10" />
              </div>
            )}
            
            {/* Title with truncation */}
            {title && (
              <h3 className="text-sm font-semibold text-slate-200 truncate tracking-tight">
                {title}
              </h3>
            )}
          </div>
          
          {/* Action element */}
          {action && (
            <div className="flex-shrink-0 ml-2">
              {action}
            </div>
          )}
        </div>
      )}
      
      {/* Content Section */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default Card;
