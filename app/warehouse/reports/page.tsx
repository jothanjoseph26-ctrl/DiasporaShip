'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { KpiCard } from '@/components/shared';
import {
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock,
  BarChart3,
  Download,
  Boxes,
} from 'lucide-react';

type Period = 'today' | 'week' | 'month';

const reportData = {
  today: { received: 43, dispatched: 38, avgDwell: 3.2, capacityUtil: 82 },
  week: { received: 287, dispatched: 264, avgDwell: 3.5, capacityUtil: 79 },
  month: { received: 1247, dispatched: 1198, avgDwell: 3.8, capacityUtil: 78 },
  dailyThroughput: [
    { day: 'Mon', received: 42, dispatched: 38 },
    { day: 'Tue', received: 45, dispatched: 41 },
    { day: 'Wed', received: 38, dispatched: 35 },
    { day: 'Thu', received: 51, dispatched: 47 },
    { day: 'Fri', received: 48, dispatched: 44 },
    { day: 'Sat', received: 35, dispatched: 32 },
    { day: 'Sun', received: 28, dispatched: 27 },
  ],
  dwellDistribution: [
    { range: '0-2 days', count: 420, percent: 34 },
    { range: '3-5 days', count: 510, percent: 41 },
    { range: '6-10 days', count: 240, percent: 19 },
    { range: '10+ days', count: 77, percent: 6 },
  ],
  typeBreakdown: [
    { type: 'Parcel', percent: 45, color: '#7C3AED' },
    { type: 'Cargo', percent: 25, color: '#C4622D' },
    { type: 'Document', percent: 15, color: '#2563EB' },
    { type: 'Fragile', percent: 10, color: '#C9972B' },
    { type: 'Cold Chain', percent: 5, color: '#059669' },
  ],
};

const periods: { key: Period; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>('today');

  const data = reportData[period];
  const maxThroughput = Math.max(...reportData.dailyThroughput.map((d) => Math.max(d.received, d.dispatched)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 bg-[#FAF6EF] rounded-lg p-1">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                period === p.key
                  ? 'bg-white text-[#1A1208] shadow-sm'
                  : 'text-[#8C7B6B] hover:text-[#1A1208]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-44 bg-white border-[#E8DDD0]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Warehouses</SelectItem>
            <SelectItem value="atlanta">Atlanta Hub</SelectItem>
            <SelectItem value="lagos">Lagos Hub</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={<ArrowDownToLine className="h-5 w-5" />} label="Items received" value={data.received.toLocaleString()} variant="terra" />
        <KpiCard icon={<ArrowUpFromLine className="h-5 w-5" />} label="Items dispatched" value={data.dispatched.toLocaleString()} variant="gold" />
        <KpiCard icon={<Clock className="h-5 w-5" />} label="Avg dwell time" value={`${data.avgDwell} days`} variant="ink" />
        <KpiCard icon={<Boxes className="h-5 w-5" />} label="Capacity utilization" value={`${data.capacityUtil}%`} variant="terra" />
      </div>

      <Card className="border-[#E8DDD0] bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1A1208]">Throughput — Received vs Dispatched per Day</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 h-48">
            {reportData.dailyThroughput.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-1 items-end h-40">
                  <div
                    className="flex-1 rounded-t-md bg-[#7C3AED] transition-all"
                    style={{ height: `${(d.received / maxThroughput) * 100}%` }}
                    title={`Received: ${d.received}`}
                  />
                  <div
                    className="flex-1 rounded-t-md bg-[#C4622D] transition-all"
                    style={{ height: `${(d.dispatched / maxThroughput) * 100}%` }}
                    title={`Dispatched: ${d.dispatched}`}
                  />
                </div>
                <span className="text-[10px] font-medium text-[#8C7B6B]">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <span className="flex items-center gap-1.5 text-xs text-[#8C7B6B]">
              <span className="w-3 h-3 rounded-sm bg-[#7C3AED]" /> Received
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#8C7B6B]">
              <span className="w-3 h-3 rounded-sm bg-[#C4622D]" /> Dispatched
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-[#E8DDD0] bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#1A1208]">Dwell Time Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reportData.dwellDistribution.map((d) => (
              <div key={d.range}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[#1A1208]">{d.range}</span>
                  <span className="text-xs text-[#8C7B6B]">{d.count} items ({d.percent}%)</span>
                </div>
                <div className="w-full h-4 rounded-full bg-[#FAF6EF] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      d.range === '10+ days'
                        ? 'bg-red-500'
                        : d.range === '6-10 days'
                        ? 'bg-amber-500'
                        : 'bg-[#7C3AED]'
                    }`}
                    style={{ width: `${d.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#E8DDD0] bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#1A1208]">Item Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="relative w-36 h-36 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {reportData.typeBreakdown.reduce<{ segments: React.ReactNode[]; offset: number }>((acc, item) => {
                    const dash = item.percent * 2.51327;
                    acc.segments.push(
                      <circle
                        key={item.type}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="16"
                        strokeDasharray={`${dash} ${251.327 - dash}`}
                        strokeDashoffset={-acc.offset}
                      />
                    );
                    acc.offset += dash;
                    return acc;
                  }, { segments: [], offset: 0 }).segments}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xl font-bold text-[#1A1208]">1,247</p>
                    <p className="text-[10px] text-[#8C7B6B]">items</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 flex-1">
                {reportData.typeBreakdown.map((item) => (
                  <div key={item.type} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-[#1A1208] flex-1">{item.type}</span>
                    <span className="text-sm font-semibold text-[#1A1208]">{item.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="gap-2 border-[#E8DDD0] text-[#1A1208] hover:bg-[#FAF6EF]">
          <Download className="h-4 w-4" />
          Download CSV
        </Button>
        <Button variant="outline" className="gap-2 border-[#E8DDD0] text-[#1A1208] hover:bg-[#FAF6EF]">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </div>
  );
}
