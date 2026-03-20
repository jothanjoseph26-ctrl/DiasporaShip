'use client';

import { useState, useMemo } from 'react';
import { DollarSign, Clock, Truck, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { KpiCard, DataTable, FilterBar } from '@/components/shared';
import type { FilterConfig } from '@/components/shared';
import { formatDate, formatCurrency } from '@/lib/utils';

interface TransactionRow {
  id: string; date: string; user: string; type: 'credit' | 'debit';
  category: string; amount: number; currency: string;
  reference: string; status: 'completed' | 'pending' | 'failed';
}

const TYPE_COLORS: Record<string, string> = {
  credit: 'bg-green-100 text-green-800',
  debit: 'bg-red-100 text-red-800',
};

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-amber-100 text-amber-800',
  failed: 'bg-red-100 text-red-800',
};

const CATEGORY_LABELS: Record<string, string> = {
  shipping: 'Shipping',
  wallet_fund: 'Wallet Fund',
  payout: 'Payout',
  refund: 'Refund',
  cod: 'COD',
  topup: 'Top-up',
  withdrawal: 'Withdrawal',
};

const mockTransactions: TransactionRow[] = [
  { id:'t1',date:'2026-03-18T10:00:00Z',user:'John Okafor',type:'credit',category:'shipping',amount:242.75,currency:'USD',reference:'TXN-00123',status:'completed' },
  { id:'t2',date:'2026-03-18T09:30:00Z',user:'TechCorp Ltd',type:'credit',category:'shipping',amount:7525,currency:'USD',reference:'TXN-00124',status:'completed' },
  { id:'t3',date:'2026-03-18T08:00:00Z',user:'Grace Nwosu',type:'credit',category:'cod',amount:12500,currency:'NGN',reference:'TXN-00125',status:'pending' },
  { id:'t4',date:'2026-03-17T16:00:00Z',user:'Adebayo Ogundimu',type:'debit',category:'payout',amount:45000,currency:'NGN',reference:'PAY-00089',status:'completed' },
  { id:'t5',date:'2026-03-17T14:30:00Z',user:'Michael Chen',type:'credit',category:'wallet_fund',amount:500,currency:'USD',reference:'TXN-00126',status:'completed' },
  { id:'t6',date:'2026-03-17T12:00:00Z',user:'Amina Sani',type:'credit',category:'shipping',amount:8500,currency:'NGN',reference:'TXN-00127',status:'completed' },
  { id:'t7',date:'2026-03-17T10:00:00Z',user:'Emeka Nwankwo',type:'debit',category:'refund',amount:85,currency:'USD',reference:'RFN-00034',status:'completed' },
  { id:'t8',date:'2026-03-16T15:00:00Z',user:'Kwame Asante',type:'credit',category:'shipping',amount:1450,currency:'USD',reference:'TXN-00128',status:'completed' },
  { id:'t9',date:'2026-03-16T11:00:00Z',user:'Fatima Bello',type:'debit',category:'payout',amount:125000,currency:'NGN',reference:'PAY-00090',status:'pending' },
  { id:'t10',date:'2026-03-16T09:00:00Z',user:'Chinwe Eze',type:'credit',category:'cod',amount:18000,currency:'NGN',reference:'TXN-00129',status:'completed' },
  { id:'t11',date:'2026-03-15T16:00:00Z',user:'John Okafor',type:'credit',category:'wallet_fund',amount:100,currency:'USD',reference:'TXN-00130',status:'completed' },
  { id:'t12',date:'2026-03-15T14:00:00Z',user:'TechCorp Ltd',type:'credit',category:'shipping',amount:8120,currency:'USD',reference:'TXN-00131',status:'completed' },
  { id:'t13',date:'2026-03-15T10:00:00Z',user:'Wanjiku Kamau',type:'credit',category:'shipping',amount:4500,currency:'KES',reference:'TXN-00132',status:'completed' },
  { id:'t14',date:'2026-03-14T16:00:00Z',user:'Emeka Nwosu',type:'debit',category:'payout',amount:156000,currency:'NGN',reference:'PAY-00091',status:'completed' },
  { id:'t15',date:'2026-03-14T12:00:00Z',user:'Grace Nwosu',type:'credit',category:'shipping',amount:5000,currency:'NGN',reference:'TXN-00133',status:'completed' },
  { id:'t16',date:'2026-03-14T08:00:00Z',user:'Smith & Associates',type:'credit',category:'shipping',amount:2278,currency:'USD',reference:'TXN-00134',status:'completed' },
  { id:'t17',date:'2026-03-13T15:00:00Z',user:'Okafor Trading',type:'debit',category:'refund',amount:310,currency:'GBP',reference:'RFN-00035',status:'pending' },
  { id:'t18',date:'2026-03-13T11:00:00Z',user:'Asante Imports',type:'credit',category:'wallet_fund',amount:2000,currency:'GHS',reference:'TXN-00135',status:'completed' },
  { id:'t19',date:'2026-03-12T14:00:00Z',user:'Ibrahim Musa',type:'credit',category:'cod',amount:9500,currency:'NGN',reference:'TXN-00136',status:'completed' },
  { id:'t20',date:'2026-03-12T10:00:00Z',user:'Blessing Eze',type:'debit',category:'withdrawal',amount:32000,currency:'NGN',reference:'WDR-00012',status:'failed' },
];

export default function AdminBillingPage() {
  const [filters, setFilters] = useState<Record<string,string>>({});

  const filtered = useMemo(() => {
    return mockTransactions.filter(t => {
      if (filters.type && t.type !== filters.type) return false;
      if (filters.category && t.category !== filters.category) return false;
      if (filters.currency && t.currency !== filters.currency) return false;
      if (filters.dateFrom && t.date < filters.dateFrom) return false;
      if (filters.dateTo && t.date > filters.dateTo) return false;
      return true;
    });
  }, [filters]);

  const filterConfigs: FilterConfig[] = [
    { key:'type', type:'select', label:'Type', options: [{value:'credit',label:'Credit'},{value:'debit',label:'Debit'}] },
    { key:'category', type:'select', label:'Category', options: [{value:'shipping',label:'Shipping'},{value:'wallet_fund',label:'Wallet Fund'},{value:'payout',label:'Payout'},{value:'refund',label:'Refund'},{value:'cod',label:'COD'}] },
    { key:'currency', type:'select', label:'Currency', options: [{value:'USD',label:'USD'},{value:'NGN',label:'NGN'},{value:'GHS',label:'GHS'},{value:'KES',label:'KES'},{value:'GBP',label:'GBP'}] },
    { key:'dateFrom', type:'dateRange', label:'From' },
    { key:'dateTo', type:'dateRange', label:'To' },
  ];

  const columns = [
    { key:'date', label:'Date', sortable:true, render: (t: TransactionRow) => <span className="text-xs text-[var(--muted-text)]">{formatDate(t.date)}</span> },
    { key:'user', label:'User', sortable:true, render: (t: TransactionRow) => <span className="text-sm">{t.user}</span> },
    { key:'type', label:'Type', render: (t: TransactionRow) => <Badge className={TYPE_COLORS[t.type]}>{t.type}</Badge> },
    { key:'category', label:'Category', render: (t: TransactionRow) => <span className="text-sm capitalize">{CATEGORY_LABELS[t.category] || t.category}</span> },
    { key:'amount', label:'Amount', sortable:true, render: (t: TransactionRow) => <span className={`text-sm font-semibold ${t.type === 'credit' ? 'text-green-700' : 'text-red-600'}`}>{t.type === 'debit' ? '-' : '+'}{formatCurrency(t.amount, t.currency)}</span> },
    { key:'currency', label:'Currency', render: (t: TransactionRow) => <span className="text-xs font-medium">{t.currency}</span> },
    { key:'reference', label:'Reference', render: (t: TransactionRow) => <span className="font-mono text-xs">{t.reference}</span> },
    { key:'status', label:'Status', render: (t: TransactionRow) => <Badge className={STATUS_COLORS[t.status]}>{t.status}</Badge> },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        <KpiCard icon={<DollarSign size={18} />} label="Revenue Today" value="$12,450" trend="+5.2%" variant="terra" />
        <KpiCard icon={<Clock size={18} />} label="Pending Payments" value="$3,200" variant="gold" />
        <KpiCard icon={<Truck size={18} />} label="COD Outstanding" value="$1,800" variant="ink" />
        <KpiCard icon={<RotateCcw size={18} />} label="Refunds Issued" value="$450" variant="terra" />
      </div>

      <div>
        <h1 className="text-lg font-semibold text-[var(--ink)]">Billing & Transactions</h1>
        <p className="text-xs text-[var(--muted-text)]">{filtered.length} transactions</p>
      </div>

      <FilterBar filters={filterConfigs} onFilterChange={(k,v) => setFilters(f => ({...f,[k]:v}))} onClear={() => setFilters({})} values={filters} />

      <DataTable columns={columns as any} data={filtered as any} pageSize={10} />
    </div>
  );
}
