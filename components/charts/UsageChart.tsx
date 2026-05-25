'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { UsageEntry } from '@/lib/types';
import { BarChart3 } from 'lucide-react';

interface Props { data: UsageEntry[]; height?: number; }

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#131920] border border-[#1e2d3d] rounded-lg py-2 px-3 text-xs shadow-xl">
      <p className="text-[#8899aa] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-mono">{p.name}: {p.value.toFixed(1)}h</p>
      ))}
    </div>
  );
};

export default function UsageChart({ data, height = 260 }: Props) {
  return (
    <div className="bg-[var(--color-bg2)] border border-[var(--color-border)] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text1)]">
          <BarChart3 className="w-4 h-4 text-[var(--color-accent3)]" /> Usage Patterns
        </div>
        <span className="text-xs text-[var(--color-text3)]">{data.length} days</span>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#536070' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={(v: number) => `${v}h`} tick={{ fontSize: 11, fill: '#536070' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11, color: '#8899aa' }} />
          <Bar dataKey="bat" name="Battery" stackId="a" fill="#00ffa3" fillOpacity={0.8} radius={[0, 0, 0, 0]} maxBarSize={24} />
          <Bar dataKey="ac" name="AC Power" stackId="a" fill="#00d4ff" fillOpacity={0.6} radius={[4, 4, 0, 0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
