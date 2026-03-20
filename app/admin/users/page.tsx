'use client';

import { useState, useMemo } from 'react';
import { Eye, UserCheck, Key, Wallet, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, FilterBar, RightDrawer } from '@/components/shared';
import type { FilterConfig } from '@/components/shared';
import type { UserRole, KYCStatus } from '@/types';
import { formatDate } from '@/lib/utils';

const ROLE_COLORS: Record<UserRole, string> = {
  customer: 'bg-[var(--terra)]/10 text-[var(--terra)]',
  driver: 'bg-emerald-100 text-emerald-800',
  warehouse_staff: 'bg-blue-100 text-blue-800',
  dispatcher: 'bg-violet-100 text-violet-800',
  agent: 'bg-amber-100 text-amber-800',
  admin: 'bg-[var(--ink)]/10 text-[var(--ink)]',
  super_admin: 'bg-red-100 text-red-800',
};

const KYC_COLORS: Record<KYCStatus, string> = {
  approved: 'bg-green-100 text-green-800',
  pending: 'bg-amber-100 text-amber-800',
  rejected: 'bg-red-100 text-red-800',
  none: 'bg-gray-100 text-gray-600',
};

interface UserRow {
  id: string; email: string; phone: string; firstName: string; lastName: string;
  role: UserRole; accountType: 'individual' | 'business' | 'corporate';
  businessName?: string; isActive: boolean; kycStatus: KYCStatus;
  countryOfResidence: string; createdAt: string; shipmentCount: number; walletBalance: number;
}

const mockUsers: UserRow[] = [
  { id:'u1',email:'john.okafor@example.com',phone:'+2348012345678',firstName:'John',lastName:'Okafor',role:'customer',accountType:'business',businessName:'Okafor Trading Co.',isActive:true,kycStatus:'approved',countryOfResidence:'US',createdAt:'2024-01-15T00:00:00Z',shipmentCount:47,walletBalance:1250 },
  { id:'u2',email:'amina.sani@example.com',phone:'+2348023456789',firstName:'Amina',lastName:'Sani',role:'customer',accountType:'individual',isActive:true,kycStatus:'pending',countryOfResidence:'NG',createdAt:'2024-03-20T00:00:00Z',shipmentCount:12,walletBalance:450 },
  { id:'u3',email:'admin@techcorp.com',phone:'+14045551234',firstName:'TechCorp',lastName:'Admin',role:'customer',accountType:'corporate',businessName:'TechCorp International',isActive:true,kycStatus:'approved',countryOfResidence:'US',createdAt:'2023-11-05T00:00:00Z',shipmentCount:234,walletBalance:15000 },
  { id:'u4',email:'grace.nwosu@example.com',phone:'+2348034567890',firstName:'Grace',lastName:'Nwosu',role:'customer',accountType:'individual',isActive:true,kycStatus:'approved',countryOfResidence:'NG',createdAt:'2025-01-10T00:00:00Z',shipmentCount:8,walletBalance:320 },
  { id:'d1',email:'adebayo.ogundimu@driver.com',phone:'+2348012345678',firstName:'Adebayo',lastName:'Ogundimu',role:'driver',accountType:'individual',isActive:true,kycStatus:'approved',countryOfResidence:'NG',createdAt:'2024-06-01T00:00:00Z',shipmentCount:847,walletBalance:125000 },
  { id:'d2',email:'chinwe.eze@driver.com',phone:'+2348023456789',firstName:'Chinwe',lastName:'Eze',role:'driver',accountType:'individual',isActive:true,kycStatus:'approved',countryOfResidence:'NG',createdAt:'2024-07-15T00:00:00Z',shipmentCount:562,walletBalance:89000 },
  { id:'d3',email:'emeka.nwosu@driver.com',phone:'+2348034567890',firstName:'Emeka',lastName:'Nwosu',role:'driver',accountType:'individual',isActive:true,kycStatus:'approved',countryOfResidence:'NG',createdAt:'2024-05-20T00:00:00Z',shipmentCount:1243,walletBalance:156000 },
  { id:'a1',email:'admin@diasporaship.com',phone:'+14045559999',firstName:'Super',lastName:'Admin',role:'super_admin',accountType:'individual',isActive:true,kycStatus:'approved',countryOfResidence:'US',createdAt:'2023-01-01T00:00:00Z',shipmentCount:0,walletBalance:0 },
  { id:'a2',email:'ops@diasporaship.com',phone:'+2348045678901',firstName:'Ops',lastName:'Manager',role:'admin',accountType:'individual',isActive:true,kycStatus:'approved',countryOfResidence:'NG',createdAt:'2023-06-15T00:00:00Z',shipmentCount:0,walletBalance:0 },
  { id:'u5',email:'kwame.asante@example.com',phone:'+233245678901',firstName:'Kwame',lastName:'Asante',role:'customer',accountType:'business',businessName:'Asante Imports',isActive:true,kycStatus:'approved',countryOfResidence:'GH',createdAt:'2024-09-10T00:00:00Z',shipmentCount:35,walletBalance:2100 },
  { id:'u6',email:'emeka.nwankwo@example.com',phone:'+2348056789012',firstName:'Emeka',lastName:'Nwankwo',role:'customer',accountType:'individual',isActive:false,kycStatus:'rejected',countryOfResidence:'NG',createdAt:'2025-02-01T00:00:00Z',shipmentCount:2,walletBalance:0 },
  { id:'a3',email:'support@diasporaship.com',phone:'+14045558888',firstName:'Support',lastName:'Agent',role:'agent',accountType:'individual',isActive:true,kycStatus:'approved',countryOfResidence:'US',createdAt:'2024-02-20T00:00:00Z',shipmentCount:0,walletBalance:0 },
  { id:'u7',email:'wanjiku.kamau@example.com',phone:'+254712345678',firstName:'Wanjiku',lastName:'Kamau',role:'customer',accountType:'individual',isActive:true,kycStatus:'none',countryOfResidence:'KE',createdAt:'2025-11-20T00:00:00Z',shipmentCount:3,walletBalance:150 },
  { id:'d4',email:'fatima.bello@driver.com',phone:'+2348067890123',firstName:'Fatima',lastName:'Bello',role:'driver',accountType:'individual',isActive:true,kycStatus:'pending',countryOfResidence:'NG',createdAt:'2025-01-05T00:00:00Z',shipmentCount:312,walletBalance:45000 },
  { id:'u8',email:'michael.chen@example.com',phone:'+14045551234',firstName:'Michael',lastName:'Chen',role:'warehouse_staff',accountType:'individual',isActive:true,kycStatus:'approved',countryOfResidence:'US',createdAt:'2024-04-01T00:00:00Z',shipmentCount:0,walletBalance:0 },
];

const filterConfigs: FilterConfig[] = [
  { key:'role', type:'select', label:'Role', options: [{value:'customer',label:'Customer'},{value:'driver',label:'Driver'},{value:'admin',label:'Admin'},{value:'agent',label:'Agent'},{value:'warehouse_staff',label:'Warehouse Staff'},{value:'super_admin',label:'Super Admin'}] },
  { key:'accountType', type:'select', label:'Account Type', options: [{value:'individual',label:'Individual'},{value:'business',label:'Business'},{value:'corporate',label:'Corporate'}] },
  { key:'kycStatus', type:'select', label:'KYC Status', options: [{value:'approved',label:'Approved'},{value:'pending',label:'Pending'},{value:'rejected',label:'Rejected'},{value:'none',label:'None'}] },
  { key:'country', type:'select', label:'Country', options: [{value:'US',label:'US'},{value:'NG',label:'Nigeria'},{value:'GH',label:'Ghana'},{value:'KE',label:'Kenya'}] },
  { key:'search', type:'search', label:'Search', placeholder:'Name or email...' },
  { key:'active', type:'select', label:'Status', options: [{value:'true',label:'Active'},{value:'false',label:'Inactive'}] },
];

function getInitials(first: string, last: string) {
  return `${first[0]}${last[0]}`.toUpperCase();
}

const recentShipments = [
  { tracking:'DS-20260318-A1B2C3', status:'In Transit', date:'Mar 18', amount:'$242.75' },
  { tracking:'DS-20260315-M3N4O5', status:'Delivered', date:'Mar 15', amount:'$165.00' },
  { tracking:'DS-20260312-G7H8I9', status:'Customs', date:'Mar 12', amount:'$7,525' },
  { tracking:'DS-20260310-Y5Z6A7', status:'Pending', date:'Mar 10', amount:'$112.00' },
  { tracking:'DS-20260308-E1F2G3', status:'Delivered', date:'Mar 8', amount:'$1,452' },
];

export default function AdminUsersPage() {
  const [filters, setFilters] = useState<Record<string,string>>({});
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    return mockUsers.filter(u => {
      if (filters.role && u.role !== filters.role) return false;
      if (filters.accountType && u.accountType !== filters.accountType) return false;
      if (filters.kycStatus && u.kycStatus !== filters.kycStatus) return false;
      if (filters.country && u.countryOfResidence !== filters.country) return false;
      if (filters.active && String(u.isActive) !== filters.active) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!`${u.firstName} ${u.lastName}`.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [filters]);

  const columns = [
    {
      key:'name', label:'Name', sortable:true,
      render: (u: UserRow) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[var(--terra)] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {getInitials(u.firstName, u.lastName)}
          </div>
          <span className="text-sm font-medium">{u.firstName} {u.lastName}</span>
        </div>
      ),
    },
    { key:'email', label:'Email', sortable:true, render: (u: UserRow) => <span className="text-sm">{u.email}</span> },
    { key:'phone', label:'Phone', render: (u: UserRow) => <span className="text-sm">{u.phone}</span> },
    {
      key:'role', label:'Role', sortable:true,
      render: (u: UserRow) => <Badge className={ROLE_COLORS[u.role]}>{u.role.replace('_',' ')}</Badge>,
    },
    { key:'accountType', label:'Account', sortable:true, render: (u: UserRow) => <span className="text-sm capitalize">{u.accountType}</span> },
    {
      key:'kycStatus', label:'KYC',
      render: (u: UserRow) => <Badge className={KYC_COLORS[u.kycStatus]}>{u.kycStatus}</Badge>,
    },
    { key:'shipmentCount', label:'Shipments', sortable:true, render: (u: UserRow) => <span className="text-sm">{u.shipmentCount}</span> },
    { key:'createdAt', label:'Joined', sortable:true, render: (u: UserRow) => <span className="text-xs text-[var(--muted-text)]">{formatDate(u.createdAt)}</span> },
    {
      key:'actions', label:'Actions',
      render: (u: UserRow) => (
        <button className="p-1.5 rounded hover:bg-[var(--terra-pale)] text-gray-700 hover:text-[var(--terra)]" onClick={e => { e.stopPropagation(); setSelectedUser(u); setDrawerOpen(true); }}>
          <Eye size={14} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-[var(--ink)]">User Management</h1>
        <p className="text-xs text-[var(--muted-text)]">{filtered.length} users</p>
      </div>

      <FilterBar filters={filterConfigs} onFilterChange={(k,v) => setFilters(f => ({...f,[k]:v}))} onClear={() => setFilters({})} values={filters} />

      <DataTable columns={columns as any} data={filtered as any} onRowClick={(u: any) => { setSelectedUser(u); setDrawerOpen(true); }} pageSize={10} />

      <RightDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="User Profile" width={480}>
        {selectedUser && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[var(--terra)] flex items-center justify-center text-white text-lg font-bold">
                {getInitials(selectedUser.firstName, selectedUser.lastName)}
              </div>
              <div>
                <h3 className="text-base font-semibold">{selectedUser.firstName} {selectedUser.lastName}</h3>
                <p className="text-sm text-[var(--muted-text)]">{selectedUser.email}</p>
                <p className="text-xs text-[var(--muted-text)]">{selectedUser.phone} · {selectedUser.countryOfResidence}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[var(--cream)] rounded-lg p-3">
                <div className="text-xs text-[var(--muted-text)]">Role</div>
                <Badge className={ROLE_COLORS[selectedUser.role]}>{selectedUser.role.replace('_',' ')}</Badge>
              </div>
              <div className="bg-[var(--cream)] rounded-lg p-3">
                <div className="text-xs text-[var(--muted-text)]">KYC</div>
                <Badge className={KYC_COLORS[selectedUser.kycStatus]}>{selectedUser.kycStatus}</Badge>
              </div>
              <div className="bg-[var(--cream)] rounded-lg p-3">
                <div className="text-xs text-[var(--muted-text)]">Shipments</div>
                <div className="text-sm font-semibold">{selectedUser.shipmentCount}</div>
              </div>
              <div className="bg-[var(--cream)] rounded-lg p-3">
                <div className="text-xs text-[var(--muted-text)]">Wallet</div>
                <div className="text-sm font-semibold">${selectedUser.walletBalance.toLocaleString()}</div>
              </div>
            </div>

            <div className="border-t border-[var(--border-warm)] pt-4">
              <h4 className="text-sm font-semibold mb-3">Recent Shipments</h4>
              <div className="border border-[var(--border-warm)] rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead><tr className="border-b border-[var(--border-warm)] bg-[var(--cream)]"><th className="text-left p-2 font-semibold">Tracking</th><th className="text-left p-2 font-semibold">Status</th><th className="text-left p-2 font-semibold">Date</th><th className="text-right p-2 font-semibold">Amount</th></tr></thead>
                  <tbody>
                    {recentShipments.map((s,i) => (
                      <tr key={i} className="border-b border-[var(--border-warm)] last:border-0">
                        <td className="p-2 font-mono">{s.tracking}</td>
                        <td className="p-2">{s.status}</td>
                        <td className="p-2 text-[var(--muted-text)]">{s.date}</td>
                        <td className="p-2 text-right font-medium">{s.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t border-[var(--border-warm)] pt-4">
              <h4 className="text-sm font-semibold mb-3">Wallet Audit</h4>
              <div className="bg-[var(--cream)] rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-[var(--muted-text)]">Balance (USD)</span><span className="font-semibold">${selectedUser.walletBalance.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-[var(--muted-text)]">Last transaction</span><span>Top-up $500 · Mar 15</span></div>
              </div>
            </div>

            <div className="border-t border-[var(--border-warm)] pt-4">
              <h4 className="text-sm font-semibold mb-3">KYC Documents</h4>
              <div className="bg-[var(--cream)] rounded-lg p-6 text-center text-sm text-[var(--muted-text)]">
                Document viewer placeholder
              </div>
            </div>

            <div className="border-t border-[var(--border-warm)] pt-4 space-y-2">
              <Button variant="outline" className="w-full gap-2 text-sm"><UserCheck size={14} /> {selectedUser.isActive ? 'Deactivate' : 'Activate'} User</Button>
              <Button variant="outline" className="w-full gap-2 text-sm"><ShieldCheck size={14} /> Change Role</Button>
              <Button variant="outline" className="w-full gap-2 text-sm"><Wallet size={14} /> Adjust Wallet</Button>
              <Button variant="outline" className="w-full gap-2 text-sm"><Key size={14} /> Reset Password</Button>
            </div>
          </div>
        )}
      </RightDrawer>
    </div>
  );
}
