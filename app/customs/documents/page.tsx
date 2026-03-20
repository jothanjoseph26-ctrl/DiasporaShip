'use client';

import { useState } from 'react';
import { AlertTriangle, Eye, CheckCircle2, XCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable, FilterBar } from '@/components/shared';
import type { FilterConfig } from '@/components/shared';

interface CustomsDoc {
  id: string;
  shipmentId: string;
  trackingNumber: string;
  documentType: string;
  fileName: string;
  aiConfidence: number | null;
  status: 'uploaded' | 'reviewed' | 'approved' | 'rejected' | 'expired';
  uploadedAt: string;
  expiryDate: string | null;
}

const mockDocs: CustomsDoc[] = [
  { id: '1', shipmentId: 's1', trackingNumber: 'DS-20260320-A001', documentType: 'commercial_invoice', fileName: 'invoice_Okafor_20260320.pdf', aiConfidence: 95, status: 'uploaded', uploadedAt: '2026-03-20', expiryDate: null },
  { id: '2', shipmentId: 's1', trackingNumber: 'DS-20260320-A001', documentType: 'packing_list', fileName: 'packing_Okafor_20260320.pdf', aiConfidence: 92, status: 'uploaded', uploadedAt: '2026-03-20', expiryDate: null },
  { id: '3', shipmentId: 's2', trackingNumber: 'DS-20260320-A002', documentType: 'commercial_invoice', fileName: 'invoice_Adebayo.pdf', aiConfidence: 88, status: 'reviewed', uploadedAt: '2026-03-20', expiryDate: null },
  { id: '4', shipmentId: 's2', trackingNumber: 'DS-20260320-A002', documentType: 'certificate_of_origin', fileName: 'coo_Adebayo.pdf', aiConfidence: 76, status: 'reviewed', uploadedAt: '2026-03-20', expiryDate: '2026-04-15' },
  { id: '5', shipmentId: 's3', trackingNumber: 'DS-20260320-A003', documentType: 'commercial_invoice', fileName: 'invoice_TechHub.pdf', aiConfidence: 62, status: 'uploaded', uploadedAt: '2026-03-20', expiryDate: null },
  { id: '6', shipmentId: 's3', trackingNumber: 'DS-20260320-A003', documentType: 'packing_list', fileName: 'packing_TechHub.pdf', aiConfidence: 58, status: 'rejected', uploadedAt: '2026-03-20', expiryDate: null },
  { id: '7', shipmentId: 's3', trackingNumber: 'DS-20260320-A003', documentType: 'certificate_of_origin', fileName: 'coo_TechHub.pdf', aiConfidence: null, status: 'uploaded', uploadedAt: '2026-03-20', expiryDate: null },
  { id: '8', shipmentId: 's4', trackingNumber: 'DS-20260320-A004', documentType: 'commercial_invoice', fileName: 'invoice_Grace.pdf', aiConfidence: 91, status: 'approved', uploadedAt: '2026-03-20', expiryDate: null },
  { id: '9', shipmentId: 's4', trackingNumber: 'DS-20260320-A004', documentType: 'export_permit', fileName: 'export_permit_Grace.pdf', aiConfidence: 94, status: 'approved', uploadedAt: '2026-03-20', expiryDate: '2026-09-20' },
  { id: '10', shipmentId: 's5', trackingNumber: 'DS-20260319-A005', documentType: 'commercial_invoice', fileName: 'invoice_Kamau.pdf', aiConfidence: 78, status: 'uploaded', uploadedAt: '2026-03-19', expiryDate: null },
  { id: '11', shipmentId: 's5', trackingNumber: 'DS-20260319-A005', documentType: 'airway_bill', fileName: 'awb_Kamau.pdf', aiConfidence: 82, status: 'uploaded', uploadedAt: '2026-03-19', expiryDate: null },
  { id: '12', shipmentId: 's6', trackingNumber: 'DS-20260318-B001', documentType: 'commercial_invoice', fileName: 'invoice_Belmonte.pdf', aiConfidence: 92, status: 'approved', uploadedAt: '2026-03-18', expiryDate: null },
  { id: '13', shipmentId: 's6', trackingNumber: 'DS-20260318-B001', documentType: 'packing_list', fileName: 'packing_Belmonte.pdf', aiConfidence: 90, status: 'approved', uploadedAt: '2026-03-18', expiryDate: null },
  { id: '14', shipmentId: 's7', trackingNumber: 'DS-20260318-B002', documentType: 'commercial_invoice', fileName: 'invoice_Osei.pdf', aiConfidence: 45, status: 'rejected', uploadedAt: '2026-03-18', expiryDate: null },
  { id: '15', shipmentId: 's8', trackingNumber: 'DS-20260317-B003', documentType: 'commercial_invoice', fileName: 'invoice_Njoku.pdf', aiConfidence: 89, status: 'approved', uploadedAt: '2026-03-17', expiryDate: null },
  { id: '16', shipmentId: 's8', trackingNumber: 'DS-20260317-B003', documentType: 'bill_of_lading', fileName: 'bol_Njoku.pdf', aiConfidence: 93, status: 'approved', uploadedAt: '2026-03-17', expiryDate: null },
  { id: '17', shipmentId: 's8', trackingNumber: 'DS-20260317-B003', documentType: 'certificate_of_origin', fileName: 'coo_Njoku.pdf', aiConfidence: 87, status: 'approved', uploadedAt: '2026-03-17', expiryDate: '2026-04-08' },
  { id: '18', shipmentId: 's9', trackingNumber: 'DS-20260317-B004', documentType: 'commercial_invoice', fileName: 'invoice_Kimani.pdf', aiConfidence: 97, status: 'approved', uploadedAt: '2026-03-17', expiryDate: null },
  { id: '19', shipmentId: 's10', trackingNumber: 'DS-20260317-B005', documentType: 'commercial_invoice', fileName: 'invoice_Abiodun.pdf', aiConfidence: 93, status: 'approved', uploadedAt: '2026-03-17', expiryDate: null },
  { id: '20', shipmentId: 's11', trackingNumber: 'DS-20260316-B006', documentType: 'import_permit', fileName: 'import_Achebe.pdf', aiConfidence: 81, status: 'reviewed', uploadedAt: '2026-03-16', expiryDate: '2026-03-28' },
];

const filterConfig: FilterConfig[] = [
  { key: 'docType', type: 'select', label: 'Document Type', options: [
    { label: 'Commercial Invoice', value: 'commercial_invoice' },
    { label: 'Packing List', value: 'packing_list' },
    { label: 'Bill of Lading', value: 'bill_of_lading' },
    { label: 'Airway Bill', value: 'airway_bill' },
    { label: 'Certificate of Origin', value: 'certificate_of_origin' },
    { label: 'Import Permit', value: 'import_permit' },
    { label: 'Export Permit', value: 'export_permit' },
  ]},
  { key: 'status', type: 'select', label: 'Status', options: [
    { label: 'Uploaded', value: 'uploaded' },
    { label: 'Reviewed', value: 'reviewed' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Expired', value: 'expired' },
  ]},
  { key: 'confidence', type: 'select', label: 'AI Confidence', options: [
    { label: 'High (≥90%)', value: 'high' },
    { label: 'Medium (70-89%)', value: 'medium' },
    { label: 'Low (<70%)', value: 'low' },
    { label: 'Missing', value: 'missing' },
  ]},
  { key: 'dateFrom', type: 'date', label: 'From' },
  { key: 'dateTo', type: 'date', label: 'To' },
];

const docTypeLabels: Record<string, string> = {
  commercial_invoice: 'Invoice',
  packing_list: 'Packing List',
  bill_of_lading: 'Bill of Lading',
  airway_bill: 'Airway Bill',
  certificate_of_origin: 'Cert. of Origin',
  import_permit: 'Import Permit',
  export_permit: 'Export Permit',
};

function getConfidenceBadge(score: number | null) {
  if (score === null) return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">Not processed</span>;
  if (score >= 90) return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">{score}%</span>;
  if (score >= 70) return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">{score}%</span>;
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">{score}%</span>;
}

function getStatusBadge(status: string) {
  const config: Record<string, { label: string; bg: string; text: string }> = {
    uploaded: { label: 'Uploaded', bg: 'bg-gray-100', text: 'text-gray-700' },
    reviewed: { label: 'Reviewed', bg: 'bg-blue-100', text: 'text-blue-700' },
    approved: { label: 'Approved', bg: 'bg-green-100', text: 'text-green-700' },
    rejected: { label: 'Rejected', bg: 'bg-red-100', text: 'text-red-700' },
    expired: { label: 'Expired', bg: 'bg-gray-100', text: 'text-gray-700' },
  };
  const c = config[status] || config.uploaded;
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>{c.label}</span>;
}

function isExpiringSoon(date: string | null): boolean {
  if (!date) return false;
  const expiry = new Date(date);
  const now = new Date('2026-03-20');
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= 30 && diffDays >= 0;
}

function getDaysUntilExpiry(date: string): number {
  const expiry = new Date(date);
  const now = new Date('2026-03-20');
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function CustomsDocumentsPage() {
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const expiringDocs = mockDocs.filter(d => isExpiringSoon(d.expiryDate));

  const filtered = mockDocs.filter(d => {
    if (filters.docType && d.documentType !== filters.docType) return false;
    if (filters.status && d.status !== filters.status) return false;
    if (filters.confidence) {
      if (filters.confidence === 'high' && (d.aiConfidence === null || d.aiConfidence < 90)) return false;
      if (filters.confidence === 'medium' && (d.aiConfidence === null || d.aiConfidence < 70 || d.aiConfidence >= 90)) return false;
      if (filters.confidence === 'low' && (d.aiConfidence === null || d.aiConfidence >= 70)) return false;
      if (filters.confidence === 'missing' && d.aiConfidence !== null) return false;
    }
    return true;
  });

  const columns = [
    { key: 'trackingNumber', label: 'Shipment ID', sortable: true, render: (d: CustomsDoc) => <span className="font-mono text-xs font-semibold text-cyan-700 hover:underline cursor-pointer">{d.trackingNumber}</span> },
    { key: 'documentType', label: 'Type', render: (d: CustomsDoc) => <Badge variant="outline" className="text-[10px] border-cyan-200 text-cyan-700">{docTypeLabels[d.documentType] || d.documentType}</Badge> },
    { key: 'fileName', label: 'File Name', render: (d: CustomsDoc) => <span className="text-xs text-[var(--ink)] max-w-[200px] truncate block">{d.fileName}</span> },
    { key: 'aiConfidence', label: 'AI Confidence', render: (d: CustomsDoc) => getConfidenceBadge(d.aiConfidence) },
    { key: 'status', label: 'Status', render: (d: CustomsDoc) => getStatusBadge(d.status) },
    { key: 'uploadedAt', label: 'Uploaded', sortable: true, render: (d: CustomsDoc) => <span className="text-xs text-[var(--muted-text)]">{d.uploadedAt}</span> },
    { key: 'expiryDate', label: 'Expires', render: (d: CustomsDoc) => {
      if (!d.expiryDate) return <span className="text-xs text-[var(--muted-text)]">—</span>;
      const days = getDaysUntilExpiry(d.expiryDate);
      const isRed = days <= 30;
      return <span className={`text-xs font-medium ${isRed ? 'text-red-600' : 'text-[var(--ink)]'}`}>{d.expiryDate} {isRed && `(${days}d)`}</span>;
    }},
    { key: 'actions', label: 'Actions', render: (d: CustomsDoc) => (
      <div className="flex gap-1">
        <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-700 hover:text-cyan-700"><Eye size={13} /></Button>
        {d.status !== 'approved' && <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600 hover:text-green-700"><CheckCircle2 size={13} /></Button>}
        {d.status !== 'rejected' && <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-700"><XCircle size={13} /></Button>}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      {expiringDocs.length > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
          <span className="text-sm text-amber-800"><strong>{expiringDocs.length} document{expiringDocs.length > 1 ? 's' : ''}</strong> expiring within 30 days. Review and renew as needed.</span>
        </div>
      )}
      <FilterBar filters={filterConfig} onFilterChange={handleFilterChange} onClear={() => setFilters({})} values={filters} />
      <DataTable columns={columns} data={filtered} emptyState={{ icon: <FileText size={24} />, title: 'No documents found' }} />
    </div>
  );
}
