import type { Metadata } from 'next';
import { Syne, JetBrains_Mono, Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'BatteryIQ — Professional Laptop Battery Health Analyzer',
  description:
    'Analyze your laptop battery health from Windows powercfg /batteryreport. Get professional health scores, degradation trends, AI-powered insights, and actionable recommendations. 100% private — runs locally in your browser.',
  keywords: [
    'battery health checker',
    'laptop battery analyzer',
    'powercfg battery report',
    'battery wear level',
    'battery health test',
    'Windows battery report',
    'battery degradation',
    'battery cycle count',
  ],
  openGraph: {
    title: 'BatteryIQ — Professional Laptop Battery Health Analyzer',
    description:
      'Upload your Windows battery report and get instant professional health analysis with scores, charts, and AI-powered recommendations.',
    type: 'website',
    siteName: 'BatteryIQ',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${syne.variable} ${jetbrainsMono.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#080c12" />
        <meta name="google-adsense-account" content="ca-pub-6088632479455301" />
        <meta name="monetag" content="58fc10d2e262143b783c9aecaaa355d0" />
        <Script
          async
          src="https://quge5.com/88/tag.min.js"
          data-zone="243065"
          data-cfasync="false"
          strategy="beforeInteractive"
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6088632479455301"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
