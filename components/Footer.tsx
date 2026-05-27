'use client';

import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ width: '100%', borderTop: '1px solid var(--bdr)', background: 'var(--bg1)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px' }}>
        {/* 3-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg, #00ffa3, #00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                ⚡
              </div>
              <span className="font-syne" style={{ fontSize: 18, fontWeight: 700, color: 'var(--tx1)' }}>
                Battery<span style={{ color: 'var(--acc)' }}>IQ</span>
              </span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--tx2)', lineHeight: 1.7, maxWidth: 280 }}>
              Professional battery health analysis for Windows laptops. Free, private, and runs entirely in your browser.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx1)', marginBottom: 16 }}>Features</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Health Score Analysis', 'Degradation Tracking', 'Multi-Report Compare', 'PDF & JSON Export', 'AI-Powered Insights'].map((f, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--tx2)' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--acc)', flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Privacy */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx1)', marginBottom: 16 }}>Privacy Promise</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['100% client-side processing', 'No data uploaded to servers', 'No account required', 'No tracking or analytics', 'Reports auto-saved locally'].map((p, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--tx2)' }}>
                  <span style={{ color: 'var(--acc)' }}>✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex', flexWrap: 'wrap' as const, alignItems: 'center', justifyContent: 'space-between',
          gap: 12, paddingTop: 32, borderTop: '1px solid var(--bdr)',
        }}>
          <span className="font-mono" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--tx3)' }}>
            Built with <Heart style={{ width: 12, height: 12, color: 'var(--dng)', fill: 'var(--dng)' }} /> · BatteryIQ v4.0
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--tx3)' }}>
            <Link href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</Link>
            <Link href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</Link>
            <span>© {new Date().getFullYear()} BatteryIQ</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
