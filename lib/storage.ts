/* ═══════════════════════════════════════════════════════════════════
   BatteryIQ — Local Storage Manager
   Handles persistence of reports, settings, and counters
═══════════════════════════════════════════════════════════════════ */

import type { BatteryReport } from './types';

const STORAGE_KEY = 'batteryiq_reports';
const COUNT_KEY = 'batteryiq_count';
const THEME_KEY = 'batteryiq_theme';

/** Save reports array to localStorage */
export function saveReports(reports: BatteryReport[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (e) {
    console.warn('BatteryIQ: Failed to save reports:', e);
  }
}

/** Load reports from localStorage */
export function loadReports(): BatteryReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    console.warn('BatteryIQ: Failed to load reports:', e);
  }
  return [];
}

/** Get total number of reports ever analyzed */
export function getAnalyzedCount(): number {
  try {
    return parseInt(localStorage.getItem(COUNT_KEY) || '0');
  } catch { return 0; }
}

/** Increment and return the analyzed count */
export function incrementCount(): number {
  try {
    const count = getAnalyzedCount() + 1;
    localStorage.setItem(COUNT_KEY, count.toString());
    return count;
  } catch { return 0; }
}

/** Get saved theme preference */
export function getTheme(): 'dark' | 'light' {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    return theme === 'light' ? 'light' : 'dark';
  } catch { return 'dark'; }
}

/** Save theme preference */
export function setTheme(theme: 'dark' | 'light'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch { /* silently fail */ }
}
