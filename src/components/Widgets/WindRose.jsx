import { Compass } from 'lucide-react';
import Card from '../common/Card';

const WindRose = ({ data }) => {
  if (!data || data.length === 0) return null;

  const maxFrequency = Math.max(1, ...data.map((item) => item.frequency));
  const center = 50;
  const maxRadius = 30;

  const points = data
    .map((item) => {
      const radius = (item.frequency / maxFrequency) * maxRadius;
      const angle = (item.angle * Math.PI) / 180;
      const x = center + radius * Math.sin(angle);
      const y = center - radius * Math.cos(angle);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Card title="Роза ветров" icon={Compass}>
      <div className="h-48 rounded-xl border border-slate-600/25 bg-slate-900/25 p-3">
        <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Роза ветров">
          {[10, 20, 30].map((radius) => (
            <circle key={`ring-${radius}`} cx={center} cy={center} r={radius} fill="none" stroke="rgba(148, 163, 184, 0.18)" strokeDasharray="1.2 1.6" />
          ))}

          {data.map((item) => {
            const angle = (item.angle * Math.PI) / 180;
            const x = center + maxRadius * Math.sin(angle);
            const y = center - maxRadius * Math.cos(angle);
            return <line key={`axis-${item.direction}`} x1={center} y1={center} x2={x} y2={y} stroke="rgba(148, 163, 184, 0.2)" />;
          })}

          <polygon points={points} fill="rgba(16, 185, 129, 0.28)" stroke="#10b981" strokeWidth="1.2" />

          {data.map((item) => {
            const angle = (item.angle * Math.PI) / 180;
            const labelRadius = maxRadius + 8;
            const x = center + labelRadius * Math.sin(angle);
            const y = center - labelRadius * Math.cos(angle);

            return (
              <text
                key={`label-${item.direction}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="4"
                fill="#94a3b8"
              >
                {item.direction}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="mt-2 text-center">
        <p className="text-xs text-slate-500">Преобладающее направление ветра</p>
      </div>
    </Card>
  );
};

export default WindRose;
