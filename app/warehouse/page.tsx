'use client';

import { KpiCard } from '@/components/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  AlertTriangle,
  FileWarning,
  ChevronRight,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

const warehouses = [
  { name: 'Atlanta Hub', country: 'US', usedM3: 780, totalM3: 1000, percent: 78 },
  { name: 'Lagos Hub', country: 'NG', usedM3: 460, totalM3: 500, percent: 92 },
];

const receivedToday = [
  { tracking: 'DS-20260320-A1B2C3', time: '09:15 AM', type: 'parcel' },
  { tracking: 'DS-20260320-D4E5F6', time: '09:42 AM', type: 'cargo' },
  { tracking: 'DS-20260320-G7H8I9', time: '10:08 AM', type: 'document' },
  { tracking: 'DS-20260320-J1K2L3', time: '10:35 AM', type: 'fragile' },
  { tracking: 'DS-20260320-M4N5O6', time: '11:02 AM', type: 'parcel' },
];

const dispatchedToday = [
  { tracking: 'DS-20260319-P7Q8R9', time: '08:30 AM', type: 'parcel' },
  { tracking: 'DS-20260319-S1T2U3', time: '09:00 AM', type: 'cargo' },
  { tracking: 'DS-20260319-V4W5X6', time: '09:45 AM', type: 'cold_chain' },
  { tracking: 'DS-20260319-Y7Z8A1', time: '10:15 AM', type: 'parcel' },
  { tracking: 'DS-20260319-B2C3D4', time: '10:50 AM', type: 'fragile' },
];

const typeColors: Record<string, string> = {
  parcel: 'bg-violet-100 text-violet-800',
  cargo: 'bg-amber-100 text-amber-800',
  document: 'bg-blue-100 text-blue-800',
  fragile: 'bg-rose-100 text-rose-800',
  cold_chain: 'bg-teal-100 text-teal-800',
};

const flagMap: Record<string, string> = { US: '🇺🇸', NG: '🇳🇬' };

function getCapacityColor(percent: number) {
  if (percent >= 90) return 'bg-red-500';
  if (percent >= 70) return 'bg-amber-500';
  return 'bg-green-500';
}

function CapacityGauge({ warehouse }: { warehouse: typeof warehouses[number] }) {
  return (
    <div className="flex-1 min-w-[280px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{flagMap[warehouse.country]}</span>
          <span className="font-semibold text-[#1A1208]">{warehouse.name}</span>
        </div>
        <span className="text-sm font-medium text-[#1A1208]">{warehouse.percent}%</span>
      </div>
      <div className="w-full h-4 rounded-full bg-[#F5EBE0] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${getCapacityColor(warehouse.percent)}`}
          style={{ width: `${warehouse.percent}%` }}
        />
      </div>
      <p className="text-xs text-[#8C7B6B] mt-1">{warehouse.usedM3} / {warehouse.totalM3} m³</p>
    </div>
  );
}

function ActivityList({ title, items }: { title: string; items: typeof receivedToday }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[#1A1208] mb-3">{title}</h3>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[#FAF6EF] transition-colors">
            <div className="flex items-center gap-3">
              <Clock className="h-3.5 w-3.5 text-[#8C7B6B]" />
              <span className="font-mono text-sm text-[#1A1208]">{item.tracking}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`text-[10px] px-1.5 py-0 ${typeColors[item.type] || 'bg-gray-100 text-gray-700'}`}>{item.type.replace('_', ' ')}</Badge>
              <span className="text-xs text-[#8C7B6B] w-16 text-right">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WarehouseDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={<Package className="h-5 w-5" />} label="Items in storage" value="1,247" variant="ink" />
        <KpiCard icon={<ArrowDownToLine className="h-5 w-5" />} label="Receiving today" value="43" variant="terra" />
        <KpiCard icon={<ArrowUpFromLine className="h-5 w-5" />} label="Dispatching today" value="38" variant="gold" />
        <KpiCard icon={<Boxes className="h-5 w-5" />} label="Capacity used" value="78%" trend="+2%" variant="terra" />
      </div>

      <Card className="border-[#E8DDD0] bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1A1208]">Warehouse Capacity</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-8">
          {warehouses.map((wh) => (
            <CapacityGauge key={wh.name} warehouse={wh} />
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-[#E8DDD0] bg-white">
          <CardContent className="p-5">
            <ActivityList title="Received Today" items={receivedToday} />
          </CardContent>
        </Card>
        <Card className="border-[#E8DDD0] bg-white">
          <CardContent className="p-5">
            <ActivityList title="Dispatched Today" items={dispatchedToday} />
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#E8DDD0] bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1A1208]">Pending Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/warehouse/dispatch" className="flex items-center justify-between p-4 rounded-xl border border-[#E8DDD0] hover:border-violet-300 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-violet-50 flex items-center justify-center">
                <ArrowUpFromLine className="h-5 w-5 text-[#7C3AED]" />
              </div>
              <div>
                <p className="font-medium text-sm text-[#1A1208]">Items awaiting dispatch</p>
                <p className="text-xs text-[#8C7B6B]">Ready for outbound processing</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#7C3AED]">12</span>
              <ChevronRight className="h-4 w-4 text-[#8C7B6B] group-hover:text-[#7C3AED] transition-colors" />
            </div>
          </Link>
          <div className="flex items-center justify-between p-4 rounded-xl border border-amber-200 bg-amber-50/40">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <FileWarning className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-sm text-[#1A1208]">Items with missing customs docs</p>
                <p className="text-xs text-[#8C7B6B]">Requires document upload before dispatch</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-2xl font-bold text-amber-600">3</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
