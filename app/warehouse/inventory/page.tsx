'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
import { StatusBadge } from '@/components/shared';
import {
  Search,
  Eye,
  Move,
  ArrowUpFromLine,
  X,
  AlertTriangle,
} from 'lucide-react';
import type { ShipmentStatus } from '@/types';

interface InventoryItem {
  id: string;
  bin: string;
  tracking: string;
  customer: string;
  destination: string;
  destinationFlag: string;
  type: string;
  weight: string;
  docsStatus: 'complete' | 'pending' | 'missing';
  daysInWarehouse: number;
  status: ShipmentStatus;
}

const mockInventory: InventoryItem[] = [
  { id: '1', bin: 'A-12-3', tracking: 'DS-20260320-A1B2C3', customer: 'John Okafor', destination: 'Nigeria', destinationFlag: '🇳🇬', type: 'parcel', weight: '5.2 kg', docsStatus: 'complete', daysInWarehouse: 1, status: 'at_warehouse' },
  { id: '2', bin: 'A-12-4', tracking: 'DS-20260319-D4E5F6', customer: 'Emeka Nwosu', destination: 'Ghana', destinationFlag: '🇬🇭', type: 'cargo', weight: '12.0 kg', docsStatus: 'pending', daysInWarehouse: 2, status: 'processing' },
  { id: '3', bin: 'B-05-1', tracking: 'DS-20260318-G7H8I9', customer: 'Kwame Asante', destination: 'Kenya', destinationFlag: '🇰🇪', type: 'document', weight: '0.5 kg', docsStatus: 'complete', daysInWarehouse: 3, status: 'customs_cleared' },
  { id: '4', bin: 'B-05-2', tracking: 'DS-20260317-J1K2L3', customer: 'Fatima Bello', destination: 'Nigeria', destinationFlag: '🇳🇬', type: 'fragile', weight: '3.8 kg', docsStatus: 'missing', daysInWarehouse: 4, status: 'customs_pending' },
  { id: '5', bin: 'C-08-2', tracking: 'DS-20260316-M4N5O6', customer: 'Grace Okafor', destination: 'United States', destinationFlag: '🇺🇸', type: 'cold_chain', weight: '8.5 kg', docsStatus: 'complete', daysInWarehouse: 5, status: 'customs_cleared' },
  { id: '6', bin: 'A-13-1', tracking: 'DS-20260315-P7Q8R9', customer: 'Ibrahim Musa', destination: 'Nigeria', destinationFlag: '🇳🇬', type: 'parcel', weight: '2.1 kg', docsStatus: 'complete', daysInWarehouse: 6, status: 'at_warehouse' },
  { id: '7', bin: 'C-09-1', tracking: 'DS-20260314-S1T2U3', customer: 'Chinwe Eze', destination: 'Ghana', destinationFlag: '🇬🇭', type: 'cargo', weight: '45.0 kg', docsStatus: 'pending', daysInWarehouse: 7, status: 'customs_pending' },
  { id: '8', bin: 'D-01-1', tracking: 'DS-20260313-V4W5X6', customer: 'Adebayo Ogundimu', destination: 'Kenya', destinationFlag: '🇰🇪', type: 'parcel', weight: '1.8 kg', docsStatus: 'complete', daysInWarehouse: 8, status: 'processing' },
  { id: '9', bin: 'A-12-3', tracking: 'DS-20260312-Y7Z8A1', customer: 'Wanjiku Kamau', destination: 'Nigeria', destinationFlag: '🇳🇬', type: 'document', weight: '0.3 kg', docsStatus: 'complete', daysInWarehouse: 9, status: 'at_warehouse' },
  { id: '10', bin: 'B-05-1', tracking: 'DS-20260311-B2C3D4', customer: 'Michael Chen', destination: 'United States', destinationFlag: '🇺🇸', type: 'fragile', weight: '7.2 kg', docsStatus: 'missing', daysInWarehouse: 11, status: 'customs_pending' },
  { id: '11', bin: 'A-13-1', tracking: 'DS-20260310-E5F6G7', customer: 'Tunde Adeyemi', destination: 'Nigeria', destinationFlag: '🇳🇬', type: 'cargo', weight: '22.0 kg', docsStatus: 'pending', daysInWarehouse: 12, status: 'processing' },
  { id: '12', bin: 'C-08-2', tracking: 'DS-20260309-H8I9J1', customer: 'Amina Sani', destination: 'Ghana', destinationFlag: '🇬🇭', type: 'parcel', weight: '4.5 kg', docsStatus: 'complete', daysInWarehouse: 13, status: 'customs_cleared' },
  { id: '13', bin: 'D-01-1', tracking: 'DS-20260308-K2L3M4', customer: 'Emeka Nwankwo', destination: 'Kenya', destinationFlag: '🇰🇪', type: 'cold_chain', weight: '15.0 kg', docsStatus: 'complete', daysInWarehouse: 14, status: 'at_warehouse' },
  { id: '14', bin: 'B-05-2', tracking: 'DS-20260307-N5O6P7', customer: 'Kwame Asante', destination: 'Nigeria', destinationFlag: '🇳🇬', type: 'parcel', weight: '3.0 kg', docsStatus: 'pending', daysInWarehouse: 4, status: 'customs_pending' },
  { id: '15', bin: 'A-12-4', tracking: 'DS-20260306-Q8R9S1', customer: 'John Okafor', destination: 'United States', destinationFlag: '🇺🇸', type: 'cargo', weight: '18.5 kg', docsStatus: 'complete', daysInWarehouse: 16, status: 'processing' },
  { id: '16', bin: 'C-09-1', tracking: 'DS-20260305-T2U3V4', customer: 'Grace Okafor', destination: 'Nigeria', destinationFlag: '🇳🇬', type: 'document', weight: '0.4 kg', docsStatus: 'complete', daysInWarehouse: 17, status: 'customs_cleared' },
  { id: '17', bin: 'A-12-3', tracking: 'DS-20260304-W5X6Y7', customer: 'Fatima Bello', destination: 'Ghana', destinationFlag: '🇬🇭', type: 'fragile', weight: '6.1 kg', docsStatus: 'missing', daysInWarehouse: 18, status: 'at_warehouse' },
  { id: '18', bin: 'B-05-1', tracking: 'DS-20260303-Z8A1B2', customer: 'Ibrahim Musa', destination: 'Kenya', destinationFlag: '🇰🇪', type: 'parcel', weight: '2.7 kg', docsStatus: 'complete', daysInWarehouse: 3, status: 'at_warehouse' },
  { id: '19', bin: 'D-01-1', tracking: 'DS-20260302-C3D4E5', customer: 'Chinwe Eze', destination: 'Nigeria', destinationFlag: '🇳🇬', type: 'cargo', weight: '33.0 kg', docsStatus: 'pending', daysInWarehouse: 20, status: 'customs_pending' },
  { id: '20', bin: 'A-13-1', tracking: 'DS-20260301-F6G7H8', customer: 'Adebayo Ogundimu', destination: 'United States', destinationFlag: '🇺🇸', type: 'cold_chain', weight: '10.2 kg', docsStatus: 'complete', daysInWarehouse: 21, status: 'processing' },
];

const typeColors: Record<string, string> = {
  parcel: 'bg-violet-100 text-violet-800',
  cargo: 'bg-amber-100 text-amber-800',
  document: 'bg-blue-100 text-blue-800',
  fragile: 'bg-rose-100 text-rose-800',
  cold_chain: 'bg-teal-100 text-teal-800',
};

const docsStatusConfig: Record<string, { label: string; bg: string; text: string }> = {
  complete: { label: 'Complete', bg: 'bg-green-100', text: 'text-green-800' },
  pending: { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-800' },
  missing: { label: 'Missing', bg: 'bg-red-100', text: 'text-red-800' },
};

function daysBg(days: number) {
  if (days > 10) return 'bg-red-100 text-red-800';
  if (days > 5) return 'bg-amber-100 text-amber-800';
  return 'bg-[#FAF6EF] text-[#1A1208]';
}

const PAGE_SIZE = 10;

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [docsFilter, setDocsFilter] = useState('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    return mockInventory.filter((item) => {
      if (search) {
        const q = search.toLowerCase();
        if (!item.tracking.toLowerCase().includes(q) && !item.customer.toLowerCase().includes(q)) return false;
      }
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (docsFilter !== 'all' && item.docsStatus !== docsFilter) return false;
      return true;
    });
  }, [search, statusFilter, docsFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (paged.every((item) => selected.has(item.id))) {
      setSelected((prev) => {
        const next = new Set(prev);
        paged.forEach((item) => next.delete(item.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        paged.forEach((item) => next.add(item.id));
        return next;
      });
    }
  }

  const selectedItems = mockInventory.filter((item) => selected.has(item.id));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-700 block mb-1.5">Warehouse</label>
          <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
            <SelectTrigger className="w-44 h-9 bg-white border-[#E8DDD0] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Warehouses</SelectItem>
              <SelectItem value="atlanta">Atlanta Hub</SelectItem>
              <SelectItem value="lagos">Lagos Hub</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-700 block mb-1.5">Status</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44 h-9 bg-white border-[#E8DDD0] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="at_warehouse">At Warehouse</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="customs_pending">Customs Pending</SelectItem>
              <SelectItem value="customs_cleared">Customs Cleared</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-700 block mb-1.5">Docs Status</label>
          <Select value={docsFilter} onValueChange={setDocsFilter}>
            <SelectTrigger className="w-44 h-9 bg-white border-[#E8DDD0] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="complete">Complete</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="missing">Missing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-700 block mb-1.5">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-700" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Tracking or customer..."
              className="h-9 pl-9 bg-white border-[#E8DDD0] text-sm"
            />
          </div>
        </div>
        {(search || statusFilter !== 'all' || docsFilter !== 'all') && (
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('all');
              setDocsFilter('all');
              setPage(0);
            }}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#C4622D] pb-0.5"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      <Card className="border-[#E8DDD0] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-[1.5px] border-[#E8DDD0]">
                <th className="p-3 text-left">
                  <input
                    type="checkbox"
                    checked={paged.length > 0 && paged.every((item) => selected.has(item.id))}
                    onChange={toggleSelectAll}
                    className="rounded border-[#E8DDD0]"
                  />
                </th>
                <th className="p-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-700">Bin</th>
                <th className="p-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-700">Tracking</th>
                <th className="p-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-700">Customer</th>
                <th className="p-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-700">Destination</th>
                <th className="p-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-700">Type</th>
                <th className="p-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-700">Weight</th>
                <th className="p-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-700">Docs</th>
                <th className="p-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-700">Days</th>
                <th className="p-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((item) => {
                const dc = docsStatusConfig[item.docsStatus];
                return (
                  <tr key={item.id} className="border-b border-[#E8DDD0] last:border-0 hover:bg-[#FAF6EF]/50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selected.has(item.id)}
                        onChange={() => toggleSelect(item.id)}
                        className="rounded border-[#E8DDD0]"
                      />
                    </td>
                    <td className="p-3 font-mono text-sm font-medium text-[#1A1208]">{item.bin}</td>
                    <td className="p-3 font-mono text-sm text-[#7C3AED] font-medium">{item.tracking}</td>
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
                    <td className="p-3 text-[#1A1208]">{item.weight}</td>
                    <td className="p-3">
                      <Badge className={`text-[10px] px-1.5 py-0 ${dc.bg} ${dc.text}`}>{dc.label}</Badge>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center justify-center text-xs font-semibold px-2 py-0.5 rounded-full min-w-[32px] ${daysBg(item.daysInWarehouse)}`}>
                        {item.daysInWarehouse}d
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-700 hover:text-[#1A1208] hover:bg-[#FAF6EF]">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-700 hover:text-[#1A1208] hover:bg-[#FAF6EF]">
                          <Move className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#7C3AED] hover:text-[#6D28D9] hover:bg-violet-50">
                          <ArrowUpFromLine className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#E8DDD0]">
            <span className="text-xs text-gray-700">
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 border-[#E8DDD0]"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 border-[#E8DDD0]"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {selected.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 md:left-[240px] bg-[#1A1208] text-white px-6 py-4 flex items-center justify-between z-50 shadow-2xl">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium">{selected.size} item{selected.size > 1 ? 's' : ''} selected</span>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white h-9 rounded-lg gap-1.5">
              <ArrowUpFromLine className="h-4 w-4" /> Batch Dispatch
            </Button>
            <Button size="sm" variant="outline" className="border-amber-500 text-amber-400 hover:bg-amber-500/10 h-9 rounded-lg gap-1.5">
              <AlertTriangle className="h-4 w-4" /> Flag for Customs
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/10 h-9 rounded-lg"
              onClick={() => setSelected(new Set())}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
