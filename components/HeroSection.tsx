'use client';

import { motion } from 'framer-motion';
import { Shield, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function HeroSection({ analyzedCount }: { analyzedCount: number }) {
  const [copied, setCopied] = useState(false);

  const copyCmd = () => {
    navigator.clipboard.writeText('powercfg /batteryreport /output "%USERPROFILE%\\battery-report.html"')
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
      .catch(() => {});
  };

  return (
    <section className="text-center pt-20 pb-12 px-5 relative overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,255,163,0.07) 0%, transparent 70%), radial-gradient(ellipse 30% 30% at 80% 50%, rgba(0,212,255,0.05) 0%, transparent 60%)'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-1.5 text-[11px] tracking-[2px] text-[var(--color-accent)] uppercase font-semibold bg-[rgba(0,255,163,0.08)] border border-[rgba(0,255,163,0.2)] py-1 px-3.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-blink" />
          Free · No signup · Runs locally
        </div>

        {/* Headline */}
        <h1 className="font-[family-name:var(--font-syne)] font-extrabold leading-[1.05] tracking-[-2px] text-[var(--color-text1)] mb-5" style={{ fontSize: 'clamp(36px, 6vw, 68px)' }}>
          Your laptop battery,<br />
          <span className="text-[var(--color-accent)]">fully decoded</span>
        </h1>

        <p className="text-[var(--color-text2)] max-w-[560px] mx-auto mb-10 font-light" style={{ fontSize: 'clamp(15px, 2vw, 18px)' }}>
          Upload your Windows battery report and get a professional health analysis — wear level, degradation trends, session drain data, and actionable recommendations.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 flex-wrap mb-12">
          {[
            { value: analyzedCount.toString(), label: 'Reports analyzed' },
            { value: '100%', label: 'Private & local' },
            { value: 'Multi', label: 'Report comparison' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              className="text-center"
            >
              <strong className="block font-[family-name:var(--font-mono)] text-[28px] font-bold text-[var(--color-text1)]">
                {stat.value}
              </strong>
              <span className="text-xs text-[var(--color-text3)] uppercase tracking-[1px]">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Privacy Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-center gap-2 text-[var(--color-accent)] text-sm mb-10"
      >
        <Shield className="w-4 h-4" />
        <span className="text-[var(--color-text2)]">Your battery report never leaves your device.</span>
      </motion.div>

      {/* How-to Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="max-w-[760px] mx-auto px-4"
      >
        <p className="font-[family-name:var(--font-syne)] text-[13px] font-bold tracking-[2px] uppercase text-[var(--color-text3)] mb-4 flex items-center gap-2">
          How to generate your report
          <span className="flex-1 h-px bg-[var(--color-border)]" />
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {[
            { num: '01', title: 'Open PowerShell as Admin', desc: 'Right-click Start → PowerShell (Admin)' },
            { num: '02', title: 'Run the command below', desc: 'Generates an HTML report of your battery' },
            { num: '03', title: 'Upload the HTML file', desc: 'Drop battery-report.html into the upload zone' },
          ].map((step, i) => (
            <div key={i} className="bg-[var(--color-bg2)] border border-[var(--color-border)] rounded-[14px] p-5 text-left hover:border-[var(--color-border2)] transition-colors">
              <div className="w-[26px] h-[26px] rounded-lg bg-[rgba(0,255,163,0.1)] border border-[rgba(0,255,163,0.2)] text-[var(--color-accent)] text-xs font-bold font-[family-name:var(--font-mono)] flex items-center justify-center mb-2.5">
                {step.num}
              </div>
              <h4 className="text-[13px] font-semibold mb-1 text-[var(--color-text1)]">{step.title}</h4>
              <p className="text-xs text-[var(--color-text2)]">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Command Box */}
        <div className="bg-[var(--color-bg2)] border border-[var(--color-border)] rounded-xl py-3.5 px-4 flex items-center gap-3 font-[family-name:var(--font-mono)] text-[13px]">
          <span className="text-[var(--color-accent)] text-[15px] shrink-0">›</span>
          <span className="text-[var(--color-text1)] flex-1 break-all text-left">
            powercfg /batteryreport /output &quot;%USERPROFILE%\battery-report.html&quot;
          </span>
          <button
            onClick={copyCmd}
            className="py-1 px-3 rounded-lg text-[11px] font-semibold bg-[rgba(0,255,163,0.1)] text-[var(--color-accent)] border border-[rgba(0,255,163,0.2)] hover:bg-[rgba(0,255,163,0.2)] transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
