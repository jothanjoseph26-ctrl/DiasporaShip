'use client';

import { Package, DollarSign, Users, Truck, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KpiCard, DataTable, StatusBadge } from '@/components/shared';
import type { ShipmentStatus } from '@/types';

interface RecentShipment {
  id: string;
  trackingNumber: string;
  customer: string;
  route: string;
  status: ShipmentStatus;
  amount: string;
}

const recentShipments: RecentShipment[] = [
  { id: '1', trackingNumber: 'DS-20260320-LG01', customer: 'Emeka Okafor', route: 'Lagos → Abuja', status: 'in_transit_domestic', amount: '₦45,000' },
  { id: '2', trackingNumber: 'DS-20260320-LG02', customer: 'Aisha Bello', route: 'Lagos → Enugu', status: 'out_for_delivery', amount: '₦32,000' },
  { id: '3', trackingNumber: 'DS-20260320-LG03', customer: 'Chinedu Nwosu', route: 'Lagos → PH', status: 'delivered', amount: '₦28,500' },
  { id: '4', trackingNumber: 'DS-20260320-LG04', customer: 'Fatima Yusuf', route: 'Lagos → Kano', status: 'in_transit_domestic', amount: '₦55,000' },
  { id: '5', trackingNumber: 'DS-20260319-LG05', customer: 'Obinna Eze', route: 'Ikeja → VI', status: 'delivered', amount: '₦8,500' },
  { id: '6', trackingNumber: 'DS-20260319-LG06', customer: 'Ngozi Adeyemi', route: 'Lekki → Ikeja', status: 'delivered', amount: '₦6,200' },
  { id: '7', trackingNumber: 'DS-20260319-LG07', customer: 'Tunde Bakare', route: 'Surulere → Yaba', status: 'out_for_delivery', amount: '₦4,800' },
  { id: '8', trackingNumber: 'DS-20260318-LG08', customer: 'Blessing Okoro', route: 'Lagos → Ibadan', status: 'delivered', amount: '₦18,000' },
  { id: '9', trackingNumber: 'DS-20260318-LG09', customer: 'Ahmed Sanni', route: 'Apapa → Lekki', status: 'delivered', amount: '₦12,500' },
  { id: '10', trackingNumber: 'DS-20260318-LG10', customer: 'Chioma Obi', route: 'Lagos → Benin', status: 'in_transit_domestic', amount: '₦22,000' },
];

export default function AgentDashboard() {
  const columns = [
    { key: 'trackingNumber', label: 'Tracking ID', sortable: true, render: (s: RecentShipment) => <span className="font-mono text-xs font-semibold">{s.trackingNumber}</span> },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'route', label: 'Route' },
    { key: 'status', label: 'Status', render: (s: RecentShipment) => <StatusBadge status={s.status} /> },
    { key: 'amount', label: 'Amount', sortable: true, render: (s: RecentShipment) => <span className="font-semibold text-sm">{s.amount}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-playfair)' }}>Lagos Hub</h2>
          <p className="text-sm text-[var(--muted-text)]">Lagos, Nigeria 🇳🇬</p>
        </div>
        <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--gold-pale)] text-[var(--gold-dark)] border border-[var(--gold)]/20">8%</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={<Package size={18} />} label="Shipments Today" value="23" trend="+5" variant="terra" />
        <KpiCard icon={<DollarSign size={18} />} label="Revenue This Month" value="$8,450" trend="+12%" variant="gold" />
        <KpiCard icon={<Users size={18} />} label="Customers Total" value="156" trend="+8" variant="ink" />
        <KpiCard icon={<Truck size={18} />} label="Active Local Drivers" value="12" variant="terra" />
      </div>

      <div className="bg-[var(--ink)] rounded-[var(--radius-lg)] p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Wallet size={16} className="text-[var(--gold)]" />
          <h3 className="text-sm font-semibold text-[var(--warm-white)]">Cash Reconciliation</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          <div>
            <p className="text-xs text-[var(--warm-white)]/50 mb-1">COD Collected Today</p>
            <p className="text-3xl font-bold text-[var(--gold)]" style={{ fontFamily: 'var(--font-playfair)' }}>$1,240</p>
          </div>
          <div>
            <p className="text-xs text-[var(--warm-white)]/50 mb-1">Pending Payout</p>
            <p className="text-2xl font-bold text-[var(--warm-white)]" style={{ fontFamily: 'var(--font-playfair)' }}>$3,680</p>
          </div>
          <div className="flex justify-end">
            <Button className="bg-[var(--gold)] hover:bg-[var(--gold-dark)] text-[var(--ink)] font-semibold">Request Settlement</Button>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={recentShipments}
        emptyState={{ icon: <Package size={24} />, title: 'No recent shipments' }}
      />
    </div>
  );
}
