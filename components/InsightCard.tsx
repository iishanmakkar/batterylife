'use client';

import type { InsightItem } from '@/lib/types';
import { Lightbulb, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const iconMap = {
  positive: <CheckCircle className="w-4 h-4" />,
  neutral: <Info className="w-4 h-4" />,
  warning: <AlertTriangle className="w-4 h-4" />,
  critical: <AlertTriangle className="w-4 h-4" />,
};

const colorMap = {
  positive: { bg: 'rgba(0,255,163,0.1)', text: 'var(--color-accent)', border: 'rgba(0,255,163,0.2)' },
  neutral: { bg: 'rgba(0,212,255,0.1)', text: 'var(--color-accent2)', border: 'rgba(0,212,255,0.2)' },
  warning: { bg: 'rgba(255,184,48,0.1)', text: 'var(--color-warn)', border: 'rgba(255,184,48,0.2)' },
  critical: { bg: 'rgba(255,79,79,0.1)', text: 'var(--color-danger)', border: 'rgba(255,79,79,0.2)' },
};

export default function InsightCard({ insight }: { insight: InsightItem }) {
  const colors = colorMap[insight.severity];
  return (
    <div className="flex items-start gap-3.5 py-4 px-5 border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-bg3)] transition-colors">
      <div
        className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: colors.bg, color: colors.text }}
      >
        {iconMap[insight.severity]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-[var(--color-text1)] mb-0.5">{insight.title}</div>
        <div className="text-xs text-[var(--color-text2)] leading-relaxed">{insight.description}</div>
        {insight.action && (
          <div className="mt-2 text-[11px] py-1.5 px-2.5 rounded-lg font-medium flex items-center gap-1.5" style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
            <Lightbulb className="w-3 h-3" /> {insight.action}
          </div>
        )}
      </div>
    </div>
  );
}
