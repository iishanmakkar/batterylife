'use client';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg1)] mt-4">
      <div className="max-w-5xl mx-auto py-10 px-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent2)] flex items-center justify-center">
                <Zap className="w-3 h-3 text-black" fill="black" />
              </div>
              <span className="font-[family-name:var(--font-syne)] font-bold text-[var(--color-text1)]">BatteryIQ</span>
            </div>
            <p className="text-xs text-[var(--color-text3)] leading-relaxed">
              Professional battery health analysis for Windows laptops. Free, private, and runs entirely in your browser.
            </p>
          </div>
          {/* Features */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[1px] text-[var(--color-text3)] mb-3">Features</h4>
            <ul className="text-xs text-[var(--color-text2)] space-y-1.5">
              <li>Health Score Analysis</li>
              <li>Degradation Tracking</li>
              <li>Multi-Report Compare</li>
              <li>PDF & JSON Export</li>
              <li>AI-Powered Insights</li>
            </ul>
          </div>
          {/* Privacy */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[1px] text-[var(--color-text3)] mb-3">Privacy</h4>
            <ul className="text-xs text-[var(--color-text2)] space-y-1.5">
              <li>✓ 100% client-side processing</li>
              <li>✓ No data uploaded to servers</li>
              <li>✓ No account required</li>
              <li>✓ No tracking or analytics</li>
              <li>✓ Reports auto-saved locally</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[var(--color-border)] pt-5 text-center text-xs text-[var(--color-text3)]">
          Built with ❤️ · BatteryIQ v4.0 · Reports auto-saved in your browser
        </div>
      </div>
    </footer>
  );
}
