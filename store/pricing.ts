import { create } from 'zustand'
import type { InternationalRate, DomesticRate, PriceCalculationResult, PricingAuditLog } from '@/types/pricing'
import { NIGERIA_CITY_PAIRS, GHANA_CITY_PAIRS, KENYA_CITY_PAIRS } from '@/lib/corridors'

function calcVolumetricWeight(length: number, width: number, height: number, divisor: number): number {
  return (length * width * height) / divisor
}

export function calculatePrice(params: {
  corridorId: string
  actualWeight: number
  lengthCm?: number
  widthCm?: number
  heightCm?: number
  serviceId?: string
  declaredValue?: number
  isInsured?: boolean
  rates?: {
    international?: InternationalRate[]
    domestic?: DomesticRate[]
  }
}): PriceCalculationResult {
  const { corridorId, actualWeight, lengthCm, widthCm, heightCm, serviceId, declaredValue = 0, isInsured = false } = params
  const intlRates = params.rates?.international || DEFAULT_INTERNATIONAL_RATES
  const domRates = params.rates?.domestic || DEFAULT_DOMESTIC_RATES
  
  const intlRate = intlRates.find(r => r.corridorId === corridorId)
  const domRate = domRates.find(r => r.corridorId === corridorId)
  
  if (intlRate) {
    const service = serviceId 
      ? intlRate.services.find(s => s.id === serviceId)
      : intlRate.services[1]
    
    if (!service) {
      return { actualWeight: 0, volumetricWeight: 0, billableWeight: 0, baseFreight: 0, fuelSurcharge: 0, customsDuties: 0, insurance: 0, vat: 0, total: 0, currency: 'USD', breakdown: [] }
    }

    const volumetricWeight = (lengthCm && widthCm && heightCm) 
      ? calcVolumetricWeight(lengthCm, widthCm, heightCm, intlRate.volumetricDivisor)
      : 0
    
    const billableWeight = Math.max(actualWeight, volumetricWeight)
    const baseFreight = billableWeight * service.basePerKg
    const fuelSurcharge = baseFreight * (intlRate.fuelSurchargePercent / 100)
    const customsDuties = service.customsFixed
    const insurance = isInsured ? Math.max(10, declaredValue * 0.015) : 0
    const subtotal = baseFreight + fuelSurcharge + customsDuties + insurance
    const vat = subtotal * 0.075
    const total = Math.max(intlRate.minCharge, subtotal + vat)

    return {
      actualWeight,
      volumetricWeight: Math.round(volumetricWeight * 100) / 100,
      billableWeight: Math.round(billableWeight * 100) / 100,
      baseFreight: Math.round(baseFreight * 100) / 100,
      fuelSurcharge: Math.round(fuelSurcharge * 100) / 100,
      customsDuties,
      insurance: Math.round(insurance * 100) / 100,
      vat: Math.round(vat * 100) / 100,
      total: Math.round(total * 100) / 100,
      currency: 'USD',
      breakdown: [
        { label: 'Base freight', amount: baseFreight },
        { label: 'Fuel surcharge', amount: fuelSurcharge },
        { label: 'Customs duties', amount: customsDuties },
        ...(insurance > 0 ? [{ label: 'Insurance (1.5%)', amount: insurance }] : []),
        { label: 'VAT (7.5%)', amount: vat },
      ],
    }
  }

  if (domRate) {
    const extraKg = Math.max(0, actualWeight - 1)
    const baseFreight = domRate.basePrice + extraKg * domRate.perKgExtra
    const total = Math.max(domRate.minCharge, baseFreight)

    console.log('[PRICING] Domestic rate found:', domRate.corridorId, 'base:', domRate.basePrice, 'extra:', extraKg, 'total:', total)

    return {
      actualWeight,
      volumetricWeight: 0,
      billableWeight: actualWeight,
      baseFreight,
      fuelSurcharge: 0,
      customsDuties: 0,
      insurance: 0,
      vat: 0,
      total,
      currency: domRate.currency,
      breakdown: [
        { label: 'Base rate', amount: domRate.basePrice },
        ...(extraKg > 0 ? [{ label: `Extra weight (${extraKg.toFixed(1)}kg)`, amount: extraKg * domRate.perKgExtra }] : []),
      ],
    }
  }

  console.log('[PRICING] Corridor not found in rates, trying fallback. Looking for:', corridorId)
  console.log('[PRICING] Available corridorIds in domRates:', domRates.map(r => r.corridorId).join(', '))
  
  const allCityPairs = [...NIGERIA_CITY_PAIRS, ...GHANA_CITY_PAIRS, ...KENYA_CITY_PAIRS]
  const cityPair = allCityPairs.find(p => p.id === corridorId)
  console.log('[PRICING] City pair fallback:', cityPair ? `Found: ${cityPair.from} → ${cityPair.to}` : 'Not found')
  
  if (cityPair) {
    let basePrice = 0
    let perKgExtra = 250
    let currency = 'NGN'
    
    if ('baseNGN' in cityPair && cityPair.baseNGN) {
      basePrice = cityPair.baseNGN
      perKgExtra = 250
      currency = 'NGN'
    } else if ('baseGHS' in cityPair && cityPair.baseGHS) {
      basePrice = cityPair.baseGHS
      perKgExtra = 12
      currency = 'GHS'
    } else if ('baseKES' in cityPair && cityPair.baseKES) {
      basePrice = cityPair.baseKES
      perKgExtra = 80
      currency = 'KES'
    }
    
    const extraKg = Math.max(0, actualWeight - 1)
    const total = basePrice + extraKg * perKgExtra
    
    return {
      actualWeight,
      volumetricWeight: 0,
      billableWeight: actualWeight,
      baseFreight: basePrice,
      fuelSurcharge: 0,
      customsDuties: 0,
      insurance: 0,
      vat: 0,
      total,
      currency,
      breakdown: [
        { label: 'Base rate', amount: basePrice },
        ...(extraKg > 0 ? [{ label: `Extra weight (${extraKg.toFixed(1)}kg)`, amount: extraKg * perKgExtra }] : []),
      ],
    }
  }

  return { actualWeight: 0, volumetricWeight: 0, billableWeight: 0, baseFreight: 0, fuelSurcharge: 0, customsDuties: 0, insurance: 0, vat: 0, total: 0, currency: 'USD', breakdown: [] }
}

interface PricingState {
  internationalRates: InternationalRate[]
  domesticRates: DomesticRate[]
  auditLog: PricingAuditLog[]
  
  updateInternationalRate: (corridorId: string, serviceId: string, field: string, value: number) => void
  updateDomesticRate: (corridorId: string, field: string, value: number) => void
  getRateByCorridor: (corridorId: string) => InternationalRate | DomesticRate | undefined
  calculatePrice: (params: {
    corridorId: string
    actualWeight: number
    lengthCm?: number
    widthCm?: number
    heightCm?: number
    serviceId?: string
    declaredValue?: number
    isInsured?: boolean
  }) => PriceCalculationResult
}

const DEFAULT_INTERNATIONAL_RATES: InternationalRate[] = [
  {
    corridorId: 'US-NG',
    origin: 'US',
    destination: 'NG',
    currency: 'USD',
    volumetricDivisor: 5000,
    minCharge: 85,
    fuelSurchargePercent: 8,
    effectiveFrom: '2026-01-01',
    updatedAt: '2026-03-01',
    updatedBy: 'admin@logix.com',
    services: [
      { id: 'express', name: 'Express Air', type: 'express', basePerKg: 12, customsFixed: 45, transitDays: '3-5 days', badge: 'Fastest' },
      { id: 'standard', name: 'Standard Air', type: 'standard', basePerKg: 8, customsFixed: 35, transitDays: '5-7 days', badge: 'Recommended' },
      { id: 'economy', name: 'Economy', type: 'economy', basePerKg: 5, customsFixed: 55, transitDays: '14-21 days', badge: 'Best value' },
    ],
  },
  {
    corridorId: 'UK-NG',
    origin: 'GB',
    destination: 'NG',
    currency: 'USD',
    volumetricDivisor: 5000,
    minCharge: 75,
    fuelSurchargePercent: 8,
    effectiveFrom: '2026-01-01',
    updatedAt: '2026-03-01',
    updatedBy: 'admin@logix.com',
    services: [
      { id: 'express', name: 'Express Air', type: 'express', basePerKg: 11, customsFixed: 40, transitDays: '2-4 days', badge: 'Fastest' },
      { id: 'standard', name: 'Standard Air', type: 'standard', basePerKg: 7, customsFixed: 30, transitDays: '4-6 days', badge: 'Recommended' },
      { id: 'economy', name: 'Economy', type: 'economy', basePerKg: 4.5, customsFixed: 50, transitDays: '10-14 days', badge: 'Best value' },
    ],
  },
  {
    corridorId: 'UK-GH',
    origin: 'GB',
    destination: 'GH',
    currency: 'USD',
    volumetricDivisor: 5000,
    minCharge: 80,
    fuelSurchargePercent: 8,
    effectiveFrom: '2026-01-01',
    updatedAt: '2026-03-01',
    updatedBy: 'admin@logix.com',
    services: [
      { id: 'express', name: 'Express Air', type: 'express', basePerKg: 12.5, customsFixed: 42, transitDays: '4-5 days', badge: 'Fastest' },
      { id: 'standard', name: 'Standard Air', type: 'standard', basePerKg: 8.5, customsFixed: 32, transitDays: '5-7 days', badge: 'Recommended' },
      { id: 'economy', name: 'Economy', type: 'economy', basePerKg: 5, customsFixed: 52, transitDays: '12-18 days', badge: 'Best value' },
    ],
  },
  {
    corridorId: 'CN-NG',
    origin: 'CN',
    destination: 'NG',
    currency: 'USD',
    volumetricDivisor: 6000,
    minCharge: 65,
    fuelSurchargePercent: 10,
    effectiveFrom: '2026-01-01',
    updatedAt: '2026-03-01',
    updatedBy: 'admin@logix.com',
    services: [
      { id: 'air', name: 'Air Freight', type: 'air', basePerKg: 14, customsFixed: 65, transitDays: '5-9 days', badge: 'Fastest' },
      { id: 'express', name: 'Express Sea', type: 'express', basePerKg: 7, customsFixed: 55, transitDays: '18-22 days', badge: 'Balanced' },
      { id: 'sea', name: 'Sea Freight', type: 'sea', basePerKg: 3.5, customsFixed: 75, transitDays: '25-35 days', badge: 'Best value' },
    ],
  },
  {
    corridorId: 'US-GH',
    origin: 'US',
    destination: 'GH',
    currency: 'USD',
    volumetricDivisor: 5000,
    minCharge: 90,
    fuelSurchargePercent: 8,
    effectiveFrom: '2026-01-01',
    updatedAt: '2026-03-01',
    updatedBy: 'admin@logix.com',
    services: [
      { id: 'express', name: 'Express Air', type: 'express', basePerKg: 13, customsFixed: 48, transitDays: '4-6 days', badge: 'Fastest' },
      { id: 'standard', name: 'Standard Air', type: 'standard', basePerKg: 9, customsFixed: 38, transitDays: '6-8 days', badge: 'Recommended' },
      { id: 'economy', name: 'Economy', type: 'economy', basePerKg: 5.5, customsFixed: 58, transitDays: '14-21 days', badge: 'Best value' },
    ],
  },
  {
    corridorId: 'US-KE',
    origin: 'US',
    destination: 'KE',
    currency: 'USD',
    volumetricDivisor: 5000,
    minCharge: 95,
    fuelSurchargePercent: 9,
    effectiveFrom: '2026-01-01',
    updatedAt: '2026-03-01',
    updatedBy: 'admin@logix.com',
    services: [
      { id: 'express', name: 'Express Air', type: 'express', basePerKg: 13.5, customsFixed: 50, transitDays: '5-7 days', badge: 'Fastest' },
      { id: 'standard', name: 'Standard Air', type: 'standard', basePerKg: 9.5, customsFixed: 40, transitDays: '7-9 days', badge: 'Recommended' },
      { id: 'economy', name: 'Economy', type: 'economy', basePerKg: 6, customsFixed: 60, transitDays: '16-22 days', badge: 'Best value' },
    ],
  },
]

const DEFAULT_DOMESTIC_RATES: DomesticRate[] = [
  // Nigeria routes (matching NIGERIA_CITY_PAIRS from corridors.ts)
  { corridorId: 'lag-abj', region: 'NG', fromCity: 'Lagos', toCity: 'Abuja', currency: 'NGN', basePrice: 4500, perKgExtra: 250, minCharge: 2500, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'lag-ph', region: 'NG', fromCity: 'Lagos', toCity: 'Port Harcourt', currency: 'NGN', basePrice: 5000, perKgExtra: 250, minCharge: 3000, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'lag-kan', region: 'NG', fromCity: 'Lagos', toCity: 'Kano', currency: 'NGN', basePrice: 5500, perKgExtra: 250, minCharge: 3500, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'lag-enu', region: 'NG', fromCity: 'Lagos', toCity: 'Enugu', currency: 'NGN', basePrice: 4800, perKgExtra: 250, minCharge: 2800, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'lag-owi', region: 'NG', fromCity: 'Lagos', toCity: 'Owerri', currency: 'NGN', basePrice: 4200, perKgExtra: 250, minCharge: 2500, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'abj-ph', region: 'NG', fromCity: 'Abuja', toCity: 'Port Harcourt', currency: 'NGN', basePrice: 5200, perKgExtra: 250, minCharge: 3200, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'abj-kan', region: 'NG', fromCity: 'Abuja', toCity: 'Kano', currency: 'NGN', basePrice: 3800, perKgExtra: 250, minCharge: 2200, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'abj-lag', region: 'NG', fromCity: 'Abuja', toCity: 'Lagos', currency: 'NGN', basePrice: 4500, perKgExtra: 250, minCharge: 2500, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'ph-lag', region: 'NG', fromCity: 'Port Harcourt', toCity: 'Lagos', currency: 'NGN', basePrice: 5000, perKgExtra: 250, minCharge: 3000, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'ph-abj', region: 'NG', fromCity: 'Port Harcourt', toCity: 'Abuja', currency: 'NGN', basePrice: 5200, perKgExtra: 250, minCharge: 3200, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'kan-lag', region: 'NG', fromCity: 'Kano', toCity: 'Lagos', currency: 'NGN', basePrice: 5500, perKgExtra: 250, minCharge: 3500, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'war-lag', region: 'NG', fromCity: 'Warri', toCity: 'Lagos', currency: 'NGN', basePrice: 4000, perKgExtra: 250, minCharge: 2500, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'cal-lag', region: 'NG', fromCity: 'Calabar', toCity: 'Lagos', currency: 'NGN', basePrice: 5000, perKgExtra: 250, minCharge: 3000, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'enu-lag', region: 'NG', fromCity: 'Enugu', toCity: 'Lagos', currency: 'NGN', basePrice: 4800, perKgExtra: 250, minCharge: 2800, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'ibd-lag', region: 'NG', fromCity: 'Ibadan', toCity: 'Lagos', currency: 'NGN', basePrice: 2500, perKgExtra: 200, minCharge: 1500, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'ibd-abj', region: 'NG', fromCity: 'Ibadan', toCity: 'Abuja', currency: 'NGN', basePrice: 4200, perKgExtra: 250, minCharge: 2500, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  // Ghana routes
  { corridorId: 'acc-kum', region: 'GH', fromCity: 'Accra', toCity: 'Kumasi', currency: 'GHS', basePrice: 120, perKgExtra: 12, minCharge: 80, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'acc-tam', region: 'GH', fromCity: 'Accra', toCity: 'Tamale', currency: 'GHS', basePrice: 180, perKgExtra: 12, minCharge: 120, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'acc-tak', region: 'GH', fromCity: 'Accra', toCity: 'Takoradi', currency: 'GHS', basePrice: 100, perKgExtra: 12, minCharge: 70, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'kum-acc', region: 'GH', fromCity: 'Kumasi', toCity: 'Accra', currency: 'GHS', basePrice: 120, perKgExtra: 12, minCharge: 80, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'kum-tam', region: 'GH', fromCity: 'Kumasi', toCity: 'Tamale', currency: 'GHS', basePrice: 130, perKgExtra: 12, minCharge: 90, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'tak-acc', region: 'GH', fromCity: 'Takoradi', toCity: 'Accra', currency: 'GHS', basePrice: 100, perKgExtra: 12, minCharge: 70, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  // Kenya routes
  { corridorId: 'nai-mom', region: 'KE', fromCity: 'Nairobi', toCity: 'Mombasa', currency: 'KES', basePrice: 850, perKgExtra: 80, minCharge: 600, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'nai-kis', region: 'KE', fromCity: 'Nairobi', toCity: 'Kisumu', currency: 'KES', basePrice: 900, perKgExtra: 80, minCharge: 650, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'nai-eld', region: 'KE', fromCity: 'Nairobi', toCity: 'Eldoret', currency: 'KES', basePrice: 950, perKgExtra: 80, minCharge: 700, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'nai-nak', region: 'KE', fromCity: 'Nairobi', toCity: 'Nakuru', currency: 'KES', basePrice: 600, perKgExtra: 80, minCharge: 450, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'mom-nai', region: 'KE', fromCity: 'Mombasa', toCity: 'Nairobi', currency: 'KES', basePrice: 850, perKgExtra: 80, minCharge: 600, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
  { corridorId: 'kis-nai', region: 'KE', fromCity: 'Kisumu', toCity: 'Nairobi', currency: 'KES', basePrice: 900, perKgExtra: 80, minCharge: 650, volumetricDivisor: 4000, effectiveFrom: '2026-01-01', updatedAt: '2026-03-01', updatedBy: 'admin@logix.com' },
]

const MOCK_AUDIT_LOG: PricingAuditLog[] = [
  { id: 'log-1', corridorId: 'US-NG', field: 'services.0.basePerKg', oldValue: '10', newValue: '12', changedBy: 'admin@logix.com', changedAt: '2026-03-15T10:30:00Z' },
  { id: 'log-2', corridorId: 'US-NG', field: 'fuelSurchargePercent', oldValue: '6', newValue: '8', changedBy: 'admin@logix.com', changedAt: '2026-03-10T14:20:00Z' },
  { id: 'log-3', corridorId: 'lag-abj', field: 'basePrice', oldValue: '4000', newValue: '4500', changedBy: 'admin@logix.com', changedAt: '2026-03-01T09:00:00Z' },
]

export const usePricingStore = create<PricingState>((set, get) => ({
  internationalRates: DEFAULT_INTERNATIONAL_RATES,
  domesticRates: DEFAULT_DOMESTIC_RATES,
  auditLog: MOCK_AUDIT_LOG,

  updateInternationalRate: (corridorId, serviceId, field, value) => {
    set(state => ({
      internationalRates: state.internationalRates.map(corridor => {
        if (corridor.corridorId !== corridorId) return corridor
        return {
          ...corridor,
          services: corridor.services.map(service => {
            if (service.id !== serviceId) return service
            return { ...service, [field]: value }
          }),
          updatedAt: new Date().toISOString(),
          updatedBy: 'admin@logix.com',
        }
      }),
      auditLog: [...state.auditLog, {
        id: `log-${Date.now()}`,
        corridorId,
        field: `services.${serviceId}.${field}`,
        oldValue: '',
        newValue: String(value),
        changedBy: 'admin@logix.com',
        changedAt: new Date().toISOString(),
      }],
    }))
  },

  updateDomesticRate: (corridorId, field, value) => {
    set(state => ({
      domesticRates: state.domesticRates.map(rate => {
        if (rate.corridorId !== corridorId) return rate
        return { ...rate, [field]: value, updatedAt: new Date().toISOString(), updatedBy: 'admin@logix.com' }
      }),
    }))
  },

  getRateByCorridor: (corridorId) => {
    const state = get()
    return state.internationalRates.find(r => r.corridorId === corridorId) 
        || state.domesticRates.find(r => r.corridorId === corridorId)
  },

  calculatePrice: (params) => {
    const state = get()
    return calculatePrice({
      ...params,
      rates: {
        international: state.internationalRates,
        domestic: state.domesticRates,
      }
    })
  },
}))
