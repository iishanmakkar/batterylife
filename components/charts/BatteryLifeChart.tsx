'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { LifeEstimate } from '@/lib/types';
import { Clock } from 'lucide-react';

interface Props { data: LifeEstimate[]; height?: number; }

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#131920] border border-[#1e2d3d] rounded-lg py-2 px-3 text-xs shadow-xl">
      <p className="text-[#8899aa] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-mono text-[#e8f0fe]">{p.name}: {p.value.toFixed(1)}h</p>
      ))}
    </div>
  );
};

function getBarColor(hours: number): string {
  if (hours >= 7) return '#00ffa3';
  if (hours >= 5) return '#ffb830';
  return '#ff4f4f';
}

export default function BatteryLifeChart({ data, height = 260 }: Props) {
  return (
    <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text1)]">
          <Clock className="w-4 h-4 text-[var(--accent2)]" /> Battery Life Estimates
        </div>
        <span className="text-xs text-[var(--text3)]">{data.length} periods</span>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#536070' }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 14]} tickFormatter={(v: number) => `${v}h`} tick={{ fontSize: 11, fill: '#536070' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="active" name="Active" radius={[4, 4, 0, 0]} maxBarSize={32}>
            {data.map((entry, i) => (
              <Cell key={i} fill={getBarColor(entry.active)} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
