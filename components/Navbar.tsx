'use client';

import { Sun, Moon, Zap } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Navbar({ reportCount }: { reportCount?: number }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 h-[60px] flex items-center justify-between px-5 border-b border-[var(--color-border)] bg-[var(--color-bg1)]/80 backdrop-blur-xl">
      <a href="#" className="flex items-center gap-2.5 no-underline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent2)] flex items-center justify-center">
          <Zap className="w-4 h-4 text-black" fill="black" />
        </div>
        <span className="font-[family-name:var(--font-syne)] font-extrabold text-xl tracking-tight text-[var(--color-text1)]">
          BatteryIQ
        </span>
      </a>
      <div className="flex items-center gap-3">
        {reportCount !== undefined && reportCount > 0 && (
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[rgba(0,255,163,0.12)] text-[var(--color-accent)] border border-[rgba(0,255,163,0.2)] font-medium tracking-wider">
            {reportCount} report{reportCount !== 1 ? 's' : ''}
          </span>
        )}
        <button
          onClick={toggleTheme}
          className="w-[38px] h-[38px] rounded-[10px] border border-[var(--color-border2)] bg-[var(--color-bg2)] flex items-center justify-center text-[var(--color-text2)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </nav>
  );
}
