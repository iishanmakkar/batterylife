'use client';

import { motion } from 'framer-motion';
import { Shield, Copy, Check, Terminal } from 'lucide-react';
import { useState } from 'react';

export default function HeroSection({ analyzedCount }: { analyzedCount: number }) {
  const [copied, setCopied] = useState(false);

  const copyCmd = () => {
    navigator.clipboard.writeText('powercfg /batteryreport /output "$env:USERPROFILE\\battery-report.html"')
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
      .catch(() => {});
  };

  return (
    <section style={{ position: 'relative', overflow: 'hidden', width: '100%' }}>
      {/* Ambient gradient overlays */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,255,163,0.07) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 20%, rgba(0,212,255,0.04) 0%, transparent 60%)'
      }} />

      {/* Hero Content — centered */}
      <div style={{
        position: 'relative', zIndex: 10, width: '100%',
        maxWidth: 900, margin: '0 auto', padding: '96px 24px 64px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          {/* Eyebrow Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 11, letterSpacing: 2, color: 'var(--acc)',
            background: 'rgba(0,255,163,0.08)', border: '1px solid rgba(0,255,163,0.2)',
            padding: '6px 16px', borderRadius: 999, marginBottom: 32,
            fontWeight: 600, textTransform: 'uppercase' as const,
          }}>
            <span className="animate-blink" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--acc)', display: 'inline-block' }} />
            Free · No signup · Runs locally
          </div>

          {/* Headline */}
          <h1 className="font-syne" style={{
            fontWeight: 800, lineHeight: 1.05, marginBottom: 24,
            fontSize: 'clamp(36px, 6vw, 72px)', letterSpacing: -2, color: 'var(--tx1)',
          }}>
            Your laptop battery,<br />
            <span className="text-gradient">fully decoded</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            color: 'var(--tx2)', maxWidth: 580, marginBottom: 48,
            fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: 1.7,
          }}>
            Upload your Windows battery report and get a professional health analysis — wear level, degradation trends, session drain data, and actionable recommendations.
          </p>

          {/* Stats Row */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' as const,
            marginBottom: 48, width: '100%', padding: '24px 0',
            borderTop: '1px solid var(--bdr)', borderBottom: '1px solid var(--bdr)',
          }}>
            {[
              { value: analyzedCount > 0 ? analyzedCount.toString() : '0', label: 'Reports analyzed', color: 'var(--acc)' },
              { value: '100%', label: 'Private & local', color: 'var(--tx1)' },
              { value: 'Multi', label: 'Report comparison', color: 'var(--acc2)' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                style={{ textAlign: 'center', minWidth: 120 }}
              >
                <strong className="font-mono" style={{ display: 'block', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: stat.color }}>
                  {stat.value}
                </strong>
                <span style={{ fontSize: 11, color: 'var(--tx3)', textTransform: 'uppercase' as const, letterSpacing: 1.5, marginTop: 4, display: 'block' }}>
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Privacy Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, marginBottom: 48 }}>
            <Shield style={{ width: 16, height: 16, color: 'var(--acc)' }} />
            <span style={{ color: 'var(--tx2)' }}>Your battery report never leaves your device.</span>
          </div>
        </motion.div>
      </div>

      {/* How-to Section */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: '0 24px 48px' }}
      >
        {/* Section label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Terminal style={{ width: 16, height: 16, color: 'var(--acc2)' }} />
          <span className="font-syne" style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, color: 'var(--tx3)' }}>
            How to generate your report
          </span>
          <span style={{ flex: 1, height: 1, background: 'var(--bdr)' }} />
        </div>

        {/* Step Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { num: '01', title: 'Open PowerShell as Admin', desc: 'Right-click Start → Terminal (Admin)' },
            { num: '02', title: 'Run the command below', desc: 'Generates an HTML report of your battery' },
            { num: '03', title: 'Upload the HTML file', desc: 'Drop battery-report.html into the upload zone' },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
              style={{
                background: 'var(--bg2)', border: '1px solid var(--bdr)',
                borderRadius: 16, padding: 24,
              }}
            >
              <div className="font-mono" style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(0,255,163,0.1)', border: '1px solid rgba(0,255,163,0.2)',
                color: 'var(--acc)', fontSize: 13, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
              }}>
                {step.num}
              </div>
              <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: 'var(--tx1)' }}>{step.title}</h4>
              <p style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.6 }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Command Box */}
        <div className="font-mono" style={{
          background: 'var(--bg2)', border: '1px solid var(--bdr)',
          borderRadius: 12, padding: '16px 20px', fontSize: 14,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <span style={{ color: 'var(--acc)', fontSize: 18, fontWeight: 700, flexShrink: 0 }}>›</span>
          <code style={{ color: 'var(--tx1)', fontSize: 13, flex: 1, wordBreak: 'break-all' as const }}>
            powercfg /batteryreport /output &quot;$env:USERPROFILE\battery-report.html&quot;
          </code>
          <button
            onClick={copyCmd}
            className="cursor-pointer"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 16px', borderRadius: 8, fontSize: 11, fontWeight: 600,
              background: 'rgba(0,255,163,0.1)', color: 'var(--acc)',
              border: '1px solid rgba(0,255,163,0.2)', flexShrink: 0,
            }}
          >
            {copied ? <><Check style={{ width: 12, height: 12 }} /> Copied</> : <><Copy style={{ width: 12, height: 12 }} /> Copy</>}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
