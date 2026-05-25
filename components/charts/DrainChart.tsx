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
    <div className="bg-[#131920] border border-[#1e2d3d] rounded-lg py-2 px-3 text-xs shadow-xl">
      <p className="text-[#8899aa] mb-1">{d.date}</p>
      <p className="text-[#e8f0fe] font-[family-name:var(--font-mono)]">Drain: {d.drain}%</p>
      <p className="text-[#8899aa]">Duration: {d.dur}</p>
      <p className="text-[#8899aa]">Energy: {d.mwh} mWh</p>
      <p className="text-[#8899aa]">Rate: {d.rate} mWh/h</p>
    </div>
  );
};

export default function DrainChart({ data, height = 260 }: Props) {
  const chartData = data.map((d, i) => ({ ...d, label: `S${i + 1}` }));

  return (
    <div className="bg-[var(--color-bg2)] border border-[var(--color-border)] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text1)]">
          <Activity className="w-4 h-4 text-[var(--color-warn)]" /> Drain Sessions
        </div>
        <span className="text-xs text-[var(--color-text3)]">{data.length} sessions</span>
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
