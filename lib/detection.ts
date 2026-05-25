/* ═══════════════════════════════════════════════════════════════════
   BatteryIQ — Advanced Detection Utilities
   Fake battery detection, gaming damage, device age, resale impact
═══════════════════════════════════════════════════════════════════ */

import type { BatteryReport, HealthAnalysis } from './types';
import { linearRegression } from './health';

/** Detect potentially fake or misreported battery data */
export function detectFakeBattery(report: BatteryReport): { isSuspicious: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const { designCapacity: dc, fullChargeCapacity: fcc, cycleCount: cc, chemistry } = report.battery;

  if (dc > 100000) reasons.push('Design capacity exceeds 100Wh — unusually high for a laptop battery');
  if (dc > 0 && dc < 5000) reasons.push('Design capacity below 5Wh — suspiciously low');
  if (fcc > dc * 1.15 && dc > 0) reasons.push('Full charge capacity exceeds design by >15% — possible calibration error or counterfeit');
  if (!['lion', 'lip', 'li-ion', 'lipo', 'nimh', 'nicd'].includes(chemistry.toLowerCase())) {
    reasons.push(`Unusual battery chemistry: "${chemistry}"`);
  }
  if (cc === 0 && dc > 0 && fcc < dc * 0.85) reasons.push('Zero cycle count but significant wear — data inconsistency');
  if (cc > 2000) reasons.push('Cycle count exceeds 2000 — extremely unusual for a laptop battery');

  return { isSuspicious: reasons.length > 0, reasons };
}

/** Estimate impact of gaming/heavy workloads on battery degradation */
export function estimateGamingDamage(report: BatteryReport): {
  level: string;
  description: string;
  percentage: number;
} {
  const sessions = report.drainSessions;
  if (sessions.length === 0) return { level: 'Unknown', description: 'No drain session data available.', percentage: 0 };

  const heavySessions = sessions.filter(s => s.drain > 40);
  const highRateSessions = sessions.filter(s => s.rate > 25000);
  const heavyPct = (heavySessions.length / sessions.length) * 100;
  const avgRate = sessions.reduce((a, b) => a + b.rate, 0) / sessions.length;

  let level: string, description: string, percentage: number;

  if (heavyPct > 40 || highRateSessions.length > 5) {
    level = 'Heavy';
    description = `${heavySessions.length} heavy drain sessions detected (${heavyPct.toFixed(0)}% of all sessions). Average power draw: ${Math.round(avgRate)} mWh/h. This pattern suggests frequent gaming or GPU-intensive workloads, which accelerate battery degradation significantly.`;
    percentage = Math.min(30, Math.round(heavyPct * 0.5));
  } else if (heavyPct > 15 || highRateSessions.length > 2) {
    level = 'Moderate';
    description = `Some high-drain sessions detected. ${heavySessions.length} sessions exceeded 40% drain. Occasional heavy workloads contribute to normal wear.`;
    percentage = Math.min(15, Math.round(heavyPct * 0.3));
  } else {
    level = 'Light';
    description = 'No significant heavy-workload battery drain patterns detected. Your usage appears to be standard productivity workloads.';
    percentage = Math.min(5, Math.round(heavyPct * 0.1));
  }

  return { level, description, percentage };
}

/** Estimate how old the device is based on available data */
export function estimateDeviceAge(report: BatteryReport): { months: number; label: string } {
  const capHist = report.capacityHistory;

  // Try to estimate from capacity history date range
  if (capHist.length >= 2) {
    const estimatedMonths = Math.round(capHist.length * 1.5);
    const label = estimatedMonths > 24
      ? `~${Math.round(estimatedMonths / 12)} years`
      : `~${estimatedMonths} months`;
    return { months: estimatedMonths, label };
  }

  // Fallback: estimate from cycle count (~20 cycles per month typical)
  const cc = report.battery.cycleCount;
  if (cc > 0) {
    const months = Math.max(1, Math.round(cc / 20));
    const label = months > 24 ? `~${Math.round(months / 12)} years` : `~${months} months`;
    return { months, label };
  }

  return { months: 0, label: 'Unknown' };
}

/** Estimate impact on device resale value based on battery health */
export function estimateResaleImpact(health: HealthAnalysis): {
  impactPercent: number;
  label: string;
  description: string;
} {
  if (health.status === 'Unknown') {
    return { impactPercent: 0, label: 'Unknown', description: 'Resale impact cannot be estimated until capacity data is available.' };
  }

  if (health.wearPct < 5) {
    return { impactPercent: 0, label: 'None', description: 'Battery is essentially new. No impact on resale value.' };
  } else if (health.wearPct < 10) {
    return { impactPercent: 3, label: 'Minimal', description: 'Battery shows minimal wear. Negligible impact on device value (~3%).' };
  } else if (health.wearPct < 20) {
    return { impactPercent: 8, label: 'Low', description: 'Normal battery wear. Minor reduction in resale value (~5-10%).' };
  } else if (health.wearPct < 30) {
    return { impactPercent: 15, label: 'Moderate', description: 'Noticeable battery degradation. Buyers may negotiate 10-20% off.' };
  } else if (health.wearPct < 45) {
    return { impactPercent: 25, label: 'Significant', description: 'Battery is significantly worn. Expect 20-30% reduction in resale value.' };
  } else {
    return { impactPercent: 35, label: 'Major', description: 'Battery needs replacement. Value reduced by 30-40% unless battery is replaced.' };
  }
}

/** Predict battery health over the next 12 months using regression */
export function predictHealthTimeline(
  report: BatteryReport,
  health: HealthAnalysis
): Array<{ month: string; predictedHealth: number }> {
  const timeline: Array<{ month: string; predictedHealth: number }> = [];
  const dc = report.battery.designCapacity;

  if (!health.regression || dc <= 0) return timeline;

  const currentIdx = report.capacityHistory.length - 1;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();

  for (let i = 0; i <= 12; i++) {
    const futureDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const monthLabel = `${months[futureDate.getMonth()]} ${futureDate.getFullYear().toString().slice(2)}`;
    // Assume ~0.67 data points per month (based on typical report frequency)
    const futureIdx = currentIdx + i * 0.67;
    const predictedFcc = Math.max(0, health.regression.predict(futureIdx));
    const predictedHealthPct = Math.max(0, Math.min(100, (predictedFcc / dc) * 100));

    timeline.push({ month: monthLabel, predictedHealth: +predictedHealthPct.toFixed(1) });
  }

  return timeline;
}
