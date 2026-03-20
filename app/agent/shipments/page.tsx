'use client';

import { useState } from 'react';
import { Package, ChevronDown } from 'lucide-react';
import { DataTable, FilterBar, RightDrawer, StatusBadge } from '@/components/shared';
import type { FilterConfig } from '@/components/shared';
import { Button } from '@/components/ui/button';
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
}

const mockShipments: AgentShipment[] = [
  { id: '1', trackingNumber: 'DS-20260320-LG01', customer: 'Emeka Okafor', origin: 'Lagos', destination: 'Abuja', type: 'parcel', status: 'in_transit_domestic', amount: '₦45,000', date: '2026-03-20', assignedDriver: 'Adebayo Ogundimu', weight: '5.2 kg', paymentMethod: 'COD' },
  { id: '2', trackingNumber: 'DS-20260320-LG02', customer: 'Aisha Bello', origin: 'Lagos', destination: 'Enugu', type: 'parcel', status: 'out_for_delivery', amount: '₦32,000', date: '2026-03-20', assignedDriver: 'Emeka Nwosu', weight: '3.1 kg', paymentMethod: 'Paid' },
  { id: '3', trackingNumber: 'DS-20260320-LG03', customer: 'Chinedu Nwosu', origin: 'Lagos', destination: 'Port Harcourt', type: 'cargo', status: 'delivered', amount: '₦28,500', date: '2026-03-20', assignedDriver: 'Ibrahim Musa', weight: '12 kg', paymentMethod: 'Paid' },
  { id: '4', trackingNumber: 'DS-20260320-LG04', customer: 'Fatima Yusuf', origin: 'Lagos', destination: 'Kano', type: 'parcel', status: 'in_transit_domestic', amount: '₦55,000', date: '2026-03-20', assignedDriver: 'Chinwe Eze', weight: '8.5 kg', paymentMethod: 'COD' },
  { id: '5', trackingNumber: 'DS-20260319-LG05', customer: 'Obinna Eze', origin: 'Ikeja', destination: 'Victoria Island', type: 'document', status: 'delivered', amount: '₦8,500', date: '2026-03-19', assignedDriver: 'Emeka Nwosu', weight: '0.5 kg', paymentMethod: 'Paid' },
  { id: '6', trackingNumber: 'DS-20260319-LG06', customer: 'Ngozi Adeyemi', origin: 'Lekki', destination: 'Ikeja', type: 'parcel', status: 'delivered', amount: '₦6,200', date: '2026-03-19', assignedDriver: 'Adebayo Ogundimu', weight: '2.0 kg', paymentMethod: 'Paid' },
  { id: '7', trackingNumber: 'DS-20260319-LG07', customer: 'Tunde Bakare', origin: 'Surulere', destination: 'Yaba', type: 'document', status: 'out_for_delivery', amount: '₦4,800', date: '2026-03-19', assignedDriver: 'Grace Okafor', weight: '0.3 kg', paymentMethod: 'COD' },
  { id: '8', trackingNumber: 'DS-20260318-LG08', customer: 'Blessing Okoro', origin: 'Lagos', destination: 'Ibadan', type: 'parcel', status: 'delivered', amount: '₦18,000', date: '2026-03-18', assignedDriver: 'Ibrahim Musa', weight: '4.5 kg', paymentMethod: 'Paid' },
  { id: '9', trackingNumber: 'DS-20260318-LG09', customer: 'Ahmed Sanni', origin: 'Apapa', destination: 'Lekki', type: 'cargo', status: 'delivered', amount: '₦12,500', date: '2026-03-18', assignedDriver: 'Emeka Nwosu', weight: '25 kg', paymentMethod: 'Paid' },
  { id: '10', trackingNumber: 'DS-20260318-LG10', customer: 'Chioma Obi', origin: 'Lagos', destination: 'Benin', type: 'parcel', status: 'in_transit_domestic', amount: '₦22,000', date: '2026-03-18', assignedDriver: 'Chinwe Eze', weight: '6.0 kg', paymentMethod: 'COD' },
  { id: '11', trackingNumber: 'DS-20260317-LG11', customer: 'Peter Nnamdi', origin: 'Lagos', destination: 'Warri', type: 'fragile', status: 'delivered', amount: '₦38,000', date: '2026-03-17', assignedDriver: 'Adebayo Ogundimu', weight: '3.5 kg', paymentMethod: 'Paid' },
  { id: '12', trackingNumber: 'DS-20260317-LG12', customer: 'Sade Adegoke', origin: 'VI', destination: 'Ikoyi', type: 'document', status: 'delivered', amount: '₦3,500', date: '2026-03-17', assignedDriver: 'Emeka Nwosu', weight: '0.2 kg', paymentMethod: 'Paid' },
  { id: '13', trackingNumber: 'DS-20260316-LG13', customer: 'Mustapha Ali', origin: 'Lagos', destination: 'Kaduna', type: 'cargo', status: 'delivered', amount: '₦62,000', date: '2026-03-16', assignedDriver: 'Fatima Bello', weight: '45 kg', paymentMethod: 'Paid' },
  { id: '14', trackingNumber: 'DS-20260316-LG14', customer: 'Yetunde Fashola', origin: 'Lekki', destination: 'Ajah', type: 'parcel', status: 'delivered', amount: '₦5,500', date: '2026-03-16', assignedDriver: 'Grace Okafor', weight: '1.8 kg', paymentMethod: 'COD' },
  { id: '15', trackingNumber: 'DS-20260315-LG15', customer: 'Emeka Okafor', origin: 'Lagos', destination: 'Owerri', type: 'parcel', status: 'delivered', amount: '₦25,000', date: '2026-03-15', assignedDriver: 'Ibrahim Musa', weight: '7.0 kg', paymentMethod: 'Paid' },
];

const filterConfig: FilterConfig[] = [
  { key: 'status', type: 'select', label: 'Status', options: [
    { label: 'In Transit', value: 'in_transit_domestic' },
    { label: 'Out for Delivery', value: 'out_for_delivery' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'At Warehouse', value: 'at_warehouse' },
    { label: 'Picked Up', value: 'picked_up' },
  ]},
  { key: 'type', type: 'select', label: 'Type', options: [
    { label: 'Parcel', value: 'parcel' },
    { label: 'Document', value: 'document' },
    { label: 'Cargo', value: 'cargo' },
    { label: 'Fragile', value: 'fragile' },
  ]},
  { key: 'search', type: 'search', label: 'Search', placeholder: 'Tracking or customer...' },
  { key: 'dateFrom', type: 'date', label: 'From' },
  { key: 'dateTo', type: 'date', label: 'To' },
];

function getTypeBadge(type: ShipmentType) {
  const config: Record<string, { label: string; bg: string; text: string }> = {
    parcel: { label: 'Parcel', bg: 'bg-blue-100', text: 'text-blue-700' },
    document: { label: 'Document', bg: 'bg-violet-100', text: 'text-violet-700' },
    cargo: { label: 'Cargo', bg: 'bg-amber-100', text: 'text-amber-700' },
    freight: { label: 'Freight', bg: 'bg-orange-100', text: 'text-orange-700' },
    fragile: { label: 'Fragile', bg: 'bg-red-100', text: 'text-red-700' },
    cold_chain: { label: 'Cold Chain', bg: 'bg-cyan-100', text: 'text-cyan-700' },
  };
  const c = config[type] || config.parcel;
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>{c.label}</span>;
}

export default function AgentShipmentsPage() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<AgentShipment | null>(null);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filtered = mockShipments.filter(s => {
    if (filters.status && s.status !== filters.status) return false;
    if (filters.type && s.type !== filters.type) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!s.trackingNumber.toLowerCase().includes(q) && !s.customer.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const columns = [
    { key: 'trackingNumber', label: 'Tracking ID', sortable: true, render: (s: AgentShipment) => <span className="font-mono text-xs font-semibold">{s.trackingNumber}</span> },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'route', label: 'Route', render: (s: AgentShipment) => <span className="text-sm">{s.origin} → {s.destination}</span> },
    { key: 'type', label: 'Type', render: (s: AgentShipment) => getTypeBadge(s.type) },
    { key: 'status', label: 'Status', render: (s: AgentShipment) => <StatusBadge status={s.status} /> },
    { key: 'amount', label: 'Amount', sortable: true, render: (s: AgentShipment) => <span className="font-semibold text-sm">{s.amount}</span> },
    { key: 'date', label: 'Date', sortable: true, render: (s: AgentShipment) => <span className="text-xs text-[var(--muted-text)]">{s.date}</span> },
    { key: 'actions', label: 'Actions', render: (s: AgentShipment) => (
      <div className="relative" onClick={e => e.stopPropagation()}>
        <select
          className="text-xs border border-[var(--border-warm)] rounded px-2 py-1 bg-[var(--warm-white)] text-[var(--ink)] cursor-pointer"
          defaultValue=""
          onChange={() => {}}
        >
          <option value="" disabled>Update...</option>
          <option value="picked_up">Picked Up</option>
          <option value="at_warehouse">At Warehouse</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="failed_delivery">Failed Delivery</option>
        </select>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <FilterBar filters={filterConfig} onFilterChange={handleFilterChange} onClear={() => setFilters({})} values={filters} />
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={s => { setSelected(s); setDrawerOpen(true); }}
        emptyState={{ icon: <Package size={24} />, title: 'No shipments found' }}
      />
      <RightDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Shipment Details">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-semibold">{selected.trackingNumber}</span>
              <StatusBadge status={selected.status} />
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[var(--muted-text)]">Customer</span><span className="font-medium">{selected.customer}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted-text)]">Route</span><span>{selected.origin} → {selected.destination}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted-text)]">Type</span>{getTypeBadge(selected.type)}</div>
              <div className="flex justify-between"><span className="text-[var(--muted-text)]">Weight</span><span>{selected.weight}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted-text)]">Amount</span><span className="font-semibold">{selected.amount}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted-text)]">Payment</span><span>{selected.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted-text)]">Driver</span><span>{selected.assignedDriver}</span></div>
            </div>
            <div className="border-t border-[var(--border-warm)] pt-4">
              <label className="text-xs font-semibold text-[var(--muted-text)] mb-1.5 block">Update Status</label>
              <select className="w-full text-sm border border-[var(--border-warm)] rounded-lg px-3 py-2 bg-[var(--warm-white)]">
                <option value="picked_up">Picked Up</option>
                <option value="at_warehouse">At Warehouse</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="failed_delivery">Failed Delivery</option>
              </select>
              <Button className="w-full mt-3 bg-[var(--gold)] hover:bg-[var(--gold-dark)] text-[var(--ink)] font-semibold">Update Status</Button>
            </div>
          </div>
        )}
      </RightDrawer>
    </div>
  );
}
