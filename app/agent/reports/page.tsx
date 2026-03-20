'use client';

import { useState } from 'react';
import { Download, DollarSign, Package, Wallet, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KpiCard } from '@/components/shared';

type Period = 'today' | 'week' | 'month';

const periodData: Record<Period, { revenue: string; shipments: string; commission: string; cod: string }> = {
  today: { revenue: '$485', shipments: '23', commission: '$39', cod: '$1,240' },
  week: { revenue: '$3,200', shipments: '142', commission: '$256', cod: '$7,800' },
  month: { revenue: '$8,450', shipments: '567', commission: '$676', cod: '$22,400' },
};

const revenueByWeek = [
  { label: 'W1', value: 1800 },
  { label: 'W2', value: 2200 },
  { label: 'W3', value: 2800 },
  { label: 'W4', value: 1650 },
];

const shipmentTrend = [
  { label: 'Mon', value: 18 },
  { label: 'Tue', value: 22 },
  { label: 'Wed', value: 28 },
  { label: 'Thu', value: 25 },
  { label: 'Fri', value: 32 },
  { label: 'Sat', value: 12 },
  { label: 'Sun', value: 5 },
];

const topCustomers = [
  { name: 'Sade Adegoke', spend: '₦8,400,000', shipments: 89 },
  { name: 'Tunde Bakare', spend: '₦5,200,000', shipments: 67 },
  { name: 'Chinedu Nwosu', spend: '₦2,850,000', shipments: 42 },
  { name: 'Peter Nnamdi', spend: '₦1,780,000', shipments: 31 },
  { name: 'Emeka Okafor', spend: '₦1,250,000', shipments: 24 },
];

const commissionHistory = [
  { period: 'Jan 2026', earned: '$520', paid: '$520' },
  { period: 'Feb 2026', earned: '$610', paid: '$610' },
  { period: 'Mar 2026', earned: '$676', paid: '$0' },
];

export default function AgentReportsPage() {
  const [period, setPeriod] = useState<Period>('month');
  const data = periodData[period];
  const maxRevenue = Math.max(...revenueByWeek.map(w => w.value));
  const maxShipment = Math.max(...shipmentTrend.map(d => d.value));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-[var(--cream)] rounded-lg p-1">
          {(['today', 'week', 'month'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-colors ${period === p ? 'bg-[var(--gold)] text-[var(--ink)] shadow-sm' : 'text-[var(--muted-text)] hover:text-[var(--ink)]'}`}
            >
              {p === 'today' ? 'Today' : p === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
        <Button variant="outline" className="gap-2 border-[var(--gold)]/30 text-[var(--gold-dark)] hover:bg-[var(--gold-pale)]">
          <Download size={14} /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={<DollarSign size={18} />} label="Revenue" value={data.revenue} trend="+12%" variant="gold" />
        <KpiCard icon={<Package size={18} />} label="Shipments" value={data.shipments} trend="+8%" variant="terra" />
        <KpiCard icon={<Wallet size={18} />} label="Commission Earned" value={data.commission} variant="gold" />
        <KpiCard icon={<CreditCard size={18} />} label="COD Collected" value={data.cod} variant="ink" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--warm-white)] border border-[var(--border-warm)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="text-sm font-semibold text-[var(--ink)] mb-4">Revenue by Period</h3>
          <div className="flex items-end gap-3 h-40">
            {revenueByWeek.map(w => (
              <div key={w.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-semibold text-[var(--muted-text)]">${(w.value / 1000).toFixed(1)}k</span>
                <div className="w-full rounded-t-md bg-[var(--gold)]/20 relative" style={{ height: `${(w.value / maxRevenue) * 100}%` }}>
                  <div className="absolute bottom-0 left-0 right-0 bg-[var(--gold)] rounded-t-md" style={{ height: '100%' }} />
                </div>
                <span className="text-[10px] text-[var(--muted-text)]">{w.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--warm-white)] border border-[var(--border-warm)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="text-sm font-semibold text-[var(--ink)] mb-4">Shipment Volume Trend</h3>
          <div className="flex items-end gap-2 h-40">
            {shipmentTrend.map(d => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-semibold text-[var(--muted-text)]">{d.value}</span>
                <div className="w-full rounded-t-md bg-[var(--terra)]/20 relative" style={{ height: `${(d.value / maxShipment) * 100}%` }}>
                  <div className="absolute bottom-0 left-0 right-0 bg-[var(--terra)] rounded-t-md" style={{ height: '100%' }} />
                </div>
                <span className="text-[10px] text-[var(--muted-text)]">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--warm-white)] border border-[var(--border-warm)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="text-sm font-semibold text-[var(--ink)] mb-4">Top 5 Customers by Spend</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border-warm)]">
                <th className="text-left py-2 text-[var(--muted-text)] font-semibold">#</th>
                <th className="text-left py-2 text-[var(--muted-text)] font-semibold">Customer</th>
                <th className="text-right py-2 text-[var(--muted-text)] font-semibold">Shipments</th>
                <th className="text-right py-2 text-[var(--muted-text)] font-semibold">Total Spend</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((c, i) => (
                <tr key={c.name} className="border-b border-[var(--border-warm)] last:border-0">
                  <td className="py-2.5 font-semibold text-[var(--ink)]">{i + 1}</td>
                  <td className="py-2.5 text-[var(--ink)]">{c.name}</td>
                  <td className="py-2.5 text-right text-[var(--ink)]">{c.shipments}</td>
                  <td className="py-2.5 text-right font-semibold text-[var(--ink)]">{c.spend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[var(--warm-white)] border border-[var(--border-warm)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="text-sm font-semibold text-[var(--ink)] mb-4">Commission Earned vs Payout</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border-warm)]">
                <th className="text-left py-2 text-[var(--muted-text)] font-semibold">Period</th>
                <th className="text-right py-2 text-[var(--muted-text)] font-semibold">Earned</th>
                <th className="text-right py-2 text-[var(--muted-text)] font-semibold">Paid</th>
                <th className="text-right py-2 text-[var(--muted-text)] font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {commissionHistory.map(c => {
                const settled = c.paid !== '$0';
                return (
                  <tr key={c.period} className="border-b border-[var(--border-warm)] last:border-0">
                    <td className="py-2.5 text-[var(--ink)]">{c.period}</td>
                    <td className="py-2.5 text-right font-semibold text-[var(--ink)]">{c.earned}</td>
                    <td className="py-2.5 text-right text-[var(--ink)]">{c.paid}</td>
                    <td className="py-2.5 text-right">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${settled ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {settled ? 'Settled' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
