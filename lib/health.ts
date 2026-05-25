/* ═══════════════════════════════════════════════════════════════════
   BatteryIQ — Health Analysis Engine
   Computes health scores, grades, verdicts, and predictions
═══════════════════════════════════════════════════════════════════ */

import type { BatteryReport, HealthAnalysis, VerdictItem, RegressionResult } from './types';

/** Ordinary least squares linear regression */
export function linearRegression(points: Array<{ x: number; y: number }>): RegressionResult {
  const n = points.length;
  if (n < 2) return { slope: 0, intercept: 0, r2: 0, predict: () => 0 };

  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);

  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return { slope: 0, intercept: sumY / n, r2: 0, predict: () => sumY / n };

  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  const yMean = sumY / n;
  const ssTot = points.reduce((s, p) => s + (p.y - yMean) ** 2, 0);
  const ssRes = points.reduce((s, p) => s + (p.y - (slope * p.x + intercept)) ** 2, 0);
  const r2 = ssTot ? 1 - ssRes / ssTot : 0;

  return { slope, intercept, r2, predict: (x: number) => slope * x + intercept };
}

/** Compute comprehensive battery health analysis */
export function computeHealth(report: BatteryReport): HealthAnalysis {
  const { designCapacity: dc, fullChargeCapacity: fcc, cycleCount: cc } = report.battery;

  const wearPct = dc > 0 ? ((dc - fcc) / dc) * 100 : 0;
  const healthPct = dc > 0 ? (fcc / dc) * 100 : 0;

  // ── Scoring Algorithm ───────────────────────────────────
  let score = 100;
  score -= Math.min(wearPct * 1.5, 40);
  if (cc > 400) score -= 15;
  else if (cc > 300) score -= 10;
  else if (cc > 200) score -= 5;
  else if (cc > 100) score -= 2;

  const avgLife = report.lifeEstimates.length
    ? report.lifeEstimates.reduce((a, b) => a + b.active, 0) / report.lifeEstimates.length
    : 0;
  if (avgLife > 0 && avgLife < 4) score -= 10;
  else if (avgLife > 0 && avgLife < 5) score -= 5;

  score = Math.max(0, Math.min(100, Math.round(score)));

  // ── Grade & Status ──────────────────────────────────────
  let status: string, color: string, grade: string;
  if (score >= 90) { status = 'Excellent'; color = '#00ffa3'; grade = 'A+'; }
  else if (score >= 80) { status = 'Good'; color = '#00ffa3'; grade = 'A'; }
  else if (score >= 65) { status = 'Fair'; color = '#ffb830'; grade = 'B'; }
  else if (score >= 50) { status = 'Degraded'; color = '#ff9500'; grade = 'C'; }
  else { status = 'Replace Soon'; color = '#ff4f4f'; grade = 'Replace Soon'; }

  const remainingCycles = Math.max(0, 500 - cc);

  // ── Regression ──────────────────────────────────────────
  const capHist = report.capacityHistory;
  let regression: RegressionResult | null = null;
  if (capHist.length >= 3) {
    const xy = capHist.map((c, i) => ({ x: i, y: c.fcc }));
    regression = linearRegression(xy);
  }

  // ── Estimated Lifespan ──────────────────────────────────
  let estimatedLifespan = 'Unknown';
  if (regression && regression.slope < 0 && dc > 0) {
    const threshold = dc * 0.4; // 40% of design = end of useful life
    const currentIdx = capHist.length - 1;
    const currentFcc = regression.predict(currentIdx);
    const monthsLeft = Math.max(0, Math.round((currentFcc - threshold) / Math.abs(regression.slope) * 1.5));
    estimatedLifespan = monthsLeft > 36 ? '3+ years' : monthsLeft > 12 ? `${Math.round(monthsLeft / 12)} year(s)` : `${monthsLeft} months`;
  } else if (wearPct < 10) {
    estimatedLifespan = '3+ years';
  } else if (wearPct < 20) {
    estimatedLifespan = '1-2 years';
  } else if (wearPct < 35) {
    estimatedLifespan = '6-12 months';
  } else {
    estimatedLifespan = 'Replace soon';
  }

  // ── Resale Impact ───────────────────────────────────────
  let resaleImpact: string;
  if (wearPct < 10) resaleImpact = 'Minimal (0-5% value reduction)';
  else if (wearPct < 20) resaleImpact = 'Low (5-10% value reduction)';
  else if (wearPct < 30) resaleImpact = 'Moderate (10-20% value reduction)';
  else resaleImpact = 'Significant (20-35% value reduction)';

  // ── Gaming Damage ───────────────────────────────────────
  const heavyDrains = report.drainSessions.filter(s => s.drain > 40);
  let gamingDamage: string;
  if (heavyDrains.length === 0) gamingDamage = 'None detected';
  else if (heavyDrains.length <= 2) gamingDamage = 'Light — occasional heavy sessions';
  else if (heavyDrains.length <= 5) gamingDamage = 'Moderate — frequent heavy workloads';
  else gamingDamage = 'Heavy — significant stress from intensive use';

  // ── Device Age ──────────────────────────────────────────
  let deviceAge = 'Unknown';
  if (capHist.length >= 2) {
    const months = capHist.length * 1.5;
    deviceAge = months > 24 ? `~${Math.round(months / 12)} years` : `~${Math.round(months)} months`;
  } else if (cc > 0) {
    const estMonths = Math.round(cc / 20); // ~20 cycles per month average
    deviceAge = estMonths > 24 ? `~${Math.round(estMonths / 12)} years` : `~${estMonths} months`;
  }

  const dailyDrainAvg = report.weeklyUsage.length
    ? +(report.weeklyUsage.reduce((a, b) => a + b.bat, 0) / report.weeklyUsage.length).toFixed(1)
    : 0;

  return {
    score, healthPct: +healthPct.toFixed(1), wearPct: +wearPct.toFixed(1),
    grade, status, color, remainingCycles,
    avgLife: +avgLife.toFixed(1), dailyDrainAvg,
    estimatedLifespan, resaleImpact, gamingDamage, deviceAge,
    regression,
  };
}

/** Generate diagnostic verdicts about battery health */
export function getVerdicts(report: BatteryReport, health: HealthAnalysis): VerdictItem[] {
  const items: VerdictItem[] = [];
  const { cycleCount: cc, designCapacity: dc, fullChargeCapacity: fcc } = report.battery;

  // ── Capacity Retention ──────────────────────────────────
  if (health.wearPct < 5) {
    items.push({ type: 'good', icon: '✓', title: 'Excellent capacity retention', desc: `Only ${health.wearPct}% capacity lost. Your battery is in outstanding condition.` });
  } else if (health.wearPct < 15) {
    items.push({ type: 'good', icon: '✓', title: 'Normal wear level', desc: `${health.wearPct}% capacity loss is within expected range. No action needed.` });
  } else if (health.wearPct < 25) {
    items.push({ type: 'warn', icon: '!', title: 'Moderate battery wear detected', desc: `${health.wearPct}% capacity lost (${(dc - fcc).toLocaleString()} mWh). Consider monitoring closely.` });
  } else {
    items.push({ type: 'bad', icon: '✕', title: 'Significant capacity loss', desc: `${health.wearPct}% capacity lost — battery holds ${fcc.toLocaleString()} mWh vs original ${dc.toLocaleString()} mWh. Consider replacement.` });
  }

  // ── Cycle Count ─────────────────────────────────────────
  if (cc < 200) {
    items.push({ type: 'good', icon: '✓', title: 'Low cycle count', desc: `${cc} cycles — well below the ~500 cycle typical lifespan.` });
  } else if (cc < 350) {
    items.push({ type: 'info', icon: 'ℹ', title: 'Moderate cycle count', desc: `${cc} cycles. Li-Ion batteries are rated ~300–500 cycles. Monitor capacity trends.` });
  } else {
    items.push({ type: 'warn', icon: '!', title: 'Approaching end of rated lifespan', desc: `${cc} cycles. Beyond 350–400, performance may degrade faster.` });
  }

  // ── Battery Life ────────────────────────────────────────
  if (health.avgLife >= 7) {
    items.push({ type: 'good', icon: '✓', title: 'Great real-world battery life', desc: `Averaging ${health.avgLife} hours of active use per session.` });
  } else if (health.avgLife >= 5) {
    items.push({ type: 'info', icon: 'ℹ', title: 'Acceptable battery life', desc: `Averaging ${health.avgLife} hours per session.` });
  } else if (health.avgLife > 0) {
    items.push({ type: 'warn', icon: '!', title: 'Below-average battery life', desc: `Averaging only ${health.avgLife}h per session — check background apps or wear.` });
  }

  // ── Degradation Trend ───────────────────────────────────
  const capHist = report.capacityHistory;
  if (capHist.length >= 4) {
    const first3avg = (capHist[0].fcc + capHist[1].fcc + capHist[2].fcc) / 3;
    const last3avg = (capHist[capHist.length - 1].fcc + capHist[capHist.length - 2].fcc + capHist[capHist.length - 3].fcc) / 3;
    const deltaPct = ((first3avg - last3avg) / first3avg) * 100;
    if (deltaPct > 10) {
      items.push({ type: 'warn', icon: '!', title: 'Accelerating degradation trend', desc: `Capacity dropped ~${deltaPct.toFixed(1)}% over recorded history.` });
    } else if (deltaPct > 0) {
      items.push({ type: 'good', icon: '✓', title: 'Stable degradation trend', desc: 'Capacity decline is gradual — no sudden drops detected.' });
    }
  }

  // ── Regression Predictions ──────────────────────────────
  if (health.regression && capHist.length >= 3) {
    const lastIdx = capHist.length - 1;
    const futureIdx = lastIdx + 6;
    const predicted = health.regression.predict(lastIdx);
    const futurePred = health.regression.predict(futureIdx);
    const monthlyLoss = ((predicted - futurePred) / 6).toFixed(0);
    if (health.regression.slope < -200) {
      items.push({ type: 'warn', icon: '!', title: 'Accelerating capacity loss', desc: `Losing ~${Math.abs(+monthlyLoss)} mWh per period based on trend.` });
    } else if (health.regression.slope < 0) {
      items.push({ type: 'info', icon: 'ℹ', title: 'Gradual capacity decline', desc: `Losing ~${Math.abs(+monthlyLoss)} mWh per period. Normal degradation pattern.` });
    }
  }

  // ── Drain Patterns ──────────────────────────────────────
  const drains = report.drainSessions;
  if (drains.length > 0) {
    const heavyDrains = drains.filter(s => s.drain > 40);
    if (heavyDrains.length >= 2) {
      items.push({ type: 'warn', icon: '!', title: 'Frequent high-drain sessions', desc: `${heavyDrains.length} sessions with 40%+ drain. Heavy workloads accelerate aging.` });
    } else {
      items.push({ type: 'good', icon: '✓', title: 'Drain patterns look healthy', desc: 'No extreme battery drain patterns detected.' });
    }
  }

  return items;
}
