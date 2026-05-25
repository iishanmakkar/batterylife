'use client';

import type { BatteryReport, HealthAnalysis } from '@/lib/types';
import { Thermometer, BatteryCharging, Gauge, Clock, Plug, RefreshCw, Zap, CalendarCheck } from 'lucide-react';

const baseTips = [
  { icon: <BatteryCharging className="w-5 h-5" />, title: 'Keep 20-80% Charge', desc: 'Avoid fully draining or charging to 100% regularly. The 20-80% sweet spot minimizes stress on lithium-ion cells.', pro: 'Enable charge limit in your laptop BIOS settings.' },
  { icon: <Thermometer className="w-5 h-5" />, title: 'Manage Heat', desc: 'High temperatures accelerate chemical degradation. Ensure vents are clear and use on hard surfaces.', pro: 'Keep ambient temperature below 35°C.' },
  { icon: <Gauge className="w-5 h-5" />, title: 'Use Battery Saver', desc: 'Windows Battery Saver mode reduces background activity and extends runtime when you are on battery.', pro: 'Set it to activate at 30% remaining.' },
  { icon: <Clock className="w-5 h-5" />, title: 'Optimize Standby', desc: 'Modern Standby can drain battery. Review which apps wake your device via powercfg /sleepstudy.', pro: 'Disable wake-on-WiFi for non-essential apps.' },
  { icon: <Plug className="w-5 h-5" />, title: "Don't Stay Plugged In", desc: 'Constant 100% charge creates trickle-charge stress. Unplug when full or use a charge limiter.', pro: 'Use manufacturer battery conservation tools.' },
  { icon: <RefreshCw className="w-5 h-5" />, title: 'Monitor Monthly', desc: 'Run powercfg /batteryreport monthly to catch degradation early before it affects your workflow.', pro: 'Compare reports here to spot trends.' },
  { icon: <Zap className="w-5 h-5" />, title: 'Avoid Rapid Charging', desc: 'Fast charging generates more heat and stress. Use standard charging when you are not in a hurry.', pro: 'Standard 65W is gentler than 100W+ chargers.' },
  { icon: <CalendarCheck className="w-5 h-5" />, title: 'Calibrate Quarterly', desc: 'Full discharge to 5% then charge to 100% helps recalibrate the battery gauge for accurate readings.', pro: 'Do this every 3 months for best accuracy.' },
];

export default function TipsGrid({ health }: { report: BatteryReport; health: HealthAnalysis }) {
  const urgentTips: string[] = [];
  if (health.wearPct > 20) urgentTips.push('Your battery has significant wear. Prioritize keeping charge between 20-80%.');
  if (health.avgLife < 4 && health.avgLife > 0) urgentTips.push('Short battery life detected. Check for background apps draining power.');
  if (health.remainingCycles < 100) urgentTips.push('Approaching end of rated lifespan. Start planning for a replacement.');

  return (
    <div className="space-y-5">
      {urgentTips.length > 0 && (
        <div className="bg-[rgba(255,184,48,0.08)] border border-[rgba(255,184,48,0.2)] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[var(--color-warn)] mb-3">Priority Recommendations</h3>
          {urgentTips.map((tip, i) => (
            <p key={i} className="text-xs text-[var(--color-text2)] leading-relaxed mb-1.5">{tip}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {baseTips.map((tip, i) => (
          <div key={i} className="bg-[var(--color-bg2)] border border-[var(--color-border)] rounded-2xl p-6 hover:border-[var(--color-border2)] transition-all flex flex-col min-h-[190px]">
            <div className="text-[var(--color-accent)] mb-4">{tip.icon}</div>
            <h4 className="text-sm font-semibold text-[var(--color-text1)] mb-2">{tip.title}</h4>
            <p className="text-xs text-[var(--color-text2)] leading-relaxed mb-5 flex-1">{tip.desc}</p>
            <div className="text-[11px] bg-[rgba(0,255,163,0.06)] border border-[rgba(0,255,163,0.15)] rounded-lg py-2 px-3 text-[var(--color-accent)] leading-snug">
              {tip.pro}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
