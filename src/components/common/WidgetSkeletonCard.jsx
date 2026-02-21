import Card from './Card';

const WidgetSkeletonCard = ({
  title = 'Загрузка виджета',
  icon,
  heightClass = 'h-48',
  className = '',
}) => {
  return (
    <Card title={title} icon={icon} className={className} hover={false}>
      <div className={`${heightClass} rounded-xl border border-slate-600/20 bg-slate-800/25 p-3`}>
        <div className="h-5 w-2/5 animate-skeleton rounded-lg" />
        <div className="mt-3 space-y-2">
          <div className="h-3 w-full animate-skeleton rounded-lg" />
          <div className="h-3 w-11/12 animate-skeleton rounded-lg" />
          <div className="h-3 w-4/5 animate-skeleton rounded-lg" />
        </div>
        <div className="mt-4 h-[58%] animate-skeleton rounded-xl" />
      </div>
    </Card>
  );
};

export default WidgetSkeletonCard;
