import type { BatteryReport } from './types';

const validCapacity = (value: number): boolean => value > 10000 && value < 200000;

export function normalizeReport(report: BatteryReport): BatteryReport {
  const history = report.capacityHistory ?? [];
  const historyValues = history.map(entry => entry.fcc).filter(validCapacity);
  const latestHistory = historyValues.length ? historyValues[historyValues.length - 1] : 0;
  const bestHistory = historyValues.length ? Math.max(...historyValues) : 0;

  const designCapacity = validCapacity(report.battery.designCapacity)
    ? report.battery.designCapacity
    : bestHistory;
  const fullChargeCapacity = validCapacity(report.battery.fullChargeCapacity)
    ? report.battery.fullChargeCapacity
    : latestHistory;

  return {
    ...report,
    battery: {
      ...report.battery,
      name: report.battery.name.toUpperCase().startsWith('DESKTOP-') ? 'Unknown' : report.battery.name,
      designCapacity,
      fullChargeCapacity,
    },
  };
}

export function normalizeReports(reports: BatteryReport[]): BatteryReport[] {
  return reports.map(normalizeReport);
}
