"use client";

import { useState, useRef } from 'react';
import { Upload, X, FileText, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const documentTypes = [
  { value: 'commercial_invoice', label: 'Commercial Invoice' },
  { value: 'packing_list', label: 'Packing List' },
  { value: 'bill_of_lading', label: 'Bill of Lading' },
  { value: 'airway_bill', label: 'Airway Bill' },
  { value: 'certificate_of_origin', label: 'Certificate of Origin' },
  { value: 'import_permit', label: 'Import Permit' },
  { value: 'export_permit', label: 'Export Permit' },
  { value: 'other', label: 'Other' },
];

interface DocumentUploadModalProps {
  shipmentId: string;
  onUpload: (data: { file: File; documentType: string }) => Promise<void>;
  onClose: () => void;
}

export function DocumentUploadModal({ shipmentId, onUpload, onClose }: DocumentUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleUpload = async () => {
    if (!file || !docType) return;
    setUploading(true);
    setProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 100));
      setProgress(i);
    }
    await onUpload({ file, documentType: docType });
    setUploading(false);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-[var(--muted-text)] mb-1.5 block">Document Type</label>
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger><SelectValue placeholder="Select document type" /></SelectTrigger>
              <SelectContent>
                {documentTypes.map(dt => (
                  <SelectItem key={dt.value} value={dt.value}>{dt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragOver ? 'border-[var(--terra)] bg-[var(--terra-pale)]' : 'border-[var(--border-warm)] hover:border-[var(--terra)]'}`}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />
            {file ? (
              <div className="flex items-center justify-center gap-2 text-sm text-[var(--ink)]">
                <FileText size={16} className="text-[var(--terra)]" />
                <span className="font-medium">{file.name}</span>
                <span className="text-xs text-[var(--muted-text)]">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            ) : (
              <div>
                <Upload size={24} className="mx-auto text-[var(--muted-text)] mb-2" />
                <p className="text-sm text-[var(--ink)] font-medium">Drop file here or click to browse</p>
                <p className="text-xs text-[var(--muted-text)] mt-1">PDF, JPG, PNG up to 10MB</p>
              </div>
            )}
          </div>

          {uploading && (
            <div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-[var(--muted-text)] mt-1 text-center">{progress}% uploaded</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleUpload}
              disabled={!file || !docType || uploading}
              className="flex-1 bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={uploading}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
