'use client'

import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeft, ArrowRight, CheckCircle2, CreditCard,
  Wallet, Globe2, Truck, FileText, Info
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
import { useWalletStore } from '@/store'
import { formatCurrency, generateTrackingNumber } from '@/lib/utils'

// ── TYPES ─────────────────────────────────────────────────────
type ShipmentCategory = 'international' | 'domestic'
type DomesticRegion = 'NG' | 'GH' | 'KE'

interface WizardState {
  // step 1 — corridor
  category:          ShipmentCategory
  internationalId:   InternationalCorridorId
  domesticRegion:    DomesticRegion
  domesticFromCity:  string
  domesticToCity:    string
  // step 2 — package
  shipmentType:      string
  weightKg:          string
  description:       string
  declaredValue:     string
  insured:           boolean
  // step 3 — pickup (drop-off address)
  senderName:        string
  senderPhone:       string
  senderAddress:     string
  // step 4 — delivery
  recipientName:     string
  recipientPhone:    string
  recipientAddress:  string
  // step 5 — service
  selectedServiceId: string
  // step 6 — payment
  paymentMethod:     'card' | 'wallet'
}

// ── STEPS ─────────────────────────────────────────────────────
const INTL_STEPS  = ['Route', 'Package', 'Drop-off', 'Delivery', 'Service', 'Review']
const DOM_STEPS   = ['Route', 'Package', 'Drop-off', 'Delivery', 'Service', 'Review']

// ── INITIAL STATE ─────────────────────────────────────────────
const INIT: WizardState = {
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
  senderName:        '',
  senderPhone:       '',
  senderAddress:     '',
  recipientName:     '',
  recipientPhone:    '',
  recipientAddress:  '',
  selectedServiceId: 'standard',
  paymentMethod:     'wallet',
}

// ── COMPONENT ─────────────────────────────────────────────────
export default function NewShipmentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { wallet } = useWalletStore()

  const typeParam = searchParams.get('type') as ShipmentCategory | null
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<WizardState>({
    ...INIT,
    category: typeParam ?? 'international',
  })
  const [complete, setComplete] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')

  const upd = <K extends keyof WizardState>(k: K, v: WizardState[K]) =>
    setForm(p => ({ ...p, [k]: v }))

  // ── DERIVED VALUES ──────────────────────────────────────────
  const isIntl    = form.category === 'international'
  const corridor  = INTERNATIONAL_CORRIDORS[form.internationalId]
  const steps     = isIntl ? INTL_STEPS : DOM_STEPS

  const domesticPairs: CityPair[] = useMemo(() => {
    if (form.domesticRegion === 'NG') return NIGERIA_CITY_PAIRS
    if (form.domesticRegion === 'GH') return GHANA_CITY_PAIRS
    return KENYA_CITY_PAIRS
  }, [form.domesticRegion])

  const domesticCities = useMemo(() => {
    if (form.domesticRegion === 'NG') return NIGERIA_CITIES
    if (form.domesticRegion === 'GH') return GHANA_CITIES
    return KENYA_CITIES
  }, [form.domesticRegion])

  const activePair = useMemo(() =>
    domesticPairs.find(p =>
      p.from === form.domesticFromCity && p.to === form.domesticToCity
    ) ?? domesticPairs[0]
  , [domesticPairs, form.domesticFromCity, form.domesticToCity])

  const currency = isIntl ? 'USD' : domesticCurrency(form.domesticRegion)

  // Pricing
  const intlService = corridor?.services.find(s => s.id === form.selectedServiceId) ?? corridor?.services[1]
  const insurance   = form.insured ? Math.max(10, Math.round(Number(form.declaredValue || 0) * 0.015)) : 0
  const intlTotal   = (intlService?.priceUSD ?? 0) + (intlService?.customs ?? 0) + insurance
  const domTotal    = calcDomesticPrice(activePair, Number(form.weightKg) || 1)

  const displayTotal = isIntl ? intlTotal : domTotal

  // ── VALIDATION ──────────────────────────────────────────────
  const canProceed = () => {
    switch (step) {
      case 0: return isIntl
        ? !!form.internationalId
        : !!form.domesticFromCity && !!form.domesticToCity && form.domesticFromCity !== form.domesticToCity
      case 1: return !!form.weightKg && !!form.description
      case 2: return !!form.senderName && !!form.senderPhone
      case 3: return !!form.recipientName && !!form.recipientPhone
      case 4: return !!form.selectedServiceId
      default: return true
    }
  }

  const next = () => setStep(s => Math.min(5, s + 1))
  const back = () => step === 0 ? router.push('/customer/ship') : setStep(s => s - 1)

  const confirm = () => {
    const tn = generateTrackingNumber()
    setTrackingNumber(tn)
    setComplete(true)
  }

  // ── SUCCESS SCREEN ──────────────────────────────────────────
  if (complete) {
    return (
      <div className="max-w-2xl mx-auto py-10 space-y-5">
        <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--warm-white)] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle2 size={22} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-[var(--muted-text)]">Booking confirmed</p>
              <h1 className="text-2xl font-bold text-[var(--ink)]"
                style={{ fontFamily: 'var(--font-playfair)' }}>
                Shipment booked!
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="rounded-xl bg-[var(--cream)] border border-[var(--border-warm)] p-4">
              <p className="text-xs uppercase tracking-wide text-[var(--muted-text)] mb-1">Tracking number</p>
              <p className="font-mono text-xl font-bold text-[var(--ink)]">{trackingNumber}</p>
            </div>
            <div className="rounded-xl bg-[var(--cream)] border border-[var(--border-warm)] p-4">
              <p className="text-xs uppercase tracking-wide text-[var(--muted-text)] mb-1">
                {isIntl ? 'Route' : 'Route'}
              </p>
              <p className="text-sm font-semibold text-[var(--ink)]">
                {isIntl
                  ? `${corridor.originFlag} → ${corridor.destFlag} ${corridor.label}`
                  : `${form.domesticFromCity} → ${form.domesticToCity}`
                }
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-[var(--terra-pale)] border border-[var(--border-warm)] p-4 mb-6">
            <div className="flex items-start gap-2">
              <Info size={15} className="text-[var(--terra)] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-[var(--terra-dark)]">
                <strong>Next step:</strong> Bring your package to our nearest office. Show your tracking
                number at the counter. Staff will weigh, label, and dispatch your shipment.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => router.push(`/customer/track/${trackingNumber}`)}
              className="bg-[var(--terra)] text-white hover:bg-[var(--terra-light)]"
            >
              Track shipment
            </Button>
            <Button variant="outline" onClick={() => router.push('/customer/shipments')}>
              View all shipments
            </Button>
            <Button variant="outline" onClick={() => router.push('/customer/ship')}>
              Send another
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ── WIZARD ──────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--cream)] p-5">
        <div className="flex items-center gap-2 text-sm text-[var(--muted-text)] mb-1">
          {isIntl
            ? <Globe2 size={14} className="text-[var(--terra)]" />
            : <Truck size={14} className="text-[var(--terra)]" />
          }
          <span>{isIntl ? 'International shipment' : 'Domestic delivery'}</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--ink)]"
          style={{ fontFamily: 'var(--font-playfair)' }}>
          New Shipment
        </h1>
      </div>

      {/* Step indicators */}
      <div className="flex flex-wrap gap-2">
        {steps.map((label, i) => (
          <div
            key={label}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
              transition-colors cursor-pointer
              ${i === step
                ? 'bg-[var(--terra)] text-white'
                : i < step
                ? 'bg-[var(--terra-pale)] text-[var(--terra-dark)]'
                : 'bg-[var(--cream)] text-[var(--muted-text)]'
              }`}
            onClick={() => i < step && setStep(i)}
          >
            {i < step ? <CheckCircle2 size={11} /> : <span>{i + 1}</span>}
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Main content + sidebar */}
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">

        {/* ── STEP CONTENT ── */}
        <Card className="border-[var(--border-warm)]">
          <CardContent className="p-6">

            {/* ─ STEP 0: ROUTE ─ */}
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-[var(--ink)] mb-1">Select your route</h2>
                  <p className="text-sm text-[var(--muted-text)]">
                    {isIntl ? 'Choose your international corridor' : 'Choose origin and destination city'}
                  </p>
                </div>

                {isIntl ? (
                  /* International corridor grid */
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(Object.entries(INTERNATIONAL_CORRIDORS) as [InternationalCorridorId, any][]).map(([id, c]) => (
                      <button
                        key={id}
                        onClick={() => upd('internationalId', id)}
                        className={`text-left rounded-xl border-2 p-4 transition-all
                          ${form.internationalId === id
                            ? 'border-[var(--terra)] bg-[var(--terra-pale)]'
                            : 'border-[var(--border-warm)] hover:border-[var(--terra)]/40 bg-[var(--warm-white)]'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg">{c.originFlag} → {c.destFlag}</span>
                          <Badge variant="secondary" className="text-[10px]">{c.transitWindow}</Badge>
                        </div>
                        <p className="text-sm font-medium text-[var(--ink)]">{c.label}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  /* Domestic: region + city selectors */
                  <div className="space-y-4">
                    {/* Region picker */}
                    <div>
                      <Label className="mb-2 block">Country</Label>
                      <div className="flex gap-2">
                        {([['NG','🇳🇬','Nigeria'], ['GH','🇬🇭','Ghana'], ['KE','🇰🇪','Kenya']] as const).map(([r, flag, name]) => (
                          <button
                            key={r}
                            onClick={() => {
                              upd('domesticRegion', r)
                              upd('domesticFromCity', r === 'NG' ? 'Lagos' : r === 'GH' ? 'Accra' : 'Nairobi')
                              upd('domesticToCity', r === 'NG' ? 'Abuja' : r === 'GH' ? 'Kumasi' : 'Mombasa')
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5
                              rounded-xl border-2 text-sm font-medium transition-all
                              ${form.domesticRegion === r
                                ? 'border-[var(--terra)] bg-[var(--terra-pale)] text-[var(--terra-dark)]'
                                : 'border-[var(--border-warm)] text-[var(--muted-text)] hover:border-[var(--terra)]/40'
                              }`}
                          >
                            <span>{flag}</span><span>{name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* City pair selectors */}
                    <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
                      <div>
                        <Label className="mb-1.5 block text-xs">From city</Label>
                        <select
                          value={form.domesticFromCity}
                          onChange={e => upd('domesticFromCity', e.target.value)}
                          className="w-full rounded-lg border border-[var(--border-warm)]
                            bg-[var(--warm-white)] px-3 py-2 text-sm text-[var(--ink)]
                            focus:outline-none focus:border-[var(--terra)]"
                        >
                          {domesticCities.filter(c => c !== form.domesticToCity).map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div className="text-[var(--muted-text)] mt-5">→</div>
                      <div>
                        <Label className="mb-1.5 block text-xs">To city</Label>
                        <select
                          value={form.domesticToCity}
                          onChange={e => upd('domesticToCity', e.target.value)}
                          className="w-full rounded-lg border border-[var(--border-warm)]
                            bg-[var(--warm-white)] px-3 py-2 text-sm text-[var(--ink)]
                            focus:outline-none focus:border-[var(--terra)]"
                        >
                          {domesticCities.filter(c => c !== form.domesticFromCity).map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Popular routes */}
                    <div>
                      <p className="text-xs text-[var(--muted-text)] mb-2">Popular routes</p>
                      <div className="flex flex-wrap gap-2">
                        {domesticPairs.slice(0, 6).map(p => (
                          <button
                            key={p.id}
                            onClick={() => { upd('domesticFromCity', p.from); upd('domesticToCity', p.to) }}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-all
                              ${form.domesticFromCity === p.from && form.domesticToCity === p.to
                                ? 'border-[var(--terra)] bg-[var(--terra-pale)] text-[var(--terra-dark)] font-medium'
                                : 'border-[var(--border-warm)] text-[var(--muted-text)] hover:border-[var(--terra)]/40'
                              }`}
                          >
                            {p.from} → {p.to}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─ STEP 1: PACKAGE ─ */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-[var(--ink)] mb-1">Package details</h2>
                  <p className="text-sm text-[var(--muted-text)]">Tell us what you are sending</p>
                </div>

                {/* Shipment type */}
                <div>
                  <Label className="mb-2 block">Shipment type</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SHIPMENT_TYPES.map(t => (
                      <button
                        key={t.value}
                        onClick={() => upd('shipmentType', t.value)}
                        className={`rounded-xl border-2 p-3 text-left transition-all
                          ${form.shipmentType === t.value
                            ? 'border-[var(--terra)] bg-[var(--terra-pale)]'
                            : 'border-[var(--border-warm)] hover:border-[var(--terra)]/40'
                          }`}
                      >
                        <p className="text-sm font-medium text-[var(--ink)]">{t.label}</p>
                        <p className="text-[11px] text-[var(--muted-text)] mt-0.5">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Description <span className="text-[var(--terra)]">*</span></Label>
                    <Input
                      value={form.description}
                      onChange={e => upd('description', e.target.value)}
                      placeholder="What are you sending?"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Weight (kg) <span className="text-[var(--terra)]">*</span></Label>
                    <Input
                      type="number" min="0.1" step="0.1"
                      value={form.weightKg}
                      onChange={e => upd('weightKg', e.target.value)}
                      placeholder="e.g. 3.5"
                    />
                  </div>
                  {isIntl && (
                    <div className="space-y-1.5">
                      <Label>Declared value (USD)</Label>
                      <Input
                        type="number" min="0"
                        value={form.declaredValue}
                        onChange={e => upd('declaredValue', e.target.value)}
                        placeholder="e.g. 250"
                      />
                    </div>
                  )}
                </div>

                {isIntl && (
                  <div className="flex items-center justify-between rounded-xl border border-[var(--border-warm)] bg-[var(--cream)] p-4">
                    <div>
                      <p className="text-sm font-medium text-[var(--ink)]">Add insurance</p>
                      <p className="text-xs text-[var(--muted-text)]">Covers loss or damage (1.5% of declared value)</p>
                    </div>
                    <button
                      onClick={() => upd('insured', !form.insured)}
                      className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors
                        ${form.insured ? 'bg-[var(--terra)]' : 'bg-[var(--border-warm)]'}`}
                    >
                      <span className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform
                        ${form.insured ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ─ STEP 2: DROP-OFF (sender) ─ */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-[var(--ink)] mb-1">Sender details</h2>
                  <p className="text-sm text-[var(--muted-text)]">
                    Who is sending this package? You will drop it off at our office.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Full name <span className="text-[var(--terra)]">*</span></Label>
                    <Input value={form.senderName} onChange={e => upd('senderName', e.target.value)} placeholder="Your full name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Phone number <span className="text-[var(--terra)]">*</span></Label>
                    <Input value={form.senderPhone} onChange={e => upd('senderPhone', e.target.value)} placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Address (for records)</Label>
                    <Input value={form.senderAddress} onChange={e => upd('senderAddress', e.target.value)} placeholder="Your street address" />
                  </div>
                </div>
                <div className="rounded-xl border border-[var(--border-warm)] bg-[var(--cream)] p-4">
                  <div className="flex items-start gap-2">
                    <Info size={14} className="text-[var(--terra)] mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-[var(--muted-text)]">
                      After booking, bring your package to our nearest office. Staff will weigh it and process your shipment.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ─ STEP 3: DELIVERY (recipient) ─ */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-[var(--ink)] mb-1">Recipient details</h2>
                  <p className="text-sm text-[var(--muted-text)]">
                    Who is receiving this package?
                    {isIntl ? ` In ${INTERNATIONAL_CORRIDORS[form.internationalId]?.destination}.` : ` In ${form.domesticToCity}.`}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Recipient name <span className="text-[var(--terra)]">*</span></Label>
                    <Input value={form.recipientName} onChange={e => upd('recipientName', e.target.value)} placeholder="Recipient full name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Recipient phone <span className="text-[var(--terra)]">*</span></Label>
                    <Input value={form.recipientPhone} onChange={e => upd('recipientPhone', e.target.value)} placeholder="+234 800 000 0000" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Delivery address</Label>
                    <Input value={form.recipientAddress} onChange={e => upd('recipientAddress', e.target.value)}
                      placeholder={isIntl ? 'Street, area, landmark, city' : 'Street, area, landmark'} />
                  </div>
                </div>
                {isIntl && corridor?.docs && (
                  <div className="rounded-xl border border-[var(--border-warm)] bg-[var(--cream)] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={13} className="text-[var(--terra)]" />
                      <p className="text-xs font-semibold text-[var(--ink)] uppercase tracking-wide">Documents required</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {corridor.docs.map(d => (
                        <span key={d} className="text-xs bg-white border border-[var(--border-warm)] px-2 py-1 rounded-full text-[var(--muted-text)]">{d}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─ STEP 4: SERVICE ─ */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-[var(--ink)] mb-1">Choose service</h2>
                  <p className="text-sm text-[var(--muted-text)]">Select your delivery speed and price</p>
                </div>

                {isIntl ? (
                  <div className="space-y-3">
                    {corridor.services.map(svc => {
                      const total = svc.priceUSD! + svc.customs! + insurance
                      return (
                        <button
                          key={svc.id}
                          onClick={() => upd('selectedServiceId', svc.id)}
                          className={`w-full text-left rounded-xl border-2 p-4 transition-all
                            ${form.selectedServiceId === svc.id
                              ? 'border-[var(--terra)] bg-[var(--terra-pale)]'
                              : 'border-[var(--border-warm)] hover:border-[var(--terra)]/40'
                            }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-[var(--ink)]">{svc.name}</span>
                                {svc.badge && (
                                  <Badge variant="secondary" className="text-[10px]">{svc.badge}</Badge>
                                )}
                              </div>
                              <p className="text-xs text-[var(--muted-text)]">{svc.days}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-xl font-bold text-[var(--ink)]">${total}</p>
                              <div className="text-[10px] text-[var(--muted-text)] mt-0.5 space-y-0.5">
                                <div>Freight ${svc.priceUSD} · Customs ${svc.customs}</div>
                                {insurance > 0 && <div>Insurance ${insurance}</div>}
                              </div>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  /* Domestic: single price card */
                  <div className="rounded-xl border-2 border-[var(--terra)] bg-[var(--terra-pale)] p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[var(--ink)] mb-1">Road Freight</p>
                        <p className="text-xs text-[var(--muted-text)]">{form.domesticFromCity} → {form.domesticToCity}</p>
                        <p className="text-xs text-[var(--muted-text)] mt-0.5">{activePair?.days ?? '1–2 days'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[var(--ink)]">
                          {currency} {domTotal.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-[var(--muted-text)] mt-0.5">
                          Base + {form.weightKg ? `${form.weightKg}kg` : 'weight'} charge
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-[var(--terra-pale)] flex gap-3 text-xs text-[var(--muted-text)]">
                      <span>✓ No customs required</span>
                      <span>✓ Door-to-door delivery</span>
                      <span>✓ Real-time tracking</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─ STEP 5: REVIEW ─ */}
            {step === 5 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-[var(--ink)] mb-1">Review and confirm</h2>
                  <p className="text-sm text-[var(--muted-text)]">Check everything before booking</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: 'Route', value: isIntl ? corridor.label : `${form.domesticFromCity} → ${form.domesticToCity}` },
                    { label: 'Type', value: `${form.shipmentType} · ${form.weightKg}kg` },
                    { label: 'Sender', value: `${form.senderName} · ${form.senderPhone}` },
                    { label: 'Recipient', value: `${form.recipientName} · ${form.recipientPhone}` },
                    { label: 'Service', value: isIntl ? (intlService?.name ?? '—') : 'Road Freight' },
                    { label: 'Total', value: isIntl ? `$${intlTotal}` : `${currency} ${domTotal.toLocaleString()}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl bg-[var(--cream)] border border-[var(--border-warm)] p-3.5">
                      <p className="text-[10px] uppercase tracking-wide text-[var(--muted-text)] mb-1">{label}</p>
                      <p className="text-sm font-medium text-[var(--ink)]">{value || '—'}</p>
                    </div>
                  ))}
                </div>

                {/* Payment method */}
                <div>
                  <Label className="mb-2 block">Payment method</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'wallet' as const, Icon: Wallet, label: 'Wallet', sub: `${currency} balance` },
                      { id: 'card'   as const, Icon: CreditCard, label: 'Card', sub: 'Visa or Mastercard' },
                    ].map(({ id, Icon, label, sub }) => (
                      <button
                        key={id}
                        onClick={() => upd('paymentMethod', id)}
                        className={`text-left rounded-xl border-2 p-3.5 transition-all
                          ${form.paymentMethod === id
                            ? 'border-[var(--terra)] bg-[var(--terra-pale)]'
                            : 'border-[var(--border-warm)]'
                          }`}
                      >
                        <Icon size={16} className="text-[var(--terra)] mb-2" />
                        <p className="text-sm font-medium text-[var(--ink)]">{label}</p>
                        <p className="text-xs text-[var(--muted-text)]">{sub}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* ── SIDEBAR ── */}
        <div className="space-y-4">
          {/* Price summary */}
          <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--warm-white)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-text)] mb-3">
              Price summary
            </p>
            {isIntl ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--muted-text)]">Freight</span>
                  <span className="text-[var(--ink)]">${intlService?.priceUSD ?? '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-text)]">Customs est.</span>
                  <span className="text-[var(--ink)]">${intlService?.customs ?? '—'}</span>
                </div>
                {insurance > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[var(--muted-text)]">Insurance</span>
                    <span className="text-[var(--ink)]">${insurance}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[var(--border-warm)] font-semibold">
                  <span className="text-[var(--ink)]">Total</span>
                  <span className="text-[var(--terra)]">${intlTotal}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--muted-text)]">Road freight</span>
                  <span className="text-[var(--ink)]">{currency} {domTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-text)]">Customs</span>
                  <span className="text-[var(--ink)]">Not required</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[var(--border-warm)] font-semibold">
                  <span className="text-[var(--ink)]">Total</span>
                  <span className="text-[var(--terra)]">{currency} {domTotal.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Route info */}
          <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--warm-white)] p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-text)]">
              Route info
            </p>
            {isIntl ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--muted-text)]">Corridor</span>
                  <span className="text-[var(--ink)] font-medium">{corridor.originFlag} → {corridor.destFlag}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-text)]">Transit</span>
                  <span className="text-[var(--ink)]">{corridor.transitWindow}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-text)]">Customs</span>
                  <span className="text-green-700 text-xs font-medium">Included</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--muted-text)]">Route</span>
                  <span className="text-[var(--ink)] font-medium">{form.domesticFromCity} → {form.domesticToCity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-text)]">Transit</span>
                  <span className="text-[var(--ink)]">{activePair?.days ?? '1–2 days'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-text)]">Customs</span>
                  <span className="text-[var(--ink)]">Not required</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-text)]">Currency</span>
                  <span className="text-[var(--ink)]">{currency}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nav buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={back}>
          <ArrowLeft size={15} className="mr-1" />
          {step === 0 ? 'Change type' : 'Back'}
        </Button>
        {step < 5 ? (
          <Button
            onClick={next}
            disabled={!canProceed()}
            className="bg-[var(--terra)] text-white hover:bg-[var(--terra-light)]"
          >
            Continue <ArrowRight size={15} className="ml-1" />
          </Button>
        ) : (
          <Button
            onClick={confirm}
            className="bg-[var(--terra)] text-white hover:bg-[var(--terra-light)]"
          >
            <CheckCircle2 size={15} className="mr-1" /> Confirm & book
          </Button>
        )}
      </div>
    </div>
  )
}
