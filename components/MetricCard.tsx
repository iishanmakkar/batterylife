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

export default function MetricCard({ icon, label, value, sub, pct, colorClass, barColor }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden bg-[var(--color-bg2)] border border-[var(--color-border)] rounded-2xl py-5 px-5 hover:border-[var(--color-border2)] hover:shadow-lg transition-all ${colorClass}`}
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: barColor }} />

      <div className="text-xl mb-2.5">{icon}</div>
      <div className="text-[11px] text-[var(--color-text3)] uppercase tracking-[1px] font-medium mb-1.5">{label}</div>
      <div className="font-[family-name:var(--font-mono)] text-[26px] font-bold leading-none text-[var(--color-text1)]">{value}</div>
      <div className="text-[11px] text-[var(--color-text2)] mt-1">{sub}</div>
      <div className="mt-3 h-[3px] bg-[var(--color-border)] rounded-sm overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="h-full rounded-sm"
          style={{ background: barColor }}
        />
      </div>
    </motion.div>
  );
}
