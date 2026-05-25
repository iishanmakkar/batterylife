'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutGrid, TrendingDown, BarChart3, Activity,
  GitCompareArrows, Lightbulb, Plus, Download, X, Upload,
  Battery, Gauge, Zap, RefreshCw, Clock, Flame, CalendarDays, DollarSign,
} from 'lucide-react';
import type { BatteryReport, TabId } from '@/lib/types';
import { computeHealth, getVerdicts } from '@/lib/health';
import { generateInsights } from '@/lib/insights';
import { estimateGamingDamage, estimateResaleImpact, estimateDeviceAge } from '@/lib/detection';
import { parseReport } from '@/lib/parser';

import ScoreCard from './ScoreCard';
import MetricCard from './MetricCard';
import InsightCard from './InsightCard';
import DeviceInfoCard from './DeviceInfoCard';
import CompareView from './CompareView';
import TipsGrid from './TipsGrid';
import ExportModal from './ExportModal';
import AdUnit from './AdUnit';

import CapacityChart from './charts/CapacityChart';
import BatteryLifeChart from './charts/BatteryLifeChart';
import UsageChart from './charts/UsageChart';
import DrainChart from './charts/DrainChart';
import DonutChart from './charts/DonutChart';
import CompareChart from './charts/CompareChart';

interface Props {
  reports: BatteryReport[];
  onAddReport: (reports: BatteryReport[]) => void;
  onRemoveReport: (index: number) => void;
  onClose: () => void;
}

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutGrid className="w-4 h-4" /> },
  { id: 'history', label: 'Capacity', icon: <TrendingDown className="w-4 h-4" /> },
  { id: 'usage', label: 'Usage', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'sessions', label: 'Sessions', icon: <Activity className="w-4 h-4" /> },
  { id: 'compare', label: 'Compare', icon: <GitCompareArrows className="w-4 h-4" /> },
  { id: 'tips', label: 'Tips', icon: <Lightbulb className="w-4 h-4" /> },
];

export default function Dashboard({ reports, onAddReport, onRemoveReport, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [activeIdx, setActiveIdx] = useState(0);
  const [showExport, setShowExport] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const report = reports[activeIdx] || reports[0];
  const health = useMemo(() => computeHealth(report), [report]);
  const verdicts = useMemo(() => getVerdicts(report, health), [report, health]);
  const insights = useMemo(() => generateInsights(report, health), [report, health]);
  const gaming = useMemo(() => estimateGamingDamage(report), [report]);
  const resale = useMemo(() => estimateResaleImpact(health), [health]);
  const age = useMemo(() => estimateDeviceAge(report), [report]);

  const handleAddFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const newReports: BatteryReport[] = [];
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          newReports.push(parseReport(reader.result as string, file.name));
          if (newReports.length === e.target.files!.length) {
            onAddReport([...reports, ...newReports]);
          }
        } catch { /* skip bad files */ }
      };
      reader.readAsText(file);
    });
    e.target.value = '';
  }, [reports, onAddReport]);

  const batHours = report.weeklyUsage.reduce((a, b) => a + b.bat, 0);
  const acHours = report.weeklyUsage.reduce((a, b) => a + b.ac, 0);

  return (
    <motion.div
      id="dashboard-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ maxWidth: 1024, margin: '0 auto', padding: '0 24px 64px', width: '100%' }}
    >
      <input ref={fileRef} type="file" accept=".html,.htm" multiple style={{ display: 'none' }} onChange={handleAddFile} />

      {/* ── Tab Navigation ─────────────────────────────────────── */}
      <div style={{ position: 'sticky', top: 64, zIndex: 40, background: 'rgba(8,12,18,0.9)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid var(--bdr)', marginBottom: 24, marginLeft: -24, marginRight: -24, padding: '0 24px' }}>
        <div className="scrollbar-none" style={{ display: 'flex', alignItems: 'center', gap: 4, overflowX: 'auto', padding: '8px 0' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px',
                fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', borderRadius: 8,
                cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                color: activeTab === t.id ? 'var(--acc)' : 'var(--tx3)',
                background: activeTab === t.id ? 'rgba(0,255,163,0.08)' : 'transparent',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={() => fileRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 500, color: 'var(--tx3)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <Plus style={{ width: 14, height: 14 }} /> Add
            </button>
            <button onClick={() => setShowExport(true)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 500, color: 'var(--tx3)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <Download style={{ width: 14, height: 14 }} /> Export
            </button>
            <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 500, color: 'var(--tx3)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X style={{ width: 14, height: 14 }} /> Close
            </button>
          </div>
        </div>
      </div>

      {/* ── Report Selector (if multiple) ──────────────────────── */}
      {reports.length > 1 && (
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          {reports.map((r, i) => (
            <div key={i} className="flex items-center gap-0">
              <button
                onClick={() => setActiveIdx(i)}
                className={`py-1.5 px-3 rounded-l-lg text-xs font-medium transition-all cursor-pointer ${
                  i === activeIdx
                    ? 'bg-[var(--color-accent)] text-black'
                    : 'bg-[var(--color-bg2)] text-[var(--color-text2)] border border-[var(--color-border)] hover:border-[var(--color-accent)]'
                }`}
              >
                {r.filename.slice(0, 20)}
              </button>
              <button
                onClick={() => onRemoveReport(i)}
                className={`py-1.5 px-1.5 rounded-r-lg text-xs transition-all cursor-pointer ${
                  i === activeIdx
                    ? 'bg-[rgba(0,255,163,0.7)] text-black hover:bg-[var(--color-danger)] hover:text-white'
                    : 'bg-[var(--color-bg2)] text-[var(--color-text3)] border border-l-0 border-[var(--color-border)] hover:text-[var(--color-danger)]'
                }`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button onClick={() => fileRef.current?.click()} className="py-1.5 px-3 rounded-lg text-xs font-medium bg-[var(--color-bg2)] text-[var(--color-text3)] border border-dashed border-[var(--color-border2)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all cursor-pointer flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add report
          </button>
        </div>
      )}

      {/* ── Tab Content ────────────────────────────────────────── */}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <ScoreCard report={report} health={health} />
          <AdUnit slot="1234567890" format="horizontal" className="my-5" />

          {/* Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricCard icon={<Battery className="w-5 h-5 text-[var(--color-accent)]" />} label="Health" value={`${health.healthPct}%`} sub={`${report.battery.fullChargeCapacity.toLocaleString()} mWh`} pct={health.healthPct} colorClass="" barColor="linear-gradient(90deg, #00ffa3, #00d4ff)" />
            <MetricCard icon={<Gauge className="w-5 h-5 text-[var(--color-warn)]" />} label="Wear" value={`${health.wearPct}%`} sub={`${(report.battery.designCapacity - report.battery.fullChargeCapacity).toLocaleString()} mWh lost`} pct={health.wearPct} colorClass="" barColor="linear-gradient(90deg, #ffb830, #ff9500)" />
            <MetricCard icon={<RefreshCw className="w-5 h-5 text-[var(--color-accent2)]" />} label="Cycles" value={`${report.battery.cycleCount}`} sub={`${health.remainingCycles} remaining`} pct={(report.battery.cycleCount / 500) * 100} colorClass="" barColor="linear-gradient(90deg, #00d4ff, #7c6dff)" />
            <MetricCard icon={<Clock className="w-5 h-5 text-[var(--color-accent3)]" />} label="Avg Life" value={health.avgLife > 0 ? `${health.avgLife}h` : 'N/A'} sub={health.avgLife >= 6 ? 'Good' : health.avgLife >= 4 ? 'Fair' : 'Low'} pct={Math.min((health.avgLife / 10) * 100, 100)} colorClass="" barColor="linear-gradient(90deg, #7c6dff, #a855f7)" />
            <MetricCard icon={<Flame className="w-5 h-5 text-[var(--color-danger)]" />} label="Gaming" value={gaming.level} sub={`${gaming.percentage}% impact`} pct={gaming.percentage} colorClass="" barColor="linear-gradient(90deg, #ff4f4f, #ff7c7c)" />
            <MetricCard icon={<CalendarDays className="w-5 h-5 text-[var(--color-accent)]" />} label="Age" value={age.label} sub={health.estimatedLifespan} pct={Math.min((age.months / 36) * 100, 100)} colorClass="" barColor="linear-gradient(90deg, #00ffa3, #00d4ff)" />
          </div>

          {/* Mini Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
            {report.capacityHistory.length > 0 && <CapacityChart data={report.capacityHistory} designCapacity={report.battery.designCapacity} height={200} />}
            {report.lifeEstimates.length > 0 && <BatteryLifeChart data={report.lifeEstimates} height={200} />}
          </div>

          <DeviceInfoCard report={report} />

          {/* Insights */}
          {insights.length > 0 && (
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--bdr)' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap style={{ width: 16, height: 16, color: 'var(--acc)' }} /> AI-Powered Insights
                </h3>
              </div>
              {insights.slice(0, 4).map((ins, i) => <InsightCard key={i} insight={ins} />)}
            </div>
          )}

          {/* Verdicts */}
          {verdicts.length > 0 && (
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx1)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity style={{ width: 16, height: 16, color: 'var(--wrn)' }} /> Diagnostics
              </h3>
              <div className="space-y-2">
                {verdicts.map((v, i) => (
                  <div key={i} className={`flex items-start gap-3 py-2 px-3.5 rounded-xl pill-${v.type}`}>
                    <span className="text-lg mt-0.5">{v.icon}</span>
                    <div>
                      <div className="text-sm font-semibold">{v.title}</div>
                      <div className="text-xs opacity-80">{v.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extra Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 16, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--tx1)', marginBottom: 4 }}>
                <DollarSign style={{ width: 16, height: 16, color: 'var(--acc)' }} /> Resale Impact
              </div>
              <div className="font-mono" style={{ fontSize: 18, color: 'var(--tx1)', fontWeight: 700 }}>{resale.label}</div>
              <p style={{ fontSize: 12, color: 'var(--tx2)', marginTop: 4 }}>{resale.description}</p>
            </div>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 16, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--tx1)', marginBottom: 4 }}>
                <Flame style={{ width: 16, height: 16, color: 'var(--dng)' }} /> Gaming Damage
              </div>
              <div className="font-mono" style={{ fontSize: 18, color: 'var(--tx1)', fontWeight: 700 }}>{gaming.level}</div>
              <p style={{ fontSize: 12, color: 'var(--tx2)', marginTop: 4 }}>{gaming.description.slice(0, 120)}</p>
            </div>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 16, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--tx1)', marginBottom: 4 }}>
                <CalendarDays style={{ width: 16, height: 16, color: 'var(--acc2)' }} /> Estimated Lifespan
              </div>
              <div className="font-mono" style={{ fontSize: 18, color: 'var(--tx1)', fontWeight: 700 }}>{health.estimatedLifespan}</div>
              <p style={{ fontSize: 12, color: 'var(--tx2)', marginTop: 4 }}>Based on current degradation rate</p>
            </div>
          </div>
          <AdUnit slot="2345678901" format="auto" className="my-5" />
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {report.capacityHistory.length > 0 ? (
            <CapacityChart data={report.capacityHistory} designCapacity={report.battery.designCapacity} />
          ) : (
            <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--tx3)' }}>No capacity history data available</div>
          )}
          {report.lifeEstimates.length > 0 && <BatteryLifeChart data={report.lifeEstimates} />}
          <AdUnit slot="3456789012" format="auto" />
          {report.capacityHistory.length >= 3 && health.regression && (
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx1)', marginBottom: 12 }}>Degradation Analysis</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16 }}>
                {[
                  { l: 'Total Loss', v: `${(report.battery.designCapacity - report.battery.fullChargeCapacity).toLocaleString()} mWh` },
                  { l: 'Monthly Loss', v: `~${Math.abs(Math.round(health.regression.slope * 0.67))} mWh` },
                  { l: 'Trend R²', v: health.regression.r2.toFixed(3) },
                  { l: 'Remaining Life', v: health.estimatedLifespan },
                ].map((m, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 11, color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: 1 }}>{m.l}</div>
                    <div className="font-mono" style={{ fontSize: 18, fontWeight: 700, color: 'var(--tx1)' }}>{m.v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* USAGE TAB */}
      {activeTab === 'usage' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
            {report.weeklyUsage.length > 0 && <UsageChart data={report.weeklyUsage} />}
            <DonutChart batteryHours={batHours} acHours={acHours} />
          </div>
          <AdUnit slot="4567890123" format="auto" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <MetricCard icon={<Battery className="w-5 h-5 text-[var(--color-accent)]" />} label="Battery Time" value={`${batHours.toFixed(1)}h`} sub="Total on battery" pct={(batHours / Math.max(batHours + acHours, 1)) * 100} colorClass="" barColor="#00ffa3" />
            <MetricCard icon={<Upload className="w-5 h-5 text-[var(--color-accent2)]" />} label="AC Time" value={`${acHours.toFixed(1)}h`} sub="Total on AC" pct={(acHours / Math.max(batHours + acHours, 1)) * 100} colorClass="" barColor="#00d4ff" />
            <MetricCard icon={<Clock className="w-5 h-5 text-[var(--color-accent3)]" />} label="Avg Daily" value={`${health.dailyDrainAvg}h`} sub="Battery per day" pct={Math.min((health.dailyDrainAvg / 8) * 100, 100)} colorClass="" barColor="#7c6dff" />
            <MetricCard icon={<Gauge className="w-5 h-5 text-[var(--color-warn)]" />} label="Days Tracked" value={`${report.weeklyUsage.length}`} sub="Usage data points" pct={(report.weeklyUsage.length / 14) * 100} colorClass="" barColor="#ffb830" />
          </div>
        </div>
      )}

      {/* SESSIONS TAB */}
      {activeTab === 'sessions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {report.drainSessions.length > 0 ? (
            <>
              <DrainChart data={report.drainSessions} />
              <AdUnit slot="5678901234" format="auto" />
              <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--bdr)' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx1)' }}>Drain Session Details</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg3)', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: 1 }}>
                        {['Date','Duration','Drain','Energy','Rate','Load'].map(h => (
                          <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {report.drainSessions.map((s, i) => (
                        <tr key={i} style={{ borderTop: '1px solid var(--bdr)' }}>
                          <td className="font-mono" style={{ padding: '10px 16px', color: 'var(--tx1)' }}>{s.date.slice(0, 16)}</td>
                          <td style={{ padding: '10px 16px', color: 'var(--tx2)' }}>{s.dur}</td>
                          <td style={{ padding: '10px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 64, height: 6, background: 'var(--bdr)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ height: '100%', borderRadius: 3, width: `${Math.min(s.drain, 100)}%`, background: s.drain > 40 ? '#ff4f4f' : s.drain > 25 ? '#ffb830' : '#00ffa3' }} />
                              </div>
                              <span className="font-mono" style={{ color: 'var(--tx1)' }}>{s.drain}%</span>
                            </div>
                          </td>
                          <td className="font-mono" style={{ padding: '10px 16px', color: 'var(--tx2)' }}>{s.mwh} mWh</td>
                          <td className="font-mono" style={{ padding: '10px 16px', color: 'var(--tx2)' }}>{s.rate} mWh/h</td>
                          <td style={{ padding: '10px 16px' }}>
                            <span className={s.drain > 40 ? 'pill-bad' : s.drain > 25 ? 'pill-warn' : 'pill-good'} style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 500 }}>
                              {s.drain > 40 ? 'Heavy' : s.drain > 25 ? 'Moderate' : 'Light'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--tx3)' }}>No drain session data available</div>
          )}
        </div>
      )}

      {/* COMPARE TAB */}
      {activeTab === 'compare' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {reports.length >= 2 ? (
            <>
              <CompareChart reports={reports} />
              <CompareView reports={reports} />
              <AdUnit slot="6789012345" format="auto" />
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <p style={{ color: 'var(--tx3)', marginBottom: 16 }}>Upload multiple reports to compare</p>
              <button onClick={() => fileRef.current?.click()} style={{ padding: '10px 24px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: 'var(--acc)', color: '#000', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, margin: '0 auto' }}>
                <Plus style={{ width: 16, height: 16 }} /> Add another report
              </button>
            </div>
          )}
        </div>
      )}

      {/* TIPS TAB */}
      {activeTab === 'tips' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {insights.length > 0 && (
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--bdr)' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--tx1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap style={{ width: 16, height: 16, color: 'var(--acc)' }} /> All Insights & Recommendations
                </h3>
              </div>
              {insights.map((ins, i) => <InsightCard key={i} insight={ins} />)}
            </div>
          )}
          <AdUnit slot="7890123456" format="auto" />
          <TipsGrid report={report} health={health} />
        </div>
      )}

      <ExportModal isOpen={showExport} onClose={() => setShowExport(false)} report={report} health={health} reports={reports} />
    </motion.div>
  );
}
