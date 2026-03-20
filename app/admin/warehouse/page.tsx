'use client';

import { useState, useMemo } from 'react';
import { Plus, Eye, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { DataTable, FilterBar, RightDrawer } from '@/components/shared';
import type { FilterConfig } from '@/components/shared';

const TYPE_COLORS: Record<string, string> = {
  origin: 'bg-blue-100 text-blue-800',
  destination: 'bg-emerald-100 text-emerald-800',
  transit: 'bg-amber-100 text-amber-800',
  fulfillment: 'bg-violet-100 text-violet-800',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-700',
};

const FLAG: Record<string, string> = { US: '🇺🇸', NG: '🇳🇬', GH: '🇬🇭', KE: '🇰🇪', GB: '🇬🇧' };

interface WarehouseRow {
  id: string; name: string; type: string; country: string;
  address: string; managerName: string; capacityM3: number; usedCapacityM3: number;
  isActive: boolean;
}

const mockWarehouses: WarehouseRow[] = [
  { id:'wh1',name:'Atlanta Hub',type:'origin',country:'US',address:'456 Logistics Way, Atlanta, GA',managerName:'Michael Chen',capacityM3:5000,usedCapacityM3:3200,isActive:true },
  { id:'wh2',name:'Lagos HQ Warehouse',type:'destination',country:'NG',address:'15 Industrial Layout, Lagos',managerName:'Tunde Adeyemi',capacityM3:8000,usedCapacityM3:5600,isActive:true },
  { id:'wh3',name:'Accra Transit Hub',type:'transit',country:'GH',address:'Factory Junction, Accra',managerName:'Kwame Asante',capacityM3:3000,usedCapacityM3:1800,isActive:true },
  { id:'wh4',name:'Nairobi Depot',type:'destination',country:'KE',address:'Mombasa Road Industrial, Nairobi',managerName:'Wanjiku Kamau',capacityM3:4000,usedCapacityM3:3800,isActive:true },
  { id:'wh5',name:'London Sorting Center',type:'transit',country:'GB',address:'100 Liverpool Street, London',managerName:'James Smith',capacityM3:2500,usedCapacityM3:1200,isActive:true },
  { id:'wh6',name:'Abuja Mini Hub',type:'fulfillment',country:'NG',address:'Plot 456, Wuse Zone 5, Abuja',managerName:'Amina Sani',capacityM3:1500,usedCapacityM3:450,isActive:false },
];

export default function AdminWarehousePage() {
  const [filters, setFilters] = useState<Record<string,string>>({});
  const [selectedWh, setSelectedWh] = useState<WarehouseRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return mockWarehouses.filter(w => {
      if (filters.country && w.country !== filters.country) return false;
      if (filters.type && w.type !== filters.type) return false;
      if (filters.status && String(w.isActive) !== filters.status) return false;
      return true;
    });
  }, [filters]);

  const filterConfigs: FilterConfig[] = [
    { key:'country', type:'select', label:'Country', options: [{value:'US',label:'US'},{value:'NG',label:'Nigeria'},{value:'GH',label:'Ghana'},{value:'KE',label:'Kenya'},{value:'GB',label:'UK'}] },
    { key:'type', type:'select', label:'Type', options: [{value:'origin',label:'Origin'},{value:'destination',label:'Destination'},{value:'transit',label:'Transit'},{value:'fulfillment',label:'Fulfillment'}] },
    { key:'status', type:'select', label:'Status', options: [{value:'true',label:'Active'},{value:'false',label:'Inactive'}] },
  ];

  const getCapacityColor = (pct: number) => {
    if (pct >= 90) return 'bg-red-500';
    if (pct >= 70) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const columns = [
    { key:'name', label:'Name', sortable:true, render: (w: WarehouseRow) => <span className="text-sm font-medium">{w.name}</span> },
    { key:'type', label:'Type', sortable:true, render: (w: WarehouseRow) => <Badge className={TYPE_COLORS[w.type]}>{w.type}</Badge> },
    { key:'country', label:'Country', render: (w: WarehouseRow) => <span className="text-sm">{FLAG[w.country] || w.country}</span> },
    { key:'address', label:'Address', render: (w: WarehouseRow) => <span className="text-xs text-[var(--muted-text)] truncate max-w-[180px] block">{w.address}</span> },
    { key:'managerName', label:'Manager', render: (w: WarehouseRow) => <span className="text-sm">{w.managerName}</span> },
    {
      key:'capacity', label:'Capacity',
      render: (w: WarehouseRow) => {
        const pct = Math.round((w.usedCapacityM3 / w.capacityM3) * 100);
        return (
          <div className="w-24">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>{pct}%</span>
              <span className="text-[var(--muted-text)]">{w.usedCapacityM3.toLocaleString()}/{w.capacityM3.toLocaleString()}</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${getCapacityColor(pct)}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      },
    },
    { key:'isActive', label:'Status', render: (w: WarehouseRow) => <Badge className={w.isActive ? STATUS_COLORS.active : STATUS_COLORS.inactive}>{w.isActive ? 'Active' : 'Inactive'}</Badge> },
    {
      key:'actions', label:'Actions',
      render: (w: WarehouseRow) => (
        <button className="p-1.5 rounded hover:bg-[var(--terra-pale)] text-gray-700 hover:text-[var(--terra)]" onClick={e => { e.stopPropagation(); setSelectedWh(w); setDrawerOpen(true); }}>
          <Eye size={14} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[var(--ink)]">Warehouses</h1>
          <p className="text-xs text-[var(--muted-text)]">{filtered.length} facilities</p>
        </div>
        <Button className="gap-2 bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white" onClick={() => setAddModalOpen(true)}>
          <Plus size={14} /> Add Warehouse
        </Button>
      </div>

      <FilterBar filters={filterConfigs} onFilterChange={(k,v) => setFilters(f => ({...f,[k]:v}))} onClear={() => setFilters({})} values={filters} />

      <DataTable columns={columns as any} data={filtered as any} onRowClick={(w: any) => { setSelectedWh(w); setDrawerOpen(true); }} pageSize={10} />

      <RightDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Warehouse Details" width={480}>
        {selectedWh && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-semibold">{selectedWh.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={TYPE_COLORS[selectedWh.type]}>{selectedWh.type}</Badge>
                <Badge className={selectedWh.isActive ? STATUS_COLORS.active : STATUS_COLORS.inactive}>{selectedWh.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-[var(--cream)] rounded-lg p-3"><span className="text-xs text-[var(--muted-text)]">Country</span><div>{FLAG[selectedWh.country] || selectedWh.country}</div></div>
              <div className="bg-[var(--cream)] rounded-lg p-3"><span className="text-xs text-[var(--muted-text)]">Manager</span><div>{selectedWh.managerName}</div></div>
              <div className="bg-[var(--cream)] rounded-lg p-3 col-span-2"><span className="text-xs text-[var(--muted-text)]">Address</span><div className="flex items-center gap-1"><MapPin size={12} />{selectedWh.address}</div></div>
            </div>

            <div className="border-t border-[var(--border-warm)] pt-4">
              <h4 className="text-sm font-semibold mb-3">Capacity</h4>
              <div className="bg-[var(--cream)] rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>{selectedWh.usedCapacityM3.toLocaleString()} m³ used</span>
                  <span>{selectedWh.capacityM3.toLocaleString()} m³ total</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${getCapacityColor(Math.round((selectedWh.usedCapacityM3 / selectedWh.capacityM3) * 100))}`} style={{ width: `${Math.round((selectedWh.usedCapacityM3 / selectedWh.capacityM3) * 100)}%` }} />
                </div>
                <div className="text-xs text-[var(--muted-text)] mt-2">{Math.round((selectedWh.usedCapacityM3 / selectedWh.capacityM3) * 100)}% utilized</div>
              </div>
            </div>

            <div className="border-t border-[var(--border-warm)] pt-4">
              <h4 className="text-sm font-semibold mb-3">Operating Hours</h4>
              <div className="space-y-1 text-sm">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                  <div key={d} className="flex justify-between"><span className="text-[var(--muted-text)]">{d}</span><span>08:00 — 18:00</span></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </RightDrawer>

      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Warehouse</DialogTitle>
            <DialogDescription>Register a new warehouse facility.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><label className="text-xs font-semibold">Name</label><Input placeholder="e.g. Lagos Hub" /></div>
            <div><label className="text-xs font-semibold">Type</label>
              <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent><SelectItem value="origin">Origin</SelectItem><SelectItem value="destination">Destination</SelectItem><SelectItem value="transit">Transit</SelectItem><SelectItem value="fulfillment">Fulfillment</SelectItem></SelectContent>
              </Select>
            </div>
            <div><label className="text-xs font-semibold">Country</label>
              <Select><SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent><SelectItem value="US">US</SelectItem><SelectItem value="NG">Nigeria</SelectItem><SelectItem value="GH">Ghana</SelectItem><SelectItem value="KE">Kenya</SelectItem><SelectItem value="GB">UK</SelectItem></SelectContent>
              </Select>
            </div>
            <div><label className="text-xs font-semibold">Address</label><Input placeholder="Full address" /></div>
            <div><label className="text-xs font-semibold">Capacity (m³)</label><Input type="number" placeholder="5000" /></div>
            <div><label className="text-xs font-semibold">Manager Name</label><Input placeholder="Manager name" /></div>
          </div>
          <DialogFooter><Button className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white">Add Warehouse</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
