'use client';

import { useState, useMemo } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { DataTable, FilterBar, StatusBadge } from '@/components/shared';
import type { FilterConfig } from '@/components/shared';
import type { ShipmentStatus } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';

const FLAG: Record<string, string> = { US: '🇺🇸', NG: '🇳🇬', GH: '🇬🇭', KE: '🇰🇪', GB: '🇬🇧', CN: '🇨🇳' };

interface CustomsRow {
  id: string; trackingNumber: string; customer: string;
  origin: string; destination: string; hsCode: string;
  declaredValue: number; dutiesEstimate: number; currency: string;
  docsStatus: string; status: ShipmentStatus; updatedAt: string;
}

const DOCS_STATUS_COLORS: Record<string, string> = {
  not_required: 'bg-gray-100 text-gray-600',
  pending: 'bg-amber-100 text-amber-800',
  submitted: 'bg-blue-100 text-blue-800',
  cleared: 'bg-green-100 text-green-800',
  held: 'bg-red-100 text-red-800',
};

const mockCustoms: CustomsRow[] = [
  { id:'s1',trackingNumber:'DS-20260318-A1B2C3',customer:'John Okafor',origin:'US',destination:'NG',hsCode:'8473.30',declaredValue:850,dutiesEstimate:85,currency:'USD',docsStatus:'submitted',status:'in_transit_international',updatedAt:'2026-03-18T06:30:00Z' },
  { id:'s3',trackingNumber:'DS-20260312-G7H8I9',customer:'TechCorp Ltd',origin:'CN',destination:'NG',hsCode:'8481.80',declaredValue:15000,dutiesEstimate:4500,currency:'USD',docsStatus:'pending',status:'customs_pending',updatedAt:'2026-03-18T09:00:00Z' },
  { id:'s6',trackingNumber:'DS-20260314-P6Q7R8',customer:'Emeka Nwankwo',origin:'US',destination:'NG',hsCode:'7013.91',declaredValue:1200,dutiesEstimate:320,currency:'USD',docsStatus:'held',status:'customs_held',updatedAt:'2026-03-17T14:00:00Z' },
  { id:'s8',trackingNumber:'DS-20260311-V2W3X4',customer:'Amina Sani',origin:'US',destination:'KE',hsCode:'3004.90',declaredValue:3000,dutiesEstimate:450,currency:'USD',docsStatus:'submitted',status:'in_transit_international',updatedAt:'2026-03-17T08:00:00Z' },
  { id:'s10',trackingNumber:'DS-20260309-B8C9D0',customer:'TechCorp Ltd',origin:'US',destination:'GH',hsCode:'6810.99',declaredValue:28000,dutiesEstimate:3200,currency:'USD',docsStatus:'pending',status:'customs_pending',updatedAt:'2026-03-16T10:00:00Z' },
  { id:'s12',trackingNumber:'DS-20260307-H4I5J6',customer:'Kwame Asante',origin:'US',destination:'KE',hsCode:'8542.31',declaredValue:5500,dutiesEstimate:650,currency:'USD',docsStatus:'cleared',status:'customs_cleared',updatedAt:'2026-03-15T12:00:00Z' },
  { id:'s16',trackingNumber:'DS-20260303-T6U7V8',customer:'Smith & Associates',origin:'CN',destination:'NG',hsCode:'8445.20',declaredValue:42000,dutiesEstimate:6300,currency:'USD',docsStatus:'submitted',status:'in_transit_international',updatedAt:'2026-03-14T06:00:00Z' },
  { id:'s17',trackingNumber:'DS-20260302-W9X0Y1',customer:'Fatima Bello',origin:'US',destination:'NG',hsCode:'4202.21',declaredValue:950,dutiesEstimate:142,currency:'USD',docsStatus:'pending',status:'customs_pending',updatedAt:'2026-03-13T09:00:00Z' },
  { id:'s20',trackingNumber:'DS-20260227-F8G9H0',customer:'TechCorp Ltd',origin:'US',destination:'GH',hsCode:'9018.39',declaredValue:7200,dutiesEstimate:720,currency:'USD',docsStatus:'cleared',status:'customs_cleared',updatedAt:'2026-03-12T15:00:00Z' },
  { id:'s-new1',trackingNumber:'DS-20260319-NEW01',customer:'Grace Nwosu',origin:'US',destination:'NG',hsCode:'6109.10',declaredValue:450,dutiesEstimate:67,currency:'USD',docsStatus:'pending',status:'customs_pending',updatedAt:'2026-03-19T08:00:00Z' },
  { id:'s-new2',trackingNumber:'DS-20260319-NEW02',customer:'Michael Chen',origin:'GB',destination:'NG',hsCode:'8471.30',declaredValue:2800,dutiesEstimate:420,currency:'GBP',docsStatus:'submitted',status:'customs_pending',updatedAt:'2026-03-19T07:00:00Z' },
  { id:'s-new3',trackingNumber:'DS-20260318-NEW03',customer:'Wanjiku Kamau',origin:'US',destination:'KE',hsCode:'3304.10',declaredValue:180,dutiesEstimate:27,currency:'USD',docsStatus:'cleared',status:'customs_cleared',updatedAt:'2026-03-18T14:00:00Z' },
  { id:'s-new4',trackingNumber:'DS-20260318-NEW04',customer:'Okafor Trading',origin:'CN',destination:'NG',hsCode:'5209.42',declaredValue:18500,dutiesEstimate:2775,currency:'USD',docsStatus:'held',status:'customs_held',updatedAt:'2026-03-18T11:00:00Z' },
  { id:'s-new5',trackingNumber:'DS-20260317-NEW05',customer:'Asante Imports',origin:'US',destination:'GH',hsCode:'8528.72',declaredValue:6500,dutiesEstimate:975,currency:'USD',docsStatus:'submitted',status:'in_transit_international',updatedAt:'2026-03-17T16:00:00Z' },
  { id:'s-new6',trackingNumber:'DS-20260316-NEW06',customer:'Blessing Eze',origin:'UK',destination:'NG',hsCode:'2204.21',declaredValue:320,dutiesEstimate:48,currency:'GBP',docsStatus:'pending',status:'customs_pending',updatedAt:'2026-03-16T09:00:00Z' },
];

export default function AdminCustomsPage() {
  const [filters, setFilters] = useState<Record<string,string>>({});
  const [confirmAction, setConfirmAction] = useState<{ type: 'clear' | 'hold'; row: CustomsRow } | null>(null);

  const filtered = useMemo(() => {
    return mockCustoms.filter(c => {
      if (filters.status && c.status !== filters.status) return false;
      if (filters.country && c.origin !== filters.country && c.destination !== filters.country) return false;
      if (filters.dateFrom && c.updatedAt < filters.dateFrom) return false;
      if (filters.dateTo && c.updatedAt > filters.dateTo) return false;
      return true;
    });
  }, [filters]);

  const filterConfigs: FilterConfig[] = [
    { key:'status', type:'select', label:'Status', options: [
      {value:'customs_pending',label:'Customs Pending'},{value:'customs_cleared',label:'Cleared'},{value:'customs_held',label:'Held'},{value:'in_transit_international',label:'In Transit Intl'},
    ]},
    { key:'country', type:'select', label:'Country', options: [{value:'US',label:'US'},{value:'NG',label:'Nigeria'},{value:'GH',label:'Ghana'},{value:'KE',label:'Kenya'},{value:'GB',label:'UK'},{value:'CN',label:'China'}] },
    { key:'dateFrom', type:'dateRange', label:'From' },
    { key:'dateTo', type:'dateRange', label:'To' },
  ];

  const columns = [
    { key:'trackingNumber', label:'Tracking', sortable:true, render: (c: CustomsRow) => <span className="font-mono text-xs">{c.trackingNumber}</span> },
    { key:'customer', label:'Customer', render: (c: CustomsRow) => <span className="text-sm">{c.customer}</span> },
    { key:'route', label:'Route', render: (c: CustomsRow) => <span className="text-sm">{FLAG[c.origin]} → {FLAG[c.destination]}</span> },
    { key:'hsCode', label:'HS Code', render: (c: CustomsRow) => <span className="font-mono text-xs">{c.hsCode}</span> },
    { key:'declaredValue', label:'Declared', sortable:true, render: (c: CustomsRow) => <span className="text-sm">{formatCurrency(c.declaredValue, c.currency)}</span> },
    { key:'dutiesEstimate', label:'Duties', render: (c: CustomsRow) => <span className="text-sm font-medium">{formatCurrency(c.dutiesEstimate, c.currency)}</span> },
    { key:'docsStatus', label:'Docs', render: (c: CustomsRow) => <Badge className={DOCS_STATUS_COLORS[c.docsStatus]}>{c.docsStatus.replace('_',' ')}</Badge> },
    { key:'status', label:'Status', render: (c: CustomsRow) => <StatusBadge status={c.status} /> },
    { key:'updatedAt', label:'Updated', sortable:true, render: (c: CustomsRow) => <span className="text-xs text-[var(--muted-text)]">{formatDate(c.updatedAt)}</span> },
    {
      key:'actions', label:'Actions',
      render: (c: CustomsRow) => (
        <div className="flex gap-1">
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-green-700 border-green-200 hover:bg-green-50" onClick={e => { e.stopPropagation(); setConfirmAction({ type:'clear', row:c }); }}>
            <ShieldCheck size={11} /> Clear
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-amber-700 border-amber-200 hover:bg-amber-50" onClick={e => { e.stopPropagation(); setConfirmAction({ type:'hold', row:c }); }}>
            <ShieldAlert size={11} /> Hold
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-[var(--ink)]">Customs Management</h1>
        <p className="text-xs text-[var(--muted-text)]">Admin override for customs clearance</p>
      </div>

      <FilterBar filters={filterConfigs} onFilterChange={(k,v) => setFilters(f => ({...f,[k]:v}))} onClear={() => setFilters({})} values={filters} />

      <DataTable columns={columns as any} data={filtered as any} pageSize={10} />

      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{confirmAction?.type === 'clear' ? 'Force Clear Shipment' : 'Force Hold Shipment'}</DialogTitle>
            <DialogDescription>
              {confirmAction?.type === 'clear'
                ? `This will mark ${confirmAction?.row.trackingNumber} as customs cleared and advance it to the next status.`
                : `This will place ${confirmAction?.row.trackingNumber} on customs hold.`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-800">This is an admin override action. It will be logged in the audit trail.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>Cancel</Button>
            <Button className={confirmAction?.type === 'clear' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'}>
              {confirmAction?.type === 'clear' ? 'Confirm Clear' : 'Confirm Hold'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
