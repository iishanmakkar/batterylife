'use client';

import { motion } from 'framer-motion';
import { Shield, Copy, Check, Terminal } from 'lucide-react';
import { useState } from 'react';

export default function HeroSection({ analyzedCount }: { analyzedCount: number }) {
  const [copied, setCopied] = useState(false);

  const copyCmd = () => {
    navigator.clipboard.writeText('powercfg /batteryreport /output "%USERPROFILE%\\battery-report.html"')
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
      .catch(() => {});
  };

  return (
    <section className="relative overflow-hidden w-full">
      {/* Ambient gradient overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,255,163,0.07) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 20%, rgba(0,212,255,0.04) 0%, transparent 60%)'
      }} />

      {/* Hero Content — centered */}
      <div className="relative z-10 w-full max-w-[900px] mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full flex flex-col items-center"
        >
          {/* Eyebrow Badge */}
          <div
            className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full mb-8"
            style={{
              fontSize: '11px',
              letterSpacing: '2px',
              color: 'var(--acc)',
              background: 'rgba(0,255,163,0.08)',
              border: '1px solid rgba(0,255,163,0.2)',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            <span
              className="animate-blink"
              style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--acc)', display: 'inline-block' }}
            />
            Free · No signup · Runs locally
          </div>

          {/* Headline */}
          <h1
            className="font-syne font-extrabold leading-[1.05] mb-6"
            style={{
              fontSize: 'clamp(36px, 6vw, 72px)',
              letterSpacing: '-2px',
              color: 'var(--tx1)',
            }}
          >
            Your laptop battery,<br />
            <span className="text-gradient">fully decoded</span>
          </h1>

          {/* Subtitle */}
          <p
            className="leading-relaxed mb-12"
            style={{
              color: 'var(--tx2)',
              maxWidth: 580,
              fontSize: 'clamp(15px, 2vw, 18px)',
            }}
          >
            Upload your Windows battery report and get a professional health analysis — wear level, degradation trends, session drain data, and actionable recommendations.
          </p>

          {/* Stats Row */}
          <div
            className="flex justify-center gap-10 sm:gap-16 flex-wrap mb-12 w-full py-6"
            style={{ borderTop: '1px solid var(--bdr)', borderBottom: '1px solid var(--bdr)' }}
          >
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
                className="text-center"
                style={{ minWidth: 100 }}
              >
                <strong
                  className="block font-mono font-bold"
                  style={{ fontSize: 'clamp(24px, 4vw, 36px)', color: stat.color }}
                >
                  {stat.value}
                </strong>
                <span style={{ fontSize: 11, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: 4, display: 'block' }}>
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Privacy Badge */}
          <div className="flex items-center justify-center gap-2 mb-12" style={{ fontSize: 14 }}>
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
        className="w-full max-w-[900px] mx-auto px-6 pb-12"
      >
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <Terminal style={{ width: 16, height: 16, color: 'var(--acc2)' }} />
          <span className="font-syne" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--tx3)' }}>
            How to generate your report
          </span>
          <span className="flex-1" style={{ height: 1, background: 'var(--bdr)' }} />
        </div>

        {/* Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
              className="rounded-2xl p-6 transition-all"
              style={{
                background: 'var(--bg2)',
                border: '1px solid var(--bdr)',
              }}
            >
              <div
                className="font-mono font-bold flex items-center justify-center mb-3"
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(0,255,163,0.1)',
                  border: '1px solid rgba(0,255,163,0.2)',
                  color: 'var(--acc)',
                  fontSize: 13,
                }}
              >
                {step.num}
              </div>
              <h4 className="font-semibold mb-1.5" style={{ fontSize: 14, color: 'var(--tx1)' }}>{step.title}</h4>
              <p className="leading-relaxed" style={{ fontSize: 13, color: 'var(--tx2)' }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Command Box */}
        <div
          className="rounded-xl flex items-center gap-4 font-mono transition-colors"
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--bdr)',
            padding: '16px 20px',
            fontSize: 14,
          }}
        >
          <span style={{ color: 'var(--acc)', fontSize: 18, fontWeight: 700, flexShrink: 0 }}>›</span>
          <code className="flex-1" style={{ color: 'var(--tx1)', fontSize: 13, wordBreak: 'break-all' }}>
            powercfg /batteryreport /output &quot;%USERPROFILE%\battery-report.html&quot;
          </code>
          <button
            onClick={copyCmd}
            className="flex items-center gap-1.5 cursor-pointer transition-all"
            style={{
              padding: '6px 16px',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 600,
              background: 'rgba(0,255,163,0.1)',
              color: 'var(--acc)',
              border: '1px solid rgba(0,255,163,0.2)',
              flexShrink: 0,
            }}
          >
            {copied ? <><Check style={{ width: 12, height: 12 }} /> Copied</> : <><Copy style={{ width: 12, height: 12 }} /> Copy</>}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
