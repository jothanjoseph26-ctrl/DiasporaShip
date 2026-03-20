'use client';

import { useState } from 'react';
import { Download, DollarSign, Truck, Users, Clock, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KpiCard } from '@/components/shared';

const periods = ['Today','Week','Month','Quarter','Year','Custom'];

const revenueData = [4200,5800,6100,7200,8500,7800,9200,8100,9800,10500,11200,12450];
const prevRevenueData = [3800,4900,5200,6100,7200,6800,7500,7100,8200,8800,9500,10200];
const corridorData = [
  { label:'US→NG', value:8200, pct:65 },
  { label:'US→GH', value:2100, pct:17 },
  { label:'US→KE', value:1450, pct:12 },
  { label:'UK→NG', value:700, pct:6 },
];
const paymentData = [
  { label:'Wallet', pct:38, color:'bg-[var(--terra)]' },
  { label:'Card', pct:32, color:'bg-blue-500' },
  { label:'Bank Transfer', pct:18, color:'bg-emerald-500' },
  { label:'COD', pct:12, color:'bg-amber-500' },
];
const deliveryDist = [
  { label:'<2 days', pct:45 },
  { label:'2-4 days', pct:35 },
  { label:'4-7 days', pct:15 },
  { label:'7+ days', pct:5 },
];
const topCustomers = [
  { name:'TechCorp Ltd', volume:234, revenue:'$52,400' },
  { name:'Okafor Trading Co.', volume:47, revenue:'$12,500' },
  { name:'Asante Imports', volume:35, revenue:'$8,200' },
  { name:'John Okafor', volume:28, revenue:'$6,800' },
  { name:'Smith & Associates', volume:22, revenue:'$5,100' },
  { name:'Grace Nwosu', volume:18, revenue:'$3,200' },
  { name:'Michael Chen', volume:15, revenue:'$2,800' },
  { name:'Wanjiku Kamau', volume:12, revenue:'$2,400' },
  { name:'Kwame Asante', volume:10, revenue:'$1,900' },
  { name:'Amina Sani', volume:8, revenue:'$1,200' },
];
const topDrivers = [
  { name:'Emeka Nwosu', deliveries:1243, onTime:98.1 },
  { name:'Adebayo Ogundimu', deliveries:847, onTime:94.5 },
  { name:'Daniel Achebe', deliveries:678, onTime:89.4 },
  { name:'Chinwe Eze', deliveries:562, onTime:97.2 },
  { name:'Ibrahim Musa', deliveries:489, onTime:95.6 },
  { name:'Blessing Eze', deliveries:398, onTime:93.7 },
  { name:'Fatima Bello', deliveries:312, onTime:92.8 },
  { name:'Grace Okafor', deliveries:234, onTime:91.2 },
  { name:'Ngozi Obi', deliveries:201, onTime:97.8 },
  { name:'Samuel Okonkwo', deliveries:156, onTime:96.3 },
];

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState('Month');
  const maxRevenue = Math.max(...revenueData);

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-30 bg-[var(--cream)] -mx-6 px-6 py-3 border-b border-[var(--border-warm)] flex items-center justify-between">
        <div className="flex gap-1">
          {periods.map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 text-xs font-medium rounded-lg ${period === p ? 'bg-[var(--terra)] text-white' : 'text-gray-700 hover:bg-[var(--terra-pale)]'}`}>{p}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Download size={12} /> PDF</Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Download size={12} /> CSV</Button>
        </div>
      </div>

      <section>
        <h2 className="text-base font-semibold text-[var(--ink)] mb-4">Revenue</h2>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <KpiCard icon={<DollarSign size={18} />} label="Total Revenue" value="$124,500" trend="+8.2%" variant="terra" />
          <KpiCard icon={<TrendingUp size={18} />} label="Avg Order Value" value="$186" trend="+3.1%" variant="gold" />
          <KpiCard icon={<Truck size={18} />} label="Shipments" value="1,847" trend="+12.4%" variant="ink" />
          <KpiCard icon={<Clock size={18} />} label="On-Time Rate" value="94.2%" trend="+1.8%" variant="terra" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 border border-[var(--border-warm)] rounded-xl bg-[var(--warm-white)] p-4">
            <h3 className="text-sm font-semibold text-[var(--ink)] mb-4">Revenue Trend</h3>
            <div className="flex items-end gap-2 h-40">
              {revenueData.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-[2px] items-end" style={{ height: '120px' }}>
                    <div className="flex-1 bg-[var(--terra)]/30 rounded-t" style={{ height: `${(prevRevenueData[i] / maxRevenue) * 100}%` }} />
                    <div className="flex-1 bg-[var(--terra)] rounded-t" style={{ height: `${(v / maxRevenue) * 100}%` }} />
                  </div>
                  <span className="text-[9px] text-gray-600">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[var(--terra)]" /> Current</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[var(--terra)]/30" /> Previous</span>
            </div>
          </div>

          <div className="border border-[var(--border-warm)] rounded-xl bg-[var(--warm-white)] p-4">
            <h3 className="text-sm font-semibold text-[var(--ink)] mb-4">By Payment Method</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-28 h-28">
                {paymentData.reduce((acc: { start: number; elements: React.ReactNode[] }, item) => {
                  const end = acc.start + item.pct;
                  const startAngle = acc.start * 3.6;
                  const endAngle = end * 3.6;
                  const largeArc = item.pct > 50 ? 1 : 0;
                  const x1 = 56 + 50 * Math.cos((startAngle - 90) * Math.PI / 180);
                  const y1 = 56 + 50 * Math.sin((startAngle - 90) * Math.PI / 180);
                  const x2 = 56 + 50 * Math.cos((endAngle - 90) * Math.PI / 180);
                  const y2 = 56 + 50 * Math.sin((endAngle - 90) * Math.PI / 180);
                  acc.elements.push(
                    <path key={item.label} d={`M56,56 L${x1},${y1} A50,50 0 ${largeArc},1 ${x2},${y2} Z`} className={item.color} opacity="0.8" />
                  );
                  return { start: end, elements: acc.elements };
                }, { start: 0, elements: [] }).elements}
                <div className="absolute inset-4 bg-[var(--warm-white)] rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-[var(--ink)]">4</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {paymentData.map(p => (
                <div key={p.label} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-[var(--ink)]"><span className={`w-2 h-2 rounded ${p.color}`} />{p.label}</span>
                  <span className="font-medium text-[var(--ink)]">{p.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border border-[var(--border-warm)] rounded-xl bg-[var(--warm-white)] p-4 mt-4">
          <h3 className="text-sm font-semibold text-[var(--ink)] mb-4">By Corridor</h3>
          <div className="space-y-3">
            {corridorData.map(c => (
              <div key={c.label} className="flex items-center gap-3">
                <span className="text-sm w-16 font-medium text-[var(--ink)]">{c.label}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--terra)] rounded-full" style={{ width: `${c.pct}%` }} />
                </div>
                <span className="text-sm font-semibold w-20 text-right text-[var(--ink)]">${c.value.toLocaleString()}</span>
                <span className="text-xs text-gray-600 w-10 text-right">{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-[var(--ink)] mb-4">Operations</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="border border-[var(--border-warm)] rounded-xl bg-[var(--warm-white)] p-4">
            <h3 className="text-sm font-semibold text-[var(--ink)] mb-4">On-Time Rate</h3>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#C4622D" strokeWidth="8" strokeDasharray={`${94.2 * 2.64} ${(100 - 94.2) * 2.64}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-[var(--ink)]">94.2%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-[var(--border-warm)] rounded-xl bg-[var(--warm-white)] p-4">
            <h3 className="text-sm font-semibold text-[var(--ink)] mb-4">Delivery Time Distribution</h3>
            <div className="space-y-3">
              {deliveryDist.map(d => (
                <div key={d.label} className="flex items-center gap-3">
                  <span className="text-xs w-16 text-gray-600">{d.label}</span>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--gold)] rounded-full" style={{ width: `${d.pct}%` }} />
                  </div>
                  <span className="text-xs font-medium w-10 text-right text-[var(--ink)]">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[var(--border-warm)] rounded-xl bg-[var(--warm-white)] p-4">
            <h3 className="text-sm font-semibold text-[var(--ink)] mb-4">Exception Rate by Status</h3>
            <div className="space-y-2">
              {[
                { label:'Customs Hold', pct:3.2 },
                { label:'Failed Delivery', pct:1.8 },
                { label:'On Hold', pct:0.9 },
                { label:'Returned', pct:0.4 },
              ].map(e => (
                <div key={e.label} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--ink)]">{e.label}</span>
                  <span className="font-medium text-red-600">{e.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-[var(--ink)] mb-4">Customers</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-[var(--border-warm)] rounded-xl bg-[var(--warm-white)] p-4">
            <h3 className="text-sm font-semibold text-[var(--ink)] mb-4">New vs Returning</h3>
            <div className="flex items-end gap-2 h-32">
              {[30,35,28,42,38,45,50,48,55,60,58,65].map((v,i) => (
                <div key={i} className="flex-1 flex flex-col gap-[2px]">
                  <div className="bg-blue-400 rounded-t" style={{ height: `${v * 0.6}%` }} />
                  <div className="bg-[var(--terra)]" style={{ height: `${(100-v) * 0.6}%` }} />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-[var(--terra)]" /> Returning</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-400" /> New</span>
            </div>
          </div>

          <div className="border border-[var(--border-warm)] rounded-xl bg-[var(--warm-white)] p-4">
            <h3 className="text-sm font-semibold text-[var(--ink)] mb-3">Top 10 by Volume</h3>
            <div className="space-y-2">
              {topCustomers.map((c,i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 w-5">{i+1}.</span>
                  <span className="flex-1 font-medium text-[var(--ink)]">{c.name}</span>
                  <span className="text-xs text-gray-600 w-12 text-right">{c.volume}</span>
                  <span className="text-xs font-semibold text-[var(--ink)] w-16 text-right">{c.revenue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-[var(--ink)] mb-4">Drivers</h2>
        <div className="border border-[var(--border-warm)] rounded-xl bg-[var(--warm-white)] p-4">
          <h3 className="text-sm font-semibold text-[var(--ink)] mb-3">Top 10 Drivers by Deliveries</h3>
          <div className="space-y-2">
            {topDrivers.map((d,i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-5">{i+1}</span>
                <span className="text-sm font-medium text-[var(--ink)] w-40">{d.name}</span>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--terra)] rounded-full" style={{ width: `${(d.deliveries / topDrivers[0].deliveries) * 100}%` }} />
                </div>
                <span className="text-xs font-medium text-[var(--ink)] w-12 text-right">{d.deliveries}</span>
                <span className={`text-xs w-12 text-right ${d.onTime >= 95 ? 'text-green-600' : 'text-amber-600'}`}>{d.onTime}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
