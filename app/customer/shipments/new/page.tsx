'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  CreditCard,
  FileText,
  Globe2,
  Sparkles,
  Truck,
  Wallet,
  Warehouse,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useWalletStore } from '@/store';
import { formatCurrency, generateTrackingNumber, getCountryFlag, getCorridorLabel } from '@/lib/utils';

type CorridorId = 'US-NG' | 'UK-GH' | 'CN-NG';

const CORRIDORS: Record<CorridorId, {
  origin: string;
  destination: string;
  label: string;
  summary: string;
  customsRequired: boolean;
  dutyNote: string;
  originPattern: string;
  destinationPattern: string;
  docs: string[];
  transitWindow: string;
  paymentCurrency: 'USD' | 'NGN' | 'GHS';
}> = {
  'US-NG': {
    origin: 'US',
    destination: 'NG',
    label: 'US -> NG',
    summary: 'US pickup -> international transit -> customs clearance -> Nigeria last-mile delivery',
    customsRequired: true,
    dutyNote: 'We estimate duty and VAT before payment so the demo feels operational, not decorative.',
    originPattern: 'US pickup uses street address, state, zip code, and mobile number.',
    destinationPattern: 'Nigeria delivery uses city, state, phone, and landmark-style delivery notes.',
    docs: ['Commercial invoice', 'Packing list', 'KYC or ID verification', 'Insurance declaration'],
    transitWindow: '3-5 business days',
    paymentCurrency: 'USD',
  },
  'UK-GH': {
    origin: 'GB',
    destination: 'GH',
    label: 'UK -> GH',
    summary: 'UK collection -> air transit -> Ghana import processing -> local delivery',
    customsRequired: true,
    dutyNote: 'Customs estimate is shown clearly with route-specific requirements.',
    originPattern: 'UK pickup prefers postcode, borough, and business or residential contact data.',
    destinationPattern: 'Ghana delivery uses area, landmark, and local contact formatting.',
    docs: ['Commercial invoice', 'Packing list', 'Consignee ID', 'Insurance proof'],
    transitWindow: '4-6 business days',
    paymentCurrency: 'USD',
  },
  'CN-NG': {
    origin: 'CN',
    destination: 'NG',
    label: 'CN -> NG',
    summary: 'China export handling -> sea or air transit -> Nigeria customs -> destination handoff',
    customsRequired: true,
    dutyNote: 'Longer transit and heavier customs review are shown explicitly in the quote.',
    originPattern: 'China supplier records warehouse, factory zone, and consignee reference.',
    destinationPattern: 'Nigeria receiver sees port, warehouse, or business address with customs contact detail.',
    docs: ['Commercial invoice', 'Packing list', 'Form M', 'PAAR', 'Bill of lading'],
    transitWindow: '5-9 business days',
    paymentCurrency: 'USD',
  },
};

const SHIPMENT_TYPES = [
  { value: 'parcel', label: 'Parcel', desc: 'Standard boxes and consumer goods' },
  { value: 'document', label: 'Document', desc: 'Legal, business, and immigration papers' },
  { value: 'cargo', label: 'Cargo', desc: 'Bulk freight and supplier inventory' },
  { value: 'freight', label: 'Freight', desc: 'Larger multi-piece or palletized loads' },
];

const SERVICE_QUOTES = [
  { id: 'express', name: 'Express Air', days: '3-5 days', price: 245, customs: 45, badge: 'Demo hero route' },
  { id: 'standard', name: 'Standard Air', days: '5-7 days', price: 165, customs: 35, badge: 'Recommended for parcels' },
  { id: 'economy', name: 'Economy Sea', days: '18-28 days', price: 95, customs: 55, badge: 'Best for larger items' },
];

const SAVED_ADDRESSES = {
  'US-NG': {
    pickup: [
      { id: 'us-1', label: 'Atlanta warehouse', name: 'John Okafor', address: '123 Commerce St, Suite 400, Atlanta, GA 30301', phone: '+1 (404) 555-1234' },
      { id: 'us-2', label: 'Dallas office', name: 'Diaspora Trading Co.', address: '88 Market Center Blvd, Dallas, TX 75207', phone: '+1 (214) 555-7788' },
    ],
    delivery: [
      { id: 'ng-1', label: 'Lagos office', name: 'Emmanuel Okafor', address: '15 Admiralty Way, Lekki Phase 1, Lagos', phone: '+234 801 234 5678' },
      { id: 'ng-2', label: 'Abuja office', name: 'Chief Okonkwo', address: 'Plot 1234, Ademola Adetokunbo Crescent, Abuja', phone: '+234 803 456 7890' },
    ],
  },
  'UK-GH': {
    pickup: [
      { id: 'uk-1', label: 'London office', name: 'Smith & Associates', address: '100 Liverpool Street, London EC2M 2RH', phone: '+44 20 7123 4567' },
      { id: 'uk-2', label: 'Birmingham depot', name: 'Westbridge Cargo', address: '14 Colmore Row, Birmingham B3 2BS', phone: '+44 121 555 4433' },
    ],
    delivery: [
      { id: 'gh-1', label: 'Accra office', name: 'Kwame Asante', address: 'Factory Junction, Accra, Greater Accra', phone: '+233 24 567 8901' },
      { id: 'gh-2', label: 'Kumasi office', name: 'Mavis Boateng', address: 'Adum, Kumasi, Ashanti Region', phone: '+233 20 111 2244' },
    ],
  },
  'CN-NG': {
    pickup: [
      { id: 'cn-1', label: 'Guangzhou supplier', name: 'Guangzhou Trading Co.', address: '789 Export Zone Road, Guangzhou, Guangdong', phone: '+86 138 0012 3456' },
      { id: 'cn-2', label: 'Shenzhen factory', name: 'Shenzhen Supply House', address: '28 Baoan Road, Shenzhen, Guangdong', phone: '+86 135 9988 2211' },
    ],
    delivery: [
      { id: 'ng-3', label: 'Apapa warehouse', name: 'LogiX Nigeria Ltd', address: 'Apapa Port Complex, Lagos', phone: '+234 901 234 5678' },
      { id: 'ng-4', label: 'Port Harcourt depot', name: 'Rivers Commerce', address: '26 Trans Amadi Industrial Layout, Port Harcourt', phone: '+234 904 567 8901' },
    ],
  },
} satisfies Record<CorridorId, { pickup: { id: string; label: string; name: string; address: string; phone: string }[]; delivery: { id: string; label: string; name: string; address: string; phone: string }[] }>;

export default function NewShipmentPage() {
  const { wallet } = useWalletStore();
  const [step, setStep] = useState(0);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [form, setForm] = useState({
    corridor: 'US-NG' as CorridorId,
    shipmentType: 'parcel',
    weight: '5.2',
    declaredValue: '850',
    description: 'Electronics - laptop accessories',
    insured: true,
    pickupAddressId: 'us-1',
    deliveryAddressId: 'ng-1',
    selectedQuote: 'express',
    paymentMethod: 'card' as 'card' | 'wallet',
  });

  const route = CORRIDORS[form.corridor];
  const selectedQuote = SERVICE_QUOTES.find((quote) => quote.id === form.selectedQuote) ?? SERVICE_QUOTES[0];
  const customsEstimate = selectedQuote.customs;
  const insurance = form.insured ? Math.max(10, Math.round(Number(form.declaredValue || 0) * 0.015)) : 0;
  const total = selectedQuote.price + customsEstimate + insurance;

  const update = (field: keyof typeof form, value: string | boolean) => setForm((prev) => ({ ...prev, [field]: value }));
  const canProceed = () => (step === 0 ? !!form.corridor : step === 1 ? !!form.weight && !!form.description : step === 2 ? !!form.pickupAddressId : step === 3 ? !!form.deliveryAddressId : step === 4 ? !!form.selectedQuote : true);

  if (bookingComplete) {
    return (
      <div className="max-w-3xl mx-auto py-10 space-y-6">
        <Card className="border-[var(--border-warm)] bg-[linear-gradient(135deg,#fff8f0_0%,#f4e7d7_100%)]">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--terra)] text-white">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-[var(--muted-text)]">Booking confirmed</p>
                <h1 style={{ fontFamily: 'var(--font-playfair)' }} className="text-3xl font-bold text-[var(--ink)]">Shipment booked for {route.label}</h1>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border-warm)] bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-[var(--muted-text)]">Tracking number</p>
                <p className="mt-2 font-mono text-2xl font-bold text-[var(--ink)]">{trackingNumber}</p>
              </div>
              <div className="rounded-2xl border border-[var(--border-warm)] bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-[var(--muted-text)]">Next checkpoint</p>
                <p className="mt-2 text-sm text-[var(--ink)]">Warehouse intake, customs review, and route handoff now share the same shipment record.</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-[var(--terra)] text-white hover:bg-[var(--terra-light)]"><Link href={`/customer/track/${trackingNumber}`}>Track shipment</Link></Button>
              <Button asChild variant="outline"><Link href="/customer/shipments">View shipments</Link></Button>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <Link href="/warehouse" className="rounded-2xl border border-[var(--border-warm)] bg-white p-4 text-left transition-colors hover:border-[var(--terra)]/40">
                <p className="text-xs uppercase tracking-wide text-[var(--muted-text)]">Presenter next step</p>
                <p className="mt-2 font-semibold text-[var(--ink)]">Warehouse intake</p>
                <p className="mt-1 text-sm text-[var(--muted-text)]">Show the shipment entering the intake queue and moving toward customs.</p>
              </Link>
              <Link href="/customs" className="rounded-2xl border border-[var(--border-warm)] bg-white p-4 text-left transition-colors hover:border-[var(--terra)]/40">
                <p className="text-xs uppercase tracking-wide text-[var(--muted-text)]">Then</p>
                <p className="mt-2 font-semibold text-[var(--ink)]">Customs review</p>
                <p className="mt-1 text-sm text-[var(--muted-text)]">Show document completeness, holds, and release decisions.</p>
              </Link>
              <Link href="/dispatch" className="rounded-2xl border border-[var(--border-warm)] bg-white p-4 text-left transition-colors hover:border-[var(--terra)]/40">
                <p className="text-xs uppercase tracking-wide text-[var(--muted-text)]">Finish the chain</p>
                <p className="mt-2 font-semibold text-[var(--ink)]">Dispatch and driver</p>
                <p className="mt-1 text-sm text-[var(--muted-text)]">Show assignment, delivery attempt control, and admin visibility.</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-[var(--border-warm)] bg-[linear-gradient(135deg,#fffaf3_0%,#f8efe1_55%,#fffdf9_100%)] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-[var(--muted-text)]"><Globe2 className="h-4 w-4 text-[var(--terra)]" /><span>Booking flow</span></div>
            <h1 style={{ fontFamily: 'var(--font-playfair)' }} className="mt-2 text-3xl md:text-4xl font-bold text-[var(--ink)]">Cross-border shipment booking</h1>
            <p className="mt-2 max-w-3xl text-sm md:text-base text-[var(--muted-text)]">The demo is centered on one story: pickup in the origin country, international transit, customs handling, and the final last-mile handoff in Nigeria or another African corridor.</p>
          </div>
          <div className="rounded-2xl border border-[var(--border-warm)] bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-[var(--muted-text)]">Wallet USD</p>
            <p className="mt-2 text-2xl font-bold text-[var(--ink)]">{formatCurrency(wallet.balanceUSD, 'USD')}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['Corridor', 'Package', 'Pickup', 'Delivery', 'Service', 'Review'].map((label, index) => (
          <div key={label} className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium ${index === step ? 'bg-[var(--terra)] text-white' : 'bg-[var(--cream)] text-[var(--muted-text)]'}`}>
            <span>{index + 1}</span><span>{label}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <Card className="border-[var(--border-warm)]">
          <CardContent className="p-6">
            {step === 0 && (
              <div className="space-y-5">
                <div><h2 className="text-lg font-semibold text-[var(--ink)]">Select a corridor</h2><p className="text-sm text-[var(--muted-text)]">Choose the route that drives the document rules, quote structure, and timeline language.</p></div>
                <div className="grid gap-3 md:grid-cols-3">
                  {(Object.entries(CORRIDORS) as [CorridorId, typeof CORRIDORS[CorridorId]][]).map(([id, corridor]) => (
                    <button key={id} onClick={() => setForm((prev) => ({ ...prev, corridor: id, pickupAddressId: SAVED_ADDRESSES[id].pickup[0].id, deliveryAddressId: SAVED_ADDRESSES[id].delivery[0].id }))} className={`rounded-2xl border-2 p-4 text-left transition-all ${form.corridor === id ? 'border-[var(--terra)] bg-[var(--terra-pale)]' : 'border-[var(--border-warm)] hover:border-[var(--terra)]/40'}`}>
                      <div className="flex items-center justify-between"><Badge variant="secondary" className="bg-white">{corridor.label}</Badge><span className="text-xl">{getCountryFlag(corridor.origin)} {getCountryFlag(corridor.destination)}</span></div>
                      <p className="mt-3 text-sm font-medium text-[var(--ink)]">{corridor.summary}</p>
                      <p className="mt-2 text-xs text-[var(--muted-text)]">{corridor.transitWindow}</p>
                    </button>
                  ))}
                </div>
                <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--cream)] p-4 text-sm text-[var(--muted-text)]">{route.customsRequired ? 'Customs is built into this flow.' : 'This route does not require customs clearance.'} {route.dutyNote}</div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div><h2 className="text-lg font-semibold text-[var(--ink)]">Package details</h2><p className="text-sm text-[var(--muted-text)]">{route.originPattern}</p></div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Shipment type</Label>
                    <div className="grid gap-2 sm:grid-cols-2">{SHIPMENT_TYPES.map((type) => <button key={type.value} onClick={() => update('shipmentType', type.value)} className={`rounded-xl border-2 p-3 text-left transition-all ${form.shipmentType === type.value ? 'border-[var(--terra)] bg-[var(--terra-pale)]' : 'border-[var(--border-warm)]'}`}><p className="font-medium text-[var(--ink)]">{type.label}</p><p className="text-xs text-[var(--muted-text)]">{type.desc}</p></button>)}</div>
                  </div>
                  <div className="space-y-1.5"><Label>Description</Label><Input value={form.description} onChange={(e) => update('description', e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>Weight (kg)</Label><Input type="number" value={form.weight} onChange={(e) => update('weight', e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>Declared value ({route.paymentCurrency})</Label><Input type="number" value={form.declaredValue} onChange={(e) => update('declaredValue', e.target.value)} /></div>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-[var(--border-warm)] bg-[var(--cream)] p-4">
                  <div><p className="text-sm font-medium text-[var(--ink)]">Add insurance</p><p className="text-xs text-[var(--muted-text)]">Trust signal for clients reviewing compliance and risk control.</p></div>
                  <button onClick={() => update('insured', !form.insured)} className={`flex h-7 w-12 items-center rounded-full p-1 ${form.insured ? 'bg-[var(--terra)]' : 'bg-[var(--border-strong)]'}`}><span className={`h-5 w-5 rounded-full bg-white transition-transform ${form.insured ? 'translate-x-5' : ''}`} /></button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div><h2 className="text-lg font-semibold text-[var(--ink)]">Pickup address</h2><p className="text-sm text-[var(--muted-text)]">{route.originPattern}</p></div>
                <div className="space-y-3">{SAVED_ADDRESSES[form.corridor].pickup.map((address) => <button key={address.id} onClick={() => update('pickupAddressId', address.id)} className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${form.pickupAddressId === address.id ? 'border-[var(--terra)] bg-[var(--terra-pale)]' : 'border-[var(--border-warm)]'}`}><div className="flex items-center justify-between"><Badge variant="secondary" className="bg-white">{address.label}</Badge><span className="text-xs text-[var(--muted-text)]">{getCountryFlag(route.origin)} {route.origin}</span></div><p className="mt-2 font-medium text-[var(--ink)]">{address.name}</p><p className="text-sm text-[var(--muted-text)]">{address.address}</p><p className="text-xs text-[var(--muted-text)]">{address.phone}</p></button>)}</div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div><h2 className="text-lg font-semibold text-[var(--ink)]">Delivery address</h2><p className="text-sm text-[var(--muted-text)]">{route.destinationPattern}</p></div>
                <div className="space-y-3">{SAVED_ADDRESSES[form.corridor].delivery.map((address) => <button key={address.id} onClick={() => update('deliveryAddressId', address.id)} className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${form.deliveryAddressId === address.id ? 'border-[var(--terra)] bg-[var(--terra-pale)]' : 'border-[var(--border-warm)]'}`}><div className="flex items-center justify-between"><Badge variant="secondary" className="bg-white">{address.label}</Badge><span className="text-xs text-[var(--muted-text)]">{getCountryFlag(route.destination)} {route.destination}</span></div><p className="mt-2 font-medium text-[var(--ink)]">{address.name}</p><p className="text-sm text-[var(--muted-text)]">{address.address}</p><p className="text-xs text-[var(--muted-text)]">{address.phone}</p></button>)}</div>
                <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--cream)] p-4 text-sm text-[var(--muted-text)]">Country-specific contact patterns are part of the demo. The same shipment can still be searched later with one tracking number.</div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <div><h2 className="text-lg font-semibold text-[var(--ink)]">Select service</h2><p className="text-sm text-[var(--muted-text)]">Each quote shows transit time, customs estimate, and the route differences clients care about.</p></div>
                <div className="space-y-3">
                  {SERVICE_QUOTES.map((quote) => {
                    const totalQuote = quote.price + quote.customs + insurance;
                    return (
                      <button key={quote.id} onClick={() => update('selectedQuote', quote.id)} className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${form.selectedQuote === quote.id ? 'border-[var(--terra)] bg-[var(--terra-pale)]' : 'border-[var(--border-warm)]'}`}>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-[var(--ink)]">{quote.name}</span>
                              {quote.id === 'express' && <Badge className="bg-[var(--terra)] text-white"><Sparkles className="mr-1 h-3 w-3" />Demo hero route</Badge>}
                              <Badge variant="secondary" className="bg-white">{quote.badge}</Badge>
                            </div>
                            <p className="mt-2 text-sm text-[var(--muted-text)]">Transit window: {quote.days}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-[var(--ink)]">{formatCurrency(totalQuote, route.paymentCurrency)}</p>
                            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-[var(--muted-text)]"><span>Freight {formatCurrency(quote.price, route.paymentCurrency)}</span><span>Customs {formatCurrency(quote.customs, route.paymentCurrency)}</span><span>Insurance {formatCurrency(insurance, route.paymentCurrency)}</span><span>{route.customsRequired ? 'Customs required' : 'No customs'}</span></div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <div><h2 className="text-lg font-semibold text-[var(--ink)]">Review and pay</h2><p className="text-sm text-[var(--muted-text)]">This summary is designed to be read out in the client demo.</p></div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--cream)] p-4"><p className="text-xs uppercase tracking-wide text-[var(--muted-text)]">Corridor</p><p className="mt-2 font-semibold text-[var(--ink)]">{getCorridorLabel(route.origin, route.destination)}</p></div>
                  <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--cream)] p-4"><p className="text-xs uppercase tracking-wide text-[var(--muted-text)]">Selected service</p><p className="mt-2 font-semibold text-[var(--ink)]">{selectedQuote.name}</p></div>
                  <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--cream)] p-4"><p className="text-xs uppercase tracking-wide text-[var(--muted-text)]">Customs estimate</p><p className="mt-2 font-semibold text-[var(--ink)]">{formatCurrency(customsEstimate, route.paymentCurrency)}</p></div>
                  <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--cream)] p-4"><p className="text-xs uppercase tracking-wide text-[var(--muted-text)]">Total</p><p className="mt-2 font-semibold text-[var(--ink)]">{formatCurrency(total, route.paymentCurrency)}</p></div>
                </div>
                <Separator />
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-[var(--border-warm)] p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]"><BadgeCheck className="h-4 w-4 text-[var(--terra)]" />Trust signals</div>
                    <ul className="mt-3 space-y-2 text-sm text-[var(--muted-text)]"><li>KYC status visible before booking</li><li>Customs docs checklist shown per corridor</li><li>Payment confirmation and receipt in the event log</li><li>Proof of delivery available on completed shipments</li></ul>
                  </div>
                  <div className="rounded-2xl border border-[var(--border-warm)] p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]"><Wallet className="h-4 w-4 text-[var(--terra)]" />Payment method</div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <button onClick={() => update('paymentMethod', 'card')} className={`rounded-xl border-2 p-3 text-left ${form.paymentMethod === 'card' ? 'border-[var(--terra)] bg-[var(--terra-pale)]' : 'border-[var(--border-warm)]'}`}><CreditCard className="h-5 w-5 text-[var(--terra)]" /><p className="mt-2 font-medium text-[var(--ink)]">Card</p><p className="text-xs text-[var(--muted-text)]">Visa or Mastercard</p></button>
                      <button onClick={() => update('paymentMethod', 'wallet')} className={`rounded-xl border-2 p-3 text-left ${form.paymentMethod === 'wallet' ? 'border-[var(--terra)] bg-[var(--terra-pale)]' : 'border-[var(--border-warm)]'}`}><Wallet className="h-5 w-5 text-[var(--terra)]" /><p className="mt-2 font-medium text-[var(--ink)]">Wallet</p><p className="text-xs text-[var(--muted-text)]">USD, NGN, or GHS balance</p></button>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--cream)] p-4 text-sm text-[var(--muted-text)]"><strong className="text-[var(--ink)]">Shipment requirements:</strong> {route.docs.join(', ')}.</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-[var(--border-warm)]">
          <CardContent className="space-y-4 p-6">
            <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--cream)] p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]"><Truck className="h-4 w-4 text-[var(--terra)]" />Route summary</div>
              <p className="mt-2 text-sm text-[var(--muted-text)]">{route.summary}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--cream)] p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]"><FileText className="h-4 w-4 text-[var(--terra)]" />Required documents</div>
              <div className="mt-3 flex flex-wrap gap-2">{route.docs.map((doc) => <Badge key={doc} variant="secondary" className="bg-white">{doc}</Badge>)}</div>
            </div>
            <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--cream)] p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]"><Warehouse className="h-4 w-4 text-[var(--terra)]" />Operational realism</div>
              <p className="mt-2 text-sm text-[var(--muted-text)]">{route.destinationPattern}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border-warm)] bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-[var(--muted-text)]">Quick facts</p>
              <div className="mt-3 grid gap-3 text-sm">
                <div className="flex items-center justify-between"><span className="text-[var(--muted-text)]">Customs</span><span className="font-medium text-[var(--ink)]">{route.customsRequired ? 'Required' : 'Not required'}</span></div>
                <div className="flex items-center justify-between"><span className="text-[var(--muted-text)]">Transit</span><span className="font-medium text-[var(--ink)]">{route.transitWindow}</span></div>
                <div className="flex items-center justify-between"><span className="text-[var(--muted-text)]">Displayed currency</span><span className="font-medium text-[var(--ink)]">{route.paymentCurrency}</span></div>
                <div className="flex items-center justify-between"><span className="text-[var(--muted-text)]">Flags</span><span className="font-medium text-[var(--ink)]">{getCountryFlag(route.origin)} {route.origin} - {getCountryFlag(route.destination)} {route.destination}</span></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}><ArrowLeft className="mr-1 h-4 w-4" />Back</Button>
        {step < 5 ? (
          <Button onClick={() => setStep((current) => current + 1)} disabled={!canProceed()} className="bg-[var(--terra)] text-white hover:bg-[var(--terra-light)]">Next<ArrowRight className="ml-1 h-4 w-4" /></Button>
        ) : (
          <Button onClick={() => { const tn = generateTrackingNumber(); setTrackingNumber(tn); setBookingComplete(true); }} className="bg-[var(--terra)] text-white hover:bg-[var(--terra-light)]"><CheckCircle2 className="mr-1 h-4 w-4" />Confirm and book</Button>
        )}
      </div>
    </div>
  );
}
