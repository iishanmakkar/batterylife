'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { BatteryMedium } from 'lucide-react';

interface Props {
  designCapacity: number;
  fullChargeCapacity: number;
  height?: number;
}

const COLORS = ['#00ffa3', '#ffb830'];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { fill: string } }> }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#131920', border: '1px solid #1e2d3d', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
      <p className="font-mono" style={{ color: payload[0].payload.fill }}>{payload[0].name}: {(payload[0].value / 1000).toFixed(1)} Wh</p>
    </div>
  );
};

export default function CapacityBreakdownChart({ designCapacity, fullChargeCapacity, height = 220 }: Props) {
  const lost = Math.max(0, designCapacity - fullChargeCapacity);
  const health = designCapacity > 0 ? Math.min(120, (fullChargeCapacity / designCapacity) * 100) : 0;
  const data = [
    { name: 'Usable', value: Math.max(0, fullChargeCapacity) },
    { name: 'Lost', value: lost },
  ];

  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 16, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--tx1)', marginBottom: 16 }}>
        <BatteryMedium style={{ width: 16, height: 16, color: 'var(--acc)' }} /> Capacity Breakdown
      </div>
      <div style={{ position: 'relative' }}>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={86} paddingAngle={3} dataKey="value" stroke="none">
              {data.map((_, i) => <Cell key={i} fill={COLORS[i]} fillOpacity={0.82} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <span className="font-mono" style={{ fontSize: 24, fontWeight: 700, color: 'var(--tx1)' }}>{health.toFixed(1)}%</span>
          <span style={{ fontSize: 11, color: 'var(--tx3)' }}>capacity</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12, fontSize: 12 }}>
        <div style={{ color: 'var(--tx2)' }}><span style={{ color: COLORS[0] }}>■</span> {(fullChargeCapacity / 1000).toFixed(1)} Wh usable</div>
        <div style={{ color: 'var(--tx2)' }}><span style={{ color: COLORS[1] }}>■</span> {(lost / 1000).toFixed(1)} Wh lost</div>
      </div>
    </div>
  );
}
