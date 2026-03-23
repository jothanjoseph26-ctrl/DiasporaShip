'use client'

import { useState, useRef } from 'react'
import {
  Search, User, Plus, Package, Globe2, Truck,
  CheckCircle2, Printer, RotateCcw, Phone,
  MapPin, Scale, DollarSign, FileText, Info,
  CreditCard, Banknote
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  INTERNATIONAL_CORRIDORS, NIGERIA_CITY_PAIRS, GHANA_CITY_PAIRS,
  KENYA_CITY_PAIRS, NIGERIA_CITIES, GHANA_CITIES, KENYA_CITIES,
  SHIPMENT_TYPES, calcDomesticPrice, domesticCurrency,
  type InternationalCorridorId, type CityPair,
} from '@/lib/corridors'
import { generateTrackingNumber } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────
// AGENT COUNTER SCREEN — /agent/counter
// Used by: office staff to register walk-in customers
//
// Flow:
//   1. Find or create customer (search by phone)
//   2. Choose shipment type (international / domestic)
//   3. Select route / corridor
//   4. Enter package details + weigh on counter scale
//   5. Enter recipient details
//   6. Review price
//   7. Collect payment (cash or POS card)
//   8. Print receipt + label
// ─────────────────────────────────────────────────────────────

type Stage =
  | 'customer'      // find or create
  | 'type'          // international vs domestic
  | 'route'         // corridor or city pair
  | 'package'       // weight, description, declared value
  | 'recipient'     // name, phone, address
  | 'payment'       // price + payment method
  | 'receipt'       // done — print

type ShipmentCategory = 'international' | 'domestic'
type DomesticRegion = 'NG' | 'GH' | 'KE'

interface CustomerProfile {
  id:      string
  name:    string
  phone:   string
  email?:  string
  isNew:   boolean
}

interface CounterForm {
  category:          ShipmentCategory
  internationalId:   InternationalCorridorId
  domesticRegion:    DomesticRegion
  domesticFromCity:  string
  domesticToCity:    string
  shipmentType:      string
  weightKg:          string
  description:       string
  declaredValue:     string
  insured:           boolean
  selectedServiceId: string
  recipientName:     string
  recipientPhone:    string
  recipientAddress:  string
  paymentMethod:     'cash_ngn' | 'cash_usd' | 'pos_card'
  amountTendered:    string
}

// Mock customer lookup — replace with real API call
const MOCK_CUSTOMERS: CustomerProfile[] = [
  { id: 'c1', name: 'Adaeze Okonkwo',  phone: '+234 803 111 2222', email: 'adaeze@gmail.com',   isNew: false },
  { id: 'c2', name: 'Emeka Nwosu',     phone: '+234 805 333 4444', email: 'emeka@yahoo.com',    isNew: false },
  { id: 'c3', name: 'Fatima Al-Hassan',phone: '+234 808 555 6666', email: 'fatima@outlook.com', isNew: false },
  { id: 'c4', name: 'Kwame Asante',    phone: '+233 244 777 8888', email: 'kwame@gmail.com',    isNew: false },
]

const STAGE_LABELS: Record<Stage, string> = {
  customer: 'Customer',
  type:     'Ship type',
  route:    'Route',
  package:  'Package',
  recipient:'Recipient',
  payment:  'Payment',
  receipt:  'Done',
}

const STAGE_ORDER: Stage[] = ['customer','type','route','package','recipient','payment','receipt']

export default function AgentCounterPage() {
  const [stage, setStage]       = useState<Stage>('customer')
  const [customer, setCustomer] = useState<CustomerProfile | null>(null)
  const [search, setSearch]     = useState('')
  const [newName, setNewName]   = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const receiptRef = useRef<HTMLDivElement>(null)

  const [form, setForm] = useState<CounterForm>({
    category:          'international',
    internationalId:   'US-NG',
    domesticRegion:    'NG',
    domesticFromCity:  'Lagos',
    domesticToCity:    'Abuja',
    shipmentType:      'parcel',
    weightKg:          '',
    description:       '',
    declaredValue:     '',
    insured:           false,
    selectedServiceId: 'standard',
    recipientName:     '',
    recipientPhone:    '',
    recipientAddress:  '',
    paymentMethod:     'cash_ngn',
    amountTendered:    '',
  })

  const upd = <K extends keyof CounterForm>(k: K, v: CounterForm[K]) =>
    setForm(p => ({ ...p, [k]: v }))

  // ── DERIVED ────────────────────────────────────────────────
  const isIntl   = form.category === 'international'
  const corridor = INTERNATIONAL_CORRIDORS[form.internationalId]

  const domesticPairs: CityPair[] = form.domesticRegion === 'NG'
    ? NIGERIA_CITY_PAIRS : form.domesticRegion === 'GH'
    ? GHANA_CITY_PAIRS : KENYA_CITY_PAIRS

  const domesticCities = form.domesticRegion === 'NG' ? NIGERIA_CITIES
    : form.domesticRegion === 'GH' ? GHANA_CITIES : KENYA_CITIES

  const activePair = domesticPairs.find(
    p => p.from === form.domesticFromCity && p.to === form.domesticToCity
  ) ?? domesticPairs[0]

  const currency = isIntl ? 'USD' : domesticCurrency(form.domesticRegion)

  const intlService = corridor?.services.find(s => s.id === form.selectedServiceId)
    ?? corridor?.services[1]
  const insurance   = form.insured
    ? Math.max(10, Math.round(Number(form.declaredValue || 0) * 0.015)) : 0
  const intlTotal   = (intlService?.priceUSD ?? 0) + (intlService?.customs ?? 0) + insurance
  const domTotal    = calcDomesticPrice(activePair, Number(form.weightKg) || 1)
  const totalPrice  = isIntl ? intlTotal : domTotal

  // Filtered customer search results
  const searchResults = search.length >= 2
    ? MOCK_CUSTOMERS.filter(c =>
        c.phone.includes(search) || c.name.toLowerCase().includes(search.toLowerCase())
      )
    : []

  const stageIndex = STAGE_ORDER.indexOf(stage)

  const goNext = (s: Stage) => setStage(s)

  const handleConfirm = () => {
    const tn = generateTrackingNumber()
    setTrackingNumber(tn)
    setStage('receipt')
  }

  const handlePrint = () => {
    if (receiptRef.current) window.print()
  }

  const handleReset = () => {
    setStage('customer')
    setCustomer(null)
    setSearch('')
    setNewName('')
    setNewPhone('')
    setTrackingNumber('')
    setForm({
      category: 'international', internationalId: 'US-NG',
      domesticRegion: 'NG', domesticFromCity: 'Lagos', domesticToCity: 'Abuja',
      shipmentType: 'parcel', weightKg: '', description: '', declaredValue: '',
      insured: false, selectedServiceId: 'standard',
      recipientName: '', recipientPhone: '', recipientAddress: '',
      paymentMethod: 'cash_ngn', amountTendered: '',
    })
  }

  // ── PROGRESS BAR ───────────────────────────────────────────
  const Progress = () => (
    <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
      {STAGE_ORDER.filter(s => s !== 'receipt').map((s, i) => {
        const idx   = STAGE_ORDER.indexOf(s)
        const done  = idx < stageIndex
        const active= s === stage
        return (
          <div key={s} className="flex items-center gap-1 flex-shrink-0">
            <div
              onClick={() => done && setStage(s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                transition-all
                ${active ? 'bg-[var(--terra)] text-white'
                  : done  ? 'bg-[var(--terra-pale)] text-[var(--terra-dark)] cursor-pointer hover:bg-[var(--terra-pale)]'
                  : 'bg-[var(--cream)] text-[var(--muted-text)]'
                }`}
            >
              {done
                ? <CheckCircle2 size={11} />
                : <span className="w-3 text-center">{i + 1}</span>
              }
              <span>{STAGE_LABELS[s]}</span>
            </div>
            {i < 5 && <div className={`w-4 h-px flex-shrink-0 ${done ? 'bg-[var(--terra)]' : 'bg-[var(--border-warm)]'}`} />}
          </div>
        )
      })}
    </div>
  )

  // ── CUSTOMER SIDEBAR ───────────────────────────────────────
  const CustomerSidebar = () => customer ? (
    <div className="rounded-xl border border-[var(--border-warm)] bg-[var(--warm-white)] p-4">
      <p className="text-[10px] uppercase tracking-wide text-[var(--muted-text)] mb-2">Customer</p>
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-full bg-[var(--terra-pale)] flex items-center justify-center
          text-[var(--terra)] text-xs font-bold flex-shrink-0">
          {customer.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--ink)]">{customer.name}</p>
          <p className="text-xs text-[var(--muted-text)]">{customer.phone}</p>
        </div>
      </div>
      {customer.isNew && (
        <Badge variant="secondary" className="text-[10px] bg-[var(--gold-pale)] text-[var(--gold-dark)]">
          New customer
        </Badge>
      )}
    </div>
  ) : null

  // ── PRICE SIDEBAR ──────────────────────────────────────────
  const PriceSidebar = () => (
    <div className="rounded-xl border border-[var(--border-warm)] bg-[var(--warm-white)] p-4">
      <p className="text-[10px] uppercase tracking-wide text-[var(--muted-text)] mb-3">Estimate</p>
      <div className="space-y-2 text-sm">
        {isIntl ? (
          <>
            <div className="flex justify-between">
              <span className="text-[var(--muted-text)]">Freight</span>
              <span>${intlService?.priceUSD ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-text)]">Customs</span>
              <span>${intlService?.customs ?? '—'}</span>
            </div>
            {insurance > 0 && (
              <div className="flex justify-between">
                <span className="text-[var(--muted-text)]">Insurance</span>
                <span>${insurance}</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-between">
            <span className="text-[var(--muted-text)]">Road freight</span>
            <span>{currency} {domTotal.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t border-[var(--border-warm)] font-semibold">
          <span className="text-[var(--ink)]">Total</span>
          <span className="text-[var(--terra)]">
            {isIntl ? `$${intlTotal}` : `${currency} ${domTotal.toLocaleString()}`}
          </span>
        </div>
      </div>
    </div>
  )

  // ══════════════════════════════════════════════════════════
  // STAGE: CUSTOMER
  // ══════════════════════════════════════════════════════════
  if (stage === 'customer') return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[var(--ink)] mb-1"
          style={{ fontFamily: 'var(--font-playfair)' }}>
          Walk-in Registration
        </h1>
        <p className="text-sm text-[var(--muted-text)]">
          Search for a returning customer or register a new one
        </p>
      </div>
      <Progress />

      <Card className="border-[var(--border-warm)]">
        <CardContent className="p-6 space-y-5">

          {/* Search */}
          <div className="space-y-2">
            <Label>Search by phone number or name</Label>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)]" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="e.g. +234 803..."
                className="pl-9"
              />
            </div>
          </div>

          {/* Search results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-[var(--muted-text)] font-medium">Matching customers</p>
              {searchResults.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setCustomer(c); goNext('type') }}
                  className="w-full flex items-center gap-3 rounded-xl border border-[var(--border-warm)]
                    bg-[var(--cream)] p-3 hover:border-[var(--terra)] transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--terra-pale)] flex items-center
                    justify-center text-[var(--terra)] text-xs font-bold flex-shrink-0">
                    {c.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--ink)]">{c.name}</p>
                    <p className="text-xs text-[var(--muted-text)]">{c.phone} · {c.email}</p>
                  </div>
                  <ArrowRight size={14} className="text-[var(--muted-text)]" />
                </button>
              ))}
            </div>
          )}

          {search.length >= 2 && searchResults.length === 0 && (
            <p className="text-sm text-[var(--muted-text)] text-center py-2">
              No customer found for &ldquo;{search}&rdquo;
            </p>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[var(--border-warm)]" />
            <span className="text-xs text-[var(--muted-text)]">or register new</span>
            <div className="flex-1 h-px bg-[var(--border-warm)]" />
          </div>

          {/* New customer form */}
          <div className="space-y-3">
            <p className="text-xs text-[var(--muted-text)] font-medium">New customer details</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Full name <span className="text-[var(--terra)]">*</span></Label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Customer full name" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone number <span className="text-[var(--terra)]">*</span></Label>
                <Input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="+234 800 000 0000" />
              </div>
            </div>
            <Button
              onClick={() => {
                if (!newName || !newPhone) return
                const nc: CustomerProfile = {
                  id: 'new-' + Date.now(),
                  name: newName, phone: newPhone, isNew: true
                }
                setCustomer(nc)
                goNext('type')
              }}
              disabled={!newName || !newPhone}
              className="w-full bg-[var(--terra)] text-white hover:bg-[var(--terra-light)]"
            >
              <Plus size={15} className="mr-1" /> Register & continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // ══════════════════════════════════════════════════════════
  // STAGE: TYPE
  // ══════════════════════════════════════════════════════════
  if (stage === 'type') return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h1 className="text-2xl font-bold text-[var(--ink)]"
        style={{ fontFamily: 'var(--font-playfair)' }}>
        Shipment Type
      </h1>
      <Progress />
      <CustomerSidebar />

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            value: 'international' as ShipmentCategory,
            Icon: Globe2,
            bg: '#E6F1FB', color: '#185FA5',
            title: 'International',
            desc: 'Cross-border — US, UK, China to Nigeria, Ghana, Kenya',
            badge: 'Customs required',
          },
          {
            value: 'domestic' as ShipmentCategory,
            Icon: Truck,
            bg: '#E1F5EE', color: '#0F6E56',
            title: 'Domestic',
            desc: 'Within Nigeria, Ghana or Kenya — road freight',
            badge: 'No customs',
          },
        ].map(({ value, Icon, bg, color, title, desc, badge }) => (
          <button
            key={value}
            onClick={() => { upd('category', value); goNext('route') }}
            className="text-left rounded-2xl border-2 border-[var(--border-warm)]
              bg-[var(--warm-white)] p-6 hover:border-[var(--terra)]
              transition-all group"
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: bg }}>
              <Icon size={20} color={color} />
            </div>
            <p className="text-base font-semibold text-[var(--ink)] mb-1">{title}</p>
            <p className="text-sm text-[var(--muted-text)] mb-3 leading-relaxed">{desc}</p>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: bg, color }}>
              {badge}
            </span>
          </button>
        ))}
      </div>
    </div>
  )

  // ══════════════════════════════════════════════════════════
  // STAGE: ROUTE
  // ══════════════════════════════════════════════════════════
  if (stage === 'route') return (
    <div className="max-w-3xl mx-auto space-y-5">
      <h1 className="text-2xl font-bold text-[var(--ink)]"
        style={{ fontFamily: 'var(--font-playfair)' }}>
        {isIntl ? 'Select Corridor' : 'Select Cities'}
      </h1>
      <Progress />
      <CustomerSidebar />

      <Card className="border-[var(--border-warm)]">
        <CardContent className="p-6 space-y-4">
          {isIntl ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.entries(INTERNATIONAL_CORRIDORS) as [InternationalCorridorId, any][]).map(([id, c]) => (
                <button
                  key={id}
                  onClick={() => { upd('internationalId', id); upd('selectedServiceId', 'standard') }}
                  className={`text-left rounded-xl border-2 p-4 transition-all
                    ${form.internationalId === id
                      ? 'border-[var(--terra)] bg-[var(--terra-pale)]'
                      : 'border-[var(--border-warm)] hover:border-[var(--terra)]/40'
                    }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{c.originFlag} → {c.destFlag}</span>
                    <Badge variant="secondary" className="text-[10px]">{c.transitWindow}</Badge>
                  </div>
                  <p className="text-sm font-medium text-[var(--ink)]">{c.label}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Region */}
              <div className="flex gap-2">
                {(['NG','GH','KE'] as DomesticRegion[]).map(r => {
                  const flags: Record<DomesticRegion,string> = {NG:'🇳🇬',GH:'🇬🇭',KE:'🇰🇪'}
                  const names: Record<DomesticRegion,string> = {NG:'Nigeria',GH:'Ghana',KE:'Kenya'}
                  return (
                    <button key={r}
                      onClick={() => {
                        upd('domesticRegion', r)
                        upd('domesticFromCity', r==='NG'?'Lagos':r==='GH'?'Accra':'Nairobi')
                        upd('domesticToCity',   r==='NG'?'Abuja':r==='GH'?'Kumasi':'Mombasa')
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5
                        rounded-xl border-2 text-sm font-medium transition-all
                        ${form.domesticRegion===r
                          ? 'border-[var(--terra)] bg-[var(--terra-pale)] text-[var(--terra-dark)]'
                          : 'border-[var(--border-warm)] text-[var(--muted-text)]'
                        }`}
                    >
                      <span>{flags[r]}</span><span>{names[r]}</span>
                    </button>
                  )
                })}
              </div>
              {/* City selectors */}
              <div className="grid grid-cols-[1fr_28px_1fr] gap-2 items-end">
                <div>
                  <Label className="mb-1.5 block text-xs">From</Label>
                  <select value={form.domesticFromCity}
                    onChange={e => upd('domesticFromCity', e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-warm)]
                      bg-[var(--warm-white)] px-3 py-2.5 text-sm text-[var(--ink)]
                      focus:outline-none focus:border-[var(--terra)]">
                    {domesticCities.filter(c => c!==form.domesticToCity).map(c =>
                      <option key={c} value={c}>{c}</option>
                    )}
                  </select>
                </div>
                <p className="text-center text-[var(--muted-text)] pb-2">→</p>
                <div>
                  <Label className="mb-1.5 block text-xs">To</Label>
                  <select value={form.domesticToCity}
                    onChange={e => upd('domesticToCity', e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-warm)]
                      bg-[var(--warm-white)] px-3 py-2.5 text-sm text-[var(--ink)]
                      focus:outline-none focus:border-[var(--terra)]">
                    {domesticCities.filter(c => c!==form.domesticFromCity).map(c =>
                      <option key={c} value={c}>{c}</option>
                    )}
                  </select>
                </div>
              </div>
              {/* Popular pairs */}
              <div>
                <p className="text-xs text-[var(--muted-text)] mb-2">Quick select</p>
                <div className="flex flex-wrap gap-2">
                  {domesticPairs.slice(0, 8).map(p => (
                    <button key={p.id}
                      onClick={() => { upd('domesticFromCity', p.from); upd('domesticToCity', p.to) }}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all
                        ${form.domesticFromCity===p.from && form.domesticToCity===p.to
                          ? 'border-[var(--terra)] bg-[var(--terra-pale)] text-[var(--terra-dark)] font-medium'
                          : 'border-[var(--border-warm)] text-[var(--muted-text)]'
                        }`}>
                      {p.from} → {p.to}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setStage('type')}>Back</Button>
            <Button onClick={() => goNext('package')}
              className="bg-[var(--terra)] text-white hover:bg-[var(--terra-light)]">
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // ══════════════════════════════════════════════════════════
  // STAGE: PACKAGE
  // ══════════════════════════════════════════════════════════
  if (stage === 'package') return (
    <div className="max-w-3xl mx-auto space-y-5">
      <h1 className="text-2xl font-bold text-[var(--ink)]"
        style={{ fontFamily: 'var(--font-playfair)' }}>
        Package Details
      </h1>
      <Progress />

      <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
        <Card className="border-[var(--border-warm)]">
          <CardContent className="p-6 space-y-5">
            {/* Counter weight banner */}
            <div className="flex items-center gap-3 rounded-xl bg-[var(--gold-pale)]
              border border-[var(--border-warm)] px-4 py-3">
              <Scale size={16} className="text-[var(--gold-dark)] flex-shrink-0" />
              <p className="text-sm text-[var(--gold-dark)] font-medium">
                Place package on counter scale and enter the reading below
              </p>
            </div>

            {/* Shipment type */}
            <div>
              <Label className="mb-2 block">Shipment type</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SHIPMENT_TYPES.map(t => (
                  <button key={t.value} onClick={() => upd('shipmentType', t.value)}
                    className={`rounded-xl border-2 p-3 text-left transition-all
                      ${form.shipmentType===t.value
                        ? 'border-[var(--terra)] bg-[var(--terra-pale)]'
                        : 'border-[var(--border-warm)]'
                      }`}>
                    <p className="text-sm font-medium text-[var(--ink)]">{t.label}</p>
                    <p className="text-[11px] text-[var(--muted-text)] mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Weight (kg) <span className="text-[var(--terra)]">*</span></Label>
                <div className="relative">
                  <Scale size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)]" />
                  <Input type="number" min="0.1" step="0.1"
                    value={form.weightKg}
                    onChange={e => upd('weightKg', e.target.value)}
                    placeholder="From scale" className="pl-9" />
                </div>
              </div>
              {isIntl && (
                <div className="space-y-1.5">
                  <Label>Declared value (USD)</Label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)]" />
                    <Input type="number" min="0"
                      value={form.declaredValue}
                      onChange={e => upd('declaredValue', e.target.value)}
                      placeholder="Customer declared value" className="pl-9" />
                  </div>
                </div>
              )}
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Description <span className="text-[var(--terra)]">*</span></Label>
                <Input value={form.description}
                  onChange={e => upd('description', e.target.value)}
                  placeholder="What is in the package?" />
              </div>
            </div>

            {isIntl && (
              <div className="flex items-center justify-between rounded-xl
                border border-[var(--border-warm)] bg-[var(--cream)] p-4">
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">Add insurance</p>
                  <p className="text-xs text-[var(--muted-text)]">1.5% of declared value</p>
                </div>
                <button onClick={() => upd('insured', !form.insured)}
                  className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors
                    ${form.insured ? 'bg-[var(--terra)]' : 'bg-[var(--border-warm)]'}`}>
                  <span className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform
                    ${form.insured ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            )}

            {/* Service (international only) */}
            {isIntl && (
              <div className="space-y-2">
                <Label className="block">Service</Label>
                {corridor.services.map(svc => (
                  <button key={svc.id} onClick={() => upd('selectedServiceId', svc.id)}
                    className={`w-full text-left rounded-xl border-2 px-4 py-3 transition-all
                      ${form.selectedServiceId===svc.id
                        ? 'border-[var(--terra)] bg-[var(--terra-pale)]'
                        : 'border-[var(--border-warm)]'
                      }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-semibold text-[var(--ink)]">{svc.name}</span>
                        <span className="text-xs text-[var(--muted-text)] ml-2">{svc.days}</span>
                      </div>
                      <span className="text-base font-bold text-[var(--ink)]">
                        ${(svc.priceUSD ?? 0) + (svc.customs ?? 0) + insurance}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStage('route')}>Back</Button>
              <Button
                onClick={() => goNext('recipient')}
                disabled={!form.weightKg || !form.description}
                className="bg-[var(--terra)] text-white hover:bg-[var(--terra-light)]">
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <CustomerSidebar />
          <PriceSidebar />
        </div>
      </div>
    </div>
  )

  // ══════════════════════════════════════════════════════════
  // STAGE: RECIPIENT
  // ══════════════════════════════════════════════════════════
  if (stage === 'recipient') return (
    <div className="max-w-3xl mx-auto space-y-5">
      <h1 className="text-2xl font-bold text-[var(--ink)]"
        style={{ fontFamily: 'var(--font-playfair)' }}>
        Recipient Details
      </h1>
      <Progress />

      <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
        <Card className="border-[var(--border-warm)]">
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-[var(--muted-text)]">
              Who is receiving this at{' '}
              <strong className="text-[var(--ink)]">
                {isIntl ? INTERNATIONAL_CORRIDORS[form.internationalId].label.split('→')[1].trim()
                  : form.domesticToCity}
              </strong>?
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Recipient name <span className="text-[var(--terra)]">*</span></Label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)]" />
                  <Input value={form.recipientName}
                    onChange={e => upd('recipientName', e.target.value)}
                    placeholder="Full name" className="pl-9" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Recipient phone <span className="text-[var(--terra)]">*</span></Label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)]" />
                  <Input value={form.recipientPhone}
                    onChange={e => upd('recipientPhone', e.target.value)}
                    placeholder="+234 800 000 0000" className="pl-9" />
                </div>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Delivery address</Label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-3 text-[var(--muted-text)]" />
                  <Input value={form.recipientAddress}
                    onChange={e => upd('recipientAddress', e.target.value)}
                    placeholder="Street, area, nearest landmark, city"
                    className="pl-9" />
                </div>
              </div>
            </div>

            {isIntl && corridor?.docs && (
              <div className="rounded-xl bg-[var(--cream)] border border-[var(--border-warm)] p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <FileText size={13} className="text-[var(--terra)]" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink)]">
                    Required docs — remind customer
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {corridor.docs.map(d => (
                    <span key={d} className="text-xs bg-white border border-[var(--border-warm)]
                      px-2 py-1 rounded-full text-[var(--muted-text)]">{d}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStage('package')}>Back</Button>
              <Button
                onClick={() => goNext('payment')}
                disabled={!form.recipientName || !form.recipientPhone}
                className="bg-[var(--terra)] text-white hover:bg-[var(--terra-light)]">
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <CustomerSidebar />
          <PriceSidebar />
        </div>
      </div>
    </div>
  )

  // ══════════════════════════════════════════════════════════
  // STAGE: PAYMENT
  // ══════════════════════════════════════════════════════════
  if (stage === 'payment') return (
    <div className="max-w-3xl mx-auto space-y-5">
      <h1 className="text-2xl font-bold text-[var(--ink)]"
        style={{ fontFamily: 'var(--font-playfair)' }}>
        Collect Payment
      </h1>
      <Progress />

      <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
        <Card className="border-[var(--border-warm)]">
          <CardContent className="p-6 space-y-5">

            {/* Amount due */}
            <div className="rounded-2xl bg-[var(--ink)] p-5 text-center">
              <p className="text-xs uppercase tracking-widest text-[rgba(255,253,249,0.45)] mb-1">
                Amount due
              </p>
              <p className="text-4xl font-bold text-[var(--warm-white)]" style={{ fontFamily:'var(--font-playfair)' }}>
                {isIntl ? `$${intlTotal}` : `${currency} ${domTotal.toLocaleString()}`}
              </p>
              <p className="text-xs text-[rgba(255,253,249,0.4)] mt-1">
                {isIntl
                  ? `Freight $${intlService?.priceUSD} + Customs $${intlService?.customs}${insurance > 0 ? ` + Insurance $${insurance}` : ''}`
                  : `${form.domesticFromCity} → ${form.domesticToCity} · ${activePair?.days}`
                }
              </p>
            </div>

            {/* Payment method */}
            <div>
              <Label className="mb-2 block">Payment method</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cash_ngn' as const, Icon: Banknote, label: 'Cash (NGN)', color: '#15803D' },
                  { id: 'cash_usd' as const, Icon: Banknote, label: 'Cash (USD)', color: '#185FA5' },
                  { id: 'pos_card' as const, Icon: CreditCard, label: 'POS / Card', color: '#854F0B' },
                ].map(({ id, Icon, label, color }) => (
                  <button key={id} onClick={() => upd('paymentMethod', id)}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3.5 transition-all
                      ${form.paymentMethod===id
                        ? 'border-[var(--terra)] bg-[var(--terra-pale)]'
                        : 'border-[var(--border-warm)] hover:border-[var(--terra)]/40'
                      }`}>
                    <Icon size={18} style={{ color }} />
                    <span className="text-xs font-medium text-[var(--ink)] text-center">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cash tendered */}
            {(form.paymentMethod === 'cash_ngn' || form.paymentMethod === 'cash_usd') && (
              <div className="space-y-1.5">
                <Label>Amount tendered</Label>
                <Input
                  type="number"
                  value={form.amountTendered}
                  onChange={e => upd('amountTendered', e.target.value)}
                  placeholder={`Enter amount received`}
                />
                {form.amountTendered && Number(form.amountTendered) >= totalPrice && (
                  <p className="text-sm text-green-700 font-medium">
                    Change: {isIntl ? '$' : currency + ' '}
                    {Math.round(Number(form.amountTendered) - totalPrice).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {form.paymentMethod === 'pos_card' && (
              <div className="flex items-center gap-2 rounded-xl bg-[var(--cream)]
                border border-[var(--border-warm)] px-4 py-3">
                <Info size={14} className="text-[var(--terra)] flex-shrink-0" />
                <p className="text-sm text-[var(--muted-text)]">
                  Process payment on the POS terminal first, then click Confirm below.
                </p>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStage('recipient')}>Back</Button>
              <Button
                onClick={handleConfirm}
                className="bg-[var(--terra)] text-white hover:bg-[var(--terra-light)]">
                <CheckCircle2 size={15} className="mr-1" /> Confirm & issue receipt
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <CustomerSidebar />
          <div className="rounded-xl border border-[var(--border-warm)] bg-[var(--warm-white)] p-4 space-y-2 text-sm">
            <p className="text-[10px] uppercase tracking-wide text-[var(--muted-text)] mb-3">Summary</p>
            <div className="flex justify-between">
              <span className="text-[var(--muted-text)]">Customer</span>
              <span className="text-[var(--ink)] font-medium">{customer?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-text)]">Route</span>
              <span className="text-[var(--ink)]">
                {isIntl ? form.internationalId : `${form.domesticFromCity}→${form.domesticToCity}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-text)]">Weight</span>
              <span className="text-[var(--ink)]">{form.weightKg} kg</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[var(--border-warm)] font-semibold">
              <span className="text-[var(--ink)]">Total</span>
              <span className="text-[var(--terra)]">
                {isIntl ? `$${intlTotal}` : `${currency} ${domTotal.toLocaleString()}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // ══════════════════════════════════════════════════════════
  // STAGE: RECEIPT
  // ══════════════════════════════════════════════════════════
  if (stage === 'receipt') return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
          <CheckCircle2 size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--ink)]"
            style={{ fontFamily: 'var(--font-playfair)' }}>
            Shipment registered
          </h1>
          <p className="text-sm text-[var(--muted-text)]">Payment collected. Print receipt for customer.</p>
        </div>
      </div>

      {/* Receipt card */}
      <div ref={receiptRef} className="rounded-2xl border border-[var(--border-warm)]
        bg-[var(--warm-white)] p-6 space-y-5">

        {/* Receipt header */}
        <div className="flex items-start justify-between pb-4 border-b border-[var(--border-warm)]">
          <div>
            <p className="text-lg font-bold text-[var(--ink)]"
              style={{ fontFamily: 'var(--font-playfair)' }}>DiasporaShip</p>
            <p className="text-xs text-[var(--muted-text)]">Shipment Receipt</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--muted-text)]">{new Date().toLocaleDateString('en-GB', {day:'2-digit',month:'short',year:'numeric'})}</p>
            <p className="text-xs text-[var(--muted-text)]">{new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}</p>
          </div>
        </div>

        {/* Tracking number — most prominent */}
        <div className="rounded-xl bg-[var(--cream)] border border-[var(--border-warm)] p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-[var(--muted-text)] mb-1">Tracking Number</p>
          <p className="font-mono text-2xl font-bold text-[var(--terra)]">{trackingNumber}</p>
          <p className="text-xs text-[var(--muted-text)] mt-1">Keep this number to track your shipment</p>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { label: 'Customer',  value: customer?.name ?? '—' },
            { label: 'Phone',     value: customer?.phone ?? '—' },
            { label: 'Route',     value: isIntl ? corridor.label : `${form.domesticFromCity} → ${form.domesticToCity}` },
            { label: 'Service',   value: isIntl ? (intlService?.name ?? '—') : 'Road Freight' },
            { label: 'Package',   value: `${form.shipmentType} · ${form.weightKg}kg` },
            { label: 'Contents',  value: form.description },
            { label: 'Recipient', value: form.recipientName },
            { label: 'Rec. Phone',value: form.recipientPhone },
            { label: 'Est. delivery', value: isIntl ? corridor.transitWindow : activePair?.days ?? '1–2 days' },
            { label: 'Payment',   value: form.paymentMethod === 'pos_card' ? 'Card / POS' : form.paymentMethod === 'cash_usd' ? 'Cash (USD)' : 'Cash (NGN)' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] uppercase tracking-wide text-[var(--muted-text)]">{label}</p>
              <p className="text-sm font-medium text-[var(--ink)] mt-0.5">{value || '—'}</p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between rounded-xl bg-[var(--terra-pale)]
          border border-[var(--border-warm)] px-4 py-3">
          <p className="text-sm font-semibold text-[var(--ink)]">Total paid</p>
          <p className="text-xl font-bold text-[var(--terra)]">
            {isIntl ? `$${intlTotal}` : `${currency} ${domTotal.toLocaleString()}`}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handlePrint}
          className="bg-[var(--terra)] text-white hover:bg-[var(--terra-light)]"
        >
          <Printer size={15} className="mr-1.5" /> Print receipt
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw size={15} className="mr-1.5" /> New customer
        </Button>
      </div>
    </div>
  )

  return null
}

// Local alias to avoid missing import warning
const ArrowRight = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)
