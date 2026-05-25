'use client';
import { Zap, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg1)]">
      <div className="max-w-5xl mx-auto py-14 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-black" fill="black" />
              </div>
              <span className="font-syne font-bold text-lg text-[var(--text1)]">
                Battery<span className="text-[var(--accent)]">IQ</span>
              </span>
            </div>
            <p className="text-sm text-[var(--text3)] leading-relaxed max-w-[280px]">
              Professional battery health analysis for Windows laptops. Free, private, and runs entirely in your browser.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[2px] text-[var(--text3)] mb-4">Features</h4>
            <ul className="text-sm text-[var(--text2)] space-y-2.5">
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[var(--accent)]" /> Health Score Analysis</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[var(--accent)]" /> Degradation Tracking</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[var(--accent)]" /> Multi-Report Compare</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[var(--accent)]" /> PDF & JSON Export</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[var(--accent)]" /> AI-Powered Insights</li>
            </ul>
          </div>

          {/* Privacy */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[2px] text-[var(--text3)] mb-4">Privacy Promise</h4>
            <ul className="text-sm text-[var(--text2)] space-y-2.5">
              <li className="flex items-center gap-2"><span className="text-[var(--accent)]">✓</span> 100% client-side processing</li>
              <li className="flex items-center gap-2"><span className="text-[var(--accent)]">✓</span> No data uploaded to servers</li>
              <li className="flex items-center gap-2"><span className="text-[var(--accent)]">✓</span> No account required</li>
              <li className="flex items-center gap-2"><span className="text-[var(--accent)]">✓</span> No tracking or analytics</li>
              <li className="flex items-center gap-2"><span className="text-[var(--accent)]">✓</span> Reports auto-saved locally</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text3)]">
            Built with <Heart className="w-3 h-3 text-[var(--danger)] fill-[var(--danger)]" /> by BatteryIQ
          </div>
          <div className="text-xs text-[var(--text3)]">
            v4.0 · Reports auto-saved in your browser
          </div>
        </div>
      </div>
    </footer>
  );
}
