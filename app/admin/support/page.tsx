'use client';

import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-amber-100 text-amber-800',
  replied: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
};

const mockThreads = [
  { id:'e1',subject:'Form M documentation needed for DS-20260312-G7H8I9',from:'admin@techcorp.com',date:'2026-03-18T09:00:00Z',status:'open' },
  { id:'e2',subject:'Re: Delivery attempt failed - alternate address requested',from:'grace.nwosu@example.com',date:'2026-03-17T16:30:00Z',status:'replied' },
  { id:'e3',subject:'Insurance claim for damaged fragile shipment',from:'emeka.nwankwo@example.com',date:'2026-03-16T11:00:00Z',status:'open' },
  { id:'e4',subject:'COD payment confirmation DS-20260316-D4E5F6',from:'amina.sani@example.com',date:'2026-03-15T14:00:00Z',status:'resolved' },
  { id:'e5',subject:'Request for bulk shipping discount - corporate account',from:'john.okafor@example.com',date:'2026-03-14T10:00:00Z',status:'replied' },
];

export default function AdminSupportPage() {
  return (
    <div className="space-y-5">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <div className="text-sm font-semibold text-amber-800">Full support system coming in Phase 2. Currently showing email threads only.</div>
          <p className="text-xs text-amber-700 mt-1">A complete ticketing system with SLA tracking, internal notes, and multi-channel support will be available in the next phase.</p>
        </div>
      </div>

      <div>
        <h1 className="text-lg font-semibold text-[var(--ink)]">Support</h1>
        <p className="text-xs text-[var(--muted-text)]">{mockThreads.length} email threads</p>
      </div>

      <div className="border border-[var(--border-warm)] rounded-xl bg-[var(--warm-white)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-warm)]">
              <th className="text-left p-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-text)]">Subject</th>
              <th className="text-left p-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-text)]">From</th>
              <th className="text-left p-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-text)]">Date</th>
              <th className="text-left p-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-text)]">Status</th>
              <th className="text-left p-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-text)]">Action</th>
            </tr>
          </thead>
          <tbody>
            {mockThreads.map(t => (
              <tr key={t.id} className="border-b border-[var(--border-warm)] last:border-0 hover:bg-[var(--terra-pale)]">
                <td className="p-3 font-medium text-[var(--ink)]">{t.subject}</td>
                <td className="p-3 text-[var(--muted-text)]">{t.from}</td>
                <td className="p-3 text-xs text-[var(--muted-text)]">{formatDate(t.date)}</td>
                <td className="p-3"><Badge className={STATUS_COLORS[t.status]}>{t.status}</Badge></td>
                <td className="p-3">
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                    <ExternalLink size={10} /> Open
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
