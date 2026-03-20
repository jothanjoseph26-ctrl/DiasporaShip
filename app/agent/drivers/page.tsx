'use client';

import { Truck, Eye, Phone, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DataTable } from '@/components/shared';

interface AgentDriver {
  id: string;
  name: string;
  initials: string;
  phone: string;
  status: 'online' | 'offline' | 'on_trip';
  totalDeliveries: number;
  onTimeRate: number;
  rating: number;
  earningsBalance: string;
}

const mockDrivers: AgentDriver[] = [
  { id: '1', name: 'Adebayo Ogundimu', initials: 'AO', phone: '+2348012345678', status: 'on_trip', totalDeliveries: 847, onTimeRate: 94.5, rating: 4.8, earningsBalance: '₦125,000' },
  { id: '2', name: 'Emeka Nwosu', initials: 'EN', phone: '+2348034567890', status: 'online', totalDeliveries: 1243, onTimeRate: 98.1, rating: 4.7, earningsBalance: '₦156,000' },
  { id: '3', name: 'Grace Okafor', initials: 'GO', phone: '+2348067890123', status: 'offline', totalDeliveries: 234, onTimeRate: 91.2, rating: 4.4, earningsBalance: '₦32,000' },
  { id: '4', name: 'Chinwe Eze', initials: 'CE', phone: '+2348023456789', status: 'online', totalDeliveries: 562, onTimeRate: 97.2, rating: 4.9, earningsBalance: '₦89,000' },
  { id: '5', name: 'Ibrahim Musa', initials: 'IM', phone: '+2348056789012', status: 'on_trip', totalDeliveries: 489, onTimeRate: 95.6, rating: 4.5, earningsBalance: '₦67,000' },
  { id: '6', name: 'Fatima Bello', initials: 'FB', phone: '+2348045678901', status: 'online', totalDeliveries: 312, onTimeRate: 92.8, rating: 4.6, earningsBalance: '₦45,000' },
  { id: '7', name: 'Tunde Adeyemi', initials: 'TA', phone: '+2348078901234', status: 'online', totalDeliveries: 189, onTimeRate: 93.7, rating: 4.3, earningsBalance: '₦28,000' },
  { id: '8', name: 'Ngozi Okonkwo', initials: 'NO', phone: '+2348089012345', status: 'offline', totalDeliveries: 678, onTimeRate: 96.4, rating: 4.8, earningsBalance: '₦112,000' },
];

function getStatusBadge(status: string) {
  const config: Record<string, { label: string; bg: string; text: string }> = {
    online: { label: 'Online', bg: 'bg-green-100', text: 'text-green-700' },
    offline: { label: 'Offline', bg: 'bg-gray-100', text: 'text-gray-700' },
    on_trip: { label: 'On Trip', bg: 'bg-blue-100', text: 'text-blue-700' },
  };
  const c = config[status] || config.offline;
  return <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}><span className={`w-1.5 h-1.5 rounded-full ${c.text.replace('text-', 'bg-')}`} />{c.label}</span>;
}

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={12} className={i <= Math.round(rating) ? 'fill-[var(--gold)] text-[var(--gold)]' : 'text-gray-300'} />
      ))}
      <span className="text-xs text-[var(--muted-text)] ml-1">{rating}</span>
    </div>
  );
}

export default function AgentDriversPage() {
  const columns = [
    { key: 'name', label: 'Name', sortable: true, render: (d: AgentDriver) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px] font-bold bg-[var(--gold-pale)] text-[var(--gold-dark)]">{d.initials}</AvatarFallback></Avatar>
        <span className="font-medium text-sm">{d.name}</span>
      </div>
    )},
    { key: 'phone', label: 'Phone', render: (d: AgentDriver) => <span className="text-xs">{d.phone}</span> },
    { key: 'status', label: 'Status', render: (d: AgentDriver) => getStatusBadge(d.status) },
    { key: 'totalDeliveries', label: 'Deliveries', sortable: true, render: (d: AgentDriver) => <span className="font-semibold text-sm">{d.totalDeliveries}</span> },
    { key: 'onTimeRate', label: 'On-Time Rate', sortable: true, render: (d: AgentDriver) => <span className="text-sm font-medium">{d.onTimeRate}%</span> },
    { key: 'rating', label: 'Rating', sortable: true, render: (d: AgentDriver) => renderStars(d.rating) },
    { key: 'earningsBalance', label: 'Balance', sortable: true, render: (d: AgentDriver) => <span className="font-semibold text-sm">{d.earningsBalance}</span> },
    { key: 'actions', label: 'Actions', render: (d: AgentDriver) => (
      <div className="flex gap-1">
        <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-700 hover:text-[var(--ink)]"><Eye size={13} /></Button>
        <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-700 hover:text-[var(--ink)]"><Phone size={13} /></Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <DataTable columns={columns} data={mockDrivers} emptyState={{ icon: <Truck size={24} />, title: 'No drivers found' }} />
    </div>
  );
}
