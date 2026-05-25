'use client';
import type { BatteryReport } from '@/lib/types';

export default function DeviceInfoCard({ report }: { report: BatteryReport }) {
  const fields = [
    { label: 'Device', value: report.device.name },
    { label: 'Report Time', value: report.reportTime },
    { label: 'Battery Model', value: report.battery.name },
    { label: 'Manufacturer', value: report.battery.manufacturer },
    { label: 'Serial Number', value: report.battery.serial },
    { label: 'Chemistry', value: `${report.battery.chemistry} (Lithium-Ion)` },
    { label: 'BIOS Version', value: report.device.bios },
    { label: 'OS Build', value: report.device.os },
  ];

  return (
    <div className="bg-[var(--color-bg2)] border border-[var(--color-border)] rounded-2xl p-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {fields.map((f, i) => (
          <div key={i}>
            <div className="text-[11px] text-[var(--color-text3)] uppercase tracking-[1px] font-medium mb-1">{f.label}</div>
            <div className="font-mono text-[13px] text-[var(--color-text1)] font-medium">{f.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
