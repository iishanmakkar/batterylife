'use client';
import { useEffect, useRef, useState } from 'react';

declare global { interface Window { adsbygoogle: unknown[]; } }

interface Props { slot: string; format?: string; layout?: string; className?: string; responsive?: boolean; }

export default function AdUnit({ slot, format = 'auto', layout, className = '', responsive = true }: Props) {
  const adRef = useRef<HTMLModElement>(null);
  const [mounted, setMounted] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!mounted || !adRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      // Check after a delay if the ad actually rendered content
      const timer = setTimeout(() => {
        if (adRef.current && adRef.current.offsetHeight > 0) {
          setAdLoaded(true);
        }
      }, 2000);
      return () => clearTimeout(timer);
    } catch { /* ad blocker */ }
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      className={className}
      data-no-export
      style={{
        overflow: 'hidden',
        borderRadius: 12,
        // Hide completely until ads are approved — no white boxes
        minHeight: adLoaded ? 90 : 0,
        maxHeight: adLoaded ? 'none' : 0,
        opacity: adLoaded ? 1 : 0,
        transition: 'all 0.3s ease',
      }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', background: 'transparent' }}
        data-ad-client="ca-pub-6088632479455301"
        data-ad-slot={slot}
        data-ad-format={format}
        {...(responsive ? { 'data-full-width-responsive': 'true' } : {})}
        {...(layout ? { 'data-ad-layout': layout } : {})}
      />
    </div>
  );
}
