'use client';

import { motion } from 'framer-motion';
import { Battery, Upload, Play } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import type { BatteryReport } from '@/lib/types';
import { parseReport } from '@/lib/parser';

interface Props {
  onReportParsed: (report: BatteryReport) => void;
  onDemo: () => void;
}

export default function UploadZone({ onReportParsed, onDemo }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const processFile = useCallback((file: File) => {
    if (!file.name.match(/\.html?$/i)) {
      setError('Please upload an .html file');
      return;
    }
    setLoading(true);
    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const report = parseReport(reader.result as string, file.name);
        onReportParsed(report);
      } catch {
        setError('Could not parse this file. Make sure it\'s a Windows battery report.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  }, [onReportParsed]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) processFile(e.dataTransfer.files[0]);
  }, [processFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) processFile(e.target.files[0]);
    e.target.value = '';
  }, [processFile]);

  return (
    <section className="w-full px-6 mb-16">
      <div className="w-full max-w-[800px] mx-auto">
        <input ref={fileRef} type="file" accept=".html,.htm" className="hidden" onChange={handleChange} multiple />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className="relative rounded-3xl cursor-pointer transition-all duration-300 flex flex-col items-center text-center"
          style={{
            background: 'var(--bg2)',
            border: dragging ? '2px solid var(--acc)' : '2px dashed var(--bdr2)',
            padding: 'clamp(40px, 6vw, 64px) 32px',
            boxShadow: dragging ? '0 0 40px rgba(0,255,163,0.1)' : 'none',
          }}
        >
          {/* Battery Icon */}
          <div
            className="flex items-center justify-center mb-6"
            style={{
              width: 72, height: 72, borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(0,255,163,0.15), rgba(0,212,255,0.1))',
              border: '1px solid rgba(0,255,163,0.2)',
            }}
          >
            {loading ? (
              <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--bdr2)', borderTopColor: 'var(--acc)', borderRadius: '50%' }} />
            ) : (
              <Battery style={{ width: 32, height: 32, color: 'var(--acc)' }} />
            )}
          </div>

          {/* Title */}
          <h3 className="font-syne font-bold mb-2" style={{ fontSize: 'clamp(20px, 3vw, 26px)', color: 'var(--tx1)' }}>
            Drop your battery report here
          </h3>

          {/* Subtitle */}
          <p className="mb-8" style={{ fontSize: 14, color: 'var(--tx2)', maxWidth: 420 }}>
            Drag &amp; drop your <code className="font-mono" style={{ color: 'var(--acc)', fontSize: 13, background: 'rgba(0,255,163,0.08)', padding: '2px 6px', borderRadius: 4 }}>battery-report.html</code> file, or click to browse.
            Supports multiple files for comparison.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <button
              onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
              className="flex items-center gap-2 cursor-pointer font-semibold transition-all active:scale-95"
              style={{
                background: 'var(--acc)',
                color: '#080c12',
                padding: '12px 28px',
                borderRadius: 12,
                fontSize: 14,
                border: 'none',
                boxShadow: '0 4px 20px rgba(0,255,163,0.25)',
              }}
            >
              <Upload style={{ width: 16, height: 16 }} /> Choose File
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDemo(); }}
              className="flex items-center gap-2 cursor-pointer font-medium transition-all active:scale-95"
              style={{
                background: 'transparent',
                color: 'var(--tx1)',
                padding: '12px 28px',
                borderRadius: 12,
                fontSize: 14,
                border: '1px solid var(--bdr2)',
              }}
            >
              <Play style={{ width: 14, height: 14 }} /> View Demo
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="mt-4" style={{ fontSize: 13, color: 'var(--dng)' }}>{error}</p>
          )}
        </motion.div>

        {/* Accepted formats */}
        <p className="text-center mt-4" style={{ fontSize: 12, color: 'var(--tx3)' }}>
          Accepted: <code className="font-mono" style={{ color: 'var(--tx2)' }}>battery-report.html</code> generated via{' '}
          <code className="font-mono" style={{ color: 'var(--acc)', fontSize: 11 }}>powercfg /batteryreport</code>
        </p>
      </div>
    </section>
  );
}
