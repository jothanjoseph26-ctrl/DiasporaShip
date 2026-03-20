'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Printer,
  CheckCircle2,
  Package,
} from 'lucide-react';

interface DispatchItem {
  id: string;
  tracking: string;
  customer: string;
  destination: string;
  destinationFlag: string;
  type: string;
  weight: number;
  daysInWarehouse: number;
}

const mockDispatchItems: DispatchItem[] = [
  { id: '1', tracking: 'DS-20260318-A1B2C3', customer: 'John Okafor', destination: 'Nigeria', destinationFlag: '🇳🇬', type: 'parcel', weight: 5.2, daysInWarehouse: 3 },
  { id: '2', tracking: 'DS-20260317-D4E5F6', customer: 'Emeka Nwosu', destination: 'Ghana', destinationFlag: '🇬🇭', type: 'cargo', weight: 12.0, daysInWarehouse: 4 },
  { id: '3', tracking: 'DS-20260316-G7H8I9', customer: 'Kwame Asante', destination: 'Kenya', destinationFlag: '🇰🇪', type: 'document', weight: 0.5, daysInWarehouse: 5 },
  { id: '4', tracking: 'DS-20260315-J1K2L3', customer: 'Fatima Bello', destination: 'Nigeria', destinationFlag: '🇳🇬', type: 'fragile', weight: 3.8, daysInWarehouse: 6 },
  { id: '5', tracking: 'DS-20260314-M4N5O6', customer: 'Grace Okafor', destination: 'United States', destinationFlag: '🇺🇸', type: 'cold_chain', weight: 8.5, daysInWarehouse: 7 },
  { id: '6', tracking: 'DS-20260313-P7Q8R9', customer: 'Ibrahim Musa', destination: 'Nigeria', destinationFlag: '🇳🇬', type: 'parcel', weight: 2.1, daysInWarehouse: 8 },
  { id: '7', tracking: 'DS-20260312-S1T2U3', customer: 'Chinwe Eze', destination: 'Ghana', destinationFlag: '🇬🇭', type: 'cargo', weight: 45.0, daysInWarehouse: 9 },
  { id: '8', tracking: 'DS-20260311-V4W5X6', customer: 'Adebayo Ogundimu', destination: 'Kenya', destinationFlag: '🇰🇪', type: 'parcel', weight: 1.8, daysInWarehouse: 10 },
  { id: '9', tracking: 'DS-20260310-Y7Z8A1', customer: 'Wanjiku Kamau', destination: 'Nigeria', destinationFlag: '🇳🇬', type: 'document', weight: 0.3, daysInWarehouse: 11 },
  { id: '10', tracking: 'DS-20260309-B2C3D4', customer: 'Michael Chen', destination: 'United States', destinationFlag: '🇺🇸', type: 'fragile', weight: 7.2, daysInWarehouse: 12 },
  { id: '11', tracking: 'DS-20260308-E5F6G7', customer: 'Tunde Adeyemi', destination: 'Nigeria', destinationFlag: '🇳🇬', type: 'cargo', weight: 22.0, daysInWarehouse: 13 },
  { id: '12', tracking: 'DS-20260307-H8I9J1', customer: 'Amina Sani', destination: 'Ghana', destinationFlag: '🇬🇭', type: 'parcel', weight: 4.5, daysInWarehouse: 14 },
];

const typeColors: Record<string, string> = {
  parcel: 'bg-violet-100 text-violet-800',
  cargo: 'bg-amber-100 text-amber-800',
  document: 'bg-blue-100 text-blue-800',
  fragile: 'bg-rose-100 text-rose-800',
  cold_chain: 'bg-teal-100 text-teal-800',
};

const vehicles = [
  { id: 'v1', label: 'Van — LG-284-KJA (Adebayo)' },
  { id: 'v2', label: 'Truck — AB-112-RSH (Chinwe)' },
  { id: 'v3', label: 'Truck — PH-778-RVS (Ibrahim)' },
];

export default function DispatchPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [vehicle, setVehicle] = useState('');
  const [carrier, setCarrier] = useState('');

  const selectedItems = mockDispatchItems.filter((item) => selected.has(item.id));
  const totalWeight = selectedItems.reduce((sum, item) => sum + item.weight, 0);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (mockDispatchItems.every((item) => selected.has(item.id))) {
      setSelected(new Set());
    } else {
      setSelected(new Set(mockDispatchItems.map((item) => item.id)));
    }
  }

  function handleDispatch() {
    setSelected(new Set());
    setVehicle('');
    setCarrier('');
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-w-0">
        <Card className="border-[#E8DDD0] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-[1.5px] border-[#E8DDD0]">
                  <th className="p-3 text-left">
                    <input
                      type="checkbox"
                      checked={mockDispatchItems.every((item) => selected.has(item.id))}
                      onChange={toggleSelectAll}
                      className="rounded border-[#E8DDD0]"
                    />
                  </th>
                  <th className="p-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8C7B6B]">Tracking</th>
                  <th className="p-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8C7B6B]">Customer</th>
                  <th className="p-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8C7B6B]">Destination</th>
                  <th className="p-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8C7B6B]">Type</th>
                  <th className="p-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8C7B6B]">Weight</th>
                  <th className="p-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8C7B6B]">Days</th>
                </tr>
              </thead>
              <tbody>
                {mockDispatchItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-b border-[#E8DDD0] last:border-0 cursor-pointer hover:bg-[#FAF6EF]/50 ${selected.has(item.id) ? 'bg-violet-50/50' : ''}`}
                    onClick={() => toggleSelect(item.id)}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selected.has(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="rounded border-[#E8DDD0]"
                      />
                    </td>
                    <td className="p-3 font-mono text-sm font-medium text-[#7C3AED]">{item.tracking}</td>
                    <td className="p-3 text-[#1A1208]">{item.customer}</td>
                    <td className="p-3">
                      <span className="flex items-center gap-1.5">
                        <span>{item.destinationFlag}</span>
                        <span className="text-[#1A1208]">{item.destination}</span>
                      </span>
                    </td>
                    <td className="p-3">
                      <Badge className={`text-[10px] px-1.5 py-0 ${typeColors[item.type]}`}>{item.type.replace('_', ' ')}</Badge>
                    </td>
                    <td className="p-3 text-[#1A1208]">{item.weight} kg</td>
                    <td className="p-3 text-[#1A1208]">{item.daysInWarehouse}d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="lg:w-80 lg:sticky lg:top-6 self-start">
        <Card className="border-[#E8DDD0] bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#1A1208]">Dispatch Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-[#E8DDD0]">
              <span className="text-sm text-[#8C7B6B]">Selected</span>
              <span className="text-lg font-bold text-[#1A1208]">{selected.size} items</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#E8DDD0]">
              <span className="text-sm text-[#8C7B6B]">Total weight</span>
              <span className="text-lg font-bold text-[#1A1208]">{totalWeight.toFixed(1)} kg</span>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#8C7B6B] block mb-1.5">Vehicle</label>
              <Select value={vehicle} onValueChange={setVehicle}>
                <SelectTrigger className="w-full bg-[#FAF6EF] border-[#E8DDD0]">
                  <SelectValue placeholder="Select vehicle..." />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#8C7B6B] block mb-1.5">Carrier (international handoff)</label>
              <Input
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="e.g. DHL, FedEx"
                className="bg-[#FAF6EF] border-[#E8DDD0]"
              />
            </div>

            <Button
              variant="outline"
              className="w-full h-11 gap-2 rounded-xl border-[#E8DDD0] text-[#1A1208] hover:bg-[#FAF6EF]"
              disabled={selected.size === 0}
            >
              <Printer className="h-4 w-4" />
              Print Manifest
            </Button>

            <Button
              onClick={handleDispatch}
              className="w-full h-12 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-base font-semibold gap-2"
              disabled={selected.size === 0}
            >
              <CheckCircle2 className="h-5 w-5" />
              Confirm Dispatch
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
