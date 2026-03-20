'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  FileText,
  Truck,
  Snowflake,
  Box,
  GlassWater,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Shield,
  CreditCard,
  Wallet,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useQuoteStore, useWalletStore } from '@/store';
import { formatCurrency, generateTrackingNumber } from '@/lib/utils';
import type { ShipmentType } from '@/types';

const STEPS = [
  { label: 'Type', icon: Package },
  { label: 'Package', icon: Box },
  { label: 'Pickup', icon: MapPin },
  { label: 'Delivery', icon: MapPin },
  { label: 'Service', icon: Truck },
  { label: 'Review', icon: CheckCircle2 },
];

const SHIPMENT_TYPES: { type: ShipmentType; label: string; icon: typeof Package; desc: string }[] = [
  { type: 'parcel', label: 'Parcel', icon: Package, desc: 'Standard packages and boxes' },
  { type: 'document', label: 'Document', icon: FileText, desc: 'Papers, contracts, letters' },
  { type: 'cargo', label: 'Cargo', icon: Truck, desc: 'Large or heavy shipments' },
  { type: 'freight', label: 'Freight', icon: Box, desc: 'Container or bulk freight' },
  { type: 'fragile', label: 'Fragile', icon: GlassWater, desc: 'Breakable items, glassware' },
  { type: 'cold_chain', label: 'Cold Chain', icon: Snowflake, desc: 'Temperature-controlled items' },
];

const SAVED_ADDRESSES = [
  {
    id: 'a1',
    label: 'Warehouse',
    name: 'John Okafor',
    address: '123 Commerce St, Suite 400, Atlanta, GA 30301',
    phone: '+1 (404) 555-1234',
  },
  {
    id: 'a2',
    label: 'Office',
    name: 'Emmanuel Okafor',
    address: '15 Admiralty Way, Lekki Phase 1, Lagos',
    phone: '+234 801 234 5678',
  },
];

export default function NewShipmentPage() {
  const { quotes } = useQuoteStore();
  const { wallet } = useWalletStore();
  const [step, setStep] = useState(0);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');

  const [form, setForm] = useState({
    shipmentType: '' as ShipmentType | '',
    weight: '',
    length: '',
    width: '',
    height: '',
    description: '',
    declaredValue: '',
    isInsured: false,
    pickupAddressId: '',
    pickupNew: false,
    deliveryAddressId: '',
    sameAsPickup: false,
    deliveryNew: false,
    selectedQuote: '',
    paymentMethod: 'wallet' as 'wallet' | 'card',
  });

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const canProceed = () => {
    switch (step) {
      case 0: return !!form.shipmentType;
      case 1: return !!form.weight && !!form.description;
      case 2: return !!form.pickupAddressId || form.pickupNew;
      case 3: return form.sameAsPickup || !!form.deliveryAddressId || form.deliveryNew;
      case 4: return !!form.selectedQuote;
      case 5: return true;
      default: return false;
    }
  };

  const handleBook = async () => {
    const tn = generateTrackingNumber();
    setTrackingNumber(tn);
    setBookingComplete(true);
  };

  if (bookingComplete) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1
          style={{ fontFamily: 'var(--font-playfair)' }}
          className="text-3xl font-bold text-[var(--ink)] mb-2"
        >
          Booking Confirmed!
        </h1>
        <p className="text-gray-500 mb-6">
          Your shipment has been booked successfully.
        </p>
        <Card className="border-[var(--border-warm)] mb-6">
          <CardContent className="p-6">
            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
              Tracking Number
            </p>
            <p className="font-mono text-2xl font-bold text-[var(--card-foreground)]">{trackingNumber}</p>
          </CardContent>
        </Card>
        <div className="flex gap-3 justify-center">
          <Button asChild className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white">
            <Link href={`/customer/track/${trackingNumber}`}>Track Shipment</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/customer/shipments">
              <Download className="h-4 w-4 mr-1" />
              Download Label
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1
          style={{ fontFamily: 'var(--font-playfair)' }}
          className="text-2xl font-bold text-[var(--ink)]"
        >
          Book New Shipment
        </h1>
        <p className="text-sm text-gray-500">
          Step {step + 1} of {STEPS.length}: {STEPS[step].label}
        </p>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="flex items-center gap-1">
              <button
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  i === step
                    ? 'bg-[var(--terra)] text-white'
                    : i < step
                    ? 'bg-[var(--terra-pale)] text-[var(--terra)] cursor-pointer'
                    : 'bg-[var(--cream)] text-gray-500'
                }`}
              >
                <Icon className="h-4 w-4" />
                {s.label}
              </button>
              {i < STEPS.length - 1 && (
                <ArrowRight className="h-3 w-3 text-gray-500 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      <Card className="border-[var(--border-warm)]">
        <CardContent className="p-6">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--ink)]">Select Shipment Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SHIPMENT_TYPES.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.type}
                      onClick={() => update('shipmentType', t.type)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        form.shipmentType === t.type
                          ? 'border-[var(--terra)] bg-[var(--terra-pale)]'
                          : 'border-[var(--border-warm)] hover:border-[var(--terra)]/40'
                      }`}
                    >
                      <Icon
                        className={`h-8 w-8 mb-2 ${
                          form.shipmentType === t.type ? 'text-[var(--terra)]' : 'text-gray-500'
                        }`}
                      />
                      <p className="font-semibold text-[var(--ink)]">{t.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--ink)]">Package Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Weight (kg) *</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 5.2"
                    value={form.weight}
                    onChange={(e) => update('weight', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Declared Value (USD)</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 500"
                    value={form.declaredValue}
                    onChange={(e) => update('declaredValue', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Length (cm)</Label>
                  <Input
                    type="number"
                    placeholder="45"
                    value={form.length}
                    onChange={(e) => update('length', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Width (cm)</Label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={form.width}
                    onChange={(e) => update('width', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Height (cm)</Label>
                  <Input
                    type="number"
                    placeholder="25"
                    value={form.height}
                    onChange={(e) => update('height', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Description *</Label>
                  <Input
                    placeholder="e.g. Electronics - laptop accessories"
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border-warm)]">
                <Shield className="h-5 w-5 text-[var(--terra)]" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--ink)]">Add insurance</p>
                  <p className="text-xs text-gray-500">Protect your shipment against loss or damage</p>
                </div>
                <button
                  onClick={() => update('isInsured', !form.isInsured)}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    form.isInsured ? 'bg-[var(--terra)]' : 'bg-[var(--border-strong)]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 ${
                      form.isInsured ? 'translate-x-4' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--ink)]">Pickup Address</h2>
              <div className="space-y-3">
                {SAVED_ADDRESSES.map((addr) => (
                  <button
                    key={addr.id}
                    onClick={() => {
                      update('pickupAddressId', addr.id);
                      update('pickupNew', false);
                    }}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      form.pickupAddressId === addr.id
                        ? 'border-[var(--terra)] bg-[var(--terra-pale)]'
                        : 'border-[var(--border-warm)] hover:border-[var(--terra)]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary">{addr.label}</Badge>
                      <span className="font-medium text-sm">{addr.name}</span>
                    </div>
                    <p className="text-sm text-gray-500">{addr.address}</p>
                    <p className="text-xs text-gray-500">{addr.phone}</p>
                  </button>
                ))}
                <button
                  onClick={() => {
                    update('pickupNew', true);
                    update('pickupAddressId', '');
                  }}
                  className={`w-full p-4 rounded-xl border-2 border-dashed text-center transition-all ${
                    form.pickupNew
                      ? 'border-[var(--terra)] bg-[var(--terra-pale)]'
                      : 'border-[var(--border-warm)] hover:border-[var(--terra)]/40'
                  }`}
                >
                  <p className="text-sm font-medium text-[var(--terra)]">+ Add New Pickup Address</p>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--card-foreground)]">Delivery Address</h2>
              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-[var(--border-warm)]">
                <input
                  type="checkbox"
                  checked={form.sameAsPickup}
                  onChange={(e) => update('sameAsPickup', e.target.checked)}
                  className="h-4 w-4 rounded border-[var(--border-warm)] text-[var(--terra)]"
                />
                <span className="text-sm text-[var(--card-foreground)]">Same as pickup address</span>
              </label>
              {!form.sameAsPickup && (
                <div className="space-y-3">
                  {SAVED_ADDRESSES.map((addr) => (
                    <button
                      key={addr.id}
                      onClick={() => {
                        update('deliveryAddressId', addr.id);
                        update('deliveryNew', false);
                      }}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        form.deliveryAddressId === addr.id
                          ? 'border-[var(--terra)] bg-[var(--terra-pale)]'
                          : 'border-[var(--border-warm)] hover:border-[var(--terra)]/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{addr.label}</Badge>
                        <span className="font-medium text-sm">{addr.name}</span>
                      </div>
                      <p className="text-sm text-gray-500">{addr.address}</p>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      update('deliveryNew', true);
                      update('deliveryAddressId', '');
                    }}
                    className={`w-full p-4 rounded-xl border-2 border-dashed text-center transition-all ${
                      form.deliveryNew
                        ? 'border-[var(--terra)] bg-[var(--terra-pale)]'
                        : 'border-[var(--border-warm)] hover:border-[var(--terra)]/40'
                    }`}
                  >
                    <p className="text-sm font-medium text-[var(--terra)]">+ Add New Delivery Address</p>
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--ink)]">Select Service</h2>
              <div className="space-y-3">
                {quotes.map((quote) => (
                  <button
                    key={quote.id}
                    onClick={() => update('selectedQuote', quote.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      form.selectedQuote === quote.id
                        ? 'border-[var(--terra)] bg-[var(--terra-pale)]'
                        : 'border-[var(--border-warm)] hover:border-[var(--terra)]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[var(--ink)]">{quote.serviceName}</span>
                          {quote.aiRecommended && (
                            <Badge variant="info" className="text-[10px]">
                              <Sparkles className="h-3 w-3 mr-0.5" />
                              AI Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {quote.estimatedDays.min}&ndash;{quote.estimatedDays.max} days
                        </p>
                        {quote.includesCustoms && (
                          <p className="text-xs text-green-600 mt-1">Includes customs handling</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[var(--ink)]">
                          {formatCurrency(quote.price, quote.currency)}
                        </p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px] text-gray-500 mt-1">
                          <span>Base: {formatCurrency(quote.breakdown.base, quote.currency)}</span>
                          <span>Fuel: {formatCurrency(quote.breakdown.fuel, quote.currency)}</span>
                          <span>Customs: {formatCurrency(quote.breakdown.customsEstimate, quote.currency)}</span>
                          <span>Insurance: {formatCurrency(quote.breakdown.insurance, quote.currency)}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[var(--ink)]">Review & Pay</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Shipment Type</p>
                  <p className="font-medium capitalize">{form.shipmentType || 'Not selected'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Weight</p>
                  <p className="font-medium">{form.weight ? `${form.weight} kg` : 'Not set'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Description</p>
                  <p className="font-medium">{form.description || 'Not set'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Declared Value</p>
                  <p className="font-medium">{form.declaredValue ? `$${form.declaredValue}` : 'Not set'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Insurance</p>
                  <p className="font-medium">{form.isInsured ? 'Yes' : 'No'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Service</p>
                  <p className="font-medium">
                    {quotes.find((q) => q.id === form.selectedQuote)?.serviceName || 'Not selected'}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-semibold text-[var(--ink)] mb-3">Payment Method</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => update('paymentMethod', 'wallet')}
                    className={`flex-1 p-4 rounded-xl border-2 text-left transition-all ${
                      form.paymentMethod === 'wallet'
                        ? 'border-[var(--terra)] bg-[var(--terra-pale)]'
                        : 'border-[var(--border-warm)]'
                    }`}
                  >
                    <Wallet className="h-5 w-5 text-[var(--terra)] mb-2" />
                    <p className="font-medium text-sm">Wallet</p>
                    <p className="text-xs text-gray-500">
                      Balance: {formatCurrency(wallet.balanceUSD, 'USD')}
                    </p>
                  </button>
                  <button
                    onClick={() => update('paymentMethod', 'card')}
                    className={`flex-1 p-4 rounded-xl border-2 text-left transition-all ${
                      form.paymentMethod === 'card'
                        ? 'border-[var(--terra)] bg-[var(--terra-pale)]'
                        : 'border-[var(--border-warm)]'
                    }`}
                  >
                    <CreditCard className="h-5 w-5 text-[var(--terra)] mb-2" />
                    <p className="font-medium text-sm">Card</p>
                    <p className="text-xs text-gray-500">Visa, Mastercard</p>
                  </button>
                </div>
              </div>

              <div className="bg-[var(--cream)] p-4 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[var(--ink)]">Total Amount</span>
                  <span
                    style={{ fontFamily: 'var(--font-playfair)' }}
                    className="text-2xl font-bold text-[var(--ink)]"
                  >
                    {formatCurrency(
                      quotes.find((q) => q.id === form.selectedQuote)?.price || 0,
                      'USD'
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={handleBook}
            className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white"
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Confirm & Book
          </Button>
        )}
      </div>
    </div>
  );
}
