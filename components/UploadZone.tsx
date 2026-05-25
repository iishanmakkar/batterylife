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
    <section style={{ width: '100%', padding: '0 24px', marginBottom: 64 }}>
      <div style={{ width: '100%', maxWidth: 800, margin: '0 auto' }}>
        <input ref={fileRef} type="file" accept=".html,.htm" style={{ display: 'none' }} onChange={handleChange} multiple />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          style={{
            position: 'relative', borderRadius: 24, cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
            background: 'var(--bg2)',
            border: dragging ? '2px solid var(--acc)' : '2px dashed var(--bdr2)',
            padding: 'clamp(40px, 6vw, 64px) 32px',
            boxShadow: dragging ? '0 0 40px rgba(0,255,163,0.1)' : 'none',
          }}
        >
          {/* Battery Icon */}
          <div style={{
            width: 72, height: 72, borderRadius: 20, marginBottom: 24,
            background: 'linear-gradient(135deg, rgba(0,255,163,0.15), rgba(0,212,255,0.1))',
            border: '1px solid rgba(0,255,163,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {loading ? (
              <div style={{ width: 32, height: 32, border: '3px solid var(--bdr2)', borderTopColor: 'var(--acc)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            ) : (
              <Battery style={{ width: 32, height: 32, color: 'var(--acc)' }} />
            )}
          </div>

          {/* Title */}
          <h3 className="font-syne" style={{ fontWeight: 700, marginBottom: 8, fontSize: 'clamp(20px, 3vw, 26px)', color: 'var(--tx1)' }}>
            Drop your battery report here
          </h3>

          {/* Subtitle */}
          <p style={{ fontSize: 14, color: 'var(--tx2)', maxWidth: 440, marginBottom: 32, lineHeight: 1.6 }}>
            Drag &amp; drop your{' '}
            <code className="font-mono" style={{ color: 'var(--acc)', fontSize: 13, background: 'rgba(0,255,163,0.08)', padding: '2px 6px', borderRadius: 4 }}>
              battery-report.html
            </code>{' '}
            file, or click to browse. Supports multiple files for comparison.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: 12, alignItems: 'center', flexWrap: 'wrap' as const, justifyContent: 'center' }}>
            <button
              onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                fontWeight: 600, background: 'var(--acc)', color: '#080c12',
                padding: '12px 28px', borderRadius: 12, fontSize: 14, border: 'none',
                boxShadow: '0 4px 20px rgba(0,255,163,0.25)',
              }}
            >
              <Upload style={{ width: 16, height: 16 }} /> Choose File
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDemo(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                fontWeight: 500, background: 'transparent', color: 'var(--tx1)',
                padding: '12px 28px', borderRadius: 12, fontSize: 14,
                border: '1px solid var(--bdr2)',
              }}
            >
              <Play style={{ width: 14, height: 14 }} /> View Demo
            </button>
          </div>

          {/* Error */}
          {error && (
            <p style={{ marginTop: 16, fontSize: 13, color: 'var(--dng)' }}>{error}</p>
          )}
        </motion.div>

        {/* Accepted formats */}
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--tx3)' }}>
          Accepted: <code className="font-mono" style={{ color: 'var(--tx2)' }}>battery-report.html</code> generated via{' '}
          <code className="font-mono" style={{ color: 'var(--acc)', fontSize: 11 }}>powercfg /batteryreport</code>
        </p>
      </div>
    </section>
  );
}
