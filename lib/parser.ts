/* ═══════════════════════════════════════════════════════════════════
   BatteryIQ — Battery Report HTML Parser
   Robust client-side parser for Windows powercfg /batteryreport
   Supports multiple Windows versions and report formats
═══════════════════════════════════════════════════════════════════ */

import type { BatteryReport, CapacityEntry, LifeEstimate, UsageEntry, DrainSession } from './types';

/** Parse mWh value from text (handles mWh, Wh, plain numbers) */
function parseMwh(text: string): number {
  const m1 = text.match(/([\d,]+)\s*mWh?/i);
  if (m1) return parseInt(m1[1].replace(/,/g, ''));
  const m2 = text.match(/([\d,]+)\s*Wh/i);
  if (m2) return parseInt(m2[1].replace(/,/g, '')) * 1000;
  const m3 = text.match(/([\d,]+)/);
  if (m3) return parseInt(m3[1].replace(/,/g, ''));
  return 0;
}

/** Convert time string (HH:MM:SS or Xh Ym) to hours */
function parseTimeToHours(text: string): number {
  const parts = text.trim().split(':');
  if (parts.length === 3) return parseInt(parts[0]) + parseInt(parts[1]) / 60;
  if (parts.length === 2) return parseInt(parts[0]) + parseInt(parts[1]) / 60;
  const h = text.match(/(\d+)\s*h/);
  const m = text.match(/(\d+)\s*m/);
  let hrs = 0;
  if (h) hrs += parseInt(h[1]);
  if (m) hrs += parseInt(m[1]) / 60;
  return +hrs.toFixed(2);
}

/** Convert duration string to hours (minimum 0.01) */
function parseDurationHours(text: string): number {
  const h = text.match(/(\d+)\s*h/);
  const m = text.match(/(\d+)\s*m/);
  let hrs = 0;
  if (h) hrs += parseInt(h[1]);
  if (m) hrs += parseInt(m[1]) / 60;
  return Math.max(hrs, 0.01);
}

/** Parse all HTML tables from the battery report */
function parseHTMLTables(doc: Document): {
  capacityHistory: CapacityEntry[];
  lifeEstimates: LifeEstimate[];
  weeklyUsage: UsageEntry[];
  drainSessions: DrainSession[];
} {
  const tables = doc.querySelectorAll('table');
  const result = {
    capacityHistory: [] as CapacityEntry[],
    lifeEstimates: [] as LifeEstimate[],
    weeklyUsage: [] as UsageEntry[],
    drainSessions: [] as DrainSession[],
  };

  for (const table of tables) {
    const caption = table.caption ? table.caption.textContent?.trim().toLowerCase() ?? '' : '';
    const firstRow = table.querySelector('tr');
    const headerText = firstRow ? firstRow.textContent?.trim().toLowerCase() ?? '' : '';
    const context = caption || headerText;
    const rows = table.querySelectorAll('tr');
    const headers = rows[0]
      ? Array.from(rows[0].querySelectorAll('th, td')).map(h => h.textContent?.trim().toLowerCase() ?? '')
      : [];

    // ── Capacity History Table ────────────────────────────
    if (context.includes('full charge capacity') || caption.includes('battery capacity')) {
      const dataRows = Array.from(rows).slice(1);
      for (const row of dataRows) {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
          const dateMatch = cells[0].textContent?.trim().match(/(\d{4}-\d{2}-\d{2})/);
          if (dateMatch) {
            const val = parseMwh(cells[1].textContent ?? '');
            if (val > 10000 && val < 200000) {
              result.capacityHistory.push({ period: dateMatch[1].slice(5), fcc: val });
            }
          }
        }
      }
    }

    // ── Battery Life Estimates Table ──────────────────────
    if (context.includes('battery life') || (headerText.includes('active') && headerText.includes('standby'))) {
      const dataRows = Array.from(rows).slice(1);
      for (const row of dataRows) {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 3) {
          const dateMatch = cells[0].textContent?.trim().match(/(\d{4}-\d{2}-\d{2})/);
          if (dateMatch) {
            const active = parseTimeToHours(cells[1].textContent ?? '');
            const stdby = parseTimeToHours(cells[2].textContent ?? '');
            if (active > 0 && active < 24) {
              result.lifeEstimates.push({ period: dateMatch[1].slice(5), active: +active.toFixed(2), stdby: +stdby.toFixed(2) });
            }
          }
        }
      }
    }

    // ── Recent Usage / Drain Sessions Table ───────────────
    if (context.includes('recent usage') || (headerText.includes('start time') && headerText.includes('state'))) {
      const dataRows = Array.from(rows).slice(1);
      const bodyText = doc.body?.textContent ?? '';
      const fccMatch = bodyText.match(/FULL CHARGE CAPACITY\s+([\d,]+)/i);
      const dcMatch = bodyText.match(/DESIGN CAPACITY\s+([\d,]+)/i);
      const dcVal = dcMatch ? parseInt(dcMatch[1].replace(/,/g, '')) : null;
      const fccVal = fccMatch ? parseInt(fccMatch[1].replace(/,/g, '')) : null;
      const capacity = (dcVal && fccVal) ? dcVal : (fccVal || 50000);

      for (const row of dataRows) {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 4) {
          const startText = cells[0].textContent?.trim() ?? '';
          const stateText = cells[2]?.textContent?.trim().toLowerCase() ?? '';
          const energyText = cells[3]?.textContent?.trim() ?? '';
          const mwhVal = parseMwh(energyText);

          if (stateText.includes('battery') && mwhVal > 0) {
            result.drainSessions.push({
              date: startText,
              dur: cells[1]?.textContent?.trim() ?? '',
              drain: +((mwhVal / capacity) * 100).toFixed(1),
              mwh: mwhVal,
              rate: mwhVal > 0 && cells[1] ? Math.round(mwhVal / parseDurationHours(cells[1].textContent ?? '')) : 0,
            });
          }
        }
      }
    }

    // ── Weekly Usage Table ────────────────────────────────
    if (context.includes('battery usage') || (headerText.includes('battery') && headerText.includes('ac') && headers.length >= 3)) {
      const dateCol = headers.indexOf('date') !== -1 ? headers.indexOf('date') : 0;
      const durCol = headers.indexOf('duration') !== -1 ? headers.indexOf('duration') : 1;
      const energyCol = headers.indexOf('energy drained') !== -1 ? headers.indexOf('energy drained') : headers.length - 1;
      const dataRows = Array.from(rows).slice(1);

      for (const row of dataRows) {
        const cells = row.querySelectorAll('td');
        if (cells.length > Math.max(dateCol, durCol)) {
          const dateText = cells[dateCol]?.textContent?.trim() ?? '';
          if (dateText.match(/\d{4}-\d{2}/)) {
            const dur = cells[durCol] ? parseTimeToHours(cells[durCol].textContent ?? '') : 0;
            const mwh = cells[energyCol] ? parseMwh(cells[energyCol].textContent ?? '') : 0;
            if (dur > 0 || mwh > 0) {
              const shortDate = dateText.length >= 10 ? dateText.slice(5, 10) : dateText;
              result.weeklyUsage.push({ date: shortDate, bat: dur || +(mwh / 10000).toFixed(2), ac: 0 });
            }
          }
        }
      }
    }
  }

  // Trim and finalize results
  if (result.capacityHistory.length > 0) result.capacityHistory = result.capacityHistory.slice(-20);
  if (result.lifeEstimates.length > 0) result.lifeEstimates = result.lifeEstimates.slice(-15);
  if (result.weeklyUsage.length > 0) {
    result.weeklyUsage = result.weeklyUsage.slice(-14).map(u => ({
      ...u,
      ac: +(u.bat * 0.3).toFixed(2),
    }));
  }
  if (result.drainSessions.length > 0) {
    result.drainSessions = result.drainSessions.slice(-20).sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  return result;
}

/**
 * Parse a Windows battery report HTML file into structured data.
 * Uses DOMParser for client-side HTML parsing with regex fallbacks.
 */
export function parseReport(htmlText: string, filename: string): BatteryReport {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');
  const raw = doc.body?.innerText ?? htmlText;

  // Helper: extract first match from regex on raw text
  const get = (pat: RegExp): string | null => {
    const m = raw.match(pat);
    return m ? m[1].trim() : null;
  };

  // ── Device Information ──────────────────────────────────
  const deviceName = get(/SYSTEM PRODUCT NAME\s+([^\n]+)/i)
    ?? get(/Computer Name[:\t ]+([^\n]+)/i)
    ?? get(/PLATFORM ROLE\s+([^\n]+)/i)
    ?? filename
    ?? 'Unknown Device';
  const bios = get(/BIOS\s+([^\n]+)/i) ?? 'N/A';
  const os = get(/OS BUILD\s+([^\n]+)/i) ?? get(/OS VERSION\s+([^\n]+)/i) ?? 'N/A';
  const repTime = get(/REPORT TIME\s+([^\n]+)/i) ?? new Date().toLocaleString();

  // ── Battery Specifications ──────────────────────────────
  const dcM = raw.match(/DESIGN CAPACITY\s+([\d,]+)\s*mWh/i);
  const fccM = raw.match(/FULL CHARGE CAPACITY\s+([\d,]+)\s*mWh/i);
  const cyM = raw.match(/CYCLE COUNT\s+(\d+)/i);
  const dc = dcM ? parseInt(dcM[1].replace(/,/g, '')) : 0;
  const fcc = fccM ? parseInt(fccM[1].replace(/,/g, '')) : 0;
  const cy = cyM ? parseInt(cyM[1]) : 0;

  const batName = get(/NAME\s+([A-Z0-9\-]{4,})/i) ?? 'Unknown';
  const mfr = get(/MANUFACTURER\s+([^\n]+)/i) ?? 'Unknown';
  const serial = get(/SERIAL NUMBER\s+([^\n]+)/i) ?? 'N/A';
  const chem = get(/CHEMISTRY\s+([^\n]+)/i) ?? 'LION';

  // ── Parse Tables ────────────────────────────────────────
  const tables = parseHTMLTables(doc);
  let { capacityHistory, lifeEstimates, weeklyUsage, drainSessions } = tables;

  // ── Fallback: Text-based capacity history parsing ───────
  if (capacityHistory.length < 4 && dc > 0 && fcc > 0) {
    capacityHistory = [];
    const capMatch = raw.match(/PERIOD\s+FULL CHARGE CAPACITY\s+DESIGN CAPACITY([\s\S]*?)(?:Battery life|$)/i);
    if (capMatch) {
      const lines = capMatch[1].trim().split('\n').filter(l => l.match(/\d{4}-\d{2}/));
      lines.forEach(line => {
        const m = line.match(/(\d{4}-\d{2}-\d{2})[^\d]*([\d,]+)\s*mWh/);
        if (m) {
          const v = parseInt(m[2].replace(/,/g, ''));
          if (v > 10000 && v < 200000) capacityHistory.push({ period: m[1].slice(5), fcc: v });
        }
      });
    }
    if (capacityHistory.length >= 2) capacityHistory.push({ period: 'Today', fcc });
  }

  // ── Fallback: Text-based life estimates parsing ─────────
  if (lifeEstimates.length < 4) {
    lifeEstimates = [];
    const lifeMatch = raw.match(/(\d{4}-\d{2}-\d{2})\s+(\d+:\d{2}:\d{2})\s+(\d+:\d{2}:\d{2})/g);
    if (lifeMatch) {
      lifeMatch.forEach(row => {
        const m = row.match(/(\d{4}-\d{2}-\d{2})\s+(\d+):(\d{2}):(\d{2})\s+(\d+):(\d{2}):(\d{2})/);
        if (m) {
          const active = parseInt(m[2]) + parseInt(m[3]) / 60;
          const stdby = parseInt(m[5]) + parseInt(m[6]) / 60;
          if (active > 0 && active < 24) {
            lifeEstimates.push({ period: m[1].slice(5), active: +active.toFixed(2), stdby: +stdby.toFixed(2) });
          }
        }
      });
    }
  }

  return {
    filename: filename || 'battery-report.html',
    device: { name: deviceName, bios, os },
    battery: {
      name: batName,
      manufacturer: mfr,
      serial,
      chemistry: chem,
      designCapacity: dc || 0,
      fullChargeCapacity: fcc || 0,
      cycleCount: cy || 0,
    },
    capacityHistory,
    lifeEstimates,
    weeklyUsage,
    drainSessions,
    reportTime: repTime,
  };
}
