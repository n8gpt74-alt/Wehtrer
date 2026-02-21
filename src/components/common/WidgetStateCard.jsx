import Card from './Card';

const toneStyles = {
  info: {
    iconClass: 'text-blue-300',
    ringClass: 'border-blue-400/30 bg-blue-500/10',
  },
  warning: {
    iconClass: 'text-amber-300',
    ringClass: 'border-amber-400/30 bg-amber-500/10',
  },
  error: {
    iconClass: 'text-red-300',
    ringClass: 'border-red-400/30 bg-red-500/10',
  },
};

const WidgetStateCard = ({
  title,
  icon: HeaderIcon,
  stateIcon: StateIcon,
  message,
  description,
  action,
  actionLabel,
  tone = 'info',
  className = '',
}) => {
  const toneStyle = toneStyles[tone] || toneStyles.info;

  return (
    <Card title={title} icon={HeaderIcon} className={className} hover={false}>
      <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-slate-600/20 bg-slate-800/20 px-4 py-6 text-center">
        {StateIcon && (
          <span className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full border ${toneStyle.ringClass}`}>
            <StateIcon className={`h-5 w-5 ${toneStyle.iconClass}`} />
          </span>
        )}
        <p className="text-sm font-semibold text-slate-100">{message}</p>
        {description && <p className="mt-1 max-w-xs text-xs text-slate-400">{description}</p>}
        {action && actionLabel && (
          <button
            onClick={action}
            className="mt-4 rounded-lg border border-slate-500/40 bg-slate-700/60 px-3 py-1.5 text-xs font-medium text-slate-100 transition-colors hover:bg-slate-600/70"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </Card>
  );
};

export default WidgetStateCard;
