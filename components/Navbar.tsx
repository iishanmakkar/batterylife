'use client';

import { Sun, Moon, Zap } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Navbar({ reportCount }: { reportCount?: number }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 h-[64px] flex items-center justify-between px-6 border-b border-[var(--color-border)] bg-[var(--color-bg0)]/80 backdrop-blur-xl">
      {/* Logo */}
      <a href="#" className="flex items-center gap-2.5 no-underline group" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
        <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent2)] flex items-center justify-center shadow-[0_2px_12px_rgba(0,255,163,0.25)] group-hover:shadow-[0_2px_20px_rgba(0,255,163,0.4)] transition-shadow">
          <Zap className="w-[18px] h-[18px] text-black" fill="black" />
        </div>
        <span className="font-[family-name:var(--font-syne)] font-extrabold text-xl tracking-tight text-[var(--color-text1)]">
          Battery<span className="text-[var(--color-accent)]">IQ</span>
        </span>
      </a>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {reportCount !== undefined && reportCount > 0 && (
          <span className="text-[11px] py-1 px-3 rounded-full bg-[rgba(0,255,163,0.1)] text-[var(--color-accent)] border border-[rgba(0,255,163,0.2)] font-semibold tracking-wide hidden sm:inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
            {reportCount} report{reportCount !== 1 ? 's' : ''} loaded
          </span>
        )}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-[10px] border border-[var(--color-border2)] bg-[var(--color-bg2)] flex items-center justify-center text-[var(--color-text2)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-[var(--color-bg3)] transition-all cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </nav>
  );
}
