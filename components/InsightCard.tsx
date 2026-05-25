'use client';

import type { InsightItem } from '@/lib/types';
import { Lightbulb, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const iconMap = {
  positive: <CheckCircle style={{ width: 16, height: 16 }} />,
  neutral: <Info style={{ width: 16, height: 16 }} />,
  warning: <AlertTriangle style={{ width: 16, height: 16 }} />,
  critical: <AlertTriangle style={{ width: 16, height: 16 }} />,
};

const colorMap = {
  positive: { bg: 'rgba(0,255,163,0.1)', text: 'var(--acc)', border: 'rgba(0,255,163,0.2)' },
  neutral: { bg: 'rgba(0,212,255,0.1)', text: 'var(--acc2)', border: 'rgba(0,212,255,0.2)' },
  warning: { bg: 'rgba(255,184,48,0.1)', text: 'var(--wrn)', border: 'rgba(255,184,48,0.2)' },
  critical: { bg: 'rgba(255,79,79,0.1)', text: 'var(--dng)', border: 'rgba(255,79,79,0.2)' },
};

export default function InsightCard({ insight }: { insight: InsightItem }) {
  const colors = colorMap[insight.severity];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px', borderBottom: '1px solid var(--bdr)' }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, background: colors.bg, color: colors.text }}>
        {iconMap[insight.severity]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx1)', marginBottom: 2 }}>{insight.title}</div>
        <div style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.6 }}>{insight.description}</div>
        {insight.action && (
          <div style={{ marginTop: 8, fontSize: 11, padding: '6px 10px', borderRadius: 8, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
            <Lightbulb style={{ width: 12, height: 12 }} /> {insight.action}
          </div>
        )}
      </div>
    </div>
  );
}
