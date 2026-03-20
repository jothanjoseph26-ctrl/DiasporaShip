'use client';

import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, FilterBar, RightDrawer } from '@/components/shared';
import type { FilterConfig } from '@/components/shared';
import {
  Truck,
  Eye,
  Pencil,
  MapPin,
  Clock,
  Wrench,
  Package,
  Navigation,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const countryFlags: Record<string, string> = {
  US: '🇺🇸',
  NG: '🇳🇬',
  GH: '🇬🇭',
  KE: '🇰🇪',
};

const typeColors: Record<string, string> = {
  van: 'bg-blue-100 text-blue-700',
  truck: 'bg-amber-100 text-amber-700',
  motorcycle: 'bg-emerald-100 text-emerald-700',
  car: 'bg-gray-100 text-gray-700',
  container_truck: 'bg-violet-100 text-violet-700',
};

const statusColors: Record<string, string> = {
  available: 'bg-green-100 text-green-700',
  on_trip: 'bg-blue-100 text-blue-700',
  maintenance: 'bg-amber-100 text-amber-700',
  inactive: 'bg-gray-100 text-gray-600',
};

const statusLabels: Record<string, string> = {
  available: 'Available',
  on_trip: 'On Trip',
  maintenance: 'Maintenance',
  inactive: 'Inactive',
};

const mockVehicles = [
  { id: 'v1', plateNumber: 'ABC-123-XY', type: 'van', make: 'Mercedes', model: 'Sprinter', capacityKg: 1500, country: 'NG', driver: 'Adebayo Ogundimu', driverId: 'd1', status: 'on_trip', lastLat: 6.4541, lastLng: 3.3947, lastGps: '2026-03-18T10:30:00Z' },
  { id: 'v2', plateNumber: 'GH-4567-24', type: 'truck', make: 'Isuzu', model: 'NPR', capacityKg: 4000, country: 'GH', driver: 'Kwame Asante', driverId: 'd2', status: 'available', lastLat: 5.6037, lastLng: -0.1870, lastGps: '2026-03-18T10:25:00Z' },
  { id: 'v3', plateNumber: 'DEF-456-XY', type: 'motorcycle', make: 'Honda', model: 'Click 125i', capacityKg: 50, country: 'NG', driver: 'Emeka Nwosu', driverId: 'd3', status: 'available', lastLat: 6.4316, lastLng: 3.4236, lastGps: '2026-03-18T10:28:00Z' },
  { id: 'v4', plateNumber: 'KBA-789Z', type: 'van', make: 'Toyota', model: 'Hiace', capacityKg: 1200, country: 'KE', driver: 'James Mwangi', driverId: 'd4', status: 'on_trip', lastLat: -1.2921, lastLng: 36.8219, lastGps: '2026-03-18T10:15:00Z' },
  { id: 'v5', plateNumber: 'GHI-789-XY', type: 'truck', make: 'Hino', model: '300', capacityKg: 5000, country: 'NG', driver: null, driverId: null, status: 'available', lastLat: 4.7777, lastLng: 7.0134, lastGps: '2026-03-17T18:00:00Z' },
  { id: 'v6', plateNumber: 'NG-321-LA', type: 'van', make: 'Ford', model: 'Transit', capacityKg: 1000, country: 'NG', driver: 'Oluwaseun Adeyemi', driverId: 'd5', status: 'inactive', lastLat: 6.4541, lastLng: 3.3947, lastGps: '2026-03-17T08:00:00Z' },
  { id: 'v7', plateNumber: 'US-555-ATL', type: 'truck', make: 'Freightliner', model: 'M2', capacityKg: 8000, country: 'US', driver: null, driverId: null, status: 'maintenance', lastLat: 33.7490, lastLng: -84.3880, lastGps: '2026-03-15T14:00:00Z' },
  { id: 'v8', plateNumber: 'KE-112-MSA', type: 'motorcycle', make: 'Bajaj', model: 'Boxer', capacityKg: 30, country: 'KE', driver: null, driverId: null, status: 'available', lastLat: -4.0435, lastLng: 39.6682, lastGps: '2026-03-18T09:50:00Z' },
  { id: 'v9', plateNumber: 'GH-223-ACC', type: 'car', make: 'Toyota', model: 'Corolla', capacityKg: 200, country: 'GH', driver: null, driverId: null, status: 'available', lastLat: 5.6037, lastLng: -0.1870, lastGps: '2026-03-18T10:20:00Z' },
  { id: 'v10', plateNumber: 'US-888-NYC', type: 'van', make: 'Mercedes', model: 'Sprinter', capacityKg: 1500, country: 'US', driver: null, driverId: null, status: 'available', lastLat: 40.7128, lastLng: -74.0060, lastGps: '2026-03-18T10:00:00Z' },
];

const mockMaintenanceLog = [
  { date: '2026-03-10', desc: 'Oil change and filter replacement' },
  { date: '2026-02-15', desc: 'Brake pad replacement (front)' },
  { date: '2026-01-20', desc: 'Tire rotation and alignment' },
  { date: '2025-12-05', desc: 'Annual inspection passed' },
  { date: '2025-11-12', desc: 'Battery replacement' },
];

const mockTripHistory = [
  { id: 'DS-20260317-A1', date: '2026-03-17', from: 'Ikeja', to: 'Lekki', distance: '18.2 km' },
  { id: 'DS-20260316-B2', date: '2026-03-16', from: 'VI', to: 'Surulere', distance: '12.5 km' },
  { id: 'DS-20260315-C3', date: '2026-03-15', from: 'Yaba', to: 'Ikoyi', distance: '9.8 km' },
  { id: 'DS-20260314-D4', date: '2026-03-14', from: 'Gbagada', to: 'Ajah', distance: '32.1 km' },
  { id: 'DS-20260313-E5', date: '2026-03-13', from: 'Ikeja', to: 'Maryland', distance: '6.4 km' },
];

const filters: FilterConfig[] = [
  { key: 'country', type: 'select', label: 'Country', options: [
    { label: '🇺🇸 US', value: 'US' },
    { label: '🇳🇬 NG', value: 'NG' },
    { label: '🇬🇭 GH', value: 'GH' },
    { label: '🇰🇪 KE', value: 'KE' },
  ]},
  { key: 'type', type: 'select', label: 'Type', options: [
    { label: 'Van', value: 'van' },
    { label: 'Truck', value: 'truck' },
    { label: 'Motorcycle', value: 'motorcycle' },
    { label: 'Car', value: 'car' },
  ]},
  { key: 'status', type: 'select', label: 'Status', options: [
    { label: 'Available', value: 'available' },
    { label: 'On Trip', value: 'on_trip' },
    { label: 'Maintenance', value: 'maintenance' },
    { label: 'Inactive', value: 'inactive' },
  ]},
  { key: 'driver', type: 'select', label: 'Driver', options: [
    { label: 'Assigned', value: 'assigned' },
    { label: 'Unassigned', value: 'unassigned' },
  ]},
];

const columns = [
  { key: 'plateNumber', label: 'Plate', sortable: true, render: (v: (typeof mockVehicles)[0]) => (
    <span className="font-mono text-xs font-semibold text-[#1A1208]">{v.plateNumber}</span>
  )},
  { key: 'type', label: 'Type', render: (v: (typeof mockVehicles)[0]) => (
    <Badge className={cn('text-[10px] capitalize', typeColors[v.type] || 'bg-gray-100 text-gray-700')}>
      {v.type.replace('_', ' ')}
    </Badge>
  )},
  { key: 'make', label: 'Make / Model', sortable: true, render: (v: (typeof mockVehicles)[0]) => (
    <span className="text-xs text-[#1A1208]">{v.make} {v.model}</span>
  )},
  { key: 'capacityKg', label: 'Capacity (kg)', sortable: true, render: (v: (typeof mockVehicles)[0]) => (
    <span className="text-xs text-[#1A1208]">{v.capacityKg.toLocaleString()}</span>
  )},
  { key: 'country', label: 'Country', render: (v: (typeof mockVehicles)[0]) => (
    <span className="text-sm">{countryFlags[v.country]} {v.country}</span>
  )},
  { key: 'driver', label: 'Driver', render: (v: (typeof mockVehicles)[0]) => (
    v.driver ? (
      <span className="text-xs text-[#1A1208]">{v.driver}</span>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-700 text-[10px]">Unassigned</Badge>
    )
  )},
  { key: 'status', label: 'Status', sortable: true, render: (v: (typeof mockVehicles)[0]) => (
    <Badge className={cn('text-[10px]', statusColors[v.status])}>
      {statusLabels[v.status]}
    </Badge>
  )},
  { key: 'lastLat', label: 'Last GPS', render: (v: (typeof mockVehicles)[0]) => (
    v.lastLat && v.lastLng ? (
      <span className="font-mono text-[10px] text-[var(--muted-text)]">
        {v.lastLat.toFixed(4)}, {v.lastLng.toFixed(4)}
      </span>
    ) : (
      <span className="text-[var(--muted-text)]">—</span>
    )
  )},
  { key: 'actions', label: 'Actions', render: () => (
    <div className="flex items-center gap-0.5">
      <Button variant="ghost" size="icon" className="h-7 w-7 text-[#2563EB] hover:text-[#1D4ED8] hover:bg-blue-50">
        <Eye className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-700 hover:text-[#1A1208] hover:bg-gray-50">
        <Pencil className="h-3.5 w-3.5" />
      </Button>
    </div>
  )},
];

export default function DispatchFleetPage() {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [selectedVehicle, setSelectedVehicle] = useState<(typeof mockVehicles)[0] | null>(null);

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilterValues({});
  };

  const filteredData = useMemo(() => {
    return mockVehicles.filter((v) => {
      if (filterValues.country && v.country !== filterValues.country) return false;
      if (filterValues.type && v.type !== filterValues.type) return false;
      if (filterValues.status && v.status !== filterValues.status) return false;
      if (filterValues.driver === 'assigned' && !v.driver) return false;
      if (filterValues.driver === 'unassigned' && v.driver) return false;
      return true;
    });
  }, [filterValues]);

  return (
    <div className="space-y-4">
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
        values={filterValues}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        onRowClick={(item) => setSelectedVehicle(item as (typeof mockVehicles)[0])}
        pageSize={10}
        emptyState={{
          icon: <Truck className="h-10 w-10" />,
          title: 'No vehicles found',
          description: 'Try adjusting your filters',
        }}
      />

      <RightDrawer
        open={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        title="Vehicle Details"
        width={420}
      >
        {selectedVehicle && (
          <div className="space-y-5">
            {/* Vehicle info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-base text-[#1A1208]">{selectedVehicle.plateNumber}</span>
                <Badge className={cn('text-[11px]', statusColors[selectedVehicle.status])}>
                  {statusLabels[selectedVehicle.status]}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FFF8F0] rounded-lg border border-[#E8DDD0]">
                  <p className="text-[10px] text-[#8C7B6B] uppercase font-semibold mb-1">Type</p>
                  <Badge className={cn('text-[10px] capitalize', typeColors[selectedVehicle.type])}>
                    {selectedVehicle.type.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="p-3 bg-[#FFF8F0] rounded-lg border border-[#E8DDD0]">
                  <p className="text-[10px] text-[#8C7B6B] uppercase font-semibold mb-1">Country</p>
                  <p className="text-sm font-medium text-[#1A1208]">
                    {countryFlags[selectedVehicle.country]} {selectedVehicle.country}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#FFF8F0] rounded-lg border border-[#E8DDD0]">
                <p className="text-[10px] text-[#8C7B6B] uppercase font-semibold mb-1">Make / Model</p>
                <p className="text-sm font-medium text-[#1A1208]">{selectedVehicle.make} {selectedVehicle.model}</p>
              </div>

              <div className="p-3 bg-[#FFF8F0] rounded-lg border border-[#E8DDD0]">
                <p className="text-[10px] text-[#8C7B6B] uppercase font-semibold mb-1">Capacity</p>
                <p className="text-sm font-medium text-[#1A1208]">{selectedVehicle.capacityKg.toLocaleString()} kg</p>
              </div>

              {selectedVehicle.driver ? (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-[10px] text-blue-600 uppercase font-semibold">Assigned Driver</p>
                    <p className="text-sm font-medium text-[#1A1208]">{selectedVehicle.driver}</p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-red-50 rounded-lg border border-red-100 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-red-500" />
                  <p className="text-sm text-red-600 font-medium">No driver assigned</p>
                </div>
              )}

              {selectedVehicle.lastLat && selectedVehicle.lastLng && (
                <div className="p-3 bg-[#FFF8F0] rounded-lg border border-[#E8DDD0]">
                  <p className="text-[10px] text-[#8C7B6B] uppercase font-semibold mb-1">Last GPS</p>
                  <p className="font-mono text-xs text-[#1A1208]">
                    {selectedVehicle.lastLat.toFixed(4)}, {selectedVehicle.lastLng.toFixed(4)}
                  </p>
                </div>
              )}
            </div>

            {/* Mini map placeholder */}
            <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <MapPin className="h-6 w-6 mx-auto text-gray-300 mb-1" />
                <p className="text-xs text-gray-400">Mini Map</p>
              </div>
            </div>

            {/* Maintenance log */}
            <div>
              <h3 className="text-sm font-semibold text-[#1A1208] mb-2 flex items-center gap-1.5">
                <Wrench className="h-4 w-4 text-[#8C7B6B]" />
                Maintenance Log
              </h3>
              <div className="space-y-2">
                {mockMaintenanceLog.map((entry, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 rounded border border-[#E8DDD0] bg-white">
                    <span className="text-[10px] font-mono text-[var(--muted-text)] mt-0.5 w-20 flex-shrink-0">{entry.date}</span>
                    <span className="text-xs text-[#1A1208]">{entry.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trip history */}
            <div>
              <h3 className="text-sm font-semibold text-[#1A1208] mb-2 flex items-center gap-1.5">
                <Package className="h-4 w-4 text-[#8C7B6B]" />
                Recent Trips
              </h3>
              <div className="space-y-2">
                {mockTripHistory.map((trip) => (
                  <div key={trip.id} className="flex items-center gap-3 p-2 rounded border border-[#E8DDD0] bg-white">
                    <span className="font-mono text-[10px] text-[#2563EB] font-semibold w-28 flex-shrink-0">{trip.id}</span>
                    <span className="text-[10px] text-[var(--muted-text)] w-16 flex-shrink-0">{trip.date}</span>
                    <span className="text-xs text-[#1A1208] flex-1 truncate">{trip.from} → {trip.to}</span>
                    <span className="text-[10px] text-[var(--muted-text)]">{trip.distance}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </RightDrawer>
    </div>
  );
}
