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
    <section className="relative overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,255,163,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 20%, rgba(0,212,255,0.05) 0%, transparent 60%), radial-gradient(ellipse 30% 40% at 20% 30%, rgba(124,109,255,0.04) 0%, transparent 60%)'
      }} />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[2px] text-[var(--accent)] uppercase font-semibold bg-[rgba(0,255,163,0.08)] border border-[rgba(0,255,163,0.2)] py-1.5 px-4 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-blink" />
            Free · No signup · Runs locally
          </div>

          {/* Headline */}
          <h1 className="font-syne font-extrabold leading-[1.05] tracking-[-3px] text-[var(--text1)] mb-6" style={{ fontSize: 'clamp(40px, 7vw, 76px)' }}>
            Your laptop battery,<br />
            <span className="text-gradient">fully decoded</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[var(--text2)] max-w-xl mx-auto mb-12 leading-relaxed" style={{ fontSize: 'clamp(16px, 2vw, 19px)' }}>
            Upload your Windows battery report and get a professional health analysis — wear level, degradation trends, session drain data, and actionable recommendations.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-12 sm:gap-16 flex-wrap mb-14">
            {[
              { value: analyzedCount > 0 ? analyzedCount.toString() : '0', label: 'Reports analyzed' },
              { value: '100%', label: 'Private & local' },
              { value: 'Multi', label: 'Report comparison' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                className="text-center min-w-[100px]"
              >
                <strong className="block font-mono text-3xl sm:text-4xl font-bold text-[var(--text1)]">
                  {stat.value}
                </strong>
                <span className="text-[11px] text-[var(--text3)] uppercase tracking-[1.5px] mt-1 block">{stat.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Privacy Badge */}
          <div className="flex items-center justify-center gap-2 text-sm mb-14">
            <Shield className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-[var(--text2)]">Your battery report never leaves your device.</span>
          </div>
        </motion.div>
      </div>

      {/* How-to Section */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="max-w-4xl mx-auto px-6 pb-10"
      >
        <div className="flex items-center gap-3 mb-5">
          <Terminal className="w-4 h-4 text-[var(--accent)]" />
          <span className="font-syne text-xs font-bold tracking-[2px] uppercase text-[var(--text3)]">
            How to generate your report
          </span>
          <span className="flex-1 h-px bg-[var(--border)]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
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
              className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--border2)] transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-[rgba(0,255,163,0.1)] border border-[rgba(0,255,163,0.2)] text-[var(--accent)] text-xs font-bold font-mono flex items-center justify-center mb-3 group-hover:bg-[rgba(0,255,163,0.15)] transition-colors">
                {step.num}
              </div>
              <h4 className="text-sm font-semibold mb-1.5 text-[var(--text1)]">{step.title}</h4>
              <p className="text-xs text-[var(--text2)] leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Command Box */}
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl py-4 px-5 flex items-center gap-4 font-mono text-sm hover:border-[var(--border2)] transition-colors">
          <span className="text-[var(--accent)] text-lg shrink-0 font-bold">›</span>
          <code className="text-[var(--text1)] flex-1 text-[13px] break-all">
            powercfg /batteryreport /output &quot;%USERPROFILE%\battery-report.html&quot;
          </code>
          <button
            onClick={copyCmd}
            className="py-1.5 px-4 rounded-lg text-[11px] font-semibold bg-[rgba(0,255,163,0.1)] text-[var(--accent)] border border-[rgba(0,255,163,0.2)] hover:bg-[rgba(0,255,163,0.2)] transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
