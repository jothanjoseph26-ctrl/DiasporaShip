'use client';

import { useState, useMemo } from 'react';
import { ShieldCheck, ShieldX, Clock, CheckCircle2, XCircle, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KpiCard, DataTable, FilterBar, RightDrawer } from '@/components/shared';
import type { FilterConfig } from '@/components/shared';
import type { KYCStatus } from '@/types';
import { formatDate } from '@/lib/utils';

interface KYCSubmission {
  id: string; userId: string; firstName: string; lastName: string; email: string;
  accountType: string; country: string; docTypes: string[];
  submittedAt: string; status: KYCStatus;
}

const KYC_COLORS: Record<KYCStatus, string> = {
  approved: 'bg-green-100 text-green-800',
  pending: 'bg-amber-100 text-amber-800',
  rejected: 'bg-red-100 text-red-800',
  none: 'bg-gray-100 text-gray-600',
};

const mockSubmissions: KYCSubmission[] = [
  { id:'k1',userId:'u2',firstName:'Amina',lastName:'Sani',email:'amina.sani@example.com',accountType:'individual',country:'NG',docTypes:['National ID','Selfie'],submittedAt:'2026-03-17T10:00:00Z',status:'pending' },
  { id:'k2',userId:'d4',firstName:'Fatima',lastName:'Bello',email:'fatima.bello@driver.com',accountType:'individual',country:'NG',docTypes:['Driver License','Selfie','Vehicle Reg'],submittedAt:'2026-03-17T09:30:00Z',status:'pending' },
  { id:'k3',userId:'u9',firstName:'Samuel',lastName:'Ogbonna',email:'samuel.ogbonna@example.com',accountType:'business',country:'NG',docTypes:['CAC Certificate','National ID','Utility Bill'],submittedAt:'2026-03-16T14:00:00Z',status:'pending' },
  { id:'k4',userId:'u10',firstName:'Nkechi',lastName:'Adeyemi',email:'nkechi.adeyemi@example.com',accountType:'individual',country:'NG',docTypes:['International Passport','Selfie'],submittedAt:'2026-03-16T11:00:00Z',status:'pending' },
  { id:'k5',userId:'u11',firstName:'David',lastName:'Osei',email:'david.osei@example.com',accountType:'individual',country:'GH',docTypes:['Ghana Card','Selfie'],submittedAt:'2026-03-15T16:00:00Z',status:'pending' },
  { id:'k6',userId:'u12',firstName:'Mercy',lastName:'Wanjiru',email:'mercy.wanjiru@example.com',accountType:'business',country:'KE',docTypes:['KRA PIN','National ID','Business Reg'],submittedAt:'2026-03-15T10:00:00Z',status:'pending' },
  { id:'k7',userId:'u13',firstName:'James',lastName:'Okonkwo',email:'james.okonkwo@example.com',accountType:'corporate',country:'US',docTypes:['Incorporation Docs','Tax ID','Authorized Signatory'],submittedAt:'2026-03-14T15:00:00Z',status:'pending' },
  { id:'k8',userId:'u14',firstName:'Blessing',lastName:'Eze',email:'blessing.eze@example.com',accountType:'individual',country:'NG',docTypes:['Voter Card','Selfie','Utility Bill'],submittedAt:'2026-03-14T09:00:00Z',status:'pending' },
  { id:'k9',userId:'u15',firstName:'Peter',lastName:'Mensah',email:'peter.mensah@example.com',accountType:'individual',country:'GH',docTypes:['Passport','Selfie'],submittedAt:'2026-03-13T12:00:00Z',status:'pending' },
  { id:'k10',userId:'u16',firstName:'Esther',lastName:'Kimani',email:'esther.kimani@example.com',accountType:'individual',country:'KE',docTypes:['National ID','Selfie','KRA PIN'],submittedAt:'2026-03-13T08:00:00Z',status:'pending' },
  { id:'k11',userId:'u17',firstName:'Chukwuemeka',lastName:'Ibe',email:'chukwuemeka.ibe@example.com',accountType:'business',country:'NG',docTypes:['CAC Certificate','Director ID','Utility Bill'],submittedAt:'2026-03-12T14:00:00Z',status:'pending' },
  { id:'k12',userId:'u18',firstName:'Halima',lastName:'Abubakar',email:'halima.abubakar@example.com',accountType:'individual',country:'NG',docTypes:['National ID','Selfie'],submittedAt:'2026-03-12T10:00:00Z',status:'pending' },
];

export default function AdminKycPage() {
  const [filters, setFilters] = useState<Record<string,string>>({});
  const [selectedKyc, setSelectedKyc] = useState<KYCSubmission | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const filtered = useMemo(() => {
    return mockSubmissions.filter(k => {
      if (filters.status && k.status !== filters.status) return false;
      if (filters.accountType && k.accountType !== filters.accountType) return false;
      if (filters.country && k.country !== filters.country) return false;
      return true;
    });
  }, [filters]);

  const pendingCount = mockSubmissions.filter(k => k.status === 'pending').length;

  const filterConfigs: FilterConfig[] = [
    { key:'status', type:'select', label:'Status', options: [{value:'pending',label:'Pending'},{value:'approved',label:'Approved'},{value:'rejected',label:'Rejected'}] },
    { key:'accountType', type:'select', label:'Account Type', options: [{value:'individual',label:'Individual'},{value:'business',label:'Business'},{value:'corporate',label:'Corporate'}] },
    { key:'country', type:'select', label:'Country', options: [{value:'NG',label:'Nigeria'},{value:'GH',label:'Ghana'},{value:'KE',label:'Kenya'},{value:'US',label:'US'}] },
    { key:'dateFrom', type:'dateRange', label:'Date From' },
  ];

  const columns = [
    {
      key:'user', label:'User', sortable:true,
      render: (k: KYCSubmission) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[var(--terra)] flex items-center justify-center text-white text-xs font-semibold">{k.firstName[0]}{k.lastName[0]}</div>
          <span className="text-sm font-medium text-[var(--ink)]">{k.firstName} {k.lastName}</span>
        </div>
      ),
    },
    { key:'email', label:'Email', render: (k: KYCSubmission) => <span className="text-sm text-[var(--ink)]">{k.email}</span> },
    { key:'accountType', label:'Account', render: (k: KYCSubmission) => <span className="text-sm text-[var(--ink)] capitalize">{k.accountType}</span> },
    { key:'country', label:'Country', render: (k: KYCSubmission) => <span className="text-sm text-[var(--ink)]">{k.country}</span> },
    {
      key:'docTypes', label:'Documents',
      render: (k: KYCSubmission) => (
        <div className="flex flex-wrap gap-1">{k.docTypes.map((d,i) => <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">{d}</Badge>)}</div>
      ),
    },
    { key:'submittedAt', label:'Submitted', sortable:true, render: (k: KYCSubmission) => <span className="text-xs text-[var(--muted-text)]">{formatDate(k.submittedAt)}</span> },
    {
      key:'status', label:'Status',
      render: (k: KYCSubmission) => <Badge className={KYC_COLORS[k.status]}>{k.status}</Badge>,
    },
    {
      key:'actions', label:'Action',
      render: (k: KYCSubmission) => (
        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={e => { e.stopPropagation(); setSelectedKyc(k); setDrawerOpen(true); }}>
          <FileText size={12} /> Review
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <KpiCard icon={<Clock size={18} />} label="Pending Review" value={String(pendingCount)} variant="terra" />
        <KpiCard icon={<CheckCircle2 size={18} />} label="Approved Today" value="8" variant="gold" />
        <KpiCard icon={<XCircle size={18} />} label="Rejected Today" value="2" variant="ink" />
      </div>

      <div>
        <h1 className="text-lg font-semibold text-[var(--ink)]">KYC Review Queue</h1>
        <p className="text-xs text-[var(--muted-text)]">{filtered.length} submissions</p>
      </div>

      <FilterBar filters={filterConfigs} onFilterChange={(k,v) => setFilters(f => ({...f,[k]:v}))} onClear={() => setFilters({})} values={filters} />

      <DataTable columns={columns as any} data={filtered as any} onRowClick={(k: any) => { setSelectedKyc(k); setDrawerOpen(true); }} pageSize={10} />

      <RightDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="KYC Review" width={480}>
        {selectedKyc && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[var(--terra)] flex items-center justify-center text-white font-bold">
                {selectedKyc.firstName[0]}{selectedKyc.lastName[0]}
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--ink)]">{selectedKyc.firstName} {selectedKyc.lastName}</h3>
                <p className="text-sm text-[var(--muted-text)]">{selectedKyc.email}</p>
                <p className="text-xs text-[var(--muted-text)]">{selectedKyc.accountType} · {selectedKyc.country}</p>
              </div>
            </div>

            <div className="border-t border-[var(--border-warm)] pt-4">
              <h4 className="text-sm font-semibold text-[var(--ink)] mb-3">ID Document</h4>
              <div className="bg-[var(--cream)] rounded-lg h-48 flex items-center justify-center text-[var(--muted-text)] text-sm">
                Document preview placeholder
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[var(--ink)] mb-3">Selfie</h4>
              <div className="bg-[var(--cream)] rounded-lg h-48 flex items-center justify-center text-[var(--muted-text)] text-sm">
                Selfie preview placeholder
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[var(--ink)] mb-3">Documents Submitted</h4>
              <div className="flex flex-wrap gap-2">
                {selectedKyc.docTypes.map((d,i) => <Badge key={i} variant="outline">{d}</Badge>)}
              </div>
            </div>

            <div className="border-t border-[var(--border-warm)] pt-4 space-y-3">
              <Button className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white">
                <ShieldCheck size={14} /> Approve
              </Button>
              <div>
                <label className="text-xs font-semibold text-[var(--muted-text)] uppercase tracking-wider">Rejection Reason</label>
                <textarea
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  className="mt-1 w-full border border-[var(--border-warm)] rounded-lg p-3 text-sm text-[var(--ink)] bg-[var(--warm-white)] min-h-[80px] focus:outline-none focus:ring-2 focus:ring-red-300 placeholder:text-gray-500"
                />
              </div>
              <Button variant="outline" className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50">
                <ShieldX size={14} /> Reject
              </Button>
            </div>
          </div>
        )}
      </RightDrawer>
    </div>
  );
}
