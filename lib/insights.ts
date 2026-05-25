/* ═══════════════════════════════════════════════════════════════════
   BatteryIQ — AI-like Insights Engine
   Generates smart, contextual recommendations based on battery data
═══════════════════════════════════════════════════════════════════ */

import type { BatteryReport, HealthAnalysis, InsightItem } from './types';

/** Generate contextual insights and recommendations */
export function generateInsights(report: BatteryReport, health: HealthAnalysis): InsightItem[] {
  const insights: InsightItem[] = [];
  const { cycleCount: cc, designCapacity: dc, fullChargeCapacity: fcc } = report.battery;

  // ── Overall Health Assessment ───────────────────────────
  if (health.score >= 90) {
    insights.push({
      category: 'health', severity: 'positive',
      title: 'Battery health is excellent',
      description: `Your battery retains ${health.healthPct}% of its original capacity. This is outstanding for a battery with ${cc} charge cycles.`,
      action: 'Continue your current charging habits.',
    });
  } else if (health.score >= 70) {
    insights.push({
      category: 'health', severity: 'positive',
      title: 'Battery is in good condition',
      description: `With ${health.healthPct}% capacity remaining, your battery is performing within normal parameters.`,
      action: 'No immediate action needed. Monitor quarterly.',
    });
  } else if (health.score >= 50) {
    insights.push({
      category: 'health', severity: 'warning',
      title: 'Battery degradation is above average',
      description: `Your battery has lost ${health.wearPct}% of its original capacity. Performance may be noticeably reduced.`,
      action: 'Consider planning for a battery replacement within 6-12 months.',
    });
  } else {
    insights.push({
      category: 'replacement', severity: 'critical',
      title: 'Battery replacement recommended',
      description: `With only ${health.healthPct}% capacity remaining, your battery is significantly degraded and may cause unexpected shutdowns.`,
      action: 'Contact your laptop manufacturer for battery replacement options.',
    });
  }

  // ── Cycle Count Analysis ────────────────────────────────
  if (cc > 400) {
    insights.push({
      category: 'maintenance', severity: 'warning',
      title: 'Heavy charging cycles detected',
      description: `${cc} charge cycles is approaching the typical 500-cycle lifespan for lithium-ion batteries. Accelerated degradation is expected.`,
      action: 'Optimize charging habits — keep charge between 20-80%.',
    });
  } else if (cc > 200) {
    insights.push({
      category: 'maintenance', severity: 'neutral',
      title: 'Moderate cycle usage',
      description: `${cc} cycles used of an estimated 500-cycle lifespan. Approximately ${Math.round(((500 - cc) / 500) * 100)}% of battery life remaining by cycle count.`,
    });
  }

  // ── Charging Behavior ───────────────────────────────────
  const batHours = report.weeklyUsage.reduce((a, b) => a + b.bat, 0);
  const acHours = report.weeklyUsage.reduce((a, b) => a + b.ac, 0);
  const totalHours = batHours + acHours;

  if (totalHours > 0) {
    const acPct = (acHours / totalHours) * 100;
    if (acPct > 80) {
      insights.push({
        category: 'usage', severity: 'warning',
        title: 'Avoid keeping charger plugged in continuously',
        description: `${acPct.toFixed(0)}% of your usage is on AC power. Constant charging at 100% causes trickle-charge stress on lithium-ion cells.`,
        action: 'Enable battery charge limit (80%) in BIOS or manufacturer utility.',
      });
    } else if (acPct < 20) {
      insights.push({
        category: 'usage', severity: 'neutral',
        title: 'Heavy battery-only usage',
        description: `You use your laptop on battery ${(100 - acPct).toFixed(0)}% of the time. This is normal but increases cycle count.`,
        action: 'Plug in when near a power source to reduce unnecessary cycles.',
      });
    }
  }

  // ── Gaming / Heavy Workload ─────────────────────────────
  const heavyDrains = report.drainSessions.filter(s => s.drain > 40);
  if (heavyDrains.length >= 3) {
    const avgRate = Math.round(heavyDrains.reduce((a, b) => a + b.rate, 0) / heavyDrains.length);
    insights.push({
      category: 'performance', severity: 'warning',
      title: 'Gaming or intensive workloads affecting battery',
      description: `Detected ${heavyDrains.length} high-drain sessions (40%+ drain) with average power draw of ${avgRate} mWh/h. Heavy loads generate heat and accelerate cell degradation.`,
      action: 'Use performance modes on AC power. Reduce GPU load on battery.',
    });
  }

  // ── Battery Life Trend ──────────────────────────────────
  if (health.avgLife > 0 && health.avgLife < 4) {
    insights.push({
      category: 'performance', severity: 'warning',
      title: 'Short battery runtime detected',
      description: `Average active battery life of ${health.avgLife} hours is below expectations. This may indicate background processes, wear, or display settings.`,
      action: 'Check Task Manager for high-drain apps. Lower brightness. Enable Battery Saver.',
    });
  } else if (health.avgLife >= 8) {
    insights.push({
      category: 'performance', severity: 'positive',
      title: 'Excellent battery runtime',
      description: `Averaging ${health.avgLife} hours on battery — your power management is working well.`,
    });
  }

  // ── Degradation Rate ────────────────────────────────────
  if (health.regression && health.regression.slope < -300) {
    insights.push({
      category: 'health', severity: 'critical',
      title: 'Rapid capacity decline detected',
      description: 'The capacity degradation rate is faster than typical. This may indicate a manufacturing defect, extreme temperatures, or abusive charging.',
      action: 'Check warranty status. Avoid fast charging. Keep laptop cool.',
    });
  }

  // ── Calibration Suggestion ──────────────────────────────
  if (dc > 0 && fcc > dc * 1.02) {
    insights.push({
      category: 'maintenance', severity: 'neutral',
      title: 'Battery calibration may be needed',
      description: 'Full charge capacity exceeds design capacity, which usually indicates the battery gauge needs recalibration.',
      action: 'Run a full discharge from 100% to below 5%, then charge to 100% uninterrupted.',
    });
  }

  // ── Power Efficiency Tip ────────────────────────────────
  insights.push({
    category: 'maintenance', severity: 'neutral',
    title: 'Monthly health monitoring recommended',
    description: `Run powercfg /batteryreport monthly and upload here to track degradation. Early detection saves you from unexpected battery failure.`,
    action: 'Set a monthly reminder to generate and upload a new report.',
  });

  return insights;
}
