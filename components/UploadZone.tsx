'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Battery, Loader2, Play, FileText } from 'lucide-react';
import type { BatteryReport } from '@/lib/types';
import { parseReport } from '@/lib/parser';

interface Props {
  onReportParsed: (report: BatteryReport) => void;
  onDemo: () => void;
}

export default function UploadZone({ onReportParsed, onDemo }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.name.match(/\.(html|htm)$/i)) {
      setError('Please upload an HTML file from powercfg /batteryreport');
      return;
    }
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const report = parseReport(ev.target?.result as string, file.name);
        if (!report.battery.designCapacity && !report.capacityHistory.length) {
          throw new Error('Could not parse battery data from this file. Make sure it\'s from powercfg /batteryreport.');
        }
        setSuccess(`✓ Parsed "${file.name}" successfully`);
        setTimeout(() => setSuccess(null), 3000);
        onReportParsed(report);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to parse report');
      }
      setIsLoading(false);
    };
    reader.onerror = () => { setError('Failed to read file'); setIsLoading(false); };
    reader.readAsText(file);
  }, [onReportParsed]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) processFile(e.dataTransfer.files[0]);
  }, [processFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) processFile(e.target.files[0]);
    e.target.value = '';
  }, [processFile]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="max-w-3xl mx-auto px-6 pb-16"
    >
      <div
        className={`relative border-2 border-dashed rounded-3xl py-16 px-10 text-center transition-all cursor-pointer overflow-hidden ${
          isDragging
            ? 'border-[var(--color-accent)] bg-[rgba(0,255,163,0.03)]'
            : 'border-[var(--color-border2)] bg-[var(--color-bg2)]/50 hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-bg2)]'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {/* Drag glow effect */}
        {isDragging && (
          <div className="absolute inset-0 pointer-events-none rounded-3xl" style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(0,255,163,0.08) 0%, transparent 70%)'
          }} />
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".html,.htm"
          onChange={handleFileChange}
          className="hidden"
          multiple
        />

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-5 py-4">
              <div className="w-16 h-16 rounded-2xl bg-[rgba(0,255,163,0.1)] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin" />
              </div>
              <p className="text-[var(--color-text1)] font-semibold text-lg">Processing battery report...</p>
              <p className="text-[var(--color-text3)] text-sm">Parsing data and computing health analysis</p>
            </motion.div>
          ) : (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[rgba(0,255,163,0.15)] to-[rgba(0,212,255,0.08)] border border-[rgba(0,255,163,0.2)] flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform">
                <Battery className="w-9 h-9 text-[var(--color-accent)]" />
              </div>

              {/* Title */}
              <h3 className="font-[family-name:var(--font-syne)] text-2xl font-bold mb-2 text-[var(--color-text1)]">
                Drop your battery report here
              </h3>
              <p className="text-[var(--color-text2)] text-sm mb-8 max-w-md mx-auto">
                Drag & drop your <code className="bg-[var(--color-bg3)] px-1.5 py-0.5 rounded text-[var(--color-accent)] text-xs">battery-report.html</code> file, or click to browse. Supports multiple files for comparison.
              </p>

              {/* Buttons */}
              <div className="flex gap-3 justify-center flex-wrap" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="py-3 px-8 rounded-xl text-sm font-semibold bg-[var(--color-accent)] text-black border-none hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,255,163,0.2)] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" /> Choose file
                </button>
                <button
                  onClick={onDemo}
                  className="py-3 px-8 rounded-xl text-sm font-medium bg-transparent text-[var(--color-text2)] border border-[var(--color-border2)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4" /> View demo
                </button>
              </div>

              {/* Accepted formats */}
              <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[var(--color-text3)]">
                <FileText className="w-3 h-3" />
                Accepts .html from <code className="text-[var(--color-text2)]">powercfg /batteryreport</code> · 100% local processing
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 text-[var(--color-accent)] text-sm bg-[rgba(0,255,163,0.08)] border border-[rgba(0,255,163,0.2)] rounded-xl py-2.5 px-4 font-medium"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 text-[var(--color-danger)] text-sm bg-[rgba(255,79,79,0.08)] border border-[rgba(255,79,79,0.2)] rounded-xl py-2.5 px-4"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
