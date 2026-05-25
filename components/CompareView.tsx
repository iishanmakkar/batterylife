'use client';
import type { BatteryReport } from '@/lib/types';
import { computeHealth } from '@/lib/health';

export default function CompareView({ reports }: { reports: BatteryReport[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {reports.map((r, i) => {
        const h = computeHealth(r);
        return (
          <div key={i} className="bg-[var(--color-bg2)] border border-[var(--color-border)] rounded-2xl p-5 hover:border-[var(--color-border2)] transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-sm font-semibold text-[var(--color-text1)] truncate max-w-[180px]">{r.filename}</h4>
                <p className="text-xs text-[var(--color-text3)]">{r.device.name}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-[family-name:var(--font-mono)] text-xl font-bold" style={{ background: `${h.color}18`, color: h.color }}>
                {h.score}
              </div>
            </div>
            <div className="space-y-2">
              {[
                { l: 'Design Capacity', v: `${(r.battery.designCapacity / 1000).toFixed(1)} Wh` },
                { l: 'Full Charge', v: `${(r.battery.fullChargeCapacity / 1000).toFixed(1)} Wh` },
                { l: 'Wear Level', v: `${h.wearPct}%` },
                { l: 'Cycle Count', v: `${r.battery.cycleCount}` },
                { l: 'Avg Life', v: h.avgLife > 0 ? `${h.avgLife}h` : 'N/A' },
                { l: 'Status', v: h.status },
              ].map((row, j) => (
                <div key={j} className="flex justify-between text-xs">
                  <span className="text-[var(--color-text3)]">{row.l}</span>
                  <span className="font-[family-name:var(--font-mono)] text-[var(--color-text1)] font-medium">{row.v}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
