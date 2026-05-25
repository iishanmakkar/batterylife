'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { UsageEntry } from '@/lib/types';
import { BarChart3 } from 'lucide-react';

interface Props { data: UsageEntry[]; height?: number; }

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#131920', border: '1px solid #1e2d3d', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
      <p style={{ color: '#8899aa', marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-mono">{p.name}: {p.value.toFixed(1)}h</p>
      ))}
    </div>
  );
};

export default function UsageChart({ data, height = 260 }: Props) {
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 16, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--tx1)' }}>
          <BarChart3 style={{ width: 16, height: 16, color: 'var(--acc3)' }} /> Usage Patterns
        </div>
        <span style={{ fontSize: 12, color: 'var(--tx3)' }}>{data.length} days</span>
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
