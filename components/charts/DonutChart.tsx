'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Plug } from 'lucide-react';

interface Props { batteryHours: number; acHours: number; height?: number; }

const COLORS = ['#00ffa3', '#00d4ff'];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { fill: string } }> }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--tooltip-bg)', border: '1px solid var(--tooltip-border)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
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
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 16, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--tx1)', marginBottom: 16 }}>
        <Plug style={{ width: 16, height: 16, color: 'var(--acc2)' }} /> Power Source Split
      </div>
      <div style={{ position: 'relative' }}>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
              {data.map((_, i) => <Cell key={i} fill={COLORS[i]} fillOpacity={0.8} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <span className="font-mono" style={{ fontSize: 24, fontWeight: 700, color: 'var(--tx1)' }}>{batPct}%</span>
          <span style={{ fontSize: 11, color: 'var(--tx3)' }}>on battery</span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 12 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--tx2)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[i] }} />
            {d.name} ({d.value.toFixed(1)}h)
          </div>
        ))}
      </div>
    </div>
  );
}
