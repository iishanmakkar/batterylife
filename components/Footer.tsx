'use client';

import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full" style={{ borderTop: '1px solid var(--bdr)', background: 'var(--bg1)' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="flex items-center justify-center"
                style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg, #00ffa3, #00d4ff)', fontSize: 14 }}
              >
                ⚡
              </div>
              <span className="font-syne font-bold" style={{ fontSize: 18, color: 'var(--tx1)' }}>
                Battery<span style={{ color: 'var(--acc)' }}>IQ</span>
              </span>
            </div>
            <p className="leading-relaxed" style={{ fontSize: 14, color: 'var(--tx2)', maxWidth: 280 }}>
              Professional battery health analysis for Windows laptops. Free, private, and runs entirely in your browser.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold mb-4" style={{ fontSize: 14, color: 'var(--tx1)' }}>Features</h4>
            <ul className="flex flex-col gap-2.5">
              {['Health Score Analysis', 'Degradation Tracking', 'Multi-Report Compare', 'PDF & JSON Export', 'AI-Powered Insights'].map((f, i) => (
                <li key={i} className="flex items-center gap-2" style={{ fontSize: 13, color: 'var(--tx2)' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--acc)', flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Privacy */}
          <div>
            <h4 className="font-semibold mb-4" style={{ fontSize: 14, color: 'var(--tx1)' }}>Privacy Promise</h4>
            <ul className="flex flex-col gap-2.5">
              {['100% client-side processing', 'No data uploaded to servers', 'No account required', 'No tracking or analytics', 'Reports auto-saved locally'].map((p, i) => (
                <li key={i} className="flex items-center gap-2" style={{ fontSize: 13, color: 'var(--tx2)' }}>
                  <span style={{ color: 'var(--acc)' }}>✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8" style={{ borderTop: '1px solid var(--bdr)' }}>
          <span className="font-mono flex items-center gap-1" style={{ fontSize: 13, color: 'var(--tx3)' }}>
            Built with <Heart style={{ width: 12, height: 12, color: 'var(--dng)', fill: 'var(--dng)' }} /> · BatteryIQ v4.0
          </span>
          <span style={{ fontSize: 13, color: 'var(--tx3)' }}>
            © {new Date().getFullYear()} BatteryIQ. Built for longevity.
          </span>
        </div>
      </div>
    </footer>
  );
}
