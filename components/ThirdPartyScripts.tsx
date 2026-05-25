'use client';

import { useEffect } from 'react';

function appendScript(id: string, src: string, attrs: Record<string, string> = {}) {
  if (document.getElementById(id)) return;

  const script = document.createElement('script');
  script.id = id;
  script.async = true;
  script.src = src;

  for (const [key, value] of Object.entries(attrs)) {
    script.setAttribute(key, value);
  }

  document.head.appendChild(script);
}

export default function ThirdPartyScripts() {
  useEffect(() => {
    appendScript(
      'adsense-script',
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6088632479455301',
      { crossorigin: 'anonymous' }
    );

    const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (isLocalhost) return;

    const loadInterstitialScript = window.setTimeout(() => {
      if (document.getElementById('dashboard-root')) return;

      appendScript('quge5-zone-script', 'https://quge5.com/88/tag.min.js', {
        'data-zone': '243065',
        'data-cfasync': 'false',
      });
    }, 8000);

    return () => window.clearTimeout(loadInterstitialScript);
  }, []);

  return null;
}
