'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  label: string;
  value: string;
  sub: string;
  pct: number;
  colorClass: string;
  barColor: string;
}

export default function MetricCard({ icon, label, value, sub, pct, barColor }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'relative', overflow: 'hidden',
        background: 'var(--bg2)', border: '1px solid var(--bdr)',
        borderRadius: 16, padding: '20px',
      }}
    >
      {/* Top accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: barColor }} />

      <div style={{ fontSize: 20, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 11, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 500, marginBottom: 6 }}>{label}</div>
      <div className="font-mono" style={{ fontSize: 26, fontWeight: 700, lineHeight: 1, color: 'var(--tx1)' }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--tx2)', marginTop: 4 }}>{sub}</div>
      <div style={{ marginTop: 12, height: 3, background: 'var(--bdr)', borderRadius: 2, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          style={{ height: '100%', borderRadius: 2, background: barColor }}
        />
      </div>
    </motion.div>
  );
}
