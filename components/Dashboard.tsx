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
      className="max-w-5xl mx-auto px-6 pb-16"
    >
      <input ref={fileRef} type="file" accept=".html,.htm" multiple className="hidden" onChange={handleAddFile} />

      {/* ── Tab Navigation ─────────────────────────────────────── */}
      <div className="sticky top-[64px] z-40 bg-[var(--bg0)]/90 backdrop-blur-lg border-b border-[var(--border)] mb-6 -mx-6 px-6">
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 text-xs font-medium whitespace-nowrap rounded-lg transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'text-[var(--accent)] bg-[rgba(0,255,163,0.08)]'
                  : 'text-[var(--text3)] hover:text-[var(--text2)] hover:bg-[var(--bg2)]'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
          <div className="flex-1" />
          <div className="flex items-center gap-1.5">
            <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1 py-1.5 px-3 rounded-lg text-[11px] font-medium text-[var(--text3)] hover:text-[var(--accent)] hover:bg-[var(--bg2)] transition-all cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
            <button onClick={() => setShowExport(true)} className="flex items-center gap-1 py-1.5 px-3 rounded-lg text-[11px] font-medium text-[var(--text3)] hover:text-[var(--accent)] hover:bg-[var(--bg2)] transition-all cursor-pointer">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button onClick={onClose} className="flex items-center gap-1 py-1.5 px-3 rounded-lg text-[11px] font-medium text-[var(--text3)] hover:text-[var(--danger)] hover:bg-[var(--bg2)] transition-all cursor-pointer">
              <X className="w-3.5 h-3.5" /> Close
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
                    ? 'bg-[var(--accent)] text-black'
                    : 'bg-[var(--bg2)] text-[var(--text2)] border border-[var(--border)] hover:border-[var(--accent)]'
                }`}
              >
                {r.filename.slice(0, 20)}
              </button>
              <button
                onClick={() => onRemoveReport(i)}
                className={`py-1.5 px-1.5 rounded-r-lg text-xs transition-all cursor-pointer ${
                  i === activeIdx
                    ? 'bg-[rgba(0,255,163,0.7)] text-black hover:bg-[var(--danger)] hover:text-white'
                    : 'bg-[var(--bg2)] text-[var(--text3)] border border-l-0 border-[var(--border)] hover:text-[var(--danger)]'
                }`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button onClick={() => fileRef.current?.click()} className="py-1.5 px-3 rounded-lg text-xs font-medium bg-[var(--bg2)] text-[var(--text3)] border border-dashed border-[var(--border2)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-pointer flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add report
          </button>
        </div>
      )}

      {/* ── Tab Content ────────────────────────────────────────── */}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          <ScoreCard report={report} health={health} />
          <AdUnit slot="1234567890" format="horizontal" className="my-5" />

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <MetricCard icon={<Battery className="w-5 h-5 text-[var(--accent)]" />} label="Health" value={`${health.healthPct}%`} sub={`${report.battery.fullChargeCapacity.toLocaleString()} mWh`} pct={health.healthPct} colorClass="" barColor="linear-gradient(90deg, #00ffa3, #00d4ff)" />
            <MetricCard icon={<Gauge className="w-5 h-5 text-[var(--warn)]" />} label="Wear" value={`${health.wearPct}%`} sub={`${(report.battery.designCapacity - report.battery.fullChargeCapacity).toLocaleString()} mWh lost`} pct={health.wearPct} colorClass="" barColor="linear-gradient(90deg, #ffb830, #ff9500)" />
            <MetricCard icon={<RefreshCw className="w-5 h-5 text-[var(--accent2)]" />} label="Cycles" value={`${report.battery.cycleCount}`} sub={`${health.remainingCycles} remaining`} pct={(report.battery.cycleCount / 500) * 100} colorClass="" barColor="linear-gradient(90deg, #00d4ff, #7c6dff)" />
            <MetricCard icon={<Clock className="w-5 h-5 text-[var(--accent3)]" />} label="Avg Life" value={health.avgLife > 0 ? `${health.avgLife}h` : 'N/A'} sub={health.avgLife >= 6 ? 'Good' : health.avgLife >= 4 ? 'Fair' : 'Low'} pct={Math.min((health.avgLife / 10) * 100, 100)} colorClass="" barColor="linear-gradient(90deg, #7c6dff, #a855f7)" />
            <MetricCard icon={<Flame className="w-5 h-5 text-[var(--danger)]" />} label="Gaming" value={gaming.level} sub={`${gaming.percentage}% impact`} pct={gaming.percentage} colorClass="" barColor="linear-gradient(90deg, #ff4f4f, #ff7c7c)" />
            <MetricCard icon={<CalendarDays className="w-5 h-5 text-[var(--accent)]" />} label="Age" value={age.label} sub={health.estimatedLifespan} pct={Math.min((age.months / 36) * 100, 100)} colorClass="" barColor="linear-gradient(90deg, #00ffa3, #00d4ff)" />
          </div>

          {/* Mini Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {report.capacityHistory.length > 0 && <CapacityChart data={report.capacityHistory} designCapacity={report.battery.designCapacity} height={200} />}
            {report.lifeEstimates.length > 0 && <BatteryLifeChart data={report.lifeEstimates} height={200} />}
          </div>

          <DeviceInfoCard report={report} />

          {/* Insights */}
          {insights.length > 0 && (
            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl overflow-hidden">
              <div className="py-3 px-5 border-b border-[var(--border)]">
                <h3 className="text-sm font-semibold text-[var(--text1)] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[var(--accent)]" /> AI-Powered Insights
                </h3>
              </div>
              {insights.slice(0, 4).map((ins, i) => <InsightCard key={i} insight={ins} />)}
            </div>
          )}

          {/* Verdicts */}
          {verdicts.length > 0 && (
            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-[var(--text1)] mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[var(--warn)]" /> Diagnostics
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text1)] mb-1">
                <DollarSign className="w-4 h-4 text-[var(--accent)]" /> Resale Impact
              </div>
              <div className="font-mono text-lg text-[var(--text1)] font-bold">{resale.label}</div>
              <p className="text-xs text-[var(--text2)] mt-1">{resale.description}</p>
            </div>
            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text1)] mb-1">
                <Flame className="w-4 h-4 text-[var(--danger)]" /> Gaming Damage
              </div>
              <div className="font-mono text-lg text-[var(--text1)] font-bold">{gaming.level}</div>
              <p className="text-xs text-[var(--text2)] mt-1">{gaming.description.slice(0, 120)}</p>
            </div>
            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text1)] mb-1">
                <CalendarDays className="w-4 h-4 text-[var(--accent2)]" /> Estimated Lifespan
              </div>
              <div className="font-mono text-lg text-[var(--text1)] font-bold">{health.estimatedLifespan}</div>
              <p className="text-xs text-[var(--text2)] mt-1">Based on current degradation rate</p>
            </div>
          </div>
          <AdUnit slot="2345678901" format="auto" className="my-5" />
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="space-y-5">
          {report.capacityHistory.length > 0 ? (
            <CapacityChart data={report.capacityHistory} designCapacity={report.battery.designCapacity} />
          ) : (
            <div className="text-center py-16 text-[var(--text3)]">No capacity history data available</div>
          )}
          {report.lifeEstimates.length > 0 && <BatteryLifeChart data={report.lifeEstimates} />}
          <AdUnit slot="3456789012" format="auto" />
          {report.capacityHistory.length >= 3 && health.regression && (
            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-[var(--text1)] mb-3">Degradation Analysis</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { l: 'Total Loss', v: `${(report.battery.designCapacity - report.battery.fullChargeCapacity).toLocaleString()} mWh` },
                  { l: 'Monthly Loss', v: `~${Math.abs(Math.round(health.regression.slope * 0.67))} mWh` },
                  { l: 'Trend R²', v: health.regression.r2.toFixed(3) },
                  { l: 'Remaining Life', v: health.estimatedLifespan },
                ].map((m, i) => (
                  <div key={i}>
                    <div className="text-[11px] text-[var(--text3)] uppercase tracking-[1px]">{m.l}</div>
                    <div className="font-mono text-lg font-bold text-[var(--text1)]">{m.v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* USAGE TAB */}
      {activeTab === 'usage' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {report.weeklyUsage.length > 0 && <UsageChart data={report.weeklyUsage} />}
            <DonutChart batteryHours={batHours} acHours={acHours} />
          </div>
          <AdUnit slot="4567890123" format="auto" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard icon={<Battery className="w-5 h-5 text-[var(--accent)]" />} label="Battery Time" value={`${batHours.toFixed(1)}h`} sub="Total on battery" pct={(batHours / Math.max(batHours + acHours, 1)) * 100} colorClass="" barColor="#00ffa3" />
            <MetricCard icon={<Upload className="w-5 h-5 text-[var(--accent2)]" />} label="AC Time" value={`${acHours.toFixed(1)}h`} sub="Total on AC" pct={(acHours / Math.max(batHours + acHours, 1)) * 100} colorClass="" barColor="#00d4ff" />
            <MetricCard icon={<Clock className="w-5 h-5 text-[var(--accent3)]" />} label="Avg Daily" value={`${health.dailyDrainAvg}h`} sub="Battery per day" pct={Math.min((health.dailyDrainAvg / 8) * 100, 100)} colorClass="" barColor="#7c6dff" />
            <MetricCard icon={<Gauge className="w-5 h-5 text-[var(--warn)]" />} label="Days Tracked" value={`${report.weeklyUsage.length}`} sub="Usage data points" pct={(report.weeklyUsage.length / 14) * 100} colorClass="" barColor="#ffb830" />
          </div>
        </div>
      )}

      {/* SESSIONS TAB */}
      {activeTab === 'sessions' && (
        <div className="space-y-5">
          {report.drainSessions.length > 0 ? (
            <>
              <DrainChart data={report.drainSessions} />
              <AdUnit slot="5678901234" format="auto" />
              {/* Sessions Table */}
              <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl overflow-hidden">
                <div className="py-3 px-5 border-b border-[var(--border)]">
                  <h3 className="text-sm font-semibold text-[var(--text1)]">Drain Session Details</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-[var(--bg3)] text-[var(--text3)] uppercase tracking-wider">
                        <th className="py-2.5 px-4 text-left font-medium">Date</th>
                        <th className="py-2.5 px-4 text-left font-medium">Duration</th>
                        <th className="py-2.5 px-4 text-left font-medium">Drain</th>
                        <th className="py-2.5 px-4 text-left font-medium">Energy</th>
                        <th className="py-2.5 px-4 text-left font-medium">Rate</th>
                        <th className="py-2.5 px-4 text-left font-medium">Load</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.drainSessions.map((s, i) => (
                        <tr key={i} className="border-t border-[var(--border)] hover:bg-[var(--bg3)] transition-colors">
                          <td className="py-2.5 px-4 font-mono text-[var(--text1)]">{s.date.slice(0, 16)}</td>
                          <td className="py-2.5 px-4 text-[var(--text2)]">{s.dur}</td>
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${Math.min(s.drain, 100)}%`, background: s.drain > 40 ? '#ff4f4f' : s.drain > 25 ? '#ffb830' : '#00ffa3' }} />
                              </div>
                              <span className="font-mono text-[var(--text1)]">{s.drain}%</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-4 font-mono text-[var(--text2)]">{s.mwh} mWh</td>
                          <td className="py-2.5 px-4 font-mono text-[var(--text2)]">{s.rate} mWh/h</td>
                          <td className="py-2.5 px-4">
                            <span className={`py-0.5 px-2 rounded-full text-[11px] font-medium ${
                              s.drain > 40 ? 'pill-bad' : s.drain > 25 ? 'pill-warn' : 'pill-good'
                            }`}>
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
            <div className="text-center py-16 text-[var(--text3)]">No drain session data available</div>
          )}
        </div>
      )}

      {/* COMPARE TAB */}
      {activeTab === 'compare' && (
        <div className="space-y-5">
          {reports.length >= 2 ? (
            <>
              <CompareChart reports={reports} />
              <CompareView reports={reports} />
              <AdUnit slot="6789012345" format="auto" />
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-[var(--text3)] mb-4">Upload multiple reports to compare</p>
              <button onClick={() => fileRef.current?.click()} className="py-2.5 px-6 rounded-[10px] text-[13px] font-semibold bg-[var(--accent)] text-black hover:brightness-110 transition-all flex items-center gap-1.5 mx-auto cursor-pointer">
                <Plus className="w-4 h-4" /> Add another report
              </button>
            </div>
          )}
        </div>
      )}

      {/* TIPS TAB */}
      {activeTab === 'tips' && (
        <div className="space-y-5">
          {/* All insights */}
          {insights.length > 0 && (
            <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl overflow-hidden">
              <div className="py-3 px-5 border-b border-[var(--border)]">
                <h3 className="text-sm font-semibold text-[var(--text1)] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[var(--accent)]" /> All Insights & Recommendations
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
