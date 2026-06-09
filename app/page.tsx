'use client';

import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import UploadZone from '@/components/UploadZone';
import Dashboard from '@/components/Dashboard';
import FAQSection from '@/components/FAQSection';
import ArticleSection from '@/components/ArticleSection';
import Footer from '@/components/Footer';
import AdUnit from '@/components/AdUnit';
import type { BatteryReport } from '@/lib/types';
import { saveReports, loadReports, getAnalyzedCount, incrementCount } from '@/lib/storage';
import { normalizeReport, normalizeReports } from '@/lib/normalize';

/** Generate a realistic demo battery report for demonstration */
function generateDemoReport(): BatteryReport {
  return {
    filename: 'demo-battery-report.html',
    device: { name: 'HP OmniBook Ultra 14', bios: 'U98 Ver. 01.04.01', os: '10.0.26100' },
    battery: {
      name: 'HT04XL', manufacturer: 'HP', serial: '1052G',
      chemistry: 'LION', designCapacity: 59460, fullChargeCapacity: 52320, cycleCount: 187,
    },
    capacityHistory: [
      { period: '2024-01', fcc: 59460 }, { period: '2024-03', fcc: 58900 },
      { period: '2024-05', fcc: 57850 }, { period: '2024-07', fcc: 57200 },
      { period: '2024-09', fcc: 56100 }, { period: '2024-11', fcc: 55400 },
      { period: '2025-01', fcc: 54600 }, { period: '2025-03', fcc: 53800 },
      { period: '2025-05', fcc: 52320 },
    ],
    lifeEstimates: [
      { period: '2024-09', active: 7.2, stdby: 18.5 },
      { period: '2024-10', active: 6.8, stdby: 17.2 },
      { period: '2024-11', active: 6.5, stdby: 16.8 },
      { period: '2024-12', active: 7.1, stdby: 17.6 },
      { period: '2025-01', active: 6.3, stdby: 16.1 },
      { period: '2025-02', active: 5.9, stdby: 15.4 },
      { period: '2025-03', active: 6.2, stdby: 15.8 },
      { period: '2025-04', active: 5.7, stdby: 14.9 },
      { period: '2025-05', active: 5.5, stdby: 14.3 },
    ],
    weeklyUsage: [
      { date: '05-12', bat: 3.2, ac: 5.1 }, { date: '05-13', bat: 4.1, ac: 3.9 },
      { date: '05-14', bat: 2.8, ac: 6.2 }, { date: '05-15', bat: 5.3, ac: 2.1 },
      { date: '05-16', bat: 3.6, ac: 4.7 }, { date: '05-17', bat: 6.2, ac: 1.5 },
      { date: '05-18', bat: 4.5, ac: 3.2 }, { date: '05-19', bat: 2.1, ac: 7.3 },
      { date: '05-20', bat: 3.8, ac: 4.9 }, { date: '05-21', bat: 5.7, ac: 2.6 },
    ],
    drainSessions: [
      { date: '2025-05-24 14:30', dur: '2h 10m', drain: 35.2, mwh: 18420, rate: 8490 },
      { date: '2025-05-23 09:15', dur: '3h 45m', drain: 52.1, mwh: 27270, rate: 7272 },
      { date: '2025-05-22 16:00', dur: '1h 30m', drain: 22.8, mwh: 11930, rate: 7953 },
      { date: '2025-05-21 10:00', dur: '4h 20m', drain: 61.3, mwh: 32072, rate: 7400 },
      { date: '2025-05-20 13:45', dur: '2h 50m', drain: 41.6, mwh: 21764, rate: 7689 },
      { date: '2025-05-19 08:30', dur: '1h 15m', drain: 18.9, mwh: 9888, rate: 7910 },
      { date: '2025-05-18 15:20', dur: '3h 10m', drain: 46.7, mwh: 24432, rate: 7714 },
      { date: '2025-05-17 11:00', dur: '2h 30m', drain: 38.4, mwh: 20090, rate: 8036 },
    ],
    reportTime: new Date().toLocaleString(),
  };
}

function AppContent() {
  const [reports, setReports] = useState<BatteryReport[]>([]);
  const [showDashboard, setShowDashboard] = useState(false);
  const [analyzedCount, setAnalyzedCount] = useState(0);

  // Load saved reports on mount
  useEffect(() => {
    const saved = loadReports();
    if (saved.length > 0) {
      setReports(saved);
      setShowDashboard(true);
    }
    setAnalyzedCount(getAnalyzedCount());
  }, []);

  const handleReportParsed = useCallback((report: BatteryReport) => {
    setReports(prev => {
      const next = [...prev, normalizeReport(report)];
      saveReports(next);
      return next;
    });
    setAnalyzedCount(incrementCount());
    setShowDashboard(true);
    setTimeout(() => {
      document.getElementById('dashboard-root')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const handleDemo = useCallback(() => {
    const demo = generateDemoReport();
    setReports(prev => {
      const next = [...prev, normalizeReport(demo)];
      saveReports(next);
      return next;
    });
    setAnalyzedCount(incrementCount());
    setShowDashboard(true);
    setTimeout(() => {
      document.getElementById('dashboard-root')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const handleAddReport = useCallback((newReports: BatteryReport[]) => {
    const normalized = normalizeReports(newReports);
    setReports(prev => {
      const next = [...prev, ...normalized];
      saveReports(next);
      return next;
    });
    setAnalyzedCount(prev => prev + normalized.length);
  }, []);

  const handleRemoveReport = useCallback((index: number) => {
    setReports(prev => {
      const next = prev.filter((_, i) => i !== index);
      saveReports(next);
      if (next.length === 0) setShowDashboard(false);
      return next;
    });
  }, []);

  const handleClose = useCallback(() => {
    setShowDashboard(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg0)', color: 'var(--tx1)' }}>
      <Navbar reportCount={reports.length} />

      <main style={{ flex: 1, width: '100%' }}>
        {/* Hero always visible */}
        <HeroSection analyzedCount={analyzedCount} />

        {/* Upload zone only when no dashboard */}
        {!showDashboard && (
          <>
            <UploadZone onReportParsed={handleReportParsed} onDemo={handleDemo} />
            <div className="ad-slot-wrap" style={{ maxWidth: 896, margin: '0 auto', padding: '0 24px 48px' }}>
              <AdUnit slot="8901234567" format="horizontal" />
            </div>
            <ArticleSection />
          </>
        )}

        {/* Dashboard */}
        {showDashboard && reports.length > 0 && (
          <Dashboard
            reports={reports}
            onAddReport={handleAddReport}
            onRemoveReport={handleRemoveReport}
            onClose={handleClose}
          />
        )}

        {/* Divider */}
        <div style={{ maxWidth: 896, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ height: 1, background: 'linear-gradient(to right, transparent, var(--bdr), transparent)' }} />
        </div>

        <div className="ad-slot-wrap" style={{ maxWidth: 896, margin: '0 auto', padding: '32px 24px 0' }}>
          <AdUnit slot="9012345678" format="horizontal" />
        </div>
        <FAQSection />
        <div className="ad-slot-wrap" style={{ maxWidth: 896, margin: '0 auto', padding: '0 24px 48px' }}>
          <AdUnit slot="0123456789" format="horizontal" />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function Page() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
