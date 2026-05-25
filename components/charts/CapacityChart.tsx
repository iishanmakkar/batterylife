'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { CapacityEntry } from '@/lib/types';
import { TrendingDown } from 'lucide-react';

interface Props { data: CapacityEntry[]; designCapacity?: number; trendLine?: Array<{ period: string; value: number }>; height?: number; }

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#131920] border border-[#1e2d3d] rounded-lg py-2 px-3 text-xs shadow-xl">
      <p className="text-[#8899aa] mb-1">{label}</p>
      <p className="font-mono text-[#e8f0fe] font-semibold">{(payload[0].value / 1000).toFixed(1)} Wh</p>
    </div>
  );
};

export default function CapacityChart({ data, designCapacity, height = 260 }: Props) {
  return (
    <div className="bg-[var(--color-bg2)] border border-[var(--color-border)] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text1)]">
          <TrendingDown className="w-4 h-4 text-[var(--color-accent)]" /> Capacity Over Time
        </div>
        <span className="text-xs text-[var(--color-text3)]">{data.length} data points</span>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00ffa3" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#00ffa3" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#536070' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#536070' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          {designCapacity && (
            <ReferenceLine y={designCapacity} stroke="#ff4f4f" strokeDasharray="5 5" label={{ value: 'Design', fill: '#ff4f4f', fontSize: 10, position: 'right' }} />
          )}
          <Area type="monotone" dataKey="fcc" stroke="#00ffa3" strokeWidth={2} fill="url(#capGrad)" dot={{ r: 3, fill: '#00ffa3', stroke: '#131920', strokeWidth: 2 }} activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
