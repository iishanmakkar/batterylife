'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { BatteryReport } from '@/lib/types';
import { computeHealth } from '@/lib/health';
import { GitCompareArrows } from 'lucide-react';

const COLORS = ['#00ffa3', '#00d4ff', '#7c6dff', '#ffb830', '#ff4f4f'];

interface Props { reports: BatteryReport[]; height?: number; }

export default function CompareChart({ reports, height = 260 }: Props) {
  const data = reports.map((r, i) => {
    const h = computeHealth(r);
    return {
      name: r.filename.slice(0, 20),
      score: h.score,
      wear: h.wearPct,
      cycles: r.battery.cycleCount,
      color: COLORS[i % COLORS.length],
    };
  });

  return (
    <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text1)]">
          <GitCompareArrows className="w-4 h-4 text-[var(--accent3)]" /> Report Comparison
        </div>
        <span className="text-xs text-[var(--text3)]">{reports.length} reports</span>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#536070' }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#536070' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#131920', border: '1px solid #1e2d3d', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#8899aa' }}
            itemStyle={{ color: '#e8f0fe' }}
          />
          <Bar dataKey="score" name="Health Score" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {data.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.8} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
