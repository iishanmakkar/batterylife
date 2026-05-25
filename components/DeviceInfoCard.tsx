'use client';

import { Monitor } from 'lucide-react';
import type { BatteryReport } from '@/lib/types';

export default function DeviceInfoCard({ report }: { report: BatteryReport }) {
  const fields = [
    { l: 'Device', v: report.device.name },
    { l: 'Report Time', v: report.reportTime },
    { l: 'Battery Model', v: report.battery.name },
    { l: 'Manufacturer', v: report.battery.manufacturer },
    { l: 'Serial', v: report.battery.serial },
    { l: 'Chemistry', v: report.battery.chemistry },
    { l: 'BIOS', v: report.device.bios },
    { l: 'OS Build', v: report.device.os },
  ];

  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 16, padding: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx1)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Monitor style={{ width: 16, height: 16, color: 'var(--acc2)' }} /> Device Information
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        {fields.map((f, i) => (
          <div key={i}>
            <div style={{ fontSize: 11, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 500, marginBottom: 4 }}>{f.l}</div>
            <div className="font-mono" style={{ fontSize: 13, color: 'var(--tx1)', wordBreak: 'break-all' }}>{f.v || 'Unknown'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
