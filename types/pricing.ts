export type RateType = 'per_kg' | 'flat' | 'tiered'
export type SurchargeType = 'percentage' | 'fixed'

export interface InternationalRate {
  corridorId: string
  origin: string
  destination: string
  currency: 'USD'
  services: ServiceRate[]
  volumetricDivisor: number
  minCharge: number
  fuelSurchargePercent: number
  effectiveFrom: string
  updatedAt: string
  updatedBy: string
}

export interface ServiceRate {
  id: string
  name: string
  type: 'express' | 'standard' | 'economy' | 'air' | 'sea'
  basePerKg: number
  customsFixed: number
  transitDays: string
  badge?: string
}

export interface DomesticRate {
  corridorId: string
  region: 'NG' | 'GH' | 'KE'
  fromCity: string
  toCity: string
  currency: 'NGN' | 'GHS' | 'KES'
  basePrice: number
  perKgExtra: number
  minCharge: number
  volumetricDivisor: number
  effectiveFrom: string
  updatedAt: string
  updatedBy: string
}

export interface PricingAuditLog {
  id: string
  corridorId: string
  field: string
  oldValue: string
  newValue: string
  changedBy: string
  changedAt: string
}

export interface PriceCalculationResult {
  actualWeight: number
  volumetricWeight: number
  billableWeight: number
  baseFreight: number
  fuelSurcharge: number
  customsDuties: number
  insurance: number
  vat: number
  total: number
  currency: string
  breakdown: {
    label: string
    amount: number
  }[]
}
