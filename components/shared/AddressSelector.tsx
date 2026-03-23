'use client'

import { useState } from 'react'
import { Plus, MapPin, Building, Warehouse, Ship, Trash2, Edit, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { Address } from '@/types'

interface AddressSelectorProps {
  addresses: Address[]
  selectedAddress: Address | null
  onSelect: (address: Address) => void
  type: 'pickup' | 'delivery'
  onAddNew?: () => void
}

export function AddressSelector({
  addresses,
  selectedAddress,
  onSelect,
  type,
  onAddNew,
}: AddressSelectorProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Partial<Address> | null>(null)

  const filteredAddresses = type === 'pickup'
    ? addresses.filter(a => a.isDefaultPickup || a.type === 'warehouse')
    : addresses.filter(a => a.isDefaultDelivery || a.type === 'commercial' || a.type === 'residential')

  const getIcon = (addrType: string) => {
    switch (addrType) {
      case 'warehouse': return Warehouse
      case 'commercial': return Building
      case 'port': return Ship
      default: return MapPin
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {type === 'pickup' ? 'Pickup Address' : 'Delivery Address'}
        </h3>
        {onAddNew && (
          <Button size="sm" variant="outline" onClick={onAddNew} className="h-8 gap-1">
            <Plus className="h-3 w-3" />
            Add New
          </Button>
        )}
      </div>

      {filteredAddresses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center">
          <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No saved addresses</p>
          {onAddNew && (
            <Button size="sm" variant="outline" onClick={onAddNew} className="mt-3">
              Add Address
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAddresses.map(addr => {
            const Icon = getIcon(addr.type)
            return (
              <button
                key={addr.id}
                onClick={() => onSelect(addr)}
                className={cn(
                  'w-full text-left rounded-xl border p-4 transition-all',
                  selectedAddress?.id === addr.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-primary/40 hover:bg-muted/50'
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{addr.label}</p>
                      {addr.isDefaultPickup && type === 'pickup' && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                      {addr.isDefaultDelivery && type === 'delivery' && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {addr.recipientName}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {addr.addressLine1}, {addr.city}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {addr.stateProvince}, {addr.country}
                    </p>
                  </div>
                  {selectedAddress?.id === addr.id && (
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

interface AddressFormProps {
  initialData?: Partial<Address>
  onSave: (address: Omit<Address, 'id' | 'createdAt'>) => Promise<void>
  onCancel: () => void
}

export function AddressForm({ initialData, onSave, onCancel }: AddressFormProps) {
  const [form, setForm] = useState<Partial<Address>>(initialData || {
    label: '',
    type: 'residential',
    recipientName: '',
    recipientPhone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: '',
    isDefaultPickup: false,
    isDefaultDelivery: false,
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(form as Omit<Address, 'id' | 'createdAt'>)
    } finally {
      setIsSaving(false)
    }
  }

  const update = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Address Label</Label>
          <Input
            value={form.label || ''}
            onChange={e => update('label', e.target.value)}
            placeholder="e.g. Home, Office"
          />
        </div>
        <div className="space-y-2">
          <Label>Address Type</Label>
          <select
            value={form.type || 'residential'}
            onChange={e => update('type', e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-border bg-background"
          >
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="warehouse">Warehouse</option>
            <option value="port">Port</option>
          </select>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Recipient Name</Label>
          <Input
            value={form.recipientName || ''}
            onChange={e => update('recipientName', e.target.value)}
            placeholder="Full name"
          />
        </div>
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input
            value={form.recipientPhone || ''}
            onChange={e => update('recipientPhone', e.target.value)}
            placeholder="+1234567890"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Address Line 1</Label>
        <Input
          value={form.addressLine1 || ''}
          onChange={e => update('addressLine1', e.target.value)}
          placeholder="Street address"
        />
      </div>

      <div className="space-y-2">
        <Label>Address Line 2</Label>
        <Input
          value={form.addressLine2 || ''}
          onChange={e => update('addressLine2', e.target.value)}
          placeholder="Apt, suite, etc. (optional)"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>City</Label>
          <Input
            value={form.city || ''}
            onChange={e => update('city', e.target.value)}
            placeholder="City"
          />
        </div>
        <div className="space-y-2">
          <Label>State/Province</Label>
          <Input
            value={form.stateProvince || ''}
            onChange={e => update('stateProvince', e.target.value)}
            placeholder="State"
          />
        </div>
        <div className="space-y-2">
          <Label>Postal Code</Label>
          <Input
            value={form.postalCode || ''}
            onChange={e => update('postalCode', e.target.value)}
            placeholder="Postal code"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Country</Label>
        <select
          value={form.country || ''}
          onChange={e => update('country', e.target.value)}
          className="w-full h-10 px-3 rounded-lg border border-border bg-background"
        >
          <option value="">Select country</option>
          <option value="US">United States</option>
          <option value="GB">United Kingdom</option>
          <option value="NG">Nigeria</option>
          <option value="GH">Ghana</option>
          <option value="KE">Kenya</option>
          <option value="CN">China</option>
        </select>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isDefaultPickup || false}
            onChange={e => update('isDefaultPickup', e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          <span className="text-sm">Set as default pickup</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isDefaultDelivery || false}
            onChange={e => update('isDefaultDelivery', e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          <span className="text-sm">Set as default delivery</span>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Address'}
        </Button>
      </div>
    </div>
  )
}
