'use client';

import { useState } from 'react';
import { Download, TrendingUp, Clock, ShieldAlert, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KpiCard } from '@/components/shared';

type Period = 'today' | 'week' | 'month';

const periodData: Record<Period, { clearanceRate: string; avgTime: string; holdRate: string; duties: string }> = {
  today: { clearanceRate: '89%', avgTime: '4.2h', holdRate: '12%', duties: '$18,450' },
  week: { clearanceRate: '91%', avgTime: '3.8h', holdRate: '9%', duties: '$124,800' },
  month: { clearanceRate: '93%', avgTime: '3.5h', holdRate: '7%', duties: '$485,200' },
};

const corridorData = [
  { corridor: 'US → NG', rate: 94, time: 3.2, duties: 185000 },
  { corridor: 'UK → NG', rate: 91, time: 3.8, duties: 120000 },
  { corridor: 'CN → NG', rate: 87, time: 5.1, duties: 95000 },
  { corridor: 'US → KE', rate: 92, time: 3.5, duties: 42000 },
  { corridor: 'CN → GH', rate: 89, time: 4.0, duties: 38000 },
];

const holdReasons = [
  { reason: 'Missing documents', count: 12, pct: 40 },
  { reason: 'Value mismatch', count: 8, pct: 27 },
  { reason: 'Prohibited item', count: 5, pct: 17 },
  { reason: 'Incomplete info', count: 5, pct: 17 },
];

export default function CustomsReportsPage() {
  const [period, setPeriod] = useState<Period>('week');
  const data = periodData[period];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-[var(--cream)] rounded-lg p-1">
          {(['today', 'week', 'month'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${period === p ? 'bg-cyan-600 text-white shadow-sm' : 'text-[var(--muted-text)] hover:text-[var(--ink)]'}`}
            >
              {p === 'today' ? 'Today' : p === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
        <Button variant="outline" className="gap-2 border-cyan-300 text-cyan-700 hover:bg-cyan-50">
          <Download size={14} /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={<TrendingUp size={18} />} label="Clearance Rate" value={data.clearanceRate} variant="gold" />
        <KpiCard icon={<Clock size={18} />} label="Avg Clearance Time" value={data.avgTime} variant="terra" />
        <KpiCard icon={<ShieldAlert size={18} />} label="Hold Rate" value={data.holdRate} variant="ink" />
        <KpiCard icon={<DollarSign size={18} />} label="Duties Collected" value={data.duties} variant="gold" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--warm-white)] border border-[var(--border-warm)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="text-sm font-semibold text-[var(--ink)] mb-4">Clearance Rate by Corridor</h3>
          <div className="space-y-3">
            {corridorData.map(c => (
              <div key={c.corridor} className="flex items-center gap-3">
                <span className="text-xs font-medium text-[var(--ink)] w-16">{c.corridor}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-3">
                  <div className="h-3 rounded-full bg-cyan-500 transition-all" style={{ width: `${c.rate}%` }} />
                </div>
                <span className="text-xs font-semibold text-[var(--ink)] w-10 text-right">{c.rate}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--warm-white)] border border-[var(--border-warm)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="text-sm font-semibold text-[var(--ink)] mb-4">Avg Clearance Time Trend</h3>
          <div className="flex items-end gap-2 h-40">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
              const heights = [65, 58, 72, 50, 45, 80, 70];
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-semibold text-[var(--muted-text)]">{(4.5 - heights[i] * 0.02).toFixed(1)}h</span>
                  <div className="w-full bg-cyan-100 rounded-t-md relative" style={{ height: `${heights[i]}%` }}>
                    <div className="absolute bottom-0 left-0 right-0 bg-cyan-500 rounded-t-md" style={{ height: '100%' }} />
                  </div>
                  <span className="text-[10px] text-[var(--muted-text)]">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[var(--warm-white)] border border-[var(--border-warm)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="text-sm font-semibold text-[var(--ink)] mb-4">Hold Reasons Distribution</h3>
          <div className="space-y-3">
            {holdReasons.map(r => (
              <div key={r.reason} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--ink)] font-medium">{r.reason}</span>
                  <span className="text-[var(--muted-text)]">{r.count} ({r.pct}%)</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2.5">
                  <div className="h-2.5 rounded-full bg-amber-500" style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--warm-white)] border border-[var(--border-warm)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="text-sm font-semibold text-[var(--ink)] mb-4">Duties Collected by Corridor</h3>
          <div className="space-y-3">
            {corridorData.sort((a, b) => b.duties - a.duties).map(c => {
              const maxDuties = 185000;
              return (
                <div key={c.corridor} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-[var(--ink)] w-16">{c.corridor}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3">
                    <div className="h-3 rounded-full bg-[var(--gold)]" style={{ width: `${(c.duties / maxDuties) * 100}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-[var(--ink)] w-20 text-right">${(c.duties / 1000).toFixed(0)}k</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
