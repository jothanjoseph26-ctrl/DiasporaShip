'use client';

import { useState } from 'react';
import { Clock, CheckCircle2, XCircle, Eye, ShieldCheck, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { KpiCard, DataTable, RightDrawer } from '@/components/shared';
import type { ShipmentStatus } from '@/types';

interface CustomsQueueItem {
  id: string;
  trackingNumber: string;
  customerName: string;
  origin: string;
  destination: string;
  originFlag: string;
  destFlag: string;
  docTypes: string[];
  aiConfidence: number | null;
  uploadedAt: string;
  hsCode: string;
  declaredValue: string;
  extractedShipper: string;
  extractedConsignee: string;
  extractedHSCode: string;
  extractedValue: string;
  extractedWeight: string;
  extractedQuantity: string;
}

const mockQueue: CustomsQueueItem[] = [
  { id: '1', trackingNumber: 'DS-20260320-A001', customerName: 'Okafor Trading Co.', origin: 'US', destination: 'NG', originFlag: '🇺🇸', destFlag: '🇳🇬', docTypes: ['invoice', 'packing_list'], aiConfidence: 95, uploadedAt: '2026-03-20', hsCode: '8473.30', declaredValue: '$2,450', extractedShipper: 'Okafor Trading Co.', extractedConsignee: 'Emeka Okafor', extractedHSCode: '8473.30', extractedValue: '$2,450.00', extractedWeight: '12.5 kg', extractedQuantity: '5' },
  { id: '2', trackingNumber: 'DS-20260320-A002', customerName: 'Adebayo Imports', origin: 'UK', destination: 'NG', originFlag: '🇬🇧', destFlag: '🇳🇬', docTypes: ['invoice', 'certificate_of_origin'], aiConfidence: 88, uploadedAt: '2026-03-20', hsCode: '6204.62', declaredValue: '$1,200', extractedShipper: 'Adebayo Imports Ltd', extractedConsignee: 'Adebayo Imports', extractedHSCode: '6204.62', extractedValue: '$1,200.00', extractedWeight: '8.2 kg', extractedQuantity: '24' },
  { id: '3', trackingNumber: 'DS-20260320-A003', customerName: 'TechHub Lagos', origin: 'CN', destination: 'NG', originFlag: '🇨🇳', destFlag: '🇳🇬', docTypes: ['invoice', 'packing_list', 'certificate'], aiConfidence: 62, uploadedAt: '2026-03-20', hsCode: '8517.12', declaredValue: '$15,800', extractedShipper: 'Shenzhen Tech Ltd', extractedConsignee: 'TechHub Lagos', extractedHSCode: '8517.12', extractedValue: '$18,200.00', extractedWeight: '145 kg', extractedQuantity: '200' },
  { id: '4', trackingNumber: 'DS-20260320-A004', customerName: 'Grace Fabrics', origin: 'NG', destination: 'GH', originFlag: '🇳🇬', destFlag: '🇬🇭', docTypes: ['invoice', 'export_permit'], aiConfidence: 91, uploadedAt: '2026-03-20', hsCode: '5209.31', declaredValue: '$3,600', extractedShipper: 'Grace Fabrics NG', extractedConsignee: 'Accra Textiles', extractedHSCode: '5209.31', extractedValue: '$3,600.00', extractedWeight: '85 kg', extractedQuantity: '50' },
  { id: '5', trackingNumber: 'DS-20260319-A005', customerName: 'Kamau Electronics', origin: 'US', destination: 'KE', originFlag: '🇺🇸', destFlag: '🇰🇪', docTypes: ['invoice', 'airway_bill'], aiConfidence: 78, uploadedAt: '2026-03-19', hsCode: '8471.30', declaredValue: '$4,200', extractedShipper: 'Kamau Electronics Inc', extractedConsignee: 'Kamau Electronics', extractedHSCode: '8471.30', extractedValue: '$4,500.00', extractedWeight: '22 kg', extractedQuantity: '3' },
  { id: '6', trackingNumber: 'DS-20260319-A006', customerName: 'Nwosu Pharma', origin: 'DE', destination: 'NG', originFlag: '🇩🇪', destFlag: '🇳🇬', docTypes: ['invoice', 'certificate', 'import_permit'], aiConfidence: null, uploadedAt: '2026-03-19', hsCode: '3004.90', declaredValue: '$28,500', extractedShipper: '', extractedConsignee: '', extractedHSCode: '', extractedValue: '', extractedWeight: '', extractedQuantity: '' },
  { id: '7', trackingNumber: 'DS-20260319-A007', customerName: 'Asante Traders', origin: 'CN', destination: 'GH', originFlag: '🇨🇳', destFlag: '🇬🇭', docTypes: ['invoice', 'packing_list', 'bill_of_lading'], aiConfidence: 94, uploadedAt: '2026-03-19', hsCode: '6402.99', declaredValue: '$6,750', extractedShipper: 'Guangzhou Shoe Mfg', extractedConsignee: 'Asante Traders', extractedHSCode: '6402.99', extractedValue: '$6,750.00', extractedWeight: '320 kg', extractedQuantity: '500' },
  { id: '8', trackingNumber: 'DS-20260319-A008', customerName: 'Mwangi Auto Parts', origin: 'US', destination: 'KE', originFlag: '🇺🇸', destFlag: '🇰🇪', docTypes: ['invoice', 'certificate_of_origin'], aiConfidence: 85, uploadedAt: '2026-03-19', hsCode: '8708.99', declaredValue: '$9,300', extractedShipper: 'AutoParts USA', extractedConsignee: 'Mwangi Auto', extractedHSCode: '8708.99', extractedValue: '$9,300.00', extractedWeight: '210 kg', extractedQuantity: '15' },
  { id: '9', trackingNumber: 'DS-20260318-A009', customerName: 'Belmonte & Sons', origin: 'UK', destination: 'NG', originFlag: '🇬🇧', destFlag: '🇳🇬', docTypes: ['invoice', 'packing_list'], aiConfidence: 92, uploadedAt: '2026-03-18', hsCode: '9403.60', declaredValue: '$7,800', extractedShipper: 'Belmonte London', extractedConsignee: 'Belmonte Lagos', extractedHSCode: '9403.60', extractedValue: '$7,800.00', extractedWeight: '450 kg', extractedQuantity: '8' },
  { id: '10', trackingNumber: 'DS-20260318-A010', customerName: 'Osei Fashion House', origin: 'FR', destination: 'GH', originFlag: '🇫🇷', destFlag: '🇬🇭', docTypes: ['invoice'], aiConfidence: 45, uploadedAt: '2026-03-18', hsCode: '6205.20', declaredValue: '$2,100', extractedShipper: 'Maison Paris', extractedConsignee: 'Osei Fashion', extractedHSCode: '6205.20', extractedValue: '$3,400.00', extractedWeight: '18 kg', extractedQuantity: '30' },
  { id: '11', trackingNumber: 'DS-20260318-A011', customerName: 'Oluwaseun Foods', origin: 'NG', destination: 'US', originFlag: '🇳🇬', destFlag: '🇺🇸', docTypes: ['invoice', 'certificate', 'export_permit', 'packing_list'], aiConfidence: 96, uploadedAt: '2026-03-18', hsCode: '1904.10', declaredValue: '$4,500', extractedShipper: 'Oluwaseun Foods NG', extractedConsignee: 'African Market US', extractedHSCode: '1904.10', extractedValue: '$4,500.00', extractedWeight: '250 kg', extractedQuantity: '100' },
  { id: '12', trackingNumber: 'DS-20260318-A012', customerName: 'Mensah Ventures', origin: 'IN', destination: 'GH', originFlag: '🇮🇳', destFlag: '🇬🇭', docTypes: ['invoice', 'airway_bill', 'packing_list'], aiConfidence: 73, uploadedAt: '2026-03-18', hsCode: '3304.10', declaredValue: '$1,850', extractedShipper: 'Mumbai Beauty Ltd', extractedConsignee: 'Mensah Ventures', extractedHSCode: '3304.10', extractedValue: '$1,850.00', extractedWeight: '35 kg', extractedQuantity: '120' },
  { id: '13', trackingNumber: 'DS-20260317-A013', customerName: 'Njoku Machinery', origin: 'CN', destination: 'NG', originFlag: '🇨🇳', destFlag: '🇳🇬', docTypes: ['invoice', 'bill_of_lading', 'certificate_of_origin'], aiConfidence: 89, uploadedAt: '2026-03-17', hsCode: '8462.10', declaredValue: '$42,000', extractedShipper: 'Shanghai Heavy Mfg', extractedConsignee: 'Njoku Machinery', extractedHSCode: '8462.10', extractedValue: '$42,000.00', extractedWeight: '2500 kg', extractedQuantity: '2' },
  { id: '14', trackingNumber: 'DS-20260317-A014', customerName: 'Kimani Books', origin: 'US', destination: 'KE', originFlag: '🇺🇸', destFlag: '🇰🇪', docTypes: ['invoice', 'packing_list'], aiConfidence: 97, uploadedAt: '2026-03-17', hsCode: '4901.99', declaredValue: '$890', extractedShipper: 'Academic Books US', extractedConsignee: 'Kimani Books', extractedHSCode: '4901.99', extractedValue: '$890.00', extractedWeight: '45 kg', extractedQuantity: '200' },
  { id: '15', trackingNumber: 'DS-20260317-A015', customerName: 'Achebe & Partners', origin: 'DE', destination: 'NG', originFlag: '🇩🇪', destFlag: '🇳🇬', docTypes: ['invoice', 'import_permit'], aiConfidence: 81, uploadedAt: '2026-03-17', hsCode: '9018.90', declaredValue: '$65,000', extractedShipper: 'Berlin MedTech', extractedConsignee: 'Achebe Medical', extractedHSCode: '9018.90', extractedValue: '$65,000.00', extractedWeight: '180 kg', extractedQuantity: '4' },
  { id: '16', trackingNumber: 'DS-20260317-A016', customerName: 'Abiodun Textiles', origin: 'IN', destination: 'NG', originFlag: '🇮🇳', destFlag: '🇳🇬', docTypes: ['invoice', 'packing_list', 'certificate_of_origin'], aiConfidence: 93, uploadedAt: '2026-03-17', hsCode: '5512.19', declaredValue: '$12,400', extractedShipper: 'Delhi Textiles', extractedConsignee: 'Abiodun Textiles', extractedHSCode: '5512.19', extractedValue: '$12,400.00', extractedWeight: '800 kg', extractedQuantity: '300' },
  { id: '17', trackingNumber: 'DS-20260316-A017', customerName: 'Otieno Solar', origin: 'CN', destination: 'KE', originFlag: '🇨🇳', destFlag: '🇰🇪', docTypes: ['invoice', 'bill_of_lading'], aiConfidence: 68, uploadedAt: '2026-03-16', hsCode: '8541.40', declaredValue: '$22,000', extractedShipper: 'Shenzhen Solar Co', extractedConsignee: 'Otieno Solar', extractedHSCode: '8541.40', extractedValue: '$25,300.00', extractedWeight: '600 kg', extractedQuantity: '50' },
  { id: '18', trackingNumber: 'DS-20260316-A018', customerName: 'Okonkwo Metals', origin: 'AU', destination: 'NG', originFlag: '🇦🇺', destFlag: '🇳🇬', docTypes: ['invoice', 'certificate_of_origin', 'import_permit'], aiConfidence: 90, uploadedAt: '2026-03-16', hsCode: '7208.51', declaredValue: '$38,500', extractedShipper: 'Sydney Metals', extractedConsignee: 'Okonkwo Steel', extractedHSCode: '7208.51', extractedValue: '$38,500.00', extractedWeight: '5000 kg', extractedQuantity: '10' },
];

function getDocTypeBadge(type: string) {
  const labels: Record<string, string> = {
    invoice: 'Invoice',
    packing_list: 'Packing List',
    certificate: 'Certificate',
    certificate_of_origin: 'CoO',
    airway_bill: 'AWB',
    bill_of_lading: 'BoL',
    export_permit: 'Export',
    import_permit: 'Import',
  };
  return (
    <span key={type} className="inline-flex text-[10px] font-semibold px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200 mr-1 mb-0.5">
      {labels[type] || type}
    </span>
  );
}

function getConfidenceBadge(score: number | null) {
  if (score === null) return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700"><ShieldCheck size={12} /> Not processed</span>;
  if (score >= 90) return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700"><ShieldCheck size={12} /> {score}%</span>;
  if (score >= 70) return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700"><AlertTriangle size={12} /> {score}%</span>;
  return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700"><AlertTriangle size={12} /> {score}%</span>;
}

export default function CustomsQueuePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CustomsQueueItem | null>(null);
  const [notes, setNotes] = useState('');

  const handleReview = (item: CustomsQueueItem) => {
    setSelectedItem(item);
    setNotes('');
    setDrawerOpen(true);
  };

  const aiFields = selectedItem ? [
    { field: 'Shipper Name', extracted: selectedItem.extractedShipper, declared: selectedItem.customerName, mismatch: selectedItem.extractedShipper !== selectedItem.customerName },
    { field: 'Consignee', extracted: selectedItem.extractedConsignee, declared: 'N/A', mismatch: false },
    { field: 'HS Code', extracted: selectedItem.extractedHSCode, declared: selectedItem.hsCode, mismatch: selectedItem.extractedHSCode !== selectedItem.hsCode },
    { field: 'Declared Value', extracted: selectedItem.extractedValue, declared: selectedItem.declaredValue, mismatch: selectedItem.extractedValue !== selectedItem.declaredValue && selectedItem.extractedValue !== '' },
    { field: 'Weight', extracted: selectedItem.extractedWeight, declared: 'N/A', mismatch: false },
    { field: 'Quantity', extracted: selectedItem.extractedQuantity, declared: 'N/A', mismatch: false },
  ] : [];

  const columns = [
    { key: 'trackingNumber', label: 'Shipment ID', sortable: true, render: (item: CustomsQueueItem) => <span className="font-mono text-xs font-semibold text-[var(--ink)]">{item.trackingNumber}</span> },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'route', label: 'Route', render: (item: CustomsQueueItem) => <span className="text-sm">{item.originFlag} → {item.destFlag}</span> },
    { key: 'docTypes', label: 'Documents', render: (item: CustomsQueueItem) => <div className="flex flex-wrap max-w-[180px]">{item.docTypes.map(d => getDocTypeBadge(d))}</div> },
    { key: 'aiConfidence', label: 'AI Confidence', sortable: true, render: (item: CustomsQueueItem) => getConfidenceBadge(item.aiConfidence) },
    { key: 'uploadedAt', label: 'Uploaded', sortable: true, render: (item: CustomsQueueItem) => <span className="text-xs text-[var(--muted-text)]">{item.uploadedAt}</span> },
    { key: 'actions', label: '', render: (item: CustomsQueueItem) => <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-cyan-300 bg-white text-cyan-700 hover:bg-cyan-50" onClick={(e) => { e.stopPropagation(); handleReview(item); }}><Eye size={13} /> Review</button> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard icon={<Clock size={18} />} label="Pending Review" value="18" variant="ink" />
        <KpiCard icon={<CheckCircle2 size={18} />} label="Cleared Today" value="24" trend="+6" variant="gold" />
        <KpiCard icon={<XCircle size={18} />} label="On Hold" value="3" variant="terra" />
      </div>

      <DataTable columns={columns} data={mockQueue} onRowClick={handleReview} />

      <RightDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Document Review" width={480}>
        {selectedItem && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-semibold">{selectedItem.trackingNumber}</span>
              {getConfidenceBadge(selectedItem.aiConfidence)}
            </div>

            <div className="bg-gray-100 rounded-lg flex items-center justify-center text-[var(--muted-text)] text-sm" style={{ height: 400 }}>
              Document Preview
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-text)] mb-3">AI Extracted Fields</h3>
              <div className="border border-[var(--border-warm)] rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[var(--cream)] border-b border-[var(--border-warm)]">
                      <th className="text-left p-2 font-semibold text-[var(--muted-text)]">Field</th>
                      <th className="text-left p-2 font-semibold text-[var(--muted-text)]">Extracted</th>
                      <th className="text-left p-2 font-semibold text-[var(--muted-text)]">Declared</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aiFields.map(f => (
                      <tr key={f.field} className="border-b border-[var(--border-warm)] last:border-0">
                        <td className="p-2 font-medium text-[var(--ink)]">{f.field}</td>
                        <td className={`p-2 ${f.mismatch ? 'text-red-600 font-semibold bg-red-50' : 'text-[var(--ink)]'}`}>{f.extracted || '—'}</td>
                        <td className={`p-2 ${f.mismatch ? 'text-red-600 font-semibold bg-red-50' : 'text-[var(--ink)]'}`}>{f.declared}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-1"><CheckCircle2 size={14} /> Approve</Button>
              <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white gap-1"><AlertTriangle size={14} /> Hold</Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-1"><XCircle size={14} /> Reject</Button>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--muted-text)] mb-1.5 block">Notes (required on rejection)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add review notes..."
                className="w-full border border-[var(--border-warm)] rounded-lg p-3 text-sm text-[var(--ink)] bg-[var(--warm-white)] min-h-[80px] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 placeholder:text-gray-500"
              />
            </div>
          </div>
        )}
      </RightDrawer>
    </div>
  );
}
