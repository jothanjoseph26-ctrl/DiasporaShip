'use client';

import { useState, useMemo } from 'react';
import { Eye, Star, Truck, AlertTriangle, UserMinus, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable, FilterBar, RightDrawer } from '@/components/shared';
import type { FilterConfig } from '@/components/shared';
import type { Driver } from '@/types';
import { formatCurrency } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  available: 'bg-green-100 text-green-800',
  offline: 'bg-gray-100 text-gray-700',
  on_pickup: 'bg-blue-100 text-blue-800',
  on_delivery: 'bg-blue-100 text-blue-800',
  on_break: 'bg-amber-100 text-amber-800',
};

const mockDrivers: Driver[] = [
  { id:'d1',userId:'d1',name:'Adebayo Ogundimu',avatar:'AO',phone:'+2348012345678',licenseNumber:'DL-284-ABC',licenseExpiry:'2027-05-15',vehicleType:'Van',currentVehiclePlate:'LG-284-KJA',isOnline:true,isAvailable:false,status:'on_delivery',totalDeliveries:847,onTimeRate:94.5,rating:4.8,earningsBalance:125000,branchId:'b1',branchName:'Lagos HQ',activeShipments:3,completedToday:7 },
  { id:'d2',userId:'d2',name:'Chinwe Eze',avatar:'CE',phone:'+2348023456789',licenseNumber:'DL-112-DEF',licenseExpiry:'2026-08-20',vehicleType:'Truck',currentVehiclePlate:'AB-112-RSH',isOnline:true,isAvailable:true,status:'available',totalDeliveries:562,onTimeRate:97.2,rating:4.9,earningsBalance:89000,branchId:'b2',branchName:'Abuja Branch',activeShipments:2,completedToday:5 },
  { id:'d3',userId:'d3',name:'Emeka Nwosu',avatar:'EN',phone:'+2348034567890',licenseNumber:'DL-931-GHI',licenseExpiry:'2027-02-10',vehicleType:'Motorcycle',currentVehiclePlate:'LG-931-EPE',isOnline:true,isAvailable:true,status:'available',totalDeliveries:1243,onTimeRate:98.1,rating:4.7,earningsBalance:156000,branchId:'b1',branchName:'Lagos HQ',activeShipments:0,completedToday:11 },
  { id:'d4',userId:'d4',name:'Fatima Bello',avatar:'FB',phone:'+2348045678901',licenseNumber:'DL-445-JKL',licenseExpiry:'2026-12-01',vehicleType:'Van',currentVehiclePlate:'KN-445-BUK',isOnline:true,isAvailable:false,status:'on_break',totalDeliveries:312,onTimeRate:92.8,rating:4.6,earningsBalance:45000,branchId:'b3',branchName:'Kano Branch',activeShipments:0,completedToday:4 },
  { id:'d5',userId:'d5',name:'Ibrahim Musa',avatar:'IM',phone:'+2348056789012',licenseNumber:'DL-778-MNO',licenseExpiry:'2027-09-30',vehicleType:'Truck',currentVehiclePlate:'PH-778-RVS',isOnline:true,isAvailable:true,status:'available',totalDeliveries:489,onTimeRate:95.6,rating:4.5,earningsBalance:67000,branchId:'b4',branchName:'Port Harcourt Branch',activeShipments:1,completedToday:3 },
  { id:'d6',userId:'d6',name:'Grace Okafor',avatar:'GO',phone:'+2348067890123',licenseNumber:'DL-556-PQR',licenseExpiry:'2026-04-15',vehicleType:'Van',currentVehiclePlate:'LG-556-VIC',isOnline:false,isAvailable:false,status:'offline',totalDeliveries:234,onTimeRate:91.2,rating:4.4,earningsBalance:32000,branchId:'b1',branchName:'Lagos HQ',activeShipments:0,completedToday:0 },
  { id:'d7',userId:'d7',name:'Samuel Okonkwo',avatar:'SO',phone:'+2348078901234',licenseNumber:'DL-667-STU',licenseExpiry:'2027-01-20',vehicleType:'Motorcycle',currentVehiclePlate:'LG-667-VIC',isOnline:true,isAvailable:true,status:'available',totalDeliveries:156,onTimeRate:96.3,rating:4.8,earningsBalance:23000,branchId:'b1',branchName:'Lagos HQ',activeShipments:0,completedToday:2 },
  { id:'d8',userId:'d8',name:'Blessing Eze',avatar:'BE',phone:'+2348089012345',licenseNumber:'DL-889-VWX',licenseExpiry:'2026-11-10',vehicleType:'Van',currentVehiclePlate:'AB-889-ENU',isOnline:true,isAvailable:false,status:'on_delivery',totalDeliveries:398,onTimeRate:93.7,rating:4.6,earningsBalance:54000,branchId:'b2',branchName:'Abuja Branch',activeShipments:2,completedToday:6 },
  { id:'d9',userId:'d9',name:'Daniel Achebe',avatar:'DA',phone:'+2348090123456',licenseNumber:'DL-221-YZA',licenseExpiry:'2026-06-30',vehicleType:'Truck',currentVehiclePlate:'KN-221-KAN',isOnline:false,isAvailable:false,status:'offline',totalDeliveries:678,onTimeRate:89.4,rating:4.3,earningsBalance:78000,branchId:'b3',branchName:'Kano Branch',activeShipments:0,completedToday:0 },
  { id:'d10',userId:'d10',name:'Ngozi Obi',avatar:'NO',phone:'+2348101234567',licenseNumber:'DL-333-BCD',licenseExpiry:'2027-03-15',vehicleType:'Motorcycle',currentVehiclePlate:'PH-333-RVS',isOnline:true,isAvailable:true,status:'available',totalDeliveries:201,onTimeRate:97.8,rating:4.9,earningsBalance:31000,branchId:'b4',branchName:'Port Harcourt Branch',activeShipments:0,completedToday:4 },
  { id:'d11',userId:'d11',name:'Kwame Asante',avatar:'KA',phone:'+233245678901',licenseNumber:'DL-GH-445',licenseExpiry:'2027-08-20',vehicleType:'Van',currentVehiclePlate:'GH-445-ACC',isOnline:true,isAvailable:false,status:'on_pickup',totalDeliveries:89,onTimeRate:94.1,rating:4.7,earningsBalance:12000,branchId:'b5',branchName:'Accra Agent',activeShipments:1,completedToday:1 },
  { id:'d12',userId:'d12',name:'Wanjiku Kamau',avatar:'WK',phone:'+254712345678',licenseNumber:'DL-KE-556',licenseExpiry:'2027-05-01',vehicleType:'Car',currentVehiclePlate:'KE-556-NRB',isOnline:true,isAvailable:true,status:'available',totalDeliveries:45,onTimeRate:96.0,rating:4.8,earningsBalance:8500,branchId:'b6',branchName:'Nairobi Agent',activeShipments:0,completedToday:0 },
];

const performanceData = [65, 72, 58, 80, 90, 78, 85, 92, 88, 75, 82, 95, 70, 68, 84, 91, 87, 73, 79, 93, 86, 94, 81, 77, 89, 96, 83, 98, 76, 82];

export default function AdminDriversPage() {
  const [filters, setFilters] = useState<Record<string,string>>({});
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    return mockDrivers.filter(d => {
      if (filters.country) return false;
      if (filters.branch && d.branchName !== filters.branch) return false;
      if (filters.status && d.status !== filters.status) return false;
      if (filters.vehicleType && d.vehicleType !== filters.vehicleType) return false;
      return true;
    });
  }, [filters]);

  const filterConfigs: FilterConfig[] = [
    { key:'status', type:'select', label:'Status', options: [{value:'available',label:'Available'},{value:'offline',label:'Offline'},{value:'on_delivery',label:'On Delivery'},{value:'on_pickup',label:'On Pickup'},{value:'on_break',label:'On Break'}] },
    { key:'branch', type:'select', label:'Branch', options: [{value:'Lagos HQ',label:'Lagos HQ'},{value:'Abuja Branch',label:'Abuja'},{value:'Kano Branch',label:'Kano'},{value:'Port Harcourt Branch',label:'Port Harcourt'},{value:'Accra Agent',label:'Accra'},{value:'Nairobi Agent',label:'Nairobi'}] },
    { key:'vehicleType', type:'select', label:'Vehicle', options: [{value:'Van',label:'Van'},{value:'Truck',label:'Truck'},{value:'Motorcycle',label:'Motorcycle'},{value:'Car',label:'Car'}] },
    { key:'search', type:'search', label:'Search', placeholder:'Driver name...' },
  ];

  const columns = [
    {
      key:'name', label:'Driver', sortable:true,
      render: (d: Driver) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[var(--terra)] flex items-center justify-center text-white text-xs font-semibold">{d.avatar}</div>
          <span className="text-sm font-medium">{d.name}</span>
        </div>
      ),
    },
    { key:'phone', label:'Phone', render: (d: Driver) => <span className="text-sm">{d.phone}</span> },
    { key:'branchName', label:'Branch', sortable:true, render: (d: Driver) => <span className="text-sm">{d.branchName || '—'}</span> },
    { key:'currentVehiclePlate', label:'Vehicle', render: (d: Driver) => <span className="font-mono text-xs">{d.currentVehiclePlate || '—'}</span> },
    {
      key:'status', label:'Status',
      render: (d: Driver) => <Badge className={STATUS_COLORS[d.status]}>{d.status.replace('_',' ')}</Badge>,
    },
    { key:'totalDeliveries', label:'Deliveries', sortable:true, render: (d: Driver) => <span className="text-sm">{d.totalDeliveries}</span> },
    {
      key:'onTimeRate', label:'On-Time', sortable:true,
      render: (d: Driver) => <span className={`text-sm font-medium ${d.onTimeRate >= 95 ? 'text-green-700' : d.onTimeRate >= 90 ? 'text-amber-700' : 'text-red-600'}`}>{d.onTimeRate}%</span>,
    },
    {
      key:'rating', label:'Rating',
      render: (d: Driver) => (
        <span className="flex items-center gap-1 text-sm">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          {d.rating}
        </span>
      ),
    },
    { key:'earningsBalance', label:'Earnings', sortable:true, render: (d: Driver) => <span className="text-sm">₦{d.earningsBalance.toLocaleString()}</span> },
    {
      key:'actions', label:'Actions',
      render: (d: Driver) => (
        <button className="p-1.5 rounded hover:bg-[var(--terra-pale)] text-gray-700 hover:text-[var(--terra)]" onClick={e => { e.stopPropagation(); setSelectedDriver(d); setDrawerOpen(true); }}>
          <Eye size={14} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-[var(--ink)]">Drivers</h1>
        <p className="text-xs text-[var(--muted-text)]">{filtered.length} drivers</p>
      </div>

      <FilterBar filters={filterConfigs} onFilterChange={(k,v) => setFilters(f => ({...f,[k]:v}))} onClear={() => setFilters({})} values={filters} />

      <DataTable columns={columns as any} data={filtered as any} onRowClick={(d: any) => { setSelectedDriver(d); setDrawerOpen(true); }} pageSize={10} />

      <RightDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Driver Profile" width={480}>
        {selectedDriver && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[var(--terra)] flex items-center justify-center text-white text-lg font-bold">{selectedDriver.avatar}</div>
              <div>
                <h3 className="text-base font-semibold">{selectedDriver.name}</h3>
                <p className="text-sm text-[var(--muted-text)]">{selectedDriver.phone}</p>
                <Badge className={STATUS_COLORS[selectedDriver.status]}>{selectedDriver.status.replace('_',' ')}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[var(--cream)] rounded-lg p-3 text-center">
                <div className="text-xs text-[var(--muted-text)]">Deliveries</div>
                <div className="text-sm font-semibold">{selectedDriver.totalDeliveries}</div>
              </div>
              <div className="bg-[var(--cream)] rounded-lg p-3 text-center">
                <div className="text-xs text-[var(--muted-text)]">On-Time</div>
                <div className="text-sm font-semibold">{selectedDriver.onTimeRate}%</div>
              </div>
              <div className="bg-[var(--cream)] rounded-lg p-3 text-center">
                <div className="text-xs text-[var(--muted-text)]">Rating</div>
                <div className="text-sm font-semibold flex items-center justify-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" />{selectedDriver.rating}</div>
              </div>
            </div>

            <div className="border-t border-[var(--border-warm)] pt-4">
              <h4 className="text-sm font-semibold mb-3">Performance (Last 30 Days)</h4>
              <div className="flex items-end gap-[3px] h-24">
                {performanceData.map((v,i) => (
                  <div key={i} className="flex-1 rounded-t bg-[var(--terra)]/70 hover:bg-[var(--terra)] transition-colors" style={{ height: `${v}%` }} title={`Day ${i+1}: ${v}%`} />
                ))}
              </div>
            </div>

            <div className="border-t border-[var(--border-warm)] pt-4">
              <h4 className="text-sm font-semibold mb-3">Documents</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-[var(--cream)] rounded-lg p-3">
                  <span className="text-sm">License ({selectedDriver.licenseNumber})</span>
                  <span className={`text-xs font-medium ${new Date(selectedDriver.licenseExpiry) < new Date('2026-04-20') ? 'text-red-600' : 'text-green-600'}`}>
                    Exp: {selectedDriver.licenseExpiry}
                  </span>
                </div>
                {new Date(selectedDriver.licenseExpiry) < new Date('2026-06-20') && (
                  <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg p-2">
                    <AlertTriangle size={12} /> License expires soon
                  </div>
                )}
              </div>
            </div>

            {selectedDriver.status === 'on_delivery' && (
              <div className="border-t border-[var(--border-warm)] pt-4">
                <h4 className="text-sm font-semibold mb-3">Active Job</h4>
                <div className="bg-blue-50 rounded-lg p-3 space-y-1">
                  <div className="text-sm font-medium">DS-20260318-A1B2C3</div>
                  <div className="text-xs text-[var(--muted-text)]">Lagos HQ → Lekki Phase 1</div>
                  <div className="text-xs text-[var(--muted-text)]">ETA: 25 min</div>
                </div>
              </div>
            )}

            <div className="border-t border-[var(--border-warm)] pt-4">
              <h4 className="text-sm font-semibold mb-3">Vehicle</h4>
              <Select defaultValue={selectedDriver.currentVehiclePlate || ''}>
                <SelectTrigger><SelectValue placeholder="Assign vehicle..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  <SelectItem value="LG-284-KJA">LG-284-KJA (Van)</SelectItem>
                  <SelectItem value="AB-112-RSH">AB-112-RSH (Truck)</SelectItem>
                  <SelectItem value="LG-931-EPE">LG-931-EPE (Motorcycle)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t border-[var(--border-warm)] pt-4 space-y-2">
              <Button variant="outline" className="w-full gap-2">
                {selectedDriver.isOnline ? <><UserMinus size={14} /> Deactivate</> : <><UserPlus size={14} /> Activate</>}
              </Button>
            </div>
          </div>
        )}
      </RightDrawer>
    </div>
  );
}
