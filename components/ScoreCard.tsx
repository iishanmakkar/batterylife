'use client';

import { motion } from 'framer-motion';
import type { BatteryReport, HealthAnalysis } from '@/lib/types';

export default function ScoreCard({ report, health }: { report: BatteryReport; health: HealthAnalysis }) {
  const circ = 2 * Math.PI * 82;
  const offset = circ - (health.score / 100) * circ;
  const hasData = report.battery.designCapacity > 0;

  return (
    <div className="card-glow" style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 20, padding: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, alignItems: 'center' }}>
        {/* Score Ring */}
        <div style={{ position: 'relative', width: 180, height: 180, flexShrink: 0 }}>
          <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden="true">
            <circle cx="90" cy="90" r="82" fill="none" stroke="var(--bdr)" strokeWidth="10" />
            <motion.circle
              cx="90" cy="90" r="82" fill="none" stroke={health.color} strokeWidth="10"
              strokeDasharray={circ} strokeLinecap="round"
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
              transform="rotate(-90 90 90)"
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span className="font-mono" style={{ fontSize: 44, fontWeight: 700, lineHeight: 1, color: health.color }}>
              {hasData ? health.score : '?'}
            </span>
            <span style={{ fontSize: 14, color: 'var(--tx3)', marginTop: 2 }}>{hasData ? '/100' : ''}</span>
          </div>
        </div>

        {/* Info */}
        <div>
          <h2 className="font-syne" style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6, color: 'var(--tx1)' }}>
            {hasData ? `${health.status} Health` : 'Incomplete Data'}
            {hasData && (
              <span style={{ fontSize: 18, opacity: 0.5, fontWeight: 400, marginLeft: 8 }}>· Grade {health.grade}</span>
            )}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--tx2)', marginBottom: 12 }}>
            {report.device.name}
            {report.battery.name !== 'Unknown' && ` · ${report.battery.name}`}
            {' · '}{report.reportTime}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {hasData ? (
              <>
                <span className={`pill-${health.wearPct < 15 ? 'good' : 'warn'}`} style={{ padding: '4px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                  ⚡ {health.wearPct}% wear
                </span>
                <span className={`pill-${report.battery.cycleCount < 300 ? 'good' : 'warn'}`} style={{ padding: '4px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                  🔄 {report.battery.cycleCount} cycles
                </span>
                <span className={`pill-${health.avgLife >= 6 ? 'good' : health.avgLife >= 4 ? 'warn' : 'bad'}`} style={{ padding: '4px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                  ⏱ {health.avgLife || '?'}h avg life
                </span>
                <span className="pill-info" style={{ padding: '4px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                  🧪 {report.battery.chemistry}
                </span>
              </>
            ) : (
              <span className="pill-warn" style={{ padding: '4px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500 }}>
                ⚠️ Limited data — some fields could not be parsed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
