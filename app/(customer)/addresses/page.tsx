'use client';

import { useState } from 'react';
import { MapPin, Phone, Edit, Trash2, Plus, Star, Building2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
import type { Address } from '@/types';

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'GH', name: 'Ghana' },
  { code: 'KE', name: 'Kenya' },
];

const ADDRESS_TYPES = [
  { value: 'residential', label: 'Residential', icon: Home },
  { value: 'commercial', label: 'Commercial', icon: Building2 },
  { value: 'warehouse', label: 'Warehouse', icon: Building2 },
];

export default function AddressesPage() {
  const { shipments } = useShipmentStore();
  const allAddresses = shipments.flatMap((s) => [s.pickupAddress, s.deliveryAddress]);
  const uniqueAddresses = allAddresses.filter(
    (addr, index, self) => self.findIndex((a) => a.id === addr.id) === index
  );

  const [addresses, setAddresses] = useState<Address[]>(uniqueAddresses);
  const [addOpen, setAddOpen] = useState(false);
  const [editAddr, setEditAddr] = useState<Address | null>(null);
  const [form, setForm] = useState({
    label: '',
    type: 'residential',
    recipientName: '',
    recipientPhone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: 'US',
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const resetForm = () => {
    setForm({
      label: '',
      type: 'residential',
      recipientName: '',
      recipientPhone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      stateProvince: '',
      postalCode: '',
      country: 'US',
    });
    setEditAddr(null);
  };

  const handleSave = () => {
    const newAddr: Address = {
      id: editAddr?.id || `a-${Date.now()}`,
      label: form.label || 'Address',
      type: form.type as Address['type'],
      recipientName: form.recipientName,
      recipientPhone: form.recipientPhone,
      addressLine1: form.addressLine1,
      addressLine2: form.addressLine2 || undefined,
      city: form.city,
      stateProvince: form.stateProvince,
      postalCode: form.postalCode,
      country: form.country,
      isDefaultPickup: false,
      isDefaultDelivery: false,
    };

    if (editAddr) {
      setAddresses((prev) => prev.map((a) => (a.id === editAddr.id ? newAddr : a)));
    } else {
      setAddresses((prev) => [...prev, newAddr]);
    }
    setAddOpen(false);
    resetForm();
  };

  const handleEdit = (addr: Address) => {
    setEditAddr(addr);
    setForm({
      label: addr.label,
      type: addr.type,
      recipientName: addr.recipientName,
      recipientPhone: addr.recipientPhone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || '',
      city: addr.city,
      stateProvince: addr.stateProvince,
      postalCode: addr.postalCode,
      country: addr.country,
    });
    setAddOpen(true);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const getTypeIcon = (type: string) => {
    const found = ADDRESS_TYPES.find((t) => t.value === type);
    return found?.icon || MapPin;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            style={{ fontFamily: 'var(--font-playfair)' }}
            className="text-2xl font-bold text-[var(--ink)]"
          >
            Saved Addresses
          </h1>
          <p className="text-sm text-[var(--muted-text)]">
            {addresses.length} address{addresses.length !== 1 ? 'es' : ''} saved
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setAddOpen(true);
          }}
          className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16">
          <MapPin className="h-12 w-12 text-[var(--muted-text)] mx-auto mb-3 opacity-40" />
          <p className="font-medium text-[var(--ink)] mb-1">No addresses saved</p>
          <p className="text-sm text-[var(--muted-text)] mb-4">
            Add your pickup and delivery addresses.
          </p>
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Address
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((addr) => {
            const TypeIcon = getTypeIcon(addr.type);
            return (
              <Card key={addr.id} className="border-[var(--border-warm)]">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TypeIcon className="h-4 w-4 text-[var(--terra)]" />
                      <Badge variant="secondary" className="text-[10px] capitalize">
                        {addr.type}
                      </Badge>
                      <span className="font-medium text-sm text-[var(--ink)]">{addr.label}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(addr)}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(addr.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <p className="font-medium text-[var(--ink)] mb-1">{addr.recipientName}</p>
                  <p className="text-sm text-[var(--muted-text)]">{addr.addressLine1}</p>
                  {addr.addressLine2 && (
                    <p className="text-sm text-[var(--muted-text)]">{addr.addressLine2}</p>
                  )}
                  <p className="text-sm text-[var(--muted-text)]">
                    {addr.city}, {addr.stateProvince} {addr.postalCode}
                  </p>
                  <p className="text-sm text-[var(--muted-text)]">{addr.country}</p>
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-[var(--muted-text)]">
                    <Phone className="h-3 w-3" />
                    {addr.recipientPhone}
                  </div>
                  <div className="flex gap-2 mt-3">
                    {addr.isDefaultPickup && (
                      <Badge variant="default" className="text-[10px]">
                        <Star className="h-3 w-3 mr-0.5" />
                        Default Pickup
                      </Badge>
                    )}
                    {addr.isDefaultDelivery && (
                      <Badge variant="default" className="text-[10px]">
                        <Star className="h-3 w-3 mr-0.5" />
                        Default Delivery
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={(open) => {
        setAddOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editAddr ? 'Edit Address' : 'Add New Address'}</DialogTitle>
            <DialogDescription>
              {editAddr ? 'Update your address details.' : 'Save a new pickup or delivery address.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Label</Label>
                <Input
                  placeholder="e.g. Home, Office"
                  value={form.label}
                  onChange={(e) => update('label', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => update('type', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ADDRESS_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Recipient Name</Label>
                <Input
                  placeholder="Full name"
                  value={form.recipientName}
                  onChange={(e) => update('recipientName', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input
                  placeholder="+1 (555) 123-4567"
                  value={form.recipientPhone}
                  onChange={(e) => update('recipientPhone', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Address Line 1</Label>
              <Input
                placeholder="Street address"
                value={form.addressLine1}
                onChange={(e) => update('addressLine1', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Address Line 2 (optional)</Label>
              <Input
                placeholder="Suite, unit, etc."
                value={form.addressLine2}
                onChange={(e) => update('addressLine2', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>City</Label>
                <Input
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>State / Province</Label>
                <Input
                  placeholder="State"
                  value={form.stateProvince}
                  onChange={(e) => update('stateProvince', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Postal Code</Label>
                <Input
                  placeholder="12345"
                  value={form.postalCode}
                  onChange={(e) => update('postalCode', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Country</Label>
              <Select value={form.country} onValueChange={(v) => update('country', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAddOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!form.recipientName || !form.addressLine1 || !form.city}
              className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white"
            >
              {editAddr ? 'Update Address' : 'Save Address'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
