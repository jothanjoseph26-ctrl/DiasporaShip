'use client';

import { useState, useMemo } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable, FilterBar, StatusBadge, RightDrawer } from '@/components/shared';
import type { FilterConfig } from '@/components/shared';
import {
  Package,
  Truck,
  MapPin,
  Clock,
  Weight,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const countryFlags: Record<string, string> = {
  US: '🇺🇸',
  NG: '🇳🇬',
  GH: '🇬🇭',
  KE: '🇰🇪',
  GB: '🇬🇧',
  CN: '🇨🇳',
};

const shipmentTypeColors: Record<string, string> = {
  parcel: 'bg-blue-100 text-blue-700',
  cargo: 'bg-amber-100 text-amber-700',
  freight: 'bg-violet-100 text-violet-700',
  document: 'bg-emerald-100 text-emerald-700',
  fragile: 'bg-red-100 text-red-700',
  cold_chain: 'bg-cyan-100 text-cyan-700',
};

const mockShipments = [
  { id: 's1', trackingNumber: 'DS-20260318-A1B2C3', type: 'parcel', status: 'pending_pickup', originCountry: 'US', destinationCountry: 'NG', originCity: 'Atlanta', destinationCity: 'Lagos', assignedDriver: 'Adebayo Ogundimu', pickupDate: '2026-03-18', weightKg: 12.5, priority: 'high' },
  { id: 's2', trackingNumber: 'DS-20260318-B2C3D4', type: 'document', status: 'pickup_assigned', originCountry: 'GB', destinationCountry: 'NG', originCity: 'London', destinationCity: 'Abuja', assignedDriver: 'Chinwe Eze', pickupDate: '2026-03-18', weightKg: 0.5, priority: 'medium' },
  { id: 's3', trackingNumber: 'DS-20260317-C3D4E5', type: 'cargo', status: 'picked_up', originCountry: 'CN', destinationCountry: 'NG', originCity: 'Guangzhou', destinationCity: 'Lagos', assignedDriver: null, pickupDate: '2026-03-17', weightKg: 850, priority: 'high' },
  { id: 's4', trackingNumber: 'DS-20260317-D4E5F6', type: 'parcel', status: 'out_for_delivery', originCountry: 'NG', destinationCountry: 'NG', originCity: 'Lagos', destinationCity: 'Enugu', assignedDriver: 'Emeka Nwosu', pickupDate: '2026-03-16', weightKg: 5.2, priority: 'low' },
  { id: 's5', trackingNumber: 'DS-20260317-E5F6G7', type: 'fragile', status: 'pending_pickup', originCountry: 'US', destinationCountry: 'GH', originCity: 'New York', destinationCity: 'Accra', assignedDriver: null, pickupDate: '2026-03-19', weightKg: 3.8, priority: 'high' },
  { id: 's6', trackingNumber: 'DS-20260316-F6G7H8', type: 'parcel', status: 'picked_up', originCountry: 'KE', destinationCountry: 'KE', originCity: 'Nairobi', destinationCity: 'Mombasa', assignedDriver: 'James Mwangi', pickupDate: '2026-03-16', weightKg: 8.0, priority: 'medium' },
  { id: 's7', trackingNumber: 'DS-20260316-G7H8I9', type: 'freight', status: 'pending_pickup', originCountry: 'US', destinationCountry: 'NG', originCity: 'Houston', destinationCity: 'Port Harcourt', assignedDriver: null, pickupDate: '2026-03-19', weightKg: 2200, priority: 'medium' },
  { id: 's8', trackingNumber: 'DS-20260316-H8I9J0', type: 'parcel', status: 'out_for_delivery', originCountry: 'GH', destinationCountry: 'GH', originCity: 'Accra', destinationCity: 'Kumasi', assignedDriver: 'Kwame Asante', pickupDate: '2026-03-15', weightKg: 2.1, priority: 'low' },
  { id: 's9', trackingNumber: 'DS-20260315-I9J0K1', type: 'cold_chain', status: 'pickup_assigned', originCountry: 'US', destinationCountry: 'KE', originCity: 'Los Angeles', destinationCity: 'Nairobi', assignedDriver: null, pickupDate: '2026-03-19', weightKg: 15.0, priority: 'high' },
  { id: 's10', trackingNumber: 'DS-20260315-J0K1L2', type: 'document', status: 'pending_pickup', originCountry: 'GB', destinationCountry: 'GH', originCity: 'Manchester', destinationCity: 'Accra', assignedDriver: null, pickupDate: '2026-03-20', weightKg: 0.3, priority: 'medium' },
  { id: 's11', trackingNumber: 'DS-20260315-K1L2M3', type: 'parcel', status: 'picked_up', originCountry: 'NG', destinationCountry: 'US', originCity: 'Lagos', destinationCity: 'Atlanta', assignedDriver: 'Adebayo Ogundimu', pickupDate: '2026-03-14', weightKg: 6.7, priority: 'medium' },
  { id: 's12', trackingNumber: 'DS-20260314-L2M3N4', type: 'cargo', status: 'out_for_delivery', originCountry: 'KE', destinationCountry: 'KE', originCity: 'Nairobi', destinationCity: 'Kisumu', assignedDriver: 'James Mwangi', pickupDate: '2026-03-13', weightKg: 45.0, priority: 'low' },
  { id: 's13', trackingNumber: 'DS-20260314-M3N4O5', type: 'parcel', status: 'pending_pickup', originCountry: 'US', destinationCountry: 'NG', originCity: 'Chicago', destinationCity: 'Abuja', assignedDriver: null, pickupDate: '2026-03-20', weightKg: 9.2, priority: 'high' },
  { id: 's14', trackingNumber: 'DS-20260314-N4O5P6', type: 'parcel', status: 'pickup_assigned', originCountry: 'GH', destinationCountry: 'US', originCity: 'Accra', destinationCity: 'Atlanta', assignedDriver: 'Kwame Asante', pickupDate: '2026-03-18', weightKg: 4.5, priority: 'medium' },
  { id: 's15', trackingNumber: 'DS-20260313-O5P6Q7', type: 'fragile', status: 'pending_pickup', originCountry: 'NG', destinationCountry: 'KE', originCity: 'Lagos', destinationCity: 'Nairobi', assignedDriver: null, pickupDate: '2026-03-21', weightKg: 2.8, priority: 'high' },
];

const curatedTrackingNumbers = ['DS-20260318-A1B2C3', 'DS-20260312-G7H8I9', 'DS-20260319-M4N5O6'];

const availableDrivers = [
  { id: 'd1', name: 'Adebayo Ogundimu', distance: '2.3 km', rating: 4.8, activeJobs: 3 },
  { id: 'd2', name: 'Kwame Asante', distance: '5.1 km', rating: 4.9, activeJobs: 2 },
  { id: 'd3', name: 'Emeka Nwosu', distance: '8.7 km', rating: 4.7, activeJobs: 0 },
  { id: 'd4', name: 'James Mwangi', distance: '12.4 km', rating: 4.6, activeJobs: 1 },
  { id: 'd5', name: 'Ibrahim Musa', distance: '15.0 km', rating: 4.5, activeJobs: 1 },
];

const filters: FilterConfig[] = [
  { key: 'status', type: 'select', label: 'Status', options: [
    { label: 'Pending Pickup', value: 'pending_pickup' },
    { label: 'Pickup Assigned', value: 'pickup_assigned' },
    { label: 'Picked Up', value: 'picked_up' },
    { label: 'Out for Delivery', value: 'out_for_delivery' },
  ]},
  { key: 'driver', type: 'select', label: 'Driver', options: [
    { label: 'Assigned', value: 'assigned' },
    { label: 'Unassigned', value: 'unassigned' },
  ]},
  { key: 'priority', type: 'select', label: 'Priority', options: [
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ]},
  { key: 'country', type: 'select', label: 'Country', options: [
    { label: '🇺🇸 US', value: 'US' },
    { label: '🇳🇬 NG', value: 'NG' },
    { label: '🇬🇭 GH', value: 'GH' },
    { label: '🇰🇪 KE', value: 'KE' },
  ]},
];

const columns = [
  { key: 'trackingNumber', label: 'Tracking ID', sortable: true, render: (s: (typeof mockShipments)[0]) => (
    <span className="font-mono text-xs font-semibold text-[#1A1208] hover:text-[#2563EB] cursor-pointer">
      {s.trackingNumber}
    </span>
  )},
  { key: 'type', label: 'Type', render: (s: (typeof mockShipments)[0]) => (
    <Badge className={cn('text-[10px] capitalize', shipmentTypeColors[s.type] || 'bg-gray-100 text-gray-700')}>
      {s.type.replace('_', ' ')}
    </Badge>
  )},
  { key: 'route', label: 'Route', render: (s: (typeof mockShipments)[0]) => (
    <div className="flex items-center gap-1.5 text-xs">
      <span>{countryFlags[s.originCountry]}</span>
      <span className="text-[#8C7B6B]">{s.originCity}</span>
      <ArrowRight className="h-3 w-3 text-[#8C7B6B]" />
      <span>{countryFlags[s.destinationCountry]}</span>
      <span className="text-[#8C7B6B]">{s.destinationCity}</span>
    </div>
  )},
  { key: 'status', label: 'Status', sortable: true, render: (s: (typeof mockShipments)[0]) => (
    <StatusBadge status={s.status as any} />
  )},
  { key: 'assignedDriver', label: 'Driver', sortable: true, render: (s: (typeof mockShipments)[0]) => (
    s.assignedDriver ? (
      <span className="text-xs text-[#1A1208]">{s.assignedDriver}</span>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-700 text-[10px]">Unassigned</Badge>
    )
  )},
  { key: 'pickupDate', label: 'Pickup Date', sortable: true, render: (s: (typeof mockShipments)[0]) => (
    <span className="text-xs text-[#8C7B6B]">{s.pickupDate}</span>
  )},
  { key: 'weightKg', label: 'Weight', sortable: true, render: (s: (typeof mockShipments)[0]) => (
    <span className="text-xs text-[#1A1208]">{s.weightKg} kg</span>
  )},
  { key: 'actions', label: 'Actions', render: () => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] text-[#2563EB] hover:text-[#1D4ED8] hover:bg-blue-50">
        View
      </Button>
    </div>
  )},
];

export default function DispatchShipmentsPage() {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [selectedShipment, setSelectedShipment] = useState<(typeof mockShipments)[0] | null>(null);

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilterValues({});
  };

  const filteredData = useMemo(() => {
    return mockShipments.filter((s) => {
      if (!curatedTrackingNumbers.includes(s.trackingNumber)) return false;
      if (filterValues.status && s.status !== filterValues.status) return false;
      if (filterValues.driver === 'assigned' && !s.assignedDriver) return false;
      if (filterValues.driver === 'unassigned' && s.assignedDriver) return false;
      if (filterValues.priority && s.priority !== filterValues.priority) return false;
      if (filterValues.country && s.originCountry !== filterValues.country && s.destinationCountry !== filterValues.country) return false;
      return true;
    });
  }, [filterValues]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#E8DDD0] bg-[#FAF6EF] p-4 text-sm text-[#8C7B6B]">
        Dispatch shipments is intentionally limited to the hero walkthrough and its two exception stories to keep the client demo on one operating path.
      </div>
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
        values={filterValues}
      />

      <DataTable
        columns={columns}
        data={filteredData}
        onRowClick={(item) => setSelectedShipment(item as (typeof mockShipments)[0])}
        pageSize={10}
        emptyState={{
          icon: <Package className="h-10 w-10" />,
          title: 'No shipments found',
          description: 'Try adjusting your filters',
        }}
      />

      {/* Custom row styling for unassigned */}
      <style jsx global>{`
        tr[data-unassigned="true"] {
          border-left: 3px solid #EF4444 !important;
        }
      `}</style>

      <RightDrawer
        open={!!selectedShipment}
        onClose={() => setSelectedShipment(null)}
        title="Shipment Details"
        width={420}
      >
        {selectedShipment && (
          <div className="space-y-5">
            {/* Shipment summary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-sm text-[#1A1208]">{selectedShipment.trackingNumber}</span>
                <StatusBadge status={selectedShipment.status as any} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FFF8F0] rounded-lg border border-[#E8DDD0]">
                  <p className="text-[10px] text-[#8C7B6B] uppercase font-semibold mb-1">Origin</p>
                  <p className="text-sm font-medium text-[#1A1208] flex items-center gap-1">
                    {countryFlags[selectedShipment.originCountry]} {selectedShipment.originCity}
                  </p>
                </div>
                <div className="p-3 bg-[#FFF8F0] rounded-lg border border-[#E8DDD0]">
                  <p className="text-[10px] text-[#8C7B6B] uppercase font-semibold mb-1">Destination</p>
                  <p className="text-sm font-medium text-[#1A1208] flex items-center gap-1">
                    {countryFlags[selectedShipment.destinationCountry]} {selectedShipment.destinationCity}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#8C7B6B]">
                <span className="flex items-center gap-1">
                  <Weight className="h-3.5 w-3.5" />
                  {selectedShipment.weightKg} kg
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {selectedShipment.pickupDate}
                </span>
                <Badge className={cn('text-[10px] capitalize', shipmentTypeColors[selectedShipment.type] || 'bg-gray-100 text-gray-700')}>
                  {selectedShipment.type.replace('_', ' ')}
                </Badge>
              </div>

              {selectedShipment.assignedDriver ? (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-[10px] text-blue-600 uppercase font-semibold">Assigned Driver</p>
                    <p className="text-sm font-medium text-[#1A1208]">{selectedShipment.assignedDriver}</p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-red-50 rounded-lg border border-red-100 flex items-center gap-2">
                  <Package className="h-4 w-4 text-red-500" />
                  <p className="text-sm text-red-600 font-medium">Unassigned — needs driver</p>
                </div>
              )}
            </div>

            {/* Assign driver section */}
            <div>
              <h3 className="text-sm font-semibold text-[#1A1208] mb-3">Assign Driver</h3>
              <div className="space-y-2">
                {availableDrivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-[#E8DDD0] bg-white hover:bg-[#FFF8F0] transition-colors"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-[#2563EB] text-white text-xs font-bold">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A1208] truncate">{driver.name}</p>
                      <p className="text-[10px] text-[#8C7B6B]">
                        {driver.distance} away · ★ {driver.rating} · {driver.activeJobs} active
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="h-7 px-3 text-[11px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
                    >
                      Assign
                    </Button>
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
