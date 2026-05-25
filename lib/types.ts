/* ═══════════════════════════════════════════════════════════════════
   BatteryIQ — Type Definitions
   All TypeScript interfaces for the battery health analyzer
═══════════════════════════════════════════════════════════════════ */

/** Device hardware information */
export interface DeviceInfo {
  name: string;
  bios: string;
  os: string;
}

/** Battery hardware specification */
export interface BatteryInfo {
  name: string;
  manufacturer: string;
  serial: string;
  chemistry: string;
  designCapacity: number;       // mWh — original rated capacity
  fullChargeCapacity: number;   // mWh — current max charge
  cycleCount: number;
  cycleCountKnown?: boolean;
}

/** Capacity history data point */
export interface CapacityEntry {
  period: string;
  fcc: number; // full charge capacity in mWh
}

/** Battery life estimate per period */
export interface LifeEstimate {
  period: string;
  active: number;  // hours of active use
  stdby: number;   // hours of connected standby
}

/** Weekly power usage entry */
export interface UsageEntry {
  date: string;
  bat: number;  // hours on battery
  ac: number;   // hours on AC power
}

/** Individual drain session data */
export interface DrainSession {
  date: string;
  dur: string;
  drain: number;  // percentage of capacity drained
  mwh: number;    // energy drained in mWh
  rate: number;   // drain rate in mWh/h
}

/** Complete parsed battery report */
export interface BatteryReport {
  filename: string;
  device: DeviceInfo;
  battery: BatteryInfo;
  capacityHistory: CapacityEntry[];
  lifeEstimates: LifeEstimate[];
  weeklyUsage: UsageEntry[];
  drainSessions: DrainSession[];
  reportTime: string;
}

/** Linear regression result */
export interface RegressionResult {
  slope: number;
  intercept: number;
  r2: number;
  predict: (x: number) => number;
}

/** Battery health analysis result */
export interface HealthAnalysis {
  score: number;            // 0-100 overall score
  healthPct: number;        // (FCC / DC) × 100
  wearPct: number;          // 100 - healthPct
  grade: string;            // A+ / A / B / C / Replace Soon
  status: string;           // Excellent / Good / Fair / Degraded / Replace Soon
  color: string;            // hex color for status display
  remainingCycles: number;  // estimated remaining charge cycles
  avgLife: number;          // average active battery life in hours
  dailyDrainAvg: number;    // average daily battery drain in hours
  estimatedLifespan: string;
  resaleImpact: string;
  gamingDamage: string;
  deviceAge: string;
  regression: RegressionResult | null;
}

/** Diagnostic verdict item */
export interface VerdictItem {
  type: 'good' | 'warn' | 'bad' | 'info';
  icon: string;
  title: string;
  desc: string;
}

/** Dashboard tab identifiers */
export type TabId = 'overview' | 'history' | 'usage' | 'sessions' | 'compare' | 'tips';

/** AI-like insight recommendation */
export interface InsightItem {
  category: 'health' | 'usage' | 'maintenance' | 'replacement' | 'performance';
  severity: 'positive' | 'neutral' | 'warning' | 'critical';
  title: string;
  description: string;
  action?: string;
}
