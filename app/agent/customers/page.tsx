'use client';

import { useState } from 'react';
import { Users, Phone, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DataTable, FilterBar, RightDrawer, StatusBadge } from '@/components/shared';
import type { FilterConfig } from '@/components/shared';

interface Customer {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  accountType: string;
  kycStatus: string;
  shipmentCount: number;
  totalSpend: string;
  joinedAt: string;
  lastShipment: string;
}

const mockCustomers: Customer[] = [
  { id: '1', name: 'Emeka Okafor', initials: 'EO', email: 'emeka.okafor@email.com', phone: '+2348012345001', accountType: 'business', kycStatus: 'approved', shipmentCount: 24, totalSpend: '₦1,250,000', joinedAt: '2025-06-15', lastShipment: '2026-03-20' },
  { id: '2', name: 'Aisha Bello', initials: 'AB', email: 'aisha.bello@email.com', phone: '+2348012345002', accountType: 'individual', kycStatus: 'approved', shipmentCount: 8, totalSpend: '₦320,000', joinedAt: '2025-09-20', lastShipment: '2026-03-20' },
  { id: '3', name: 'Chinedu Nwosu', initials: 'CN', email: 'chinedu.nwosu@email.com', phone: '+2348012345003', accountType: 'business', kycStatus: 'approved', shipmentCount: 42, totalSpend: '₦2,850,000', joinedAt: '2024-11-01', lastShipment: '2026-03-20' },
  { id: '4', name: 'Fatima Yusuf', initials: 'FY', email: 'fatima.yusuf@email.com', phone: '+2348012345004', accountType: 'individual', kycStatus: 'pending', shipmentCount: 3, totalSpend: '₦165,000', joinedAt: '2026-02-10', lastShipment: '2026-03-20' },
  { id: '5', name: 'Obinna Eze', initials: 'OE', email: 'obinna.eze@email.com', phone: '+2348012345005', accountType: 'business', kycStatus: 'approved', shipmentCount: 18, totalSpend: '₦890,000', joinedAt: '2025-04-22', lastShipment: '2026-03-19' },
  { id: '6', name: 'Ngozi Adeyemi', initials: 'NA', email: 'ngozi.adeyemi@email.com', phone: '+2348012345006', accountType: 'individual', kycStatus: 'approved', shipmentCount: 12, totalSpend: '₦450,000', joinedAt: '2025-07-30', lastShipment: '2026-03-19' },
  { id: '7', name: 'Tunde Bakare', initials: 'TB', email: 'tunde.bakare@email.com', phone: '+2348012345007', accountType: 'corporate', kycStatus: 'approved', shipmentCount: 67, totalSpend: '₦5,200,000', joinedAt: '2024-03-15', lastShipment: '2026-03-19' },
  { id: '8', name: 'Blessing Okoro', initials: 'BO', email: 'blessing.okoro@email.com', phone: '+2348012345008', accountType: 'individual', kycStatus: 'approved', shipmentCount: 6, totalSpend: '₦210,000', joinedAt: '2025-12-01', lastShipment: '2026-03-18' },
  { id: '9', name: 'Ahmed Sanni', initials: 'AS', email: 'ahmed.sanni@email.com', phone: '+2348012345009', accountType: 'business', kycStatus: 'rejected', shipmentCount: 2, totalSpend: '₦75,000', joinedAt: '2026-01-15', lastShipment: '2026-03-18' },
  { id: '10', name: 'Chioma Obi', initials: 'CO', email: 'chioma.obi@email.com', phone: '+2348012345010', accountType: 'individual', kycStatus: 'approved', shipmentCount: 15, totalSpend: '₦620,000', joinedAt: '2025-05-10', lastShipment: '2026-03-18' },
  { id: '11', name: 'Peter Nnamdi', initials: 'PN', email: 'peter.nnamdi@email.com', phone: '+2348012345011', accountType: 'business', kycStatus: 'approved', shipmentCount: 31, totalSpend: '₦1,780,000', joinedAt: '2025-01-20', lastShipment: '2026-03-17' },
  { id: '12', name: 'Sade Adegoke', initials: 'SA', email: 'sade.adegoke@email.com', phone: '+2348012345012', accountType: 'corporate', kycStatus: 'approved', shipmentCount: 89, totalSpend: '₦8,400,000', joinedAt: '2024-01-10', lastShipment: '2026-03-17' },
];

const filterConfig: FilterConfig[] = [
  { key: 'accountType', type: 'select', label: 'Account Type', options: [
    { label: 'Individual', value: 'individual' },
    { label: 'Business', value: 'business' },
    { label: 'Corporate', value: 'corporate' },
  ]},
  { key: 'kycStatus', type: 'select', label: 'KYC Status', options: [
    { label: 'Approved', value: 'approved' },
    { label: 'Pending', value: 'pending' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'None', value: 'none' },
  ]},
  { key: 'search', type: 'search', label: 'Search', placeholder: 'Name or email...' },
];

function getKycBadge(status: string) {
  const config: Record<string, { label: string; bg: string; text: string }> = {
    approved: { label: 'Verified', bg: 'bg-green-100', text: 'text-green-700' },
    pending: { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-700' },
    rejected: { label: 'Rejected', bg: 'bg-red-100', text: 'text-red-700' },
    none: { label: 'Not Started', bg: 'bg-gray-100', text: 'text-gray-700' },
  };
  const c = config[status] || config.none;
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>{c.label}</span>;
}

function getTypeLabel(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

const recentShipments = [
  { tracking: 'DS-20260320-LG01', route: 'Lagos → Abuja', status: 'in_transit_domestic' as const, amount: '₦45,000' },
  { tracking: 'DS-20260319-LG05', route: 'Ikeja → VI', status: 'delivered' as const, amount: '₦8,500' },
  { tracking: 'DS-20260318-LG08', route: 'Lagos → Ibadan', status: 'delivered' as const, amount: '₦18,000' },
  { tracking: 'DS-20260316-LG13', route: 'Lagos → Kaduna', status: 'delivered' as const, amount: '₦62,000' },
  { tracking: 'DS-20260315-LG15', route: 'Lagos → Owerri', status: 'delivered' as const, amount: '₦25,000' },
];

export default function AgentCustomersPage() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filtered = mockCustomers.filter(c => {
    if (filters.accountType && c.accountType !== filters.accountType) return false;
    if (filters.kycStatus && c.kycStatus !== filters.kycStatus) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const columns = [
    { key: 'name', label: 'Name', sortable: true, render: (c: Customer) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px] font-bold bg-[var(--gold-pale)] text-[var(--gold-dark)]">{c.initials}</AvatarFallback></Avatar>
        <span className="font-medium text-sm">{c.name}</span>
      </div>
    )},
    { key: 'email', label: 'Email', render: (c: Customer) => <span className="text-xs text-[var(--muted-text)]">{c.email}</span> },
    { key: 'phone', label: 'Phone', render: (c: Customer) => <span className="text-xs">{c.phone}</span> },
    { key: 'accountType', label: 'Account', sortable: true, render: (c: Customer) => <span className="text-xs">{getTypeLabel(c.accountType)}</span> },
    { key: 'kycStatus', label: 'KYC', render: (c: Customer) => getKycBadge(c.kycStatus) },
    { key: 'shipmentCount', label: 'Shipments', sortable: true, render: (c: Customer) => <span className="font-semibold text-sm">{c.shipmentCount}</span> },
    { key: 'totalSpend', label: 'Total Spend', sortable: true, render: (c: Customer) => <span className="font-semibold text-sm">{c.totalSpend}</span> },
    { key: 'joinedAt', label: 'Joined', sortable: true, render: (c: Customer) => <span className="text-xs text-[var(--muted-text)]">{c.joinedAt}</span> },
  ];

  return (
    <div className="space-y-6">
      <FilterBar filters={filterConfig} onFilterChange={handleFilterChange} onClear={() => setFilters({})} values={filters} />
      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={c => { setSelected(c); setDrawerOpen(true); }}
        emptyState={{ icon: <Users size={24} />, title: 'No customers found' }}
      />
      <RightDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Customer Profile">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12"><AvatarFallback className="text-sm font-bold bg-[var(--gold-pale)] text-[var(--gold-dark)]">{selected.initials}</AvatarFallback></Avatar>
              <div>
                <p className="font-semibold text-[var(--ink)]">{selected.name}</p>
                <p className="text-xs text-[var(--muted-text)]">{selected.email}</p>
              </div>
              {getKycBadge(selected.kycStatus)}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[var(--muted-text)]">Phone</span><span>{selected.phone}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted-text)]">Account</span><span>{getTypeLabel(selected.accountType)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted-text)]">Shipments</span><span className="font-semibold">{selected.shipmentCount}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted-text)]">Total Spend</span><span className="font-semibold">{selected.totalSpend}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted-text)]">Joined</span><span>{selected.joinedAt}</span></div>
            </div>

            <div className="border-t border-[var(--border-warm)] pt-4">
              <h4 className="text-xs font-semibold text-[var(--muted-text)] mb-3">Recent Shipments</h4>
              <div className="space-y-2">
                {recentShipments.map(s => (
                  <div key={s.tracking} className="flex items-center justify-between text-xs p-2 rounded border border-[var(--border-warm)]">
                    <div>
                      <span className="font-mono font-semibold">{s.tracking}</span>
                      <span className="text-[var(--muted-text)] ml-2">{s.route}</span>
                    </div>
                    <span className="font-semibold">{s.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[var(--border-warm)] pt-4">
              <h4 className="text-xs font-semibold text-[var(--muted-text)] mb-3">Contact</h4>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1 flex-1 border-[var(--border-warm)]"><Phone size={13} /> Call</Button>
                <Button variant="outline" size="sm" className="gap-1 flex-1 border-[var(--border-warm)]"><Mail size={13} /> Email</Button>
                <Button variant="outline" size="sm" className="gap-1 flex-1 border-green-300 text-green-700 hover:bg-green-50"><MessageCircle size={13} /> WhatsApp</Button>
              </div>
            </div>
          </div>
        )}
      </RightDrawer>
    </div>
  );
}
