'use client';

import { useState } from 'react';
import { Package } from 'lucide-react';
import { DataTable, FilterBar, StatusBadge } from '@/components/shared';
import type { FilterConfig } from '@/components/shared';
import type { ShipmentStatus } from '@/types';

interface CustomsShipment {
  id: string;
  trackingNumber: string;
  customer: string;
  origin: string;
  destination: string;
  originFlag: string;
  destFlag: string;
  hsCode: string;
  declaredValue: string;
  dutiesEstimate: string;
  docsStatus: string;
  status: ShipmentStatus;
  updatedAt: string;
}

const mockShipments: CustomsShipment[] = [
  { id: '1', trackingNumber: 'DS-20260320-A001', customer: 'Okafor Trading Co.', origin: 'US', destination: 'NG', originFlag: '🇺🇸', destFlag: '🇳🇬', hsCode: '8473.30', declaredValue: '$2,450', dutiesEstimate: '$245', docsStatus: 'submitted', status: 'customs_pending', updatedAt: '2026-03-20' },
  { id: '2', trackingNumber: 'DS-20260320-A002', customer: 'Adebayo Imports', origin: 'UK', destination: 'NG', originFlag: '🇬🇧', destFlag: '🇳🇬', hsCode: '6204.62', declaredValue: '$1,200', dutiesEstimate: '$180', docsStatus: 'submitted', status: 'customs_pending', updatedAt: '2026-03-20' },
  { id: '3', trackingNumber: 'DS-20260320-A003', customer: 'TechHub Lagos', origin: 'CN', destination: 'NG', originFlag: '🇨🇳', destFlag: '🇳🇬', hsCode: '8517.12', declaredValue: '$15,800', dutiesEstimate: '$3,160', docsStatus: 'submitted', status: 'customs_held', updatedAt: '2026-03-20' },
  { id: '4', trackingNumber: 'DS-20260320-A004', customer: 'Grace Fabrics', origin: 'NG', destination: 'GH', originFlag: '🇳🇬', destFlag: '🇬🇭', hsCode: '5209.31', declaredValue: '$3,600', dutiesEstimate: '$360', docsStatus: 'submitted', status: 'customs_pending', updatedAt: '2026-03-20' },
  { id: '5', trackingNumber: 'DS-20260319-A005', customer: 'Kamau Electronics', origin: 'US', destination: 'KE', originFlag: '🇺🇸', destFlag: '🇰🇪', hsCode: '8471.30', declaredValue: '$4,200', dutiesEstimate: '$630', docsStatus: 'submitted', status: 'customs_pending', updatedAt: '2026-03-19' },
  { id: '6', trackingNumber: 'DS-20260318-B001', customer: 'Belmonte & Sons', origin: 'UK', destination: 'NG', originFlag: '🇬🇧', destFlag: '🇳🇬', hsCode: '9403.60', declaredValue: '$7,800', dutiesEstimate: '$1,170', docsStatus: 'cleared', status: 'customs_cleared', updatedAt: '2026-03-18' },
  { id: '7', trackingNumber: 'DS-20260318-B002', customer: 'Osei Fashion House', origin: 'FR', destination: 'GH', originFlag: '🇫🇷', destFlag: '🇬🇭', hsCode: '6205.20', declaredValue: '$2,100', dutiesEstimate: '$315', docsStatus: 'submitted', status: 'customs_held', updatedAt: '2026-03-18' },
  { id: '8', trackingNumber: 'DS-20260317-B003', customer: 'Njoku Machinery', origin: 'CN', destination: 'NG', originFlag: '🇨🇳', destFlag: '🇳🇬', hsCode: '8462.10', declaredValue: '$42,000', dutiesEstimate: '$8,400', docsStatus: 'cleared', status: 'customs_cleared', updatedAt: '2026-03-17' },
  { id: '9', trackingNumber: 'DS-20260317-B004', customer: 'Kimani Books', origin: 'US', destination: 'KE', originFlag: '🇺🇸', destFlag: '🇰🇪', hsCode: '4901.99', declaredValue: '$890', dutiesEstimate: '$89', docsStatus: 'cleared', status: 'customs_cleared', updatedAt: '2026-03-17' },
  { id: '10', trackingNumber: 'DS-20260317-B005', customer: 'Abiodun Textiles', origin: 'IN', destination: 'NG', originFlag: '🇮🇳', destFlag: '🇳🇬', hsCode: '5512.19', declaredValue: '$12,400', dutiesEstimate: '$2,480', docsStatus: 'cleared', status: 'customs_cleared', updatedAt: '2026-03-17' },
  { id: '11', trackingNumber: 'DS-20260316-B006', customer: 'Otieno Solar', origin: 'CN', destination: 'KE', originFlag: '🇨🇳', destFlag: '🇰🇪', hsCode: '8541.40', declaredValue: '$22,000', dutiesEstimate: '$3,300', docsStatus: 'submitted', status: 'customs_pending', updatedAt: '2026-03-16' },
  { id: '12', trackingNumber: 'DS-20260316-B007', customer: 'Okonkwo Metals', origin: 'AU', destination: 'NG', originFlag: '🇦🇺', destFlag: '🇳🇬', hsCode: '7208.51', declaredValue: '$38,500', dutiesEstimate: '$7,700', docsStatus: 'cleared', status: 'in_transit_international', updatedAt: '2026-03-16' },
  { id: '13', trackingNumber: 'DS-20260315-B008', customer: 'Asante Traders', origin: 'CN', destination: 'GH', originFlag: '🇨🇳', destFlag: '🇬🇭', hsCode: '6402.99', declaredValue: '$6,750', dutiesEstimate: '$675', docsStatus: 'cleared', status: 'customs_cleared', updatedAt: '2026-03-15' },
  { id: '14', trackingNumber: 'DS-20260315-B009', customer: 'Oluwaseun Foods', origin: 'NG', destination: 'US', originFlag: '🇳🇬', destFlag: '🇺🇸', hsCode: '1904.10', declaredValue: '$4,500', dutiesEstimate: '$225', docsStatus: 'cleared', status: 'in_transit_international', updatedAt: '2026-03-15' },
  { id: '15', trackingNumber: 'DS-20260314-B010', customer: 'Achebe & Partners', origin: 'DE', destination: 'NG', originFlag: '🇩🇪', destFlag: '🇳🇬', hsCode: '9018.90', declaredValue: '$65,000', dutiesEstimate: '$13,000', docsStatus: 'cleared', status: 'customs_cleared', updatedAt: '2026-03-14' },
];

const filterConfig: FilterConfig[] = [
  { key: 'status', type: 'select', label: 'Status', options: [
    { label: 'Customs Pending', value: 'customs_pending' },
    { label: 'Cleared', value: 'customs_cleared' },
    { label: 'Held', value: 'customs_held' },
    { label: 'In Transit Intl', value: 'in_transit_international' },
  ]},
  { key: 'country', type: 'select', label: 'Country', options: [
    { label: 'Nigeria', value: 'NG' },
    { label: 'Ghana', value: 'GH' },
    { label: 'Kenya', value: 'KE' },
    { label: 'United States', value: 'US' },
    { label: 'United Kingdom', value: 'UK' },
  ]},
  { key: 'dateFrom', type: 'date', label: 'From' },
  { key: 'dateTo', type: 'date', label: 'To' },
];

function getDocsBadge(status: string) {
  const config: Record<string, { label: string; bg: string; text: string }> = {
    submitted: { label: 'Submitted', bg: 'bg-blue-100', text: 'text-blue-700' },
    cleared: { label: 'Cleared', bg: 'bg-green-100', text: 'text-green-700' },
    pending: { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-700' },
  };
  const c = config[status] || config.pending;
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>{c.label}</span>;
}

export default function CustomsShipmentsPage() {
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filtered = mockShipments.filter(s => {
    if (filters.status && s.status !== filters.status) return false;
    if (filters.country && s.origin !== filters.country && s.destination !== filters.country) return false;
    return true;
  });

  const columns = [
    { key: 'trackingNumber', label: 'Tracking ID', sortable: true, render: (s: CustomsShipment) => <span className="font-mono text-xs font-semibold">{s.trackingNumber}</span> },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'route', label: 'Route', render: (s: CustomsShipment) => <span className="text-sm">{s.originFlag} → {s.destFlag}</span> },
    { key: 'hsCode', label: 'HS Code', render: (s: CustomsShipment) => <span className="font-mono text-xs">{s.hsCode}</span> },
    { key: 'declaredValue', label: 'Declared Value', sortable: true },
    { key: 'dutiesEstimate', label: 'Duties Est.' },
    { key: 'docsStatus', label: 'Docs', render: (s: CustomsShipment) => getDocsBadge(s.docsStatus) },
    { key: 'status', label: 'Status', render: (s: CustomsShipment) => <StatusBadge status={s.status} /> },
    { key: 'updatedAt', label: 'Updated', sortable: true, render: (s: CustomsShipment) => <span className="text-xs text-[var(--muted-text)]">{s.updatedAt}</span> },
  ];

  return (
    <div className="space-y-6">
      <FilterBar filters={filterConfig} onFilterChange={handleFilterChange} onClear={() => setFilters({})} values={filters} />
      <DataTable columns={columns} data={filtered} emptyState={{ icon: <Package size={24} />, title: 'No shipments found' }} />
    </div>
  );
}
