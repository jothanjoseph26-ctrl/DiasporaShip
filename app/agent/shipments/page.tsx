'use client';

import { useMemo, useState } from 'react';
import { Package } from 'lucide-react';
import { DataTable, FilterBar, RightDrawer, StatusBadge } from '@/components/shared';
import type { FilterConfig } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import type { ShipmentStatus, ShipmentType } from '@/types';

interface AgentShipment {
  id: string;
  trackingNumber: string;
  customer: string;
  origin: string;
  destination: string;
  type: ShipmentType;
  status: ShipmentStatus;
  amount: string;
  date: string;
  assignedDriver: string;
  weight: string;
  paymentMethod: string;
  story: string;
}

const curatedShipments: AgentShipment[] = [
  {
    id: '1',
    trackingNumber: 'DS-20260318-A1B2C3',
    customer: 'John Okafor',
    origin: 'Atlanta',
    destination: 'Lagos',
    type: 'parcel',
    status: 'delivered',
    amount: '$242.75',
    date: '2026-03-25',
    assignedDriver: 'Adebayo Ogundimu',
    weight: '12.5 kg',
    paymentMethod: 'Paid',
    story: 'Hero corridor shipment',
  },
  {
    id: '2',
    trackingNumber: 'DS-20260312-G7H8I9',
    customer: 'TechCorp Ltd',
    origin: 'Guangzhou',
    destination: 'Apapa',
    type: 'cargo',
    status: 'customs_held',
    amount: '$7,525.00',
    date: '2026-03-18',
    assignedDriver: 'Customs desk',
    weight: '1250 kg',
    paymentMethod: 'Paid',
    story: 'Missing customs document exception',
  },
  {
    id: '3',
    trackingNumber: 'DS-20260319-M4N5O6',
    customer: 'Grace Nwosu',
    origin: 'Lagos',
    destination: 'Port Harcourt',
    type: 'parcel',
    status: 'out_for_delivery',
    amount: '₦9,200',
    date: '2026-03-21',
    assignedDriver: 'Emeka Nwosu',
    weight: '3.8 kg',
    paymentMethod: 'Paid',
    story: 'Failed first delivery attempt recovery',
  },
];

const filterConfig: FilterConfig[] = [
  {
    key: 'status',
    type: 'select',
    label: 'Status',
    options: [
      { label: 'Delivered', value: 'delivered' },
      { label: 'Customs Hold', value: 'customs_held' },
      { label: 'Out for Delivery', value: 'out_for_delivery' },
    ],
  },
  {
    key: 'type',
    type: 'select',
    label: 'Type',
    options: [
      { label: 'Parcel', value: 'parcel' },
      { label: 'Cargo', value: 'cargo' },
    ],
  },
  { key: 'search', type: 'search', label: 'Search', placeholder: 'Tracking or customer' },
];

function getTypeBadge(type: ShipmentType) {
  const config: Record<string, { label: string; className: string }> = {
    parcel: { label: 'Parcel', className: 'bg-blue-100 text-blue-700' },
    cargo: { label: 'Cargo', className: 'bg-amber-100 text-amber-700' },
  };
  const current = config[type] ?? config.parcel;
  return <Badge className={current.className}>{current.label}</Badge>;
}

export default function AgentShipmentsPage() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<AgentShipment | null>(null);

  const filtered = useMemo(() => {
    return curatedShipments.filter((shipment) => {
      if (filters.status && shipment.status !== filters.status) return false;
      if (filters.type && shipment.type !== filters.type) return false;
      if (filters.search) {
        const term = filters.search.toLowerCase();
        if (!shipment.trackingNumber.toLowerCase().includes(term) && !shipment.customer.toLowerCase().includes(term)) return false;
      }
      return true;
    });
  }, [filters]);

  const columns = [
    { key: 'trackingNumber', label: 'Tracking ID', sortable: true, render: (shipment: AgentShipment) => <span className="font-mono text-xs font-semibold">{shipment.trackingNumber}</span> },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'route', label: 'Route', render: (shipment: AgentShipment) => <span className="text-sm">{shipment.origin} -&gt; {shipment.destination}</span> },
    { key: 'type', label: 'Type', render: (shipment: AgentShipment) => getTypeBadge(shipment.type) },
    { key: 'status', label: 'Status', render: (shipment: AgentShipment) => <StatusBadge status={shipment.status} /> },
    { key: 'amount', label: 'Amount', sortable: true, render: (shipment: AgentShipment) => <span className="font-semibold text-sm">{shipment.amount}</span> },
    { key: 'date', label: 'Date', sortable: true, render: (shipment: AgentShipment) => <span className="text-xs text-[var(--muted-text)]">{shipment.date}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--cream)] p-4 text-sm text-[var(--muted-text)]">
        Agent view is now limited to the curated walkthrough shipments so the presenter cannot drift into unrelated legacy records.
      </div>

      <FilterBar filters={filterConfig} onFilterChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))} onClear={() => setFilters({})} values={filters} />

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(shipment) => {
          setSelected(shipment);
          setDrawerOpen(true);
        }}
        emptyState={{ icon: <Package size={24} />, title: 'No curated shipments found' }}
      />

      <RightDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Shipment Details">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-semibold">{selected.trackingNumber}</span>
              <StatusBadge status={selected.status} />
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[var(--muted-text)]">Story</span><span className="font-medium">{selected.story}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted-text)]">Customer</span><span className="font-medium">{selected.customer}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted-text)]">Route</span><span>{selected.origin} -&gt; {selected.destination}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted-text)]">Type</span>{getTypeBadge(selected.type)}</div>
              <div className="flex justify-between"><span className="text-[var(--muted-text)]">Weight</span><span>{selected.weight}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted-text)]">Amount</span><span className="font-semibold">{selected.amount}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted-text)]">Driver</span><span>{selected.assignedDriver}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted-text)]">Payment</span><span>{selected.paymentMethod}</span></div>
            </div>
          </div>
        )}
      </RightDrawer>
    </div>
  );
}
