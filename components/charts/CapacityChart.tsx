'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { CapacityEntry } from '@/lib/types';
import { TrendingDown } from 'lucide-react';

interface Props { data: CapacityEntry[]; designCapacity?: number; trendLine?: Array<{ period: string; value: number }>; height?: number; }

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
      <p style={{ color: 'var(--chart-muted)', marginBottom: 4 }}>{label}</p>
      <p className="font-mono" style={{ color: 'var(--tx1)', fontWeight: 600 }}>{(payload[0].value / 1000).toFixed(1)} Wh</p>
    </div>
  );
};

export default function CapacityChart({ data, designCapacity, height = 260 }: Props) {
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 16, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--tx1)' }}>
          <TrendingDown style={{ width: 16, height: 16, color: 'var(--acc)' }} /> Capacity Over Time
        </div>
        <span style={{ fontSize: 12, color: 'var(--tx3)' }}>{data.length} data points</span>
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
          <Area type="monotone" dataKey="fcc" stroke="#00ffa3" strokeWidth={2} fill="url(#capGrad)" dot={{ r: 3, fill: '#00ffa3', stroke: 'var(--chart-dot-stroke)', strokeWidth: 2 }} activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
