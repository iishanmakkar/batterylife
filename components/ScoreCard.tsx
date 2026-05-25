'use client';

import { motion } from 'framer-motion';
import type { BatteryReport, HealthAnalysis } from '@/lib/types';

export default function ScoreCard({ report, health }: { report: BatteryReport; health: HealthAnalysis }) {
  const circ = 2 * Math.PI * 82;
  const offset = circ - (health.score / 100) * circ;
  const hasData = report.battery.designCapacity > 0;

  return (
    <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[20px] p-6 card-glow">
      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-center">
        {/* Score Ring */}
        <div className="relative w-[180px] h-[180px] mx-auto sm:mx-0 shrink-0">
          <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden="true">
            <circle cx="90" cy="90" r="82" fill="none" stroke="var(--border)" strokeWidth="10" />
            <motion.circle
              cx="90" cy="90" r="82" fill="none" stroke={health.color} strokeWidth="10"
              strokeDasharray={circ} strokeLinecap="round"
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
              transform="rotate(-90 90 90)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-[44px] font-bold leading-none" style={{ color: health.color }}>
              {hasData ? health.score : '?'}
            </span>
            <span className="text-sm text-[var(--text3)] mt-0.5">{hasData ? '/100' : ''}</span>
          </div>
        </div>

        {/* Info */}
        <div className="text-center sm:text-left">
          <h2 className="font-syne text-[28px] font-extrabold tracking-tight mb-1.5">
            {hasData ? `${health.status} Health` : 'Incomplete Data'}
            {hasData && (
              <span className="text-lg opacity-50 font-normal ml-2">· Grade {health.grade}</span>
            )}
          </h2>
          <p className="text-sm text-[var(--text2)] mb-3">
            {report.device.name}
            {report.battery.name !== 'Unknown' && ` · ${report.battery.name}`}
            {' · '}{report.reportTime}
          </p>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {hasData ? (
              <>
                <span className={`pill-${health.wearPct < 15 ? 'good' : 'warn'} py-1 px-3.5 rounded-full text-xs font-medium flex items-center gap-1`}>
                  ⚡ {health.wearPct}% wear
                </span>
                <span className={`pill-${report.battery.cycleCount < 300 ? 'good' : 'warn'} py-1 px-3.5 rounded-full text-xs font-medium flex items-center gap-1`}>
                  🔄 {report.battery.cycleCount} cycles
                </span>
                <span className={`pill-${health.avgLife >= 6 ? 'good' : health.avgLife >= 4 ? 'warn' : 'bad'} py-1 px-3.5 rounded-full text-xs font-medium flex items-center gap-1`}>
                  ⏱ {health.avgLife || '?'}h avg life
                </span>
                <span className="pill-info py-1 px-3.5 rounded-full text-xs font-medium flex items-center gap-1">
                  🧪 {report.battery.chemistry}
                </span>
              </>
            ) : (
              <span className="pill-warn py-1 px-3.5 rounded-full text-xs font-medium">
                ⚠️ Limited data — some fields could not be parsed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
