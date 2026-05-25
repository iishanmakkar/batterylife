'use client';
import { useEffect, useRef, useState } from 'react';

declare global { interface Window { adsbygoogle: unknown[]; } }

interface Props { slot: string; format?: string; layout?: string; className?: string; responsive?: boolean; }

export default function AdUnit({ slot, format = 'auto', layout, className = '', responsive = true }: Props) {
  const adRef = useRef<HTMLModElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!mounted || !adRef.current) return;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch { /* ad blocker */ }
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className={`ad-container my-4 ${className}`} data-no-export>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6088632479455301"
        data-ad-slot={slot}
        data-ad-format={format}
        {...(responsive ? { 'data-full-width-responsive': 'true' } : {})}
        {...(layout ? { 'data-ad-layout': layout } : {})}
      />
    </div>
  );
}
