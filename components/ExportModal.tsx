'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileJson, Image, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { BatteryReport, HealthAnalysis } from '@/lib/types';
import { exportPDF, downloadJSON, generateShareCard } from '@/lib/export';

interface Props { isOpen: boolean; onClose: () => void; report: BatteryReport; health: HealthAnalysis; reports: BatteryReport[]; }

export default function ExportModal({ isOpen, onClose, report, health, reports }: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePDF = async () => { setLoading('pdf'); await exportPDF('dashboard-root', `BatteryIQ-${report.device.name}.pdf`); setLoading(null); };
  const handleJSON = () => { downloadJSON(reports.length > 1 ? reports : report, `BatteryIQ-${report.device.name}.json`); };
  const handleImage = async () => {
    setLoading('image');
    try {
      const blob = await generateShareCard(report, health);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `BatteryIQ-${report.device.name}.png`;
      a.click(); URL.revokeObjectURL(url);
    } catch { alert('Image export failed.'); }
    setLoading(null);
  };

  const opts = [
    { id: 'pdf', icon: <Download className="w-5 h-5" />, title: 'Download PDF', desc: 'Full analysis report as PDF document', handler: handlePDF },
    { id: 'json', icon: <FileJson className="w-5 h-5" />, title: 'Download JSON', desc: 'Raw structured data for all reports', handler: handleJSON },
    { id: 'image', icon: <Image className="w-5 h-5" />, title: 'Share Image Card', desc: 'Shareable summary card (600×400 PNG)', handler: handleImage },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-[380px] shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-syne font-bold text-lg text-[var(--text1)]">Export Report</h3>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-[var(--bg3)] flex items-center justify-center text-[var(--text3)] hover:text-[var(--text1)] transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2.5">
              {opts.map(o => (
                <button
                  key={o.id}
                  onClick={o.handler}
                  disabled={loading !== null}
                  className="w-full flex items-center gap-3.5 py-3.5 px-4 rounded-xl border border-[var(--border)] bg-[var(--bg3)] hover:border-[var(--accent)] transition-all text-left cursor-pointer disabled:opacity-50"
                >
                  <div className="w-10 h-10 rounded-lg bg-[rgba(0,255,163,0.1)] flex items-center justify-center text-[var(--accent)] shrink-0">
                    {loading === o.id ? <Loader2 className="w-5 h-5 animate-spin" /> : o.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--text1)]">{o.title}</div>
                    <div className="text-xs text-[var(--text3)]">{o.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
