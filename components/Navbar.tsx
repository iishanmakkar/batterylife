'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Navbar({ reportCount }: { reportCount?: number }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className="sticky top-0 z-50 w-full backdrop-blur-xl"
      style={{
        height: 64,
        background: 'rgba(8,12,18,0.8)',
        borderBottom: '1px solid var(--bdr)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center"
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #00ffa3, #00d4ff)',
              fontSize: 16,
            }}
          >
            ⚡
          </div>
          <span className="font-syne font-bold" style={{ fontSize: 20, color: 'var(--tx1)', letterSpacing: '-0.5px' }}>
            Battery<span style={{ color: 'var(--acc)' }}>IQ</span>
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Report count badge */}
          {reportCount != null && reportCount > 0 && (
            <div
              className="flex items-center gap-1.5 rounded-full"
              style={{
                padding: '4px 12px',
                fontSize: 12,
                fontWeight: 600,
                background: 'rgba(0,255,163,0.1)',
                border: '1px solid rgba(0,255,163,0.2)',
                color: 'var(--acc)',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--acc)', display: 'inline-block' }} />
              {reportCount} {reportCount === 1 ? 'report' : 'reports'}
            </div>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="cursor-pointer flex items-center justify-center transition-all"
            style={{
              width: 40, height: 40, borderRadius: 12,
              border: '1px solid var(--bdr)',
              background: 'transparent',
              color: 'var(--tx2)',
            }}
          >
            {theme === 'dark' ? <Sun style={{ width: 18, height: 18 }} /> : <Moon style={{ width: 18, height: 18 }} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
