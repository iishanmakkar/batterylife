'use client';

import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { HeartPulse } from 'lucide-react';
import type { CapacityEntry } from '@/lib/types';

interface Props {
  data: CapacityEntry[];
  designCapacity: number;
  height?: number;
}

interface HealthPoint {
  period: string;
  health: number;
  fcc: number;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ payload: HealthPoint }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div style={{ background: '#131920', border: '1px solid #1e2d3d', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
      <p style={{ color: '#8899aa', marginBottom: 4 }}>{label}</p>
      <p className="font-mono" style={{ color: '#e8f0fe', fontWeight: 600 }}>{point.health.toFixed(1)}% health</p>
      <p style={{ color: '#8899aa' }}>{(point.fcc / 1000).toFixed(1)} Wh full charge</p>
    </div>
  );
};

export default function HealthTrendChart({ data, designCapacity, height = 260 }: Props) {
  const chartData = designCapacity > 0
    ? data.map(d => ({ period: d.period, fcc: d.fcc, health: +((d.fcc / designCapacity) * 100).toFixed(1) }))
    : [];

  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 16, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--tx1)' }}>
          <HeartPulse style={{ width: 16, height: 16, color: 'var(--acc)' }} /> Health Trend
        </div>
        <span style={{ fontSize: 12, color: 'var(--tx3)' }}>capacity as % of design</span>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="healthTrendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.24} />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#536070' }} axisLine={false} tickLine={false} />
          <YAxis domain={[70, 105]} tickFormatter={(v: number) => `${v}%`} tick={{ fontSize: 11, fill: '#536070' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={100} stroke="#00ffa3" strokeDasharray="5 5" label={{ value: '100%', fill: '#00ffa3', fontSize: 10, position: 'right' }} />
          <ReferenceLine y={80} stroke="#ffb830" strokeDasharray="5 5" label={{ value: 'Replace watch', fill: '#ffb830', fontSize: 10, position: 'right' }} />
          <Area type="monotone" dataKey="health" stroke="#00d4ff" strokeWidth={2} fill="url(#healthTrendGrad)" dot={{ r: 3, fill: '#00d4ff', stroke: '#131920', strokeWidth: 2 }} activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
