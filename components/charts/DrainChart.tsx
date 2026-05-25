'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { DrainSession } from '@/lib/types';
import { Activity } from 'lucide-react';

interface Props { data: DrainSession[]; height?: number; }

function getColor(drain: number): string {
  if (drain > 40) return '#ff4f4f';
  if (drain > 25) return '#ffb830';
  return '#00ffa3';
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: DrainSession }> }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
      <p style={{ color: 'var(--chart-muted)', marginBottom: 4 }}>{d.date}</p>
      <p className="font-mono" style={{ color: 'var(--tx1)' }}>Drain: {d.drain}%</p>
      <p style={{ color: 'var(--chart-muted)' }}>Duration: {d.dur}</p>
      <p style={{ color: 'var(--chart-muted)' }}>Energy: {d.mwh} mWh</p>
      <p style={{ color: 'var(--chart-muted)' }}>Rate: {d.rate} mWh/h</p>
    </div>
  );
};

export default function DrainChart({ data, height = 260 }: Props) {
  const chartData = data.map((d, i) => ({ ...d, label: `S${i + 1}` }));
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 16, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--tx1)' }}>
          <Activity style={{ width: 16, height: 16, color: 'var(--wrn)' }} /> Drain Sessions
        </div>
        <span style={{ fontSize: 12, color: 'var(--tx3)' }}>{data.length} sessions</span>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#536070' }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 'auto']} tickFormatter={(v: number) => `${v}%`} tick={{ fontSize: 11, fill: '#536070' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="drain" radius={[4, 4, 0, 0]} maxBarSize={28}>
            {chartData.map((d, i) => <Cell key={i} fill={getColor(d.drain)} fillOpacity={0.8} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
