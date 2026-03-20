'use client';

import { useState } from 'react';
import { Upload, AlertTriangle, Download, Eye, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useShipmentStore } from '@/store';
import { formatDateTime, formatDate } from '@/lib/utils';
import type { CustomsDocument } from '@/types';

const DOC_TYPES = [
  'commercial_invoice',
  'packing_list',
  'bill_of_lading',
  'airway_bill',
  'certificate_of_origin',
  'import_permit',
  'export_permit',
  'other',
] as const;

const MOCK_DOCUMENTS: CustomsDocument[] = [
  {
    id: 'doc1',
    shipmentId: 's1',
    documentType: 'commercial_invoice',
    fileUrl: '#',
    fileName: 'commercial_invoice_s1.pdf',
    aiConfidenceScore: 96,
    status: 'approved',
    createdAt: '2026-03-15T10:30:00Z',
    expiryDate: '2026-06-15T00:00:00Z',
  },
  {
    id: 'doc2',
    shipmentId: 's1',
    documentType: 'packing_list',
    fileUrl: '#',
    fileName: 'packing_list_s1.pdf',
    aiConfidenceScore: 92,
    status: 'approved',
    createdAt: '2026-03-15T10:30:00Z',
  },
  {
    id: 'doc3',
    shipmentId: 's3',
    documentType: 'bill_of_lading',
    fileUrl: '#',
    fileName: 'bol_s3.pdf',
    aiConfidenceScore: 88,
    status: 'reviewed',
    createdAt: '2026-03-01T06:00:00Z',
    expiryDate: '2026-03-25T00:00:00Z',
  },
  {
    id: 'doc4',
    shipmentId: 's3',
    documentType: 'certificate_of_origin',
    fileUrl: '#',
    fileName: 'coo_s3.pdf',
    aiConfidenceScore: 75,
    status: 'uploaded',
    createdAt: '2026-03-02T10:00:00Z',
  },
  {
    id: 'doc5',
    shipmentId: 's4',
    documentType: 'commercial_invoice',
    fileUrl: '#',
    fileName: 'invoice_s4.pdf',
    aiConfidenceScore: 99,
    status: 'approved',
    createdAt: '2026-03-15T12:00:00Z',
  },
];

function getStatusBadge(status: CustomsDocument['status']) {
  switch (status) {
    case 'approved':
      return <Badge variant="success">Approved</Badge>;
    case 'reviewed':
      return <Badge variant="info">Reviewed</Badge>;
    case 'uploaded':
      return <Badge variant="secondary">Uploaded</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    case 'expired':
      return <Badge variant="destructive">Expired</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function getConfidenceBadge(score?: number) {
  if (!score) return null;
  const variant = score >= 90 ? 'success' : score >= 75 ? 'warning' : 'destructive';
  return (
    <Badge variant={variant} className="text-[10px]">
      AI {score}%
    </Badge>
  );
}

function isExpiringSoon(date?: string) {
  if (!date) return false;
  const expiry = new Date(date);
  const now = new Date();
  const diffDays = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 30 && diffDays > 0;
}

export default function DocumentsPage() {
  const { shipments } = useShipmentStore();
  const [documents, setDocuments] = useState<CustomsDocument[]>(MOCK_DOCUMENTS);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    shipmentId: '',
    documentType: '',
    fileName: '',
  });

  const expiringDocs = documents.filter((d) => isExpiringSoon(d.expiryDate));

  const handleUpload = () => {
    const newDoc: CustomsDocument = {
      id: `doc-${Date.now()}`,
      shipmentId: uploadForm.shipmentId,
      documentType: uploadForm.documentType as CustomsDocument['documentType'],
      fileUrl: '#',
      fileName: uploadForm.fileName || 'uploaded_document.pdf',
      aiConfidenceScore: Math.floor(Math.random() * 20) + 80,
      status: 'uploaded',
      createdAt: new Date().toISOString(),
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setUploadOpen(false);
    setUploadForm({ shipmentId: '', documentType: '', fileName: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            style={{ fontFamily: 'var(--font-playfair)' }}
            className="text-2xl font-bold text-[var(--ink)]"
          >
            Documents
          </h1>
          <p className="text-sm text-[var(--muted-text)]">
            {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded
          </p>
        </div>
        <Button
          onClick={() => setUploadOpen(true)}
          className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white"
        >
          <Upload className="h-4 w-4 mr-1" />
          Upload Document
        </Button>
      </div>

      {expiringDocs.length > 0 && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Expiring Documents</p>
              <p className="text-sm text-amber-700 mt-0.5">
                {expiringDocs.length} document{expiringDocs.length !== 1 ? 's' : ''} expiring within 30 days.
                Please renew to avoid customs delays.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {expiringDocs.map((doc) => (
                  <span key={doc.id} className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded">
                    {doc.documentType.replace(/_/g, ' ')} &mdash; expires {formatDate(doc.expiryDate!)}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-[var(--border-warm)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shipment</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>AI Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <span className="font-mono text-xs">{doc.shipmentId}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm capitalize">{doc.documentType.replace(/_/g, ' ')}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-[var(--muted-text)]">{doc.fileName}</span>
                </TableCell>
                <TableCell>{getConfidenceBadge(doc.aiConfidenceScore)}</TableCell>
                <TableCell>{getStatusBadge(doc.status)}</TableCell>
                <TableCell className="text-sm">{formatDateTime(doc.createdAt)}</TableCell>
                <TableCell>
                  {doc.expiryDate ? (
                    <span className={`text-sm ${isExpiringSoon(doc.expiryDate) ? 'text-amber-600 font-medium' : 'text-[var(--muted-text)]'}`}>
                      {formatDate(doc.expiryDate)}
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--muted-text)]">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload customs or shipment documents. AI will automatically extract key data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Shipment</Label>
              <Select
                value={uploadForm.shipmentId}
                onValueChange={(v) => setUploadForm((f) => ({ ...f, shipmentId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shipment" />
                </SelectTrigger>
                <SelectContent>
                  {shipments.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.trackingNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Document Type</Label>
              <Select
                value={uploadForm.documentType}
                onValueChange={(v) => setUploadForm((f) => ({ ...f, documentType: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {DOC_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>File</Label>
              <div className="border-2 border-dashed border-[var(--border-warm)] rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 text-[var(--muted-text)] mx-auto mb-2" />
                <p className="text-sm text-[var(--muted-text)]">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-[var(--muted-text)] mt-1">PDF, JPG, PNG up to 10MB</p>
                <Input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    setUploadForm((f) => ({ ...f, fileName: e.target.files?.[0]?.name || '' }))
                  }
                />
              </div>
              {uploadForm.fileName && (
                <p className="text-xs text-[var(--terra)]">{uploadForm.fileName}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!uploadForm.shipmentId || !uploadForm.documentType}
              className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
