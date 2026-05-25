'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Plug } from 'lucide-react';

interface Props { batteryHours: number; acHours: number; height?: number; }

const COLORS = ['#00ffa3', '#00d4ff'];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { fill: string } }> }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#131920] border border-[#1e2d3d] rounded-lg py-2 px-3 text-xs shadow-xl">
      <p style={{ color: payload[0].payload.fill }} className="font-mono">{payload[0].name}: {payload[0].value.toFixed(1)}h</p>
    </div>
  );
};

export default function DonutChart({ batteryHours, acHours, height = 220 }: Props) {
  const total = batteryHours + acHours;
  const batPct = total > 0 ? ((batteryHours / total) * 100).toFixed(0) : '0';
  const data = [
    { name: 'Battery', value: batteryHours },
    { name: 'AC Power', value: acHours },
  ];

  return (
    <div className="bg-[var(--color-bg2)] border border-[var(--color-border)] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text1)]">
          <Plug className="w-4 h-4 text-[var(--color-accent2)]" /> Power Source Split
        </div>
      </div>
      <div className="relative">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
              {data.map((_, i) => <Cell key={i} fill={COLORS[i]} fillOpacity={0.8} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-mono text-2xl font-bold text-[var(--color-text1)]">{batPct}%</span>
          <span className="text-[11px] text-[var(--color-text3)]">on battery</span>
        </div>
      </div>
      <div className="flex justify-center gap-6 mt-3">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-[var(--color-text2)]">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[i] }} />
            {d.name} ({d.value.toFixed(1)}h)
          </div>
        ))}
      </div>
    </div>
  );
}
