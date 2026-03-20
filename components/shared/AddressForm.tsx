"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Address } from '@/types';

const countries = [
  { code: 'US', name: 'United States', flag: '\u{1F1FA}\u{1F1F8}' },
  { code: 'NG', name: 'Nigeria', flag: '\u{1F1F3}\u{1F1EC}' },
  { code: 'GB', name: 'United Kingdom', flag: '\u{1F1EC}\u{1F1E7}' },
  { code: 'CA', name: 'Canada', flag: '\u{1F1E8}\u{1F1E6}' },
  { code: 'GH', name: 'Ghana', flag: '\u{1F1EC}\u{1F1ED}' },
  { code: 'KE', name: 'Kenya', flag: '\u{1F1F0}\u{1F1EA}' },
  { code: 'CN', name: 'China', flag: '\u{1F1E8}\u{1F1F3}' },
  { code: 'DE', name: 'Germany', flag: '\u{1F1E9}\u{1F1EA}' },
  { code: 'FR', name: 'France', flag: '\u{1F1EB}\u{1F1F7}' },
  { code: 'ZA', name: 'South Africa', flag: '\u{1F1FF}\u{1F1E6}' },
];

const countryCodes = [
  { code: '+1', country: 'US' },
  { code: '+234', country: 'NG' },
  { code: '+44', country: 'GB' },
  { code: '+233', country: 'GH' },
  { code: '+254', country: 'KE' },
  { code: '+86', country: 'CN' },
  { code: '+49', country: 'DE' },
  { code: '+33', country: 'FR' },
  { code: '+27', country: 'ZA' },
];

interface AddressFormProps {
  initialData?: Partial<Address>;
  onSubmit: (data: Omit<Address, 'id'>) => void;
  onCancel: () => void;
}

export function AddressForm({ initialData, onSubmit, onCancel }: AddressFormProps) {
  const [form, setForm] = useState({
    label: initialData?.label || '',
    type: initialData?.type || 'residential' as const,
    recipientName: initialData?.recipientName || '',
    recipientPhone: initialData?.recipientPhone || '',
    addressLine1: initialData?.addressLine1 || '',
    addressLine2: initialData?.addressLine2 || '',
    city: initialData?.city || '',
    stateProvince: initialData?.stateProvince || '',
    postalCode: initialData?.postalCode || '',
    country: initialData?.country || '',
    isDefaultPickup: initialData?.isDefaultPickup || false,
    isDefaultDelivery: initialData?.isDefaultDelivery || false,
    phoneCode: '+234',
  });

  const update = (key: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { phoneCode, ...data } = form;
    onSubmit({
      ...data,
      recipientPhone: data.recipientPhone.startsWith('+') ? data.recipientPhone : `${phoneCode}${data.recipientPhone}`,
      type: data.type,
    } as Omit<Address, 'id'>);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-medium text-[var(--muted-text)] mb-1.5 block">Label</label>
        <Input placeholder="e.g. Home, Office, Warehouse" value={form.label} onChange={e => update('label', e.target.value)} required />
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--muted-text)] mb-1.5 block">Type</label>
        <Select value={form.type} onValueChange={v => update('type', v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="residential">Residential</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="warehouse">Warehouse</SelectItem>
            <SelectItem value="port">Port</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-[var(--muted-text)] mb-1.5 block">Recipient Name</label>
          <Input placeholder="Full name" value={form.recipientName} onChange={e => update('recipientName', e.target.value)} required />
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--muted-text)] mb-1.5 block">Phone</label>
          <div className="flex gap-1">
            <Select value={form.phoneCode} onValueChange={v => update('phoneCode', v)}>
              <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
              <SelectContent>
                {countryCodes.map(cc => (
                  <SelectItem key={cc.code} value={cc.code}>{cc.code}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="8012345678" value={form.recipientPhone} onChange={e => update('recipientPhone', e.target.value)} required className="flex-1" />
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--muted-text)] mb-1.5 block">Address Line 1</label>
        <Input placeholder="Street address" value={form.addressLine1} onChange={e => update('addressLine1', e.target.value)} required />
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--muted-text)] mb-1.5 block">Address Line 2</label>
        <Input placeholder="Suite, unit, etc. (optional)" value={form.addressLine2} onChange={e => update('addressLine2', e.target.value)} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-medium text-[var(--muted-text)] mb-1.5 block">City</label>
          <Input placeholder="City" value={form.city} onChange={e => update('city', e.target.value)} required />
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--muted-text)] mb-1.5 block">State / Province</label>
          <Input placeholder="State" value={form.stateProvince} onChange={e => update('stateProvince', e.target.value)} required />
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--muted-text)] mb-1.5 block">Postal Code</label>
          <Input placeholder="Postal code" value={form.postalCode} onChange={e => update('postalCode', e.target.value)} required />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--muted-text)] mb-1.5 block">Country</label>
        <Select value={form.country} onValueChange={v => update('country', v)}>
          <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
          <SelectContent>
            {countries.map(c => (
              <SelectItem key={c.code} value={c.code}>{c.flag} {c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-6 pt-1">
        <label className="flex items-center gap-2 text-sm text-[var(--ink)] cursor-pointer">
          <input type="checkbox" checked={form.isDefaultPickup} onChange={e => update('isDefaultPickup', e.target.checked)} className="rounded border-[var(--border-warm)]" />
          Set as default pickup
        </label>
        <label className="flex items-center gap-2 text-sm text-[var(--ink)] cursor-pointer">
          <input type="checkbox" checked={form.isDefaultDelivery} onChange={e => update('isDefaultDelivery', e.target.checked)} className="rounded border-[var(--border-warm)]" />
          Set as default delivery
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white flex-1">
          Save Address
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
