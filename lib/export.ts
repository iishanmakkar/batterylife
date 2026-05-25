/* ═══════════════════════════════════════════════════════════════════
   BatteryIQ — Export Utilities
   PDF report, JSON data, and shareable image card generation
═══════════════════════════════════════════════════════════════════ */

import type { BatteryReport, HealthAnalysis } from './types';

/** Export dashboard as PDF using html2canvas + jsPDF */
export async function exportPDF(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) { alert('Export target not found'); return; }

  // Hide ad units and non-exportable elements
  const hidden = document.querySelectorAll('[data-no-export]');
  hidden.forEach(el => (el as HTMLElement).style.display = 'none');

  try {
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    const canvas = await html2canvas(element, {
      backgroundColor: '#080c12',
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(filename);
  } catch (e) {
    console.error('PDF export failed:', e);
    alert('PDF export failed. Please try again.');
  } finally {
    hidden.forEach(el => (el as HTMLElement).style.display = '');
  }
}

/** Download data as JSON file */
export function downloadJSON(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Generate a shareable image card as a Blob */
export async function generateShareCard(
  report: BatteryReport,
  health: HealthAnalysis
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const W = 600, H = 400;
      const canvas = document.createElement('canvas');
      canvas.width = W * 2; // 2x for retina
      canvas.height = H * 2;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not supported')); return; }

      ctx.scale(2, 2);

      // ── Background ──────────────────────────────────────
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#080c12');
      grad.addColorStop(1, '#0d1117');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // ── Border ──────────────────────────────────────────
      ctx.strokeStyle = '#1e2d3d';
      ctx.lineWidth = 1;
      ctx.roundRect(1, 1, W - 2, H - 2, 16);
      ctx.stroke();

      // ── Branding ────────────────────────────────────────
      ctx.fillStyle = '#00ffa3';
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.fillText('⚡ BatteryIQ', 32, 44);

      ctx.fillStyle = '#536070';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('Professional Battery Analysis', 32, 64);

      // ── Score Circle ────────────────────────────────────
      const cx = 120, cy = 180, r = 60;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = '#1e2d3d';
      ctx.lineWidth = 8;
      ctx.stroke();

      const pct = health.score / 100;
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + pct * Math.PI * 2);
      ctx.strokeStyle = health.color;
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.fillStyle = health.color;
      ctx.font = 'bold 36px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(health.score.toString(), cx, cy + 8);

      ctx.fillStyle = '#536070';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('/100', cx, cy + 28);
      ctx.textAlign = 'left';

      // ── Status ──────────────────────────────────────────
      ctx.fillStyle = health.color;
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.fillText(`${health.status} Health`, 220, 140);

      ctx.fillStyle = '#8899aa';
      ctx.font = '13px Inter, sans-serif';
      ctx.fillText(`Grade ${health.grade}`, 220, 162);

      // ── Device ──────────────────────────────────────────
      ctx.fillStyle = '#e8f0fe';
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText(report.device.name.slice(0, 35), 220, 195);

      ctx.fillStyle = '#8899aa';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(report.battery.name !== 'Unknown' ? report.battery.name : '', 220, 215);

      // ── Metrics ─────────────────────────────────────────
      const metrics = [
        { label: 'Wear', value: `${health.wearPct}%` },
        { label: 'Cycles', value: report.battery.cycleCount.toString() },
        { label: 'Avg Life', value: health.avgLife > 0 ? `${health.avgLife}h` : 'N/A' },
        { label: 'Capacity', value: `${(report.battery.fullChargeCapacity / 1000).toFixed(1)}Wh` },
      ];

      const metricY = 265;
      metrics.forEach((m, i) => {
        const mx = 32 + i * 140;
        ctx.fillStyle = '#131920';
        ctx.beginPath();
        ctx.roundRect(mx, metricY, 120, 55, 8);
        ctx.fill();

        ctx.fillStyle = '#536070';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(m.label.toUpperCase(), mx + 10, metricY + 20);

        ctx.fillStyle = '#e8f0fe';
        ctx.font = 'bold 18px JetBrains Mono, monospace';
        ctx.fillText(m.value, mx + 10, metricY + 42);
      });

      // ── Date ────────────────────────────────────────────
      ctx.fillStyle = '#536070';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(`Report: ${report.reportTime}`, 32, H - 24);
      ctx.fillText('batteryiq.app', W - 120, H - 24);

      // ── Export as Blob ──────────────────────────────────
      canvas.toBlob(blob => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to generate image'));
      }, 'image/png');
    } catch (e) {
      reject(e);
    }
  });
}
