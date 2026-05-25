'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Navbar({ reportCount }: { reportCount?: number }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50, width: '100%',
      height: 64, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      background: 'var(--nav-bg)', borderBottom: '1px solid var(--bdr)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px',
        height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #00ffa3, #00d4ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>
            ⚡
          </div>
          <span className="font-syne" style={{ fontSize: 20, fontWeight: 700, color: 'var(--tx1)', letterSpacing: -0.5 }}>
            Battery<span style={{ color: 'var(--acc)' }}>IQ</span>
          </span>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Report count badge */}
          {reportCount != null && reportCount > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 12px', borderRadius: 999,
              fontSize: 12, fontWeight: 600,
              background: 'rgba(0,255,163,0.1)', border: '1px solid rgba(0,255,163,0.2)', color: 'var(--acc)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--acc)', display: 'inline-block' }} />
              {reportCount} {reportCount === 1 ? 'report' : 'reports'}
            </div>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{
              width: 40, height: 40, borderRadius: 12, cursor: 'pointer',
              border: '1px solid var(--bdr)', background: 'transparent', color: 'var(--tx2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {theme === 'dark' ? <Sun style={{ width: 18, height: 18 }} /> : <Moon style={{ width: 18, height: 18 }} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
