'use client';

import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Gauge } from 'lucide-react';
import type { DrainSession } from '@/lib/types';

interface Props {
  data: DrainSession[];
  height?: number;
}

interface RatePoint extends DrainSession {
  label: string;
  wh: number;
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: RatePoint }> }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: '#131920', border: '1px solid #1e2d3d', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
      <p style={{ color: '#8899aa', marginBottom: 4 }}>{d.date}</p>
      <p className="font-mono" style={{ color: '#e8f0fe' }}>{(d.rate / 1000).toFixed(1)} W average draw</p>
      <p style={{ color: '#8899aa' }}>{d.wh.toFixed(1)} Wh used over {d.dur}</p>
    </div>
  );
};

export default function DrainRateChart({ data, height = 260 }: Props) {
  const chartData = data.map((d, i) => ({ ...d, label: `S${i + 1}`, wh: d.mwh / 1000 })).reverse();

  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 16, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--tx1)' }}>
          <Gauge style={{ width: 16, height: 16, color: 'var(--wrn)' }} /> Power Draw by Session
        </div>
        <span style={{ fontSize: 12, color: 'var(--tx3)' }}>watts and energy</span>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#536070' }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" tickFormatter={(v: number) => `${v}Wh`} tick={{ fontSize: 11, fill: '#536070' }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="right" orientation="right" tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}W`} tick={{ fontSize: 11, fill: '#536070' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar yAxisId="left" dataKey="wh" fill="#7c6dff" fillOpacity={0.55} radius={[4, 4, 0, 0]} maxBarSize={24} />
          <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#ffb830" strokeWidth={2} dot={{ r: 3, fill: '#ffb830', stroke: '#131920', strokeWidth: 2 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
