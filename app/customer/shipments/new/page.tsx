'use client'

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  FileText,
  Globe2,
  Truck,
  Wallet,
  Package,
  Scale,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useWalletStore, useBookingStore, calculatePrice } from '@/store'
import { cn, formatCurrency } from '@/lib/utils'
import { AddressSelector, AddressForm } from '@/components/shared/AddressSelector'
import { AddressMap } from '@/components/shared/AddressMap'
import {
  INTERNATIONAL_CORRIDORS,
  NIGERIA_CITY_PAIRS,
  GHANA_CITY_PAIRS,
  KENYA_CITY_PAIRS,
  type InternationalCorridorId,
} from '@/lib/corridors'
import { getAIWeightSuggestion, getAIDimensionSuggestion, validateWeightDimensions, type AIWeightSuggestion, type AIDimensionSuggestion } from '@/lib/ai-pricing'

type ShipmentCategory = 'international' | 'domestic'

const SHIPMENT_TYPES = [
  { value: 'parcel',   label: 'Parcel',   desc: 'Boxes and packages' },
  { value: 'document', label: 'Document', desc: 'Papers, contracts' },
  { value: 'cargo',    label: 'Cargo',    desc: 'Bulk or palletised' },
  { value: 'fragile',  label: 'Fragile',  desc: 'Requires special care' },
]

const panelClassName =
  'rounded-2xl border border-border/70 bg-card/95 shadow-sm backdrop-blur'
const mutedLabelClassName =
  'text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground'
const optionBaseClassName =
  'rounded-xl border p-4 text-left transition-all duration-200 hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60'
const optionSelectedClassName = 'border-primary bg-primary/10 shadow-sm'
const optionIdleClassName = 'border-border bg-card'
const reviewCardClassName = 'rounded-xl border border-border/70 bg-muted/45 p-4'
const sidebarPanelClassName =
  'overflow-hidden rounded-2xl border border-primary/15 !bg-transparent bg-gradient-to-b from-[#fff8ef] to-[#f3e7d7] shadow-[0_14px_36px_rgba(44,26,16,0.08)] dark:border-border dark:from-[hsl(var(--card))] dark:to-[hsl(var(--muted))]'
const sidebarHighlightClassName =
  'overflow-hidden border-primary/25 !bg-transparent bg-gradient-to-br from-primary/16 via-primary/10 to-background shadow-sm'

function NewShipmentContent() {
  const searchParams = useSearchParams()
  const type = (searchParams.get('type') as ShipmentCategory) || 'international'
  const initialCorridor = searchParams.get('corridor') as InternationalCorridorId | null

  const { wallet } = useWalletStore()
  const { 
    addresses, 
    pickupAddress, 
    deliveryAddress, 
    setPickupAddress, 
    setDeliveryAddress, 
    fetchAddresses, 
    saveAddress,
    setQuote, 
    setShipmentDetails,
    processPayment,
    isProcessing,
  } = useBookingStore()
  
  const [step, setStep] = useState(0)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [showAddressForm, setShowAddressForm] = useState(false)

  // International form state
  const [intlCorridor, setIntlCorridor] = useState<InternationalCorridorId>(
    initialCorridor || 'US-NG'
  )
  const [selectedService, setSelectedService] = useState(
    INTERNATIONAL_CORRIDORS['US-NG'].services[1].id
  )

  // Domestic form state
  const [domesticRegion, setDomesticRegion] = useState<'NG' | 'GH' | 'KE'>('NG')
  const [fromCity, setFromCity] = useState('')
  const [toCity, setToCity] = useState('')

  // Dimensions state
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: '',
  })

  // Common form state
  const [form, setForm] = useState({
    shipmentType: 'parcel',
    weight: '',
    declaredValue: '',
    description: '',
    insured: false,
    paymentMethod: 'card' as 'card' | 'wallet',
  })

  const isInternational = type === 'international'

  // Get corridor data
  const corridor = isInternational ? INTERNATIONAL_CORRIDORS[intlCorridor] : null
  const selectedServiceData = corridor?.services.find(s => s.id === selectedService)

  // Get available cities for domestic
  const availablePairs = domesticRegion === 'NG' ? NIGERIA_CITY_PAIRS :
                         domesticRegion === 'GH' ? GHANA_CITY_PAIRS :
                         KENYA_CITY_PAIRS
  const supportedFromCities = useMemo(
    () => Array.from(new Set(availablePairs.map(pair => pair.from))),
    [availablePairs]
  )
  const supportedToCities = useMemo(
    () => availablePairs
      .filter(pair => pair.from === fromCity)
      .map(pair => pair.to),
    [availablePairs, fromCity]
  )

  // Calculate domestic price
  const selectedPair = availablePairs.find(p => p.from === fromCity && p.to === toCity)

  // Calculate price using pricing engine
  const priceResult = useMemo(() => {
    const weight = parseFloat(form.weight) || 1
    
    console.log('[BOOKING] Calculating price for:', {
      isInternational,
      corridorId: isInternational ? intlCorridor : selectedPair?.id,
      weight,
      selectedPairId: selectedPair?.id,
      selectedPairFrom: selectedPair?.from,
      selectedPairTo: selectedPair?.to,
    })
    
    if (isInternational) {
      return calculatePrice({
        corridorId: intlCorridor,
        actualWeight: weight,
        lengthCm: parseFloat(dimensions.length) || undefined,
        widthCm: parseFloat(dimensions.width) || undefined,
        heightCm: parseFloat(dimensions.height) || undefined,
        serviceId: selectedService,
        declaredValue: parseFloat(form.declaredValue) || 0,
        isInsured: form.insured,
      })
    } else if (selectedPair) {
      return calculatePrice({
        corridorId: selectedPair.id,
        actualWeight: weight,
        declaredValue: parseFloat(form.declaredValue) || 0,
        isInsured: form.insured,
      })
    }
    return { actualWeight: weight, volumetricWeight: 0, billableWeight: weight, baseFreight: 0, fuelSurcharge: 0, customsDuties: 0, insurance: 0, vat: 0, total: 0, currency: 'USD', breakdown: [] }
  }, [form.weight, form.declaredValue, form.insured, isInternational, intlCorridor, selectedService, dimensions, selectedPair])

  // Update quote in store when moving to review step
  useEffect(() => {
    if (step >= 3) {
      setQuote({
        id: `quote-${Date.now()}`,
        corridorId: isInternational ? intlCorridor : selectedPair?.id || '',
        serviceId: selectedService,
        serviceName: selectedServiceData?.name || 'Standard',
        actualWeight: priceResult.actualWeight,
        volumetricWeight: priceResult.volumetricWeight,
        billableWeight: priceResult.billableWeight,
        baseFreight: priceResult.baseFreight,
        fuelSurcharge: priceResult.fuelSurcharge,
        customsDuties: priceResult.customsDuties,
        insurance: priceResult.insurance,
        vat: priceResult.vat,
        subtotal: priceResult.baseFreight + priceResult.fuelSurcharge + priceResult.customsDuties,
        total: priceResult.total,
        currency: priceResult.currency,
        breakdown: priceResult.breakdown,
        calculatedAt: new Date().toISOString(),
      })
    }
  }, [step, isInternational, intlCorridor, selectedPair, selectedService, selectedServiceData, priceResult, setQuote])

  // AI suggestions based on description
  const aiSuggestion = useMemo<AIWeightSuggestion | null>(() => {
    if (step !== 1 || !isInternational) return null
    return getAIWeightSuggestion(form.description, parseFloat(form.weight) || undefined)
  }, [step, isInternational, form.description, form.weight])

  const aiDimensionSuggestion = useMemo<AIDimensionSuggestion | null>(() => {
    if (step !== 1 || !isInternational || !form.description) return null
    return getAIDimensionSuggestion(form.description)
  }, [step, isInternational, form.description])

  const weightValidation = useMemo(() => {
    if (step !== 1 || !isInternational) return { isValid: true, warnings: [] }
    return validateWeightDimensions(
      parseFloat(form.weight) || 0,
      parseFloat(dimensions.length) || undefined,
      parseFloat(dimensions.width) || undefined,
      parseFloat(dimensions.height) || undefined
    )
  }, [step, isInternational, form.weight, dimensions])

  const update = useCallback((field: keyof typeof form, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }, [])

  const applyAISuggestion = useCallback((type: 'weight' | 'dimensions') => {
    if (type === 'weight' && aiSuggestion) {
      update('weight', String(aiSuggestion.estimatedWeight))
      if (aiSuggestion.packageTypeSuggestion !== 'parcel') {
        update('shipmentType', aiSuggestion.packageTypeSuggestion)
      }
    } else if (type === 'dimensions' && aiDimensionSuggestion) {
      setDimensions({
        length: String(aiDimensionSuggestion.estimatedDimensions.length),
        width: String(aiDimensionSuggestion.estimatedDimensions.width),
        height: String(aiDimensionSuggestion.estimatedDimensions.height),
      })
    }
  }, [aiSuggestion, aiDimensionSuggestion, update])

  useEffect(() => {
    fetchAddresses('u1')
  }, [fetchAddresses])

  const handleSaveAddress = async (addressData: Parameters<typeof saveAddress>[0]) => {
    const newAddress = await saveAddress({
      ...addressData,
      userId: 'u1',
    })
    if (newAddress) {
      setShowAddressForm(false)
    }
  }

  const handleConfirmBooking = async () => {
    const confirmation = await processPayment({
      userId: 'u1',
      userEmail: 'john.okafor@example.com',
      userPhone: '+2348012345678',
      paymentMethod: form.paymentMethod as 'wallet' | 'card',
    })
    
    if (confirmation.status === 'confirmed') {
      setTrackingNumber(confirmation.trackingNumber)
      setBookingComplete(true)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 0: return isInternational ? !!intlCorridor : !!domesticRegion
      case 1: return !!form.weight && !!form.description
      case 2: return isInternational ? true : !!selectedPair
      case 3: return isInternational ? !!selectedService : true
      default: return true
    }
  }

  if (bookingComplete) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className={panelClassName}>
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/12">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">Shipment Booked!</h1>
            <p className="mb-6 text-base text-muted-foreground">
              Your package is on its way. We&apos;ll send updates to your email.
            </p>

            <div className="mb-6 rounded-xl border border-border/70 bg-muted/50 p-4">
              <p className={cn(mutedLabelClassName, 'mb-2')}>Tracking Number</p>
              <p className="font-mono text-xl font-bold text-foreground">{trackingNumber}</p>
            </div>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild className="h-11 px-6">
                <Link href={`/customer/track/${trackingNumber}`}>Track Shipment</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/customer/shipments">View All Shipments</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const steps = isInternational
    ? ['Corridor', 'Package', 'Addresses', 'Service', 'Review']
    : ['Region', 'Package', 'Route', 'Review']

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className={cn(panelClassName, 'overflow-hidden p-6 md:p-8')}>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Globe2 className="h-4 w-4 text-primary" />
              <span>{isInternational ? 'International booking' : 'Domestic booking'}</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-foreground md:text-3xl" style={{ fontFamily: 'var(--font-playfair)' }}>
              {isInternational ? 'New Shipment' : 'Domestic Delivery'}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {isInternational
                ? corridor?.summary
                : `${domesticRegion === 'NG' ? 'Nigeria' : domesticRegion === 'GH' ? 'Ghana' : 'Kenya'} local delivery`}
            </p>
          </div>
          <div className="min-w-[160px] rounded-xl border border-border/70 bg-muted/50 p-4">
            <p className={mutedLabelClassName}>Wallet</p>
            <p className="mt-2 text-xl font-bold text-foreground">{formatCurrency(wallet.balanceUSD, 'USD')}</p>
          </div>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex flex-wrap gap-3">
        {steps.map((label, index) => (
          <div
            key={label}
            className={cn(
              'flex min-h-11 items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-medium shadow-sm transition-colors',
              index === step
                ? 'border-primary bg-primary text-primary-foreground'
                : index < step
                ? 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400'
                : 'border-border bg-card text-muted-foreground'
            )}
          >
            <span className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
              index === step ? 'bg-white/20 text-white' : 'bg-muted text-foreground'
            )}>
              {index < step ? '✓' : index + 1}
            </span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main form */}
        <Card className={panelClassName}>
          <CardContent className="p-6">
            {/* Step 0: Corridor */}
            {step === 0 && isInternational && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Select a corridor</h2>
                  <p className="text-sm text-muted-foreground">Choose your shipping route</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(Object.entries(INTERNATIONAL_CORRIDORS) as [InternationalCorridorId, typeof INTERNATIONAL_CORRIDORS[InternationalCorridorId]][]).map(([id, corr]) => (
                    <button
                      key={id}
                      onClick={() => {
                        setIntlCorridor(id)
                        setSelectedService(corr.services[1].id)
                      }}
                      className={cn(
                        optionBaseClassName,
                        intlCorridor === id ? optionSelectedClassName : optionIdleClassName
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{corr.originFlag}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-lg">{corr.destFlag}</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{corr.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{corr.transitWindow}</p>
                      <p className="mt-3 text-sm font-semibold text-primary">From ${corr.services[1].priceUSD}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 0: Domestic Region */}
            {step === 0 && !isInternational && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Select region</h2>
                  <p className="text-sm text-muted-foreground">Where do you want to send?</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {([
                    { code: 'NG' as const, name: 'Nigeria', flag: '🇳🇬', cities: 15 },
                    { code: 'GH' as const, name: 'Ghana', flag: '🇬🇭', cities: 6 },
                    { code: 'KE' as const, name: 'Kenya', flag: '🇰🇪', cities: 6 },
                  ]).map(region => (
                    <button
                      key={region.code}
                      onClick={() => {
                        setDomesticRegion(region.code)
                        setFromCity('')
                        setToCity('')
                      }}
                      className={cn(
                        optionBaseClassName,
                        domesticRegion === region.code ? optionSelectedClassName : optionIdleClassName
                      )}
                    >
                      <p className="text-2xl mb-2">{region.flag}</p>
                      <p className="font-semibold text-foreground">{region.name}</p>
                      <p className="text-sm text-muted-foreground">{region.cities} cities</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Package */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Package details</h2>
                  <p className="text-sm text-muted-foreground">Tell us about what you&apos;re sending</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <Label className="mb-3 block text-sm font-medium text-foreground">Shipment type</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SHIPMENT_TYPES.map(t => (
                        <button
                          key={t.value}
                          onClick={() => update('shipmentType', t.value)}
                          className={cn(
                            'min-h-24 rounded-xl border p-3 text-left transition-all duration-200 hover:border-primary/40 hover:bg-accent/40',
                            form.shipmentType === t.value ? optionSelectedClassName : optionIdleClassName
                          )}
                        >
                          <p className="text-sm font-semibold text-foreground">{t.label}</p>
                          <p className="mt-1 text-sm leading-5 text-muted-foreground">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="description" className="text-sm font-medium text-foreground">Description</Label>
                      <Input
                        id="description"
                        value={form.description}
                        onChange={e => update('description', e.target.value)}
                        placeholder="What are you sending?"
                        className="booking-field mt-2 h-11"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight" className="text-sm font-medium text-foreground">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={form.weight}
                        onChange={e => update('weight', e.target.value)}
                        placeholder="e.g. 5.5"
                        className="booking-field mt-2 h-11"
                      />
                    </div>
                  </div>
                  {isInternational && (
                    <>
                      <div>
                        <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Scale className="h-4 w-4" />
                          Dimensions (cm) - Optional but helps pricing accuracy
                        </Label>
                        <p className="text-xs text-muted-foreground mb-3">For volumetric weight calculation</p>
                        <div className="grid grid-cols-3 gap-3 max-w-[280px]">
                          <div>
                            <Input
                              type="number"
                              value={dimensions.length}
                              onChange={e => setDimensions(d => ({ ...d, length: e.target.value }))}
                              placeholder="L"
                              className="h-10"
                            />
                            <span className="text-xs text-muted-foreground">Length</span>
                          </div>
                          <div>
                            <Input
                              type="number"
                              value={dimensions.width}
                              onChange={e => setDimensions(d => ({ ...d, width: e.target.value }))}
                              placeholder="W"
                              className="h-10"
                            />
                            <span className="text-xs text-muted-foreground">Width</span>
                          </div>
                          <div>
                            <Input
                              type="number"
                              value={dimensions.height}
                              onChange={e => setDimensions(d => ({ ...d, height: e.target.value }))}
                              placeholder="H"
                              className="h-10"
                            />
                            <span className="text-xs text-muted-foreground">Height</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="value" className="text-sm font-medium text-foreground">Declared value (USD)</Label>
                        <Input
                          id="value"
                          type="number"
                          value={form.declaredValue}
                          onChange={e => update('declaredValue', e.target.value)}
                          placeholder="e.g. 250"
                          className="booking-field mt-2 h-11 max-w-[220px]"
                        />
                      </div>
                    </>
                  )}
                </div>
                {isInternational && (
                  <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-4">
                    <div>
                      <p className="font-medium text-foreground">Add insurance</p>
                      <p className="mt-1 text-sm text-muted-foreground">Protect your shipment (1.5%)</p>
                    </div>
                    <button
                      onClick={() => update('insured', !form.insured)}
                      className={cn(
                        'h-7 w-12 rounded-full p-1 transition-colors',
                        form.insured ? 'bg-primary' : 'bg-border'
                      )}
                      aria-pressed={form.insured}
                    >
                      <span className={cn(
                        'block h-5 w-5 rounded-full bg-white shadow transition-transform',
                        form.insured ? 'translate-x-5' : ''
                      )} />
                    </button>
                  </div>
                )}
                
                {priceResult.volumetricWeight > priceResult.actualWeight && parseFloat(form.weight) > 0 && (
                  <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <Package className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800">Volumetric weight applies</p>
                      <p className="text-sm text-amber-700 mt-1">
                        Your package: {priceResult.actualWeight}kg actual, {priceResult.volumetricWeight}kg volumetric.
                        You&apos;ll be charged for {priceResult.billableWeight}kg.
                      </p>
                    </div>
                  </div>
                )}

                {/* AI Suggestions */}
                {isInternational && (aiSuggestion || aiDimensionSuggestion) && (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">AI</span>
                      </div>
                      <p className="font-medium text-foreground">Smart suggestions based on your description</p>
                    </div>
                    
                    {aiSuggestion && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-foreground">
                              Estimated weight: <span className="font-semibold">{aiSuggestion.estimatedWeight} kg</span>
                              <span className="text-muted-foreground ml-2">(range: {aiSuggestion.weightRange.min}-{aiSuggestion.weightRange.max}kg)</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{aiSuggestion.reasoning}</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => applyAISuggestion('weight')}
                            className="text-xs h-7"
                          >
                            Apply
                          </Button>
                        </div>
                        {aiSuggestion.flags.map((flag, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                            <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <span>{flag}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {aiDimensionSuggestion && !dimensions.length && (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-foreground">
                            Suggested dimensions: <span className="font-semibold">
                              {aiDimensionSuggestion.estimatedDimensions.length}x
                              {aiDimensionSuggestion.estimatedDimensions.width}x
                              {aiDimensionSuggestion.estimatedDimensions.height} cm
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Volumetric weight: {aiDimensionSuggestion.volumeWeight}kg
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => applyAISuggestion('dimensions')}
                          className="text-xs h-7"
                        >
                          Apply
                        </Button>
                      </div>
                    )}

                    {weightValidation.warnings.length > 0 && (
                      <div className="space-y-1">
                        {weightValidation.warnings.map((warning, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                            <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <span>{warning}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Addresses/Route */}
            {step === 2 && isInternational && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Pickup & Delivery</h2>
                  <p className="text-sm text-muted-foreground">Select addresses from your saved locations or search on map</p>
                </div>
                
                <AddressSelector
                  addresses={addresses}
                  selectedAddress={pickupAddress}
                  onSelect={setPickupAddress}
                  type="pickup"
                  onAddNew={() => setShowAddressForm(true)}
                />
                
                <Separator />
                
                <AddressSelector
                  addresses={addresses}
                  selectedAddress={deliveryAddress}
                  onSelect={setDeliveryAddress}
                  type="delivery"
                  onAddNew={() => setShowAddressForm(true)}
                />
                
                {showAddressForm && (
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <h3 className="font-semibold">Add New Address</h3>
                      <AddressMap
                        onChange={(loc) => console.log('Location:', loc)}
                        placeholder="Search pickup location..."
                      />
                      <Separator />
                      <AddressForm
                        onSave={handleSaveAddress}
                        onCancel={() => setShowAddressForm(false)}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {step === 2 && !isInternational && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Select route</h2>
                  <p className="text-sm text-muted-foreground">Choose pickup and delivery cities</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium text-foreground">From city</Label>
                    <select
                      value={fromCity}
                      onChange={e => {
                        const nextFromCity = e.target.value
                        setFromCity(nextFromCity)
                        if (!availablePairs.some(pair => pair.from === nextFromCity && pair.to === toCity)) {
                          setToCity('')
                        }
                      }}
                      className="booking-field mt-2 h-11 w-full rounded-lg px-3"
                    >
                      <option value="">Select city</option>
                      {supportedFromCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-foreground">To city</Label>
                    <select
                      value={toCity}
                      onChange={e => setToCity(e.target.value)}
                      disabled={!fromCity}
                      className="booking-field mt-2 h-11 w-full rounded-lg px-3"
                    >
                      <option value="">{fromCity ? 'Select destination' : 'Choose origin first'}</option>
                      {supportedToCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {fromCity && !supportedToCities.length && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 text-amber-700" />
                      <div>
                        <p className="text-sm font-medium text-amber-900">No priced route from {fromCity}</p>
                        <p className="text-sm text-amber-800">Choose another origin city with a configured domestic corridor.</p>
                      </div>
                    </div>
                  </div>
                )}

                {!!fromCity && !!toCity && !selectedPair && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 text-amber-700" />
                      <div>
                        <p className="text-sm font-medium text-amber-900">Route pricing unavailable</p>
                        <p className="text-sm text-amber-800">{fromCity} to {toCity} is not configured yet, so checkout cannot generate an amount.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedPair && (
                  <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-foreground">{fromCity} → {toCity}</p>
                        <p className="text-sm text-muted-foreground">Delivery: {selectedPair.days}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Starting from</p>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(priceResult.total, priceResult.currency)}</p>
                      </div>
                    </div>
                    {form.weight && parseFloat(form.weight) > 0 && priceResult.total > 0 && (
                      <div className="pt-3 border-t border-primary/20">
                        <p className="text-xs text-muted-foreground mb-2">For {form.weight}kg:</p>
                        <div className="space-y-1">
                          {priceResult.breakdown.map((item: { label: string; amount: number }, i: number) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{item.label}</span>
                              <span className="font-medium">{formatCurrency(item.amount, priceResult.currency)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between font-semibold pt-2 border-t border-primary/20">
                            <span>Total</span>
                            <span className="text-lg text-primary">{formatCurrency(priceResult.total, priceResult.currency)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Service/Review */}
            {step === 3 && isInternational && corridor && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Select service</h2>
                  <p className="text-sm text-muted-foreground">Choose your delivery speed</p>
                </div>
                <div className="space-y-3">
                  {corridor.services.map(service => {
                    const priceForService = calculatePrice({
                      corridorId: intlCorridor,
                      actualWeight: parseFloat(form.weight) || 1,
                      lengthCm: parseFloat(dimensions.length) || undefined,
                      widthCm: parseFloat(dimensions.width) || undefined,
                      heightCm: parseFloat(dimensions.height) || undefined,
                      serviceId: service.id,
                      declaredValue: parseFloat(form.declaredValue) || 0,
                      isInsured: form.insured,
                    })
                    return (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service.id)}
                        className={cn(
                          optionBaseClassName,
                          'w-full',
                          selectedService === service.id ? optionSelectedClassName : optionIdleClassName
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-foreground">{service.name}</p>
                              {service.badge && <Badge variant="secondary" className="text-xs">{service.badge}</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">{service.days}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-foreground">{formatCurrency(priceForService.total, 'USD')}</p>
                            <p className="text-xs text-muted-foreground">
                              {priceForService.billableWeight}kg · Vol: {priceForService.volumetricWeight}kg
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {step === 3 && !isInternational && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Review & Confirm</h2>
                  <p className="text-sm text-muted-foreground">Confirm your domestic delivery booking</p>
                </div>
                
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className={reviewCardClassName}>
                    <p className={mutedLabelClassName}>Region</p>
                    <p className="mt-2 font-semibold text-foreground">{domesticRegion === 'NG' ? '🇳🇬 Nigeria' : domesticRegion === 'GH' ? '🇬🇭 Ghana' : '🇰🇪 Kenya'}</p>
                  </div>
                  <div className={reviewCardClassName}>
                    <p className={mutedLabelClassName}>Route</p>
                    <p className="mt-2 font-semibold text-foreground">{fromCity} → {toCity}</p>
                  </div>
                  <div className={reviewCardClassName}>
                    <p className={mutedLabelClassName}>Package</p>
                    <p className="mt-2 font-semibold text-foreground">{form.weight || '1'} kg · {form.description || 'No description'}</p>
                  </div>
                  <div className={reviewCardClassName}>
                    <p className={mutedLabelClassName}>Delivery Time</p>
                    <p className="mt-2 font-semibold text-foreground">{selectedPair?.days || 'TBD'}</p>
                  </div>
                </div>

                <Separator />

                <div className="rounded-xl border border-primary/30 bg-primary/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">Total Amount</p>
                      <p className="text-xs text-muted-foreground">Inclusive of all charges</p>
                    </div>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(priceResult.total, priceResult.currency)}</p>
                  </div>
                  
                  <div className="space-y-2 border-t border-primary/20 pt-4">
                    {priceResult.breakdown.map((item: { label: string; amount: number }, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium">{formatCurrency(item.amount, priceResult.currency)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="mb-3 block text-sm font-medium text-foreground">Payment method</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => update('paymentMethod', 'card')}
                      className={cn(
                        optionBaseClassName,
                        form.paymentMethod === 'card' ? optionSelectedClassName : optionIdleClassName
                      )}
                    >
                      <CreditCard className="mb-2 h-5 w-5 text-primary" />
                      <p className="font-medium text-foreground">Card</p>
                    </button>
                    <button
                      onClick={() => update('paymentMethod', 'wallet')}
                      className={cn(
                        optionBaseClassName,
                        form.paymentMethod === 'wallet' ? optionSelectedClassName : optionIdleClassName
                      )}
                    >
                      <Wallet className="mb-2 h-5 w-5 text-primary" />
                      <p className="font-medium text-foreground">Wallet</p>
                      <p className="mt-1 text-sm text-muted-foreground">{formatCurrency(wallet.balanceUSD, 'USD')}</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review (International) */}
            {step === 4 && isInternational && corridor && selectedServiceData && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Review</h2>
                  <p className="text-sm text-muted-foreground">Confirm your booking</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className={reviewCardClassName}>
                    <p className={mutedLabelClassName}>Route</p>
                    <p className="mt-2 font-semibold text-foreground">{corridor.originFlag} {corridor.origin} → {corridor.destFlag} {corridor.destination}</p>
                  </div>
                  <div className={reviewCardClassName}>
                    <p className={mutedLabelClassName}>Service</p>
                    <p className="mt-2 font-semibold text-foreground">{selectedServiceData.name}</p>
                  </div>
                  <div className={reviewCardClassName}>
                    <p className={mutedLabelClassName}>Package</p>
                    <p className="mt-2 font-semibold text-foreground">
                      {form.weight} kg{priceResult.volumetricWeight > 0 && ` (vol: ${priceResult.volumetricWeight}kg)`} · {form.description || 'No description'}
                    </p>
                  </div>
                  <div className={reviewCardClassName}>
                    <p className={mutedLabelClassName}>Billable Weight</p>
                    <p className="mt-2 font-semibold text-primary">{priceResult.billableWeight} kg</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Price Breakdown</p>
                  <div className="space-y-2 rounded-xl border border-border bg-muted/30 p-4">
                    {priceResult.breakdown.map((item: { label: string; amount: number }, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium">{formatCurrency(item.amount, priceResult.currency)}</span>
                      </div>
                    ))}
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="text-xl font-bold text-primary">{formatCurrency(priceResult.total, priceResult.currency)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="mb-3 block text-sm font-medium text-foreground">Payment method</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => update('paymentMethod', 'card')}
                      className={cn(
                        optionBaseClassName,
                        form.paymentMethod === 'card' ? optionSelectedClassName : optionIdleClassName
                      )}
                    >
                      <CreditCard className="mb-2 h-5 w-5 text-primary" />
                      <p className="font-medium text-foreground">Card</p>
                    </button>
                    <button
                      onClick={() => update('paymentMethod', 'wallet')}
                      className={cn(
                        optionBaseClassName,
                        form.paymentMethod === 'wallet' ? optionSelectedClassName : optionIdleClassName
                      )}
                    >
                      <Wallet className="mb-2 h-5 w-5 text-primary" />
                      <p className="font-medium text-foreground">Wallet</p>
                      <p className="mt-1 text-sm text-muted-foreground">{formatCurrency(wallet.balanceUSD, 'USD')}</p>
                    </button>
                  </div>
                </div>
                <div className={reviewCardClassName}>
                  <p className={cn(mutedLabelClassName, 'mb-3')}>Required documents</p>
                  <div className="flex flex-wrap gap-2">
                    {corridor.docs.map(doc => (
                      <Badge key={doc} variant="secondary" className="border border-border/70 bg-background text-foreground">{doc}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className={sidebarPanelClassName}>
            <CardContent className="space-y-5 p-5">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Truck className="h-4 w-4 text-primary" />
                  {isInternational ? 'Route Summary' : 'Delivery Info'}
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {isInternational ? corridor?.summary : `Fast delivery within ${domesticRegion === 'NG' ? 'Nigeria' : domesticRegion === 'GH' ? 'Ghana' : 'Kenya'}`}
                </p>
              </div>

              {isInternational && corridor && (
                <>
                  <Separator />
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <FileText className="h-4 w-4 text-primary" />Documents
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {corridor.docs.map(doc => (
                        <Badge key={doc} variant="secondary" className="border border-border/70 bg-muted/50 text-xs text-foreground">{doc}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {!isInternational && selectedPair && (
                <>
                  <Separator />
                  <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
                    <p className={mutedLabelClassName}>Route: {fromCity} → {toCity}</p>
                    <p className="mt-2 text-2xl font-bold text-primary">{formatCurrency(priceResult.total, priceResult.currency)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Delivery: {selectedPair.days}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {step >= 2 && priceResult.total > 0 && (
            <Card className={sidebarHighlightClassName}>
              <CardContent className="p-4 space-y-3">
                <p className={mutedLabelClassName}>Estimated Total</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(priceResult.total, priceResult.currency)}</p>
                {priceResult.billableWeight > 0 && (
                  <p className="text-sm text-muted-foreground">{priceResult.billableWeight}kg billable weight</p>
                )}
                {priceResult.volumetricWeight > priceResult.actualWeight && priceResult.actualWeight > 0 && (
                  <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                    Volumetric applies
                  </Badge>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => step > 0 ? setStep(step - 1) : window.history.back()}
          className="h-11 px-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        {step < (isInternational ? 4 : 3) ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="h-11 px-6"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={async () => {
              setShipmentDetails({
                corridorId: isInternational ? intlCorridor : selectedPair?.id || '',
                serviceId: selectedService,
                weight: parseFloat(form.weight) || 1,
                length: parseFloat(dimensions.length) || undefined,
                width: parseFloat(dimensions.width) || undefined,
                height: parseFloat(dimensions.height) || undefined,
                declaredValue: parseFloat(form.declaredValue) || 0,
                isInsured: form.insured,
                description: form.description,
                shipmentType: form.shipmentType,
              })
              await handleConfirmBooking()
            }}
            disabled={isProcessing}
            className="h-11 px-6"
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Pay {formatCurrency(priceResult.total, priceResult.currency)}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

export default function NewShipmentPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-5xl p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded-xl w-1/3"></div>
          <div className="h-64 bg-muted rounded-xl"></div>
          <div className="h-48 bg-muted rounded-xl"></div>
        </div>
      </div>
    }>
      <NewShipmentContent />
    </Suspense>
  )
}
