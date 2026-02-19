import { Compass } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';

const WindRose = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <Card title="Роза ветров" icon={Compass}>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="#475569" />
            <PolarAngleAxis 
              dataKey="direction" 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <Radar
              name="Частота"
              dataKey="frequency"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center mt-2">
        <p className="text-xs text-slate-500">Преобладающее направление ветра</p>
      </div>
    </Card>
  );
};

export default WindRose;
