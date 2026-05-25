'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Battery, Loader2, Play } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.name.match(/\.(html|htm)$/i)) {
      setError('Please upload an HTML file from powercfg /batteryreport');
      return;
    }
    setError(null);
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const report = parseReport(ev.target?.result as string, file.name);
        if (!report.battery.designCapacity && !report.capacityHistory.length) {
          throw new Error('Could not parse battery data from this file');
        }
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
      transition={{ delay: 0.5, duration: 0.5 }}
      className="max-w-[760px] mx-auto px-4 pb-16"
    >
      <div
        className={`relative border-2 border-dashed rounded-[20px] py-14 px-8 text-center bg-[var(--color-bg2)] transition-all cursor-pointer overflow-hidden ${
          isDragging ? 'border-[var(--color-accent)] upload-drag-active' : 'border-[var(--color-border2)] hover:border-[var(--color-accent)]'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
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
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-[var(--color-accent)] animate-spin" />
              <p className="text-[var(--color-text1)] font-medium">Processing battery report...</p>
            </motion.div>
          ) : (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="w-[72px] h-[72px] rounded-[18px] bg-gradient-to-br from-[rgba(0,255,163,0.15)] to-[rgba(0,212,255,0.1)] border border-[rgba(0,255,163,0.2)] flex items-center justify-center mx-auto mb-6">
                <Battery className="w-8 h-8 text-[var(--color-accent)]" />
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-xl font-bold mb-2 text-[var(--color-text1)]">
                Drop your battery report here
              </h3>
              <p className="text-[var(--color-text2)] text-sm mb-6">
                Drag & drop or click to upload — supports multiple files for comparison
              </p>
              <div className="flex gap-2.5 justify-center flex-wrap" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2.5 px-6 rounded-[10px] text-[13px] font-semibold bg-[var(--color-accent)] text-black border-none hover:brightness-110 hover:-translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-4 h-4" /> Choose file
                </button>
                <button
                  onClick={onDemo}
                  className="py-2.5 px-6 rounded-[10px] text-[13px] font-medium bg-transparent text-[var(--color-text2)] border border-[var(--color-border2)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-4 h-4" /> View demo
                </button>
              </div>
              <p className="mt-4 text-[11px] text-[var(--color-text3)]">
                Accepted: .html from <code className="bg-[var(--color-bg3)] px-1.5 py-0.5 rounded text-[11px]">powercfg /batteryreport</code> · 100% local processing
              </p>
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
              className="mt-4 text-[var(--color-danger)] text-sm bg-[rgba(255,79,79,0.1)] border border-[rgba(255,79,79,0.2)] rounded-lg py-2 px-4"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
