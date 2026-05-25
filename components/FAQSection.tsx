'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  { q: 'What is battery health?', a: 'Battery health is the ratio of your battery\'s current full charge capacity to its original design capacity. A new battery starts at 100% and gradually degrades over time through normal use. For example, a battery with 45,000 mWh full charge vs 50,000 mWh design capacity has 90% health.' },
  { q: 'How do I generate a battery report?', a: 'Open PowerShell or Command Prompt as Administrator and run: powercfg /batteryreport /output "%USERPROFILE%\\battery-report.html". This creates an HTML file in your user folder. Then upload that file here for analysis.' },
  { q: 'When should I replace my battery?', a: 'Consider replacement when health drops below 60%, runtime becomes too short for your daily needs, or the battery is physically swelling. Most lithium-ion batteries last 300-500 full charge cycles before significant degradation.' },
  { q: 'What is battery wear level?', a: 'Wear level is the percentage of original capacity that has been permanently lost due to chemical aging. A 15% wear level means your battery can only charge to 85% of its original capacity, regardless of what the OS reports as "100%".' },
  { q: 'Is my data safe?', a: 'Absolutely. BatteryIQ processes everything locally in your browser using JavaScript. Your battery report file never leaves your device — there are no server uploads, no databases, no cookies, and no tracking whatsoever.' },
  { q: 'How accurate is the analysis?', a: 'The analysis uses data directly from Windows\' power management system (the same data Microsoft uses). The health score, wear level, and capacity data are highly accurate. Our AI insights and degradation predictions use statistical regression analysis on this data.' },
  { q: 'What affects battery lifespan?', a: 'The main factors are: heat exposure, deep discharges (below 20%), keeping the battery at 100% constantly, high cycle counts, rapid charging, and running intensive workloads on battery power. Keeping charge between 20-80% is the single best practice.' },
  { q: 'Can I compare multiple reports?', a: 'Yes! Upload multiple battery-report.html files to compare different devices side-by-side, or track the same device over time by uploading older reports. Use the Compare tab in the dashboard to see detailed comparisons.' },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 text-[11px] tracking-[2px] text-[var(--accent2)] uppercase font-semibold bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.2)] py-1 px-3 rounded-full mb-4">
          <HelpCircle className="w-3 h-3" /> FAQ
        </div>
        <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-[var(--text1)] tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-[var(--text2)] text-sm mt-3 max-w-lg mx-auto">
          Everything you need to know about battery health analysis
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--border2)] transition-colors"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between py-5 px-6 text-left cursor-pointer bg-transparent border-none"
            >
              <span className="text-[15px] font-semibold text-[var(--text1)] pr-4">{faq.q}</span>
              <motion.div
                animate={{ rotate: openIndex === i ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="shrink-0"
              >
                <ChevronDown className="w-5 h-5 text-[var(--text3)]" />
              </motion.div>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 border-t border-[var(--border)]">
                    <p className="text-sm text-[var(--text2)] leading-relaxed pt-4">{faq.a}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
