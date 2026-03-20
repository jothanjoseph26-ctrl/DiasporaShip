'use client';

import { useState, useMemo } from 'react';
import { Plus, Eye, AlertTriangle, Truck, Wrench } from 'lucide-react';
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
import type { Vehicle } from '@/types';
import { formatDate } from '@/lib/utils';

const TYPE_COLORS: Record<string, string> = {
  van: 'bg-blue-100 text-blue-800',
  truck: 'bg-amber-100 text-amber-800',
  motorcycle: 'bg-emerald-100 text-emerald-800',
  car: 'bg-gray-100 text-gray-800',
  container_truck: 'bg-violet-100 text-violet-800',
};

const STATUS_COLORS: Record<string, string> = {
  available: 'bg-green-100 text-green-800',
  on_trip: 'bg-blue-100 text-blue-800',
  maintenance: 'bg-amber-100 text-amber-800',
  inactive: 'bg-gray-100 text-gray-700',
};

const FLAG: Record<string, string> = { US: '🇺🇸', NG: '🇳🇬', GH: '🇬🇭', KE: '🇰🇪', GB: '🇬🇧' };

const mockVehicles: Vehicle[] = [
  { id:'v1',plateNumber:'LG-284-KJA',type:'van',make:'Mercedes',model:'Sprinter',year:2023,capacityKg:1500,capacityVolumeM3:12,country:'NG',currentDriverId:'d1',currentDriverName:'Adebayo Ogundimu',status:'on_trip',lastLat:6.4541,lastLng:3.3947 },
  { id:'v2',plateNumber:'AB-112-RSH',type:'truck',make:'Isuzu',model:'NPR',year:2022,capacityKg:4000,capacityVolumeM3:25,country:'NG',currentDriverId:'d2',currentDriverName:'Chinwe Eze',status:'available',lastLat:9.0579,lastLng:7.4951 },
  { id:'v3',plateNumber:'LG-931-EPE',type:'motorcycle',make:'Honda',model:'Click 125i',year:2024,capacityKg:50,capacityVolumeM3:0.5,country:'NG',currentDriverId:'d3',currentDriverName:'Emeka Nwosu',status:'available',lastLat:6.4316,lastLng:3.4236 },
  { id:'v4',plateNumber:'KN-445-BUK',type:'van',make:'Ford',model:'Transit',year:2021,capacityKg:1200,capacityVolumeM3:10,country:'NG',currentDriverId:'d4',currentDriverName:'Fatima Bello',status:'maintenance',lastLat:12.0022,lastLng:8.5920 },
  { id:'v5',plateNumber:'PH-778-RVS',type:'truck',make:'Hino',model:'300',year:2023,capacityKg:5000,capacityVolumeM3:30,country:'NG',currentDriverId:'d5',currentDriverName:'Ibrahim Musa',status:'on_trip',lastLat:4.7777,lastLng:7.0134 },
  { id:'v6',plateNumber:'LG-556-VIC',type:'van',make:'Toyota',model:'Hiace',year:2020,capacityKg:1000,capacityVolumeM3:8,country:'NG',currentDriverId:'d6',currentDriverName:'Grace Okafor',status:'inactive',lastLat:6.4541,lastLng:3.3947 },
  { id:'v7',plateNumber:'US-452-ATL',type:'truck',make:'Freightliner',model:'M2',year:2022,capacityKg:6000,capacityVolumeM3:35,country:'US',status:'available',lastLat:33.749,lastLng:-84.388 },
  { id:'v8',plateNumber:'GH-888-ACC',type:'van',make:'Toyota',model:'Hiace',year:2021,capacityKg:1100,capacityVolumeM3:9,country:'GH',currentDriverId:'d11',currentDriverName:'Kwame Asante',status:'on_trip' },
  { id:'v9',plateNumber:'KE-777-NRB',type:'car',make:'Toyota',model:'Corolla',year:2023,capacityKg:200,capacityVolumeM3:2,country:'KE',currentDriverId:'d12',currentDriverName:'Wanjiku Kamau',status:'available' },
  { id:'v10',plateNumber:'LG-999-OKT',type:'container_truck',make:'Volvo',model:'FH16',year:2022,capacityKg:25000,capacityVolumeM3:80,country:'NG',status:'available' },
  { id:'v11',plateNumber:'AB-555-JOS',type:'motorcycle',make:'Bajaj',model:'Boxer 150',year:2024,capacityKg:40,capacityVolumeM3:0.3,country:'NG',currentDriverId:'d7',currentDriverName:'Samuel Okonkwo',status:'on_trip' },
  { id:'v12',plateNumber:'US-333-JFK',type:'van',make:'Ford',model:'E-Transit',year:2024,capacityKg:1600,capacityVolumeM3:13,country:'US',status:'available' },
];

const insuranceExpiry: Record<string, string> = {
  v1: '2026-09-15', v2: '2026-08-20', v3: '2027-01-10', v4: '2026-03-25',
  v5: '2026-12-01', v6: '2026-04-10', v7: '2026-11-30', v8: '2026-07-15',
  v9: '2027-02-20', v10: '2026-06-01', v11: '2027-03-05', v12: '2026-10-15',
};

export default function AdminVehiclesPage() {
  const [filters, setFilters] = useState<Record<string,string>>({});
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return mockVehicles.filter(v => {
      if (filters.country && v.country !== filters.country) return false;
      if (filters.type && v.type !== filters.type) return false;
      if (filters.status && v.status !== filters.status) return false;
      if (filters.assigned === 'true' && !v.currentDriverId) return false;
      if (filters.assigned === 'false' && v.currentDriverId) return false;
      return true;
    });
  }, [filters]);

  const filterConfigs: FilterConfig[] = [
    { key:'country', type:'select', label:'Country', options: [{value:'US',label:'US'},{value:'NG',label:'Nigeria'},{value:'GH',label:'Ghana'},{value:'KE',label:'Kenya'}] },
    { key:'type', type:'select', label:'Type', options: [{value:'van',label:'Van'},{value:'truck',label:'Truck'},{value:'motorcycle',label:'Motorcycle'},{value:'car',label:'Car'},{value:'container_truck',label:'Container Truck'}] },
    { key:'status', type:'select', label:'Status', options: [{value:'available',label:'Available'},{value:'on_trip',label:'On Trip'},{value:'maintenance',label:'Maintenance'},{value:'inactive',label:'Inactive'}] },
    { key:'assigned', type:'select', label:'Driver', options: [{value:'true',label:'Assigned'},{value:'false',label:'Unassigned'}] },
  ];

  const isInsuranceExpiringSoon = (plate: string) => {
    const exp = insuranceExpiry[Object.keys(insuranceExpiry).find(k => mockVehicles.find(v => v.id === k)?.plateNumber === plate) || ''];
    if (!exp) return false;
    return new Date(exp).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000;
  };

  const columns = [
    {
      key:'plateNumber', label:'Plate', sortable:true,
      render: (v: Vehicle) => <span className="font-mono text-xs font-semibold">{v.plateNumber}</span>,
    },
    {
      key:'type', label:'Type', sortable:true,
      render: (v: Vehicle) => <Badge className={TYPE_COLORS[v.type]}>{v.type.replace('_',' ')}</Badge>,
    },
    {
      key:'make', label:'Make / Model',
      render: (v: Vehicle) => <span className="text-sm">{v.make} {v.model} ({v.year})</span>,
    },
    { key:'capacityKg', label:'Capacity', sortable:true, render: (v: Vehicle) => <span className="text-sm">{v.capacityKg.toLocaleString()} kg</span> },
    { key:'country', label:'Country', render: (v: Vehicle) => <span className="text-sm">{FLAG[v.country] || v.country}</span> },
    { key:'currentDriverName', label:'Driver', render: (v: Vehicle) => <span className="text-sm">{v.currentDriverName || '—'}</span> },
    {
      key:'status', label:'Status',
      render: (v: Vehicle) => <Badge className={STATUS_COLORS[v.status]}>{v.status.replace('_',' ')}</Badge>,
    },
    {
      key:'insurance', label:'Insurance',
      render: (v: Vehicle) => {
        const exp = insuranceExpiry[v.id];
        const soon = isInsuranceExpiringSoon(v.plateNumber);
        return <span className={`text-xs ${soon ? 'text-red-600 font-semibold' : 'text-[var(--muted-text)]'}`}>{exp || '—'} {soon && <AlertTriangle size={10} className="inline" />}</span>;
      },
    },
    {
      key:'lastGpsAt', label:'GPS',
      render: (v: Vehicle) => <span className="text-xs text-[var(--muted-text)]">{v.lastLat ? `${v.lastLat.toFixed(2)}, ${v.lastLng?.toFixed(2)}` : '—'}</span>,
    },
    {
      key:'actions', label:'Actions',
      render: (v: Vehicle) => (
        <button className="p-1.5 rounded hover:bg-[var(--terra-pale)] text-gray-700 hover:text-[var(--terra)]" onClick={e => { e.stopPropagation(); setSelectedVehicle(v); setDrawerOpen(true); }}>
          <Eye size={14} />
        </button>
      ),
    },
  ];

  const maintenanceLog = [
    { date:'2026-03-10', type:'Oil Change', cost:'$45', mechanic:'AutoFix Lagos' },
    { date:'2026-02-15', type:'Tire Rotation', cost:'$30', mechanic:'AutoFix Lagos' },
    { date:'2026-01-20', type:'Brake Inspection', cost:'$120', mechanic:'AutoFix Lagos' },
  ];

  const tripHistory = [
    { date:'Mar 18', route:'Lagos HQ → Lekki', driver:'Adebayo O.', duration:'45 min' },
    { date:'Mar 17', route:'Lagos HQ → VI', driver:'Adebayo O.', duration:'1h 10min' },
    { date:'Mar 16', route:'Lagos HQ → Ikeja', driver:'Adebayo O.', duration:'30 min' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[var(--ink)]">Fleet Management</h1>
          <p className="text-xs text-[var(--muted-text)]">{filtered.length} vehicles</p>
        </div>
        <Button className="gap-2 bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white" onClick={() => setAddModalOpen(true)}>
          <Plus size={14} /> Add Vehicle
        </Button>
      </div>

      <FilterBar filters={filterConfigs} onFilterChange={(k,v) => setFilters(f => ({...f,[k]:v}))} onClear={() => setFilters({})} values={filters} />

      <DataTable columns={columns as any} data={filtered as any} onRowClick={(v: any) => { setSelectedVehicle(v); setDrawerOpen(true); }} pageSize={10} />

      <RightDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Vehicle Details" width={480}>
        {selectedVehicle && (
          <div className="space-y-5">
            <div>
              <span className="font-mono text-lg font-bold">{selectedVehicle.plateNumber}</span>
              <Badge className={`ml-2 ${STATUS_COLORS[selectedVehicle.status]}`}>{selectedVehicle.status.replace('_',' ')}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-[var(--cream)] rounded-lg p-3"><span className="text-xs text-[var(--muted-text)]">Type</span><div className="capitalize">{selectedVehicle.type.replace('_',' ')}</div></div>
              <div className="bg-[var(--cream)] rounded-lg p-3"><span className="text-xs text-[var(--muted-text)]">Country</span><div>{FLAG[selectedVehicle.country] || selectedVehicle.country}</div></div>
              <div className="bg-[var(--cream)] rounded-lg p-3"><span className="text-xs text-[var(--muted-text)]">Make / Model</span><div>{selectedVehicle.make} {selectedVehicle.model}</div></div>
              <div className="bg-[var(--cream)] rounded-lg p-3"><span className="text-xs text-[var(--muted-text)]">Year</span><div>{selectedVehicle.year}</div></div>
              <div className="bg-[var(--cream)] rounded-lg p-3"><span className="text-xs text-[var(--muted-text)]">Capacity</span><div>{selectedVehicle.capacityKg.toLocaleString()} kg / {selectedVehicle.capacityVolumeM3} m³</div></div>
              <div className="bg-[var(--cream)] rounded-lg p-3"><span className="text-xs text-[var(--muted-text)]">Driver</span><div>{selectedVehicle.currentDriverName || 'Unassigned'}</div></div>
            </div>

            <div className="border-t border-[var(--border-warm)] pt-4">
              <h4 className="text-sm font-semibold mb-3">Insurance</h4>
              <div className={`rounded-lg p-3 ${isInsuranceExpiringSoon(selectedVehicle.plateNumber) ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                <div className="text-sm font-medium">Expires: {insuranceExpiry[selectedVehicle.id] || 'N/A'}</div>
                {isInsuranceExpiringSoon(selectedVehicle.plateNumber) && <div className="text-xs mt-1 flex items-center gap-1"><AlertTriangle size={10} /> Expiring within 30 days</div>}
              </div>
            </div>

            <div className="border-t border-[var(--border-warm)] pt-4">
              <h4 className="text-sm font-semibold mb-3">Maintenance Log</h4>
              <div className="space-y-2">
                {maintenanceLog.map((m,i) => (
                  <div key={i} className="flex items-center justify-between bg-[var(--cream)] rounded-lg p-3 text-sm">
                    <div><div className="font-medium">{m.type}</div><div className="text-xs text-[var(--muted-text)]">{m.date} · {m.mechanic}</div></div>
                    <span className="font-medium">{m.cost}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[var(--border-warm)] pt-4">
              <h4 className="text-sm font-semibold mb-3">Trip History</h4>
              <div className="space-y-2">
                {tripHistory.map((t,i) => (
                  <div key={i} className="flex items-center justify-between bg-[var(--cream)] rounded-lg p-3 text-sm">
                    <div><div className="font-medium">{t.route}</div><div className="text-xs text-[var(--muted-text)]">{t.date} · {t.driver}</div></div>
                    <span className="text-xs text-[var(--muted-text)]">{t.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </RightDrawer>

      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Vehicle</DialogTitle>
            <DialogDescription>Register a new vehicle in the fleet.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><label className="text-xs font-semibold">Plate Number</label><Input placeholder="e.g. LG-000-XYZ" /></div>
            <div><label className="text-xs font-semibold">Type</label>
              <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent><SelectItem value="van">Van</SelectItem><SelectItem value="truck">Truck</SelectItem><SelectItem value="motorcycle">Motorcycle</SelectItem><SelectItem value="car">Car</SelectItem><SelectItem value="container_truck">Container Truck</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-semibold">Make</label><Input placeholder="e.g. Toyota" /></div>
              <div><label className="text-xs font-semibold">Model</label><Input placeholder="e.g. Hiace" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-semibold">Year</label><Input type="number" placeholder="2024" /></div>
              <div><label className="text-xs font-semibold">Capacity (kg)</label><Input type="number" placeholder="1500" /></div>
            </div>
            <div><label className="text-xs font-semibold">Country</label>
              <Select><SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent><SelectItem value="US">US</SelectItem><SelectItem value="NG">Nigeria</SelectItem><SelectItem value="GH">Ghana</SelectItem><SelectItem value="KE">Kenya</SelectItem></SelectContent>
              </Select>
            </div>
            <div><label className="text-xs font-semibold">Insurance Document</label>
              <div className="border-2 border-dashed border-[var(--border-warm)] rounded-lg p-4 text-center text-sm text-[var(--muted-text)]">Upload insurance document</div>
            </div>
            <div><label className="text-xs font-semibold">Road Worthiness Certificate</label>
              <div className="border-2 border-dashed border-[var(--border-warm)] rounded-lg p-4 text-center text-sm text-[var(--muted-text)]">Upload road worthiness certificate</div>
            </div>
          </div>
          <DialogFooter><Button className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white">Add Vehicle</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
