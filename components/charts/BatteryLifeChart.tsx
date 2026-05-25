'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { LifeEstimate } from '@/lib/types';
import { Clock } from 'lucide-react';

interface Props { data: LifeEstimate[]; height?: number; }

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#131920', border: '1px solid #1e2d3d', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
      <p style={{ color: '#8899aa', marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-mono" style={{ color: '#e8f0fe' }}>{p.name}: {p.value.toFixed(1)}h</p>
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
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 16, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--tx1)' }}>
          <Clock style={{ width: 16, height: 16, color: 'var(--acc2)' }} /> Battery Life Estimates
        </div>
        <span style={{ fontSize: 12, color: 'var(--tx3)' }}>{data.length} periods</span>
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
