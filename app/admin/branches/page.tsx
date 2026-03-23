'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Plus, Eye, LayoutList, GitBranch, ChevronRight, Globe, Building2 } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DataTable } from '@/components/shared';
import { formatCurrency } from '@/lib/utils';

const TYPE_COLORS: Record<string, string> = {
  hq: 'bg-[var(--ink)]/10 text-[var(--ink)]',
  branch: 'bg-blue-100 text-blue-800',
  agent: 'bg-amber-100 text-amber-800',
  partner: 'bg-violet-100 text-violet-800',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-700',
};

const FLAG: Record<string, string> = {
  US: '🇺🇸',
  NG: '🇳🇬',
  GH: '🇬🇭',
  KE: '🇰🇪',
  GB: '🇬🇧',
};

interface BranchRow {
  id: string;
  name: string;
  type: string;
  country: string;
  managerName: string;
  isActive: boolean;
  commissionRate?: number;
  shipmentCount: number;
  revenue: number;
  parentBranchId?: string;
}

const mockBranches: BranchRow[] = [
  { id: 'b7', name: 'Atlanta HQ', type: 'hq', country: 'US', managerName: 'Michael Chen', isActive: true, shipmentCount: 456, revenue: 52000 },
  { id: 'b1', name: 'Lagos HQ', type: 'hq', country: 'NG', managerName: 'Tunde Adeyemi', isActive: true, shipmentCount: 892, revenue: 45200, parentBranchId: 'b7' },
  { id: 'b2', name: 'Abuja Branch', type: 'branch', country: 'NG', managerName: 'Amina Sani', isActive: true, shipmentCount: 423, revenue: 21500, parentBranchId: 'b1' },
  { id: 'b3', name: 'Kano Branch', type: 'branch', country: 'NG', managerName: 'Ibrahim Musa', isActive: true, shipmentCount: 187, revenue: 9400, parentBranchId: 'b1' },
  { id: 'b4', name: 'Port Harcourt Branch', type: 'branch', country: 'NG', managerName: 'Emeka Nwankwo', isActive: true, shipmentCount: 234, revenue: 11800, parentBranchId: 'b1' },
  { id: 'b5', name: 'Accra Agent', type: 'agent', country: 'GH', managerName: 'Kwame Asante', isActive: true, commissionRate: 5.5, shipmentCount: 156, revenue: 7800, parentBranchId: 'b7' },
  { id: 'b6', name: 'Nairobi Agent', type: 'agent', country: 'KE', managerName: 'Wanjiku Kamau', isActive: true, commissionRate: 6.0, shipmentCount: 89, revenue: 4500, parentBranchId: 'b7' },
  { id: 'b8', name: 'Enugu Sub-Branch', type: 'agent', country: 'NG', managerName: 'Samuel Okonkwo', isActive: false, commissionRate: 4.0, shipmentCount: 45, revenue: 2200, parentBranchId: 'b2' },
];

export default function AdminBranchesPage() {
  const [view, setView] = useState<'table' | 'tree'>('table');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const columns: {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (item: BranchRow) => React.ReactNode;
  }[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (b: BranchRow) => (
        <Link href={`/admin/branches/${b.id}`} className="text-sm font-medium hover:text-[var(--terra)]">
          {b.name}
        </Link>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (b: BranchRow) => <Badge className={TYPE_COLORS[b.type]}>{b.type.replace('_', ' ')}</Badge>,
    },
    { key: 'country', label: 'Country', render: (b: BranchRow) => <span className="text-sm">{FLAG[b.country] || b.country}</span> },
    { key: 'managerName', label: 'Manager', render: (b: BranchRow) => <span className="text-sm">{b.managerName}</span> },
    { key: 'shipmentCount', label: 'Shipments', sortable: true, render: (b: BranchRow) => <span className="text-sm">{b.shipmentCount}</span> },
    { key: 'revenue', label: 'Revenue', sortable: true, render: (b: BranchRow) => <span className="text-sm font-medium">{formatCurrency(b.revenue, 'USD')}</span> },
    { key: 'commissionRate', label: 'Commission', render: (b: BranchRow) => <span className="text-sm">{b.commissionRate ? `${b.commissionRate}%` : '-'}</span> },
    {
      key: 'isActive',
      label: 'Status',
      render: (b: BranchRow) => (
        <Badge className={b.isActive ? STATUS_COLORS.active : STATUS_COLORS.inactive}>
          {b.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (b: BranchRow) => (
        <Button asChild variant="ghost" size="icon" className="h-7 w-7 text-gray-700 hover:text-[var(--terra)]">
          <Link href={`/admin/branches/${b.id}`} onClick={(e) => e.stopPropagation()}>
            <Eye size={14} />
          </Link>
        </Button>
      ),
    },
  ];

  const renderTree = (parentId?: string, depth: number = 0) => {
    const children = mockBranches.filter(
      (b) => b.parentBranchId === parentId || (!parentId && !b.parentBranchId)
    );
    if (children.length === 0) return null;

    return children.map((b) => (
      <div key={b.id}>
        <Link
          href={`/admin/branches/${b.id}`}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[var(--terra-pale)] ${depth > 0 ? 'ml-6' : ''}`}
          style={{ marginLeft: depth * 24 }}
        >
          <ChevronRight size={14} className="text-[var(--muted-text)]" />
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${b.type === 'hq' ? 'bg-[var(--ink)] text-white' : b.type === 'branch' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
            {b.type === 'hq' ? <Building2 size={14} /> : b.type === 'branch' ? <Globe size={14} /> : <GitBranch size={14} />}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">{b.name}</div>
            <div className="text-xs text-[var(--muted-text)]">
              {FLAG[b.country]} · {b.shipmentCount} shipments · {formatCurrency(b.revenue, 'USD')}
            </div>
          </div>
          <Badge className={TYPE_COLORS[b.type]}>{b.type}</Badge>
          {!b.isActive && <Badge className={STATUS_COLORS.inactive}>Inactive</Badge>}
        </Link>
        {renderTree(b.id, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[var(--ink)]">Branches</h1>
          <p className="text-xs text-[var(--muted-text)]">{mockBranches.length} branches</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-lg border border-[var(--border-warm)]">
            <button
              onClick={() => setView('table')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium ${view === 'table' ? 'bg-[var(--terra)] text-white' : 'bg-white text-gray-700'}`}
            >
              <LayoutList size={12} /> Table
            </button>
            <button
              onClick={() => setView('tree')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium ${view === 'tree' ? 'bg-[var(--terra)] text-white' : 'bg-white text-gray-700'}`}
            >
              <GitBranch size={12} /> Tree
            </button>
          </div>
          <Button
            className="gap-2 bg-[var(--terra)] text-white hover:bg-[var(--terra-light)]"
            onClick={() => setAddModalOpen(true)}
          >
            <Plus size={14} /> Add Branch
          </Button>
        </div>
      </div>

      {view === 'table' ? (
        <DataTable
          columns={columns}
          data={mockBranches}
          onRowClick={(b) => {
            window.location.href = `/admin/branches/${b.id}`;
          }}
          pageSize={10}
        />
      ) : (
        <div className="space-y-1 rounded-[var(--radius-lg)] border border-[var(--border-warm)] bg-[var(--warm-white)] p-4">
          {renderTree()}
        </div>
      )}

      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Branch</DialogTitle>
            <DialogDescription>Register a new branch or agent point.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold">Name</label>
              <Input placeholder="e.g. Abuja Branch" />
            </div>
            <div>
              <label className="text-xs font-semibold">Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hq">HQ</SelectItem>
                  <SelectItem value="branch">Branch</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold">Country</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">US</SelectItem>
                  <SelectItem value="NG">Nigeria</SelectItem>
                  <SelectItem value="GH">Ghana</SelectItem>
                  <SelectItem value="KE">Kenya</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold">Parent Branch</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent" />
                </SelectTrigger>
                <SelectContent>
                  {mockBranches
                    .filter((b) => b.type === 'hq' || b.type === 'branch')
                    .map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold">Manager Name</label>
              <Input placeholder="Manager name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold">Phone</label>
                <Input placeholder="+234..." />
              </div>
              <div>
                <label className="text-xs font-semibold">Email</label>
                <Input placeholder="branch@example.com" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button className="bg-[var(--terra)] text-white hover:bg-[var(--terra-light)]">Add Branch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
