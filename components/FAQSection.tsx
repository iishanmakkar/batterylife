'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'What is battery health?', a: 'Battery health is the ratio of your battery\'s current full charge capacity to its original design capacity. A new battery starts at 100% and gradually degrades over time through normal use.' },
  { q: 'How do I generate a battery report?', a: 'Open PowerShell or Command Prompt as Administrator and run: powercfg /batteryreport. This creates an HTML file at C:\\Windows\\System32\\battery-report.html (or the path you specify).' },
  { q: 'When should I replace my battery?', a: 'Consider replacement when health drops below 60%, runtime becomes too short for your needs, or the battery is swelling. Most batteries last 300-500 charge cycles.' },
  { q: 'What is battery wear level?', a: 'Wear level is the percentage of original capacity that has been permanently lost. A 15% wear level means your battery can only charge to 85% of its original capacity.' },
  { q: 'Is my data safe?', a: 'Absolutely. BatteryIQ processes everything locally in your browser. Your battery report never leaves your device — no servers, no uploads, no tracking.' },
  { q: 'How accurate is the analysis?', a: 'The analysis is based on data directly from Windows\' power management system. The health score, wear level, and capacity data are as accurate as Windows reports them. Our insights and predictions use statistical analysis of this data.' },
  { q: 'What affects battery lifespan?', a: 'Heat, deep discharges (below 20%), keeping the battery at 100% constantly, high cycle counts, and intensive workloads all contribute to faster degradation.' },
  { q: 'Can I compare multiple reports?', a: 'Yes! Upload multiple battery-report.html files to compare different devices or track the same device over time. Use the Compare tab to see side-by-side analysis.' },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="max-w-[760px] mx-auto px-4 py-16">
      <h2 className="font-[family-name:var(--font-syne)] text-2xl font-extrabold text-center mb-8 text-[var(--color-text1)]">
        Frequently Asked Questions
      </h2>
      <div className="bg-[var(--color-bg2)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-[var(--color-border)] last:border-b-0">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between py-4 px-5 text-left text-sm font-semibold text-[var(--color-text1)] hover:bg-[var(--color-bg3)] transition-colors cursor-pointer"
            >
              {faq.q}
              <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4 text-[var(--color-text3)] shrink-0" />
              </motion.div>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-xs text-[var(--color-text2)] leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
