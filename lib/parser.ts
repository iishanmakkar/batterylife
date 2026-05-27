/* ═══════════════════════════════════════════════════════════════════
   BatteryIQ — Battery Report HTML Parser
   Robust client-side parser for Windows powercfg /batteryreport
   Supports multiple Windows versions and report formats
═══════════════════════════════════════════════════════════════════ */

import type { BatteryReport, CapacityEntry, LifeEstimate, UsageEntry, DrainSession } from './types';

/** Parse mWh value from text (handles mWh, Wh, plain numbers) */
function parseMwh(text: string): number {
  const m1 = text.match(/([\d,]+)\s*mWh?/i);
  if (m1) {
    const parsed = parseInt(m1[1].replace(/,/g, ''));
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  const m2 = text.match(/([\d,]+)\s*Wh/i);
  if (m2) {
    const parsed = parseInt(m2[1].replace(/,/g, ''));
    return Number.isNaN(parsed) ? 0 : parsed * 1000;
  }
  const m3 = text.match(/([\d,]+)/);
  if (m3) {
    const parsed = parseInt(m3[1].replace(/,/g, ''));
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function cleanCellText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function normalizeLabel(text: string): string {
  return cleanCellText(text)
    .toLowerCase()
    .replace(/[:*]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function parseInteger(text: string): number | null {
  const normalized = cleanCellText(text);
  if (/^(?:-|--|n\/a|not available|unknown)$/i.test(normalized)) return null;
  const match = normalized.match(/\d[\d,]*/);
  return match ? parseInt(match[0].replace(/,/g, ''), 10) : null;
}

function parseCycleCount(text: string): number | null {
  const value = parseInteger(text);
  return value !== null && value >= 0 && value < 10000 ? value : null;
}

function tableContext(table: HTMLTableElement): string {
  const parts: string[] = [];
  if (table.caption?.textContent) parts.push(table.caption.textContent);

  let sibling = table.previousElementSibling;
  let scanned = 0;
  while (sibling && scanned < 4) {
    if (/^H[1-6]$/i.test(sibling.tagName)) {
      parts.push(sibling.textContent ?? '');
    }
    sibling = sibling.previousElementSibling;
    scanned += 1;
  }

  return cleanCellText(parts.join(' ')).toLowerCase();
}

function findTableValue(doc: Document, labelText: string, contextText?: string): string | null {
  const wantedLabel = normalizeLabel(labelText);
  const wantedContext = contextText?.toLowerCase();

  for (const table of Array.from(doc.querySelectorAll('table'))) {
    const context = tableContext(table as HTMLTableElement);
    if (wantedContext && !context.includes(wantedContext)) continue;

    for (const row of Array.from(table.querySelectorAll('tr'))) {
      const cells = Array.from(row.querySelectorAll('td, th'));
      if (cells.length < 2) continue;

      const label = normalizeLabel(cells[0].textContent ?? '');
      if (label === wantedLabel) {
        return cleanCellText(cells[1].textContent ?? '') || null;
      }
    }
  }

  return null;
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
  const parts = text.trim().split(':');
  if (parts.length === 3) {
    const hrs = parseInt(parts[0]) + parseInt(parts[1]) / 60 + parseInt(parts[2]) / 3600;
    return Math.max(hrs, 0.01);
  }
  if (parts.length === 2) {
    const hrs = parseInt(parts[0]) + parseInt(parts[1]) / 60;
    return Math.max(hrs, 0.01);
  }
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
  designCapacityFromTable: number;
  fullChargeFromTable: number;
  cycleCountFromTable: number;
  cycleCountKnownFromTable: boolean;
  batteryNameFromTable: string;
  manufacturerFromTable: string;
  serialFromTable: string;
  chemistryFromTable: string;
} {
  const tables = doc.querySelectorAll('table');
  const result = {
    capacityHistory: [] as CapacityEntry[],
    lifeEstimates: [] as LifeEstimate[],
    weeklyUsage: [] as UsageEntry[],
    drainSessions: [] as DrainSession[],
    designCapacityFromTable: 0,
    fullChargeFromTable: 0,
    cycleCountFromTable: 0,
    cycleCountKnownFromTable: false,
    batteryNameFromTable: '',
    manufacturerFromTable: '',
    serialFromTable: '',
    chemistryFromTable: '',
  };

  for (const table of tables) {
    const caption = table.caption ? table.caption.textContent?.trim().toLowerCase() ?? '' : '';
    const firstRow = table.querySelector('tr');
    const headerText = firstRow ? firstRow.textContent?.trim().toLowerCase() ?? '' : '';
    const context = `${tableContext(table as HTMLTableElement)} ${caption} ${headerText}`.trim();
    const isInstalledBatteryTable = context.includes('installed batteries') || context.includes('battery information');
    const rows = table.querySelectorAll('tr');
    const headers = rows[0]
      ? Array.from(rows[0].querySelectorAll('th, td')).map(h => h.textContent?.trim().toLowerCase() ?? '')
      : [];

    // ── Battery Info Table (Design Capacity, Full Charge, Cycle Count) ──
    // Some reports put specs in a 2-column table: label | value
    for (const row of rows) {
      const cells = row.querySelectorAll('td, th');
      if (cells.length >= 2) {
        const label = normalizeLabel(cells[0].textContent ?? '');
        const value = cleanCellText(cells[1].textContent ?? '');
        if (isInstalledBatteryTable && label === 'name' && value && !result.batteryNameFromTable) {
          result.batteryNameFromTable = value;
        }
        if (isInstalledBatteryTable && label === 'manufacturer' && value && !result.manufacturerFromTable) {
          result.manufacturerFromTable = value;
        }
        if (isInstalledBatteryTable && label === 'serial number' && value && !result.serialFromTable) {
          result.serialFromTable = value;
        }
        if (isInstalledBatteryTable && label === 'chemistry' && value && !result.chemistryFromTable) {
          result.chemistryFromTable = value;
        }
        if (label.includes('design capacity')) {
          const v = parseMwh(value);
          if (v > 0) result.designCapacityFromTable = v;
        }
        if (label.includes('full charge capacity')) {
          const v = parseMwh(value);
          if (v > 0) result.fullChargeFromTable = v;
        }
        if (label.includes('cycle count') || label === 'cycles' || label === 'cycle') {
          const v = parseCycleCount(value);
          if (v !== null) {
            result.cycleCountFromTable = v;
            result.cycleCountKnownFromTable = true;
          }
        }
      }
    }

    // Some OEM/Windows versions render installed batteries horizontally:
    // header labels in the first row, battery values in following row(s).
    if (isInstalledBatteryTable && rows.length >= 2) {
      const headerCells = Array.from(rows[0].querySelectorAll('td, th')).map(cell => normalizeLabel(cell.textContent ?? ''));
      const valueRows = Array.from(rows).slice(1);
      const cycleIdx = headerCells.findIndex(label => label.includes('cycle count') || label === 'cycles' || label === 'cycle');
      const designIdx = headerCells.findIndex(label => label.includes('design capacity'));
      const fullIdx = headerCells.findIndex(label => label.includes('full charge capacity'));
      const nameIdx = headerCells.findIndex(label => label === 'name' || label.includes('battery name') || label.includes('model'));
      const mfrIdx = headerCells.findIndex(label => label === 'manufacturer');
      const serialIdx = headerCells.findIndex(label => label.includes('serial'));
      const chemIdx = headerCells.findIndex(label => label === 'chemistry');

      for (const row of valueRows) {
        const values = Array.from(row.querySelectorAll('td, th')).map(cell => cleanCellText(cell.textContent ?? ''));
        if (values.length < 2) continue;

        if (cycleIdx >= 0 && values[cycleIdx] && !result.cycleCountKnownFromTable) {
          const v = parseCycleCount(values[cycleIdx]);
          if (v !== null) {
            result.cycleCountFromTable = v;
            result.cycleCountKnownFromTable = true;
          }
        }
        if (designIdx >= 0 && values[designIdx] && result.designCapacityFromTable === 0) {
          const v = parseMwh(values[designIdx]);
          if (v > 0) result.designCapacityFromTable = v;
        }
        if (fullIdx >= 0 && values[fullIdx] && result.fullChargeFromTable === 0) {
          const v = parseMwh(values[fullIdx]);
          if (v > 0) result.fullChargeFromTable = v;
        }
        if (nameIdx >= 0 && values[nameIdx] && !result.batteryNameFromTable) result.batteryNameFromTable = values[nameIdx];
        if (mfrIdx >= 0 && values[mfrIdx] && !result.manufacturerFromTable) result.manufacturerFromTable = values[mfrIdx];
        if (serialIdx >= 0 && values[serialIdx] && !result.serialFromTable) result.serialFromTable = values[serialIdx];
        if (chemIdx >= 0 && values[chemIdx] && !result.chemistryFromTable) result.chemistryFromTable = values[chemIdx];
      }
    }

    // ── Capacity History Table ────────────────────────────
    if (context.includes('full charge capacity') || caption.includes('battery capacity')
        || context.includes('capacity history')) {
      const dataRows = Array.from(rows).slice(1);
      for (const row of dataRows) {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
          const dateMatch = cells[0].textContent?.trim().match(/(\d{4}-\d{2}-\d{2})/);
          if (dateMatch) {
            // Try column 1 first (full charge), then column 2 if needed
            let val = parseMwh(cells[1].textContent ?? '');
            // Some reports have: Date | Full Charge | Design Capacity
            if (val > 10000 && val < 200000) {
              result.capacityHistory.push({ period: dateMatch[1].slice(5), fcc: val });
              // If there's a design capacity column, capture it
              if (cells.length >= 3) {
                const dcVal = parseMwh(cells[2].textContent ?? '');
                if (dcVal > 10000 && dcVal < 200000 && result.designCapacityFromTable === 0) {
                  result.designCapacityFromTable = dcVal;
                }
              }
            }
          }
        }
      }
    }

    // ── Battery Life Estimates Table ──────────────────────
    if (context.includes('battery life') || (headerText.includes('active') && headerText.includes('standby'))
        || context.includes('life estimates')) {
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

    // ── Battery Usage / Drain Sessions Table ──────────────
    if (context.includes('battery usage') || context.includes('battery drains') || headerText.includes('energy drained')) {
      const dataRows = Array.from(rows).slice(1);
      const bodyText = doc.body?.textContent ?? '';
      const fccMatch = bodyText.match(/FULL CHARGE CAPACITY\s+([\d,]+)/i);
      const dcMatch = bodyText.match(/DESIGN CAPACITY\s+([\d,]+)/i);
      const dcVal = dcMatch ? parseInt(dcMatch[1].replace(/,/g, '')) : null;
      const fccVal = fccMatch ? parseInt(fccMatch[1].replace(/,/g, '')) : null;
      const capacity = (dcVal && fccVal) ? dcVal : (fccVal || result.designCapacityFromTable || 50000);

      for (const row of dataRows) {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 5) {
          const startText = cleanCellText(cells[0].textContent ?? '');
          const stateText = cleanCellText(cells[1]?.textContent ?? '').toLowerCase();
          const durationText = cleanCellText(cells[2]?.textContent ?? '');
          const pctText = cleanCellText(cells[3]?.textContent ?? '');
          const energyText = cleanCellText(cells[4]?.textContent ?? '');
          const pctVal = parseInt(pctText.replace(/[^0-9]/g, ''));
          const mwhVal = parseMwh(energyText);

          if (stateText && mwhVal > 0) {
            result.drainSessions.push({
              date: startText,
              dur: durationText,
              drain: !isNaN(pctVal) && pctVal > 0 ? pctVal : +((mwhVal / capacity) * 100).toFixed(1),
              mwh: mwhVal,
              rate: mwhVal > 0 && durationText ? Math.round(mwhVal / parseDurationHours(durationText)) : 0,
            });
          }
        }
      }
    }

    // ── Weekly Usage Table ────────────────────────────────
    if (context.includes('usage history')) {
      const dataRows = Array.from(rows).slice(2);
      for (const row of dataRows) {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 6) {
          const dateText = cleanCellText(cells[0]?.textContent ?? '');
          const dateMatch = dateText.match(/\d{4}-\d{2}-\d{2}/);
          if (!dateMatch) continue;

          const batActive = parseTimeToHours(cleanCellText(cells[1]?.textContent ?? ''));
          const batStandby = parseTimeToHours(cleanCellText(cells[2]?.textContent ?? ''));
          const acActive = parseTimeToHours(cleanCellText(cells[4]?.textContent ?? ''));
          const acStandby = parseTimeToHours(cleanCellText(cells[5]?.textContent ?? ''));
          const bat = batActive + (batStandby > 0 && batStandby < 24 ? batStandby : 0);
          const ac = acActive + (acStandby > 0 && acStandby < 24 ? acStandby : 0);
          result.weeklyUsage.push({
            date: dateMatch[0].slice(5),
            bat: +bat.toFixed(2),
            ac: +ac.toFixed(2),
          });
        }
      }
    } else if ((headerText.includes('battery') && headerText.includes('ac') && headers.length >= 3)) {
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
    result.weeklyUsage = result.weeklyUsage.slice(-14);
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
  const raw = doc.body?.innerText ?? doc.body?.textContent ?? htmlText;

  // Helper: extract first match from regex on raw text
  const get = (pat: RegExp): string | null => {
    const m = raw.match(pat);
    return m ? m[1].trim() : null;
  };

  // ── Device Information ──────────────────────────────────
  const deviceName = findTableValue(doc, 'SYSTEM PRODUCT NAME')
    ?? get(/SYSTEM PRODUCT NAME\s+([^\n]+)/i)
    ?? get(/Computer Name[:\t ]+([^\n]+)/i)
    ?? get(/PLATFORM ROLE\s+([^\n]+)/i)
    ?? filename
    ?? 'Unknown Device';
  const bios = findTableValue(doc, 'BIOS') ?? get(/BIOS\s+([^\n]+)/i) ?? 'N/A';
  const os = findTableValue(doc, 'OS BUILD') ?? get(/OS BUILD\s+([^\n]+)/i) ?? get(/OS VERSION\s+([^\n]+)/i) ?? 'N/A';
  const repTime = findTableValue(doc, 'REPORT TIME') ?? get(/REPORT TIME\s+([^\n]+)/i) ?? new Date().toLocaleString();

  // ── Battery Specifications (regex on raw text) ──────────
  // Try multiple patterns for different report formats
  const dcM = raw.match(/DESIGN CAPACITY\s+([\d,]+)\s*mWh/i)
            ?? raw.match(/DESIGN CAPACITY[\s\S]{0,20}?([\d,]+)\s*mWh/i);
  const fccM = raw.match(/FULL CHARGE CAPACITY\s+([\d,]+)\s*mWh/i)
            ?? raw.match(/FULL CHARGE CAPACITY[\s\S]{0,20}?([\d,]+)\s*mWh/i);
  const cyM = raw.match(/(?:CYCLE COUNT|CYCLES?)\s*(?:\:|\t| )+\s*(\d[\d,]*)/i)
            ?? raw.match(/(?:CYCLE COUNT|CYCLES?)[\s\S]{0,40}?(\d[\d,]*)/i);
  let dc = parseMwh(findTableValue(doc, 'DESIGN CAPACITY', 'installed batteries') ?? '');
  let fcc = parseMwh(findTableValue(doc, 'FULL CHARGE CAPACITY', 'installed batteries') ?? '');
  const cycleTableValue = findTableValue(doc, 'CYCLE COUNT', 'installed batteries')
    ?? findTableValue(doc, 'CYCLES', 'installed batteries');
  let parsedCycle = cycleTableValue ? parseCycleCount(cycleTableValue) : null;
  let cy = parsedCycle ?? 0;
  let cycleCountKnown = parsedCycle !== null;
  if (!dc && dcM) dc = parseInt(dcM[1].replace(/,/g, ''));
  if (!fcc && fccM) fcc = parseInt(fccM[1].replace(/,/g, ''));
  if (!cycleCountKnown && cyM) {
    parsedCycle = parseCycleCount(cyM[1]);
    if (parsedCycle !== null) {
      cy = parsedCycle;
      cycleCountKnown = true;
    }
  }

  // ── Parse Tables ────────────────────────────────────────
  const tables = parseHTMLTables(doc);
  let { capacityHistory, lifeEstimates, weeklyUsage, drainSessions } = tables;

  // Battery identity must come from the installed-battery table when possible.
  const batName = tables.batteryNameFromTable
    || findTableValue(doc, 'NAME', 'installed batteries')
    || (get(/BATTERY\s+\d*\s*NAME\s+([^\n]+)/i)
      ?? get(/Battery\s+(?:name|model)[:\s]+([^\n]+)/i)
      ?? 'Unknown');
  const mfr = tables.manufacturerFromTable || findTableValue(doc, 'MANUFACTURER', 'installed batteries') || (get(/MANUFACTURER\s+([^\n]+)/i) ?? 'Unknown');
  const serial = tables.serialFromTable || findTableValue(doc, 'SERIAL NUMBER', 'installed batteries') || (get(/SERIAL NUMBER\s+([^\n]+)/i) ?? get(/SERIAL\s+([^\n]+)/i) ?? 'N/A');
  const chem = tables.chemistryFromTable || findTableValue(doc, 'CHEMISTRY', 'installed batteries') || (get(/CHEMISTRY\s+([^\n]+)/i) ?? 'LION');

  // ── Use table-extracted values as fallback for regex failures ──
  if (dc === 0 && tables.designCapacityFromTable > 0) {
    dc = tables.designCapacityFromTable;
  }
  if (fcc === 0 && tables.fullChargeFromTable > 0) {
    fcc = tables.fullChargeFromTable;
  }
  if (!cycleCountKnown && tables.cycleCountKnownFromTable) {
    cy = tables.cycleCountFromTable;
    cycleCountKnown = true;
  }

  // ── Last-resort: infer from capacity history ──────────
  if (capacityHistory.length > 0) {
    // Use the first entry as approximate design capacity
    if (dc === 0) {
      dc = Math.max(...capacityHistory.map(c => c.fcc));
    }
    // Use the last entry as current full charge capacity
    if (fcc === 0) {
      fcc = capacityHistory[capacityHistory.length - 1].fcc;
    }
  }

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
      cycleCountKnown,
    },
    capacityHistory,
    lifeEstimates,
    weeklyUsage,
    drainSessions,
    reportTime: repTime,
  };
}
