'use client';

import { useEffect, useRef, useState } from 'react';

declare global { interface Window { adsbygoogle: unknown[]; } }

interface Props { slot: string; format?: string; layout?: string; className?: string; responsive?: boolean; }

export default function AdUnit({ slot, format = 'auto', layout, className = '', responsive = true }: Props) {
  const adRef = useRef<HTMLModElement>(null);
  const [mounted, setMounted] = useState(false);
  const [adStatus, setAdStatus] = useState<'pending' | 'filled' | 'unfilled'>('pending');

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !adRef.current) return;
    const adEl = adRef.current;

    const syncStatus = () => {
      const status = adEl.getAttribute('data-ad-status');
      if (status === 'filled') setAdStatus('filled');
      if (status === 'unfilled') setAdStatus('unfilled');
    };

    const observer = new MutationObserver(syncStatus);
    observer.observe(adEl, { attributes: true, attributeFilter: ['data-ad-status'] });

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      setAdStatus('unfilled');
    }

    const timer = window.setTimeout(() => {
      syncStatus();
      if (adEl.getAttribute('data-ad-status') !== 'filled') setAdStatus('unfilled');
    }, 4000);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [mounted]);

  if (!mounted) return null;

  const isFilled = adStatus === 'filled';

  return (
    <div
      className={isFilled ? className : undefined}
      data-no-export
      data-ad-state={adStatus}
      style={{
        overflow: 'hidden',
        borderRadius: isFilled ? 12 : 0,
        height: isFilled ? 'auto' : 0,
        minHeight: 0,
        maxHeight: isFilled ? 'none' : 0,
        opacity: isFilled ? 1 : 0,
        margin: isFilled ? undefined : 0,
        padding: isFilled ? undefined : 0,
        border: isFilled ? undefined : 0,
        background: 'transparent',
        transition: 'opacity 0.2s ease',
      }}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', background: 'transparent' }}
        data-ad-client="ca-pub-6088632479455301"
        data-ad-slot={slot}
        data-ad-format={format}
        {...(responsive ? { 'data-full-width-responsive': 'true' } : {})}
        {...(layout ? { 'data-ad-layout': layout } : {})}
      />
    </div>
  );
}
