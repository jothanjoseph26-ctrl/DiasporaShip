// lib/corridors.ts
// Single source of truth for all corridors, cities, and pricing.
// Used by the customer wizard, the entry point, and the agent counter screen.

// ── TYPES ────────────────────────────────────────────────────
export type ShipmentCategory = 'international' | 'domestic'

export type InternationalCorridorId = 'US-NG' | 'UK-GH' | 'UK-NG' | 'CN-NG' | 'US-GH' | 'US-KE'
export type DomesticCorridorId     = 'NG-DOM' | 'GH-DOM' | 'KE-DOM'
export type CorridorId             = InternationalCorridorId | DomesticCorridorId

export interface ServiceOption {
  id:         string
  name:       string
  days:       string
  priceUSD?:  number
  priceNGN?:  number
  priceGHS?:  number
  priceKES?:  number
  customs?:   number
  badge?:     string
}

export interface CityPair {
  id:       string
  from:     string
  to:       string
  region:   string
  baseNGN?: number
  baseGHS?: number
  baseKES?: number
  days:     string
}

// ── INTERNATIONAL CORRIDORS ────────────────────────────────────
export const INTERNATIONAL_CORRIDORS: Record<InternationalCorridorId, {
  origin:       string
  destination:  string
  originFlag:   string
  destFlag:     string
  label:        string
  summary:      string
  transitWindow: string
  docs:         string[]
  currency:     'USD'
  services:     ServiceOption[]
}> = {
  'US-NG': {
    origin: 'US', destination: 'NG',
    originFlag: '🇺🇸', destFlag: '🇳🇬',
    label: 'United States → Nigeria',
    summary: 'US pickup → air transit → customs clearance → Nigeria last-mile',
    transitWindow: '3–5 business days',
    docs: ['Commercial invoice', 'Packing list', 'ID verification'],
    currency: 'USD',
    services: [
      { id: 'express',  name: 'Express Air',   days: '3–5 days',   priceUSD: 165, customs: 45,  badge: 'Fastest' },
      { id: 'standard', name: 'Standard Air',  days: '5–7 days',   priceUSD: 125, customs: 35,  badge: 'Recommended' },
      { id: 'economy',  name: 'Economy',       days: '14–21 days', priceUSD: 85,  customs: 55,  badge: 'Best value' },
    ],
  },
  'UK-NG': {
    origin: 'GB', destination: 'NG',
    originFlag: '🇬🇧', destFlag: '🇳🇬',
    label: 'United Kingdom → Nigeria',
    summary: 'UK collection → air transit → Nigeria customs → last-mile delivery',
    transitWindow: '2–5 business days',
    docs: ['Commercial invoice', 'Packing list'],
    currency: 'USD',
    services: [
      { id: 'express',  name: 'Express Air',  days: '2–4 days',   priceUSD: 145, customs: 40,  badge: 'Fastest' },
      { id: 'standard', name: 'Standard Air', days: '4–6 days',   priceUSD: 110, customs: 30,  badge: 'Recommended' },
      { id: 'economy',  name: 'Economy',     days: '10–14 days', priceUSD: 75,  customs: 50,  badge: 'Best value' },
    ],
  },
  'UK-GH': {
    origin: 'GB', destination: 'GH',
    originFlag: '🇬🇧', destFlag: '🇬🇭',
    label: 'United Kingdom → Ghana',
    summary: 'UK collection → air transit → Ghana import processing → local delivery',
    transitWindow: '4–6 business days',
    docs: ['Commercial invoice', 'Packing list', 'Passport copy'],
    currency: 'USD',
    services: [
      { id: 'express',  name: 'Express Air',  days: '4–5 days',   priceUSD: 155, customs: 42,  badge: 'Fastest' },
      { id: 'standard', name: 'Standard Air', days: '5–7 days',   priceUSD: 118, customs: 32,  badge: 'Recommended' },
      { id: 'economy',  name: 'Economy',      days: '12–18 days', priceUSD: 80,  customs: 52,  badge: 'Best value' },
    ],
  },
  'CN-NG': {
    origin: 'CN', destination: 'NG',
    originFlag: '🇨🇳', destFlag: '🇳🇬',
    label: 'China → Nigeria',
    summary: 'China export → sea or air transit → Nigeria customs → destination',
    transitWindow: '5–9 business days (air)',
    docs: ['Commercial invoice', 'Bill of lading', 'Form M'],
    currency: 'USD',
    services: [
      { id: 'air',      name: 'Air Freight',  days: '5–9 days',   priceUSD: 185, customs: 65,  badge: 'Fastest' },
      { id: 'express',  name: 'Express Sea',  days: '18–22 days', priceUSD: 110, customs: 55,  badge: 'Balanced' },
      { id: 'sea',      name: 'Sea Freight',  days: '25–35 days', priceUSD: 65,  customs: 75,  badge: 'Best value' },
    ],
  },
  'US-GH': {
    origin: 'US', destination: 'GH',
    originFlag: '🇺🇸', destFlag: '🇬🇭',
    label: 'United States → Ghana',
    summary: 'US pickup → air transit → Ghana customs → local delivery',
    transitWindow: '4–8 business days',
    docs: ['Commercial invoice', 'Packing list'],
    currency: 'USD',
    services: [
      { id: 'express',  name: 'Express Air',  days: '4–6 days',   priceUSD: 170, customs: 48,  badge: 'Fastest' },
      { id: 'standard', name: 'Standard Air', days: '6–8 days',   priceUSD: 130, customs: 38,  badge: 'Recommended' },
      { id: 'economy',  name: 'Economy',      days: '14–21 days', priceUSD: 90,  customs: 58,  badge: 'Best value' },
    ],
  },
  'US-KE': {
    origin: 'US', destination: 'KE',
    originFlag: '🇺🇸', destFlag: '🇰🇪',
    label: 'United States → Kenya',
    summary: 'US pickup → air transit → Nairobi customs → last-mile',
    transitWindow: '5–9 business days',
    docs: ['Commercial invoice', 'Packing list'],
    currency: 'USD',
    services: [
      { id: 'express',  name: 'Express Air',  days: '5–7 days',   priceUSD: 175, customs: 50,  badge: 'Fastest' },
      { id: 'standard', name: 'Standard Air', days: '7–9 days',   priceUSD: 135, customs: 40,  badge: 'Recommended' },
      { id: 'economy',  name: 'Economy',      days: '16–22 days', priceUSD: 95,  customs: 60,  badge: 'Best value' },
    ],
  },
}

// ── DOMESTIC — NIGERIAN CITY PAIRS ────────────────────────────
export const NIGERIA_CITIES = [
  'Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan',
  'Benin City', 'Enugu', 'Kaduna', 'Owerri', 'Calabar',
  'Warri', 'Jos', 'Ilorin', 'Uyo', 'Abeokuta',
]

export const NIGERIA_CITY_PAIRS: CityPair[] = [
  { id: 'lag-abj',  from: 'Lagos',          to: 'Abuja',          region: 'NG', baseNGN: 4500,  days: '1–2 days' },
  { id: 'lag-ph',   from: 'Lagos',          to: 'Port Harcourt', region: 'NG', baseNGN: 5000,  days: '1–2 days' },
  { id: 'lag-kan',  from: 'Lagos',          to: 'Kano',           region: 'NG', baseNGN: 5500,  days: '2–3 days' },
  { id: 'lag-enu',  from: 'Lagos',          to: 'Enugu',          region: 'NG', baseNGN: 4800,  days: '1–2 days' },
  { id: 'lag-owi',  from: 'Lagos',          to: 'Owerri',         region: 'NG', baseNGN: 4200,  days: '1–2 days' },
  { id: 'abj-ph',   from: 'Abuja',          to: 'Port Harcourt', region: 'NG', baseNGN: 5200,  days: '1–2 days' },
  { id: 'abj-kan',  from: 'Abuja',          to: 'Kano',          region: 'NG', baseNGN: 3800,  days: '1 day'   },
  { id: 'abj-lag',  from: 'Abuja',          to: 'Lagos',          region: 'NG', baseNGN: 4500,  days: '1–2 days' },
  { id: 'ph-lag',   from: 'Port Harcourt',  to: 'Lagos',          region: 'NG', baseNGN: 5000,  days: '1–2 days' },
  { id: 'ph-abj',   from: 'Port Harcourt',  to: 'Abuja',          region: 'NG', baseNGN: 5200,  days: '1–2 days' },
  { id: 'kan-lag',  from: 'Kano',           to: 'Lagos',          region: 'NG', baseNGN: 5500,  days: '2–3 days' },
  { id: 'war-lag',  from: 'Warri',          to: 'Lagos',          region: 'NG', baseNGN: 4000,  days: '1–2 days' },
  { id: 'cal-lag',  from: 'Calabar',        to: 'Lagos',          region: 'NG', baseNGN: 5000,  days: '1–2 days' },
  { id: 'enu-lag',  from: 'Enugu',          to: 'Lagos',          region: 'NG', baseNGN: 4800,  days: '1–2 days' },
  { id: 'ibd-lag',  from: 'Ibadan',         to: 'Lagos',          region: 'NG', baseNGN: 2500,  days: 'Same day' },
  { id: 'ibd-abj',  from: 'Ibadan',         to: 'Abuja',          region: 'NG', baseNGN: 4200,  days: '1–2 days' },
]

// ── DOMESTIC — GHANA CITY PAIRS ───────────────────────────────
export const GHANA_CITIES = ['Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Cape Coast', 'Sunyani']

export const GHANA_CITY_PAIRS: CityPair[] = [
  { id: 'acc-kum', from: 'Accra',    to: 'Kumasi',   region: 'GH', baseGHS: 120, days: '1 day'    },
  { id: 'acc-tam', from: 'Accra',    to: 'Tamale',   region: 'GH', baseGHS: 180, days: '1–2 days' },
  { id: 'acc-tak', from: 'Accra',    to: 'Takoradi', region: 'GH', baseGHS: 100, days: '1 day'    },
  { id: 'kum-acc', from: 'Kumasi',   to: 'Accra',    region: 'GH', baseGHS: 120, days: '1 day'    },
  { id: 'kum-tam', from: 'Kumasi',   to: 'Tamale',   region: 'GH', baseGHS: 130, days: '1 day'    },
  { id: 'tak-acc', from: 'Takoradi', to: 'Accra',    region: 'GH', baseGHS: 100, days: '1 day'    },
]

// ── DOMESTIC — KENYA CITY PAIRS ───────────────────────────────
export const KENYA_CITIES = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika']

export const KENYA_CITY_PAIRS: CityPair[] = [
  { id: 'nai-mom', from: 'Nairobi', to: 'Mombasa', region: 'KE', baseKES: 850,  days: '1 day'    },
  { id: 'nai-kis', from: 'Nairobi', to: 'Kisumu',  region: 'KE', baseKES: 900,  days: '1–2 days' },
  { id: 'nai-eld', from: 'Nairobi', to: 'Eldoret', region: 'KE', baseKES: 950,  days: '1–2 days' },
  { id: 'nai-nak', from: 'Nairobi', to: 'Nakuru',  region: 'KE', baseKES: 600,  days: 'Same day' },
  { id: 'mom-nai', from: 'Mombasa', to: 'Nairobi', region: 'KE', baseKES: 850,  days: '1 day'    },
  { id: 'kis-nai', from: 'Kisumu',  to: 'Nairobi', region: 'KE', baseKES: 900,  days: '1–2 days' },
]

// ── DOMESTIC PRICING CALCULATOR ───────────────────────────────
export function calcDomesticPrice(pair: CityPair, weightKg: number): number {
  const w = Math.max(1, weightKg)
  const extra = Math.max(0, w - 1)
  if (pair.baseNGN) return pair.baseNGN + extra * 250
  if (pair.baseGHS) return pair.baseGHS + extra * 12
  if (pair.baseKES) return pair.baseKES + extra * 80
  return 0
}

export function domesticCurrency(region: string): string {
  if (region === 'NG') return 'NGN'
  if (region === 'GH') return 'GHS'
  if (region === 'KE') return 'KES'
  return 'NGN'
}

// ── SHIPMENT TYPES ────────────────────────────────────────────
export const SHIPMENT_TYPES = [
  { value: 'parcel',   label: 'Parcel',   desc: 'Boxes and packages' },
  { value: 'document', label: 'Document', desc: 'Papers, contracts' },
  { value: 'cargo',    label: 'Cargo',    desc: 'Bulk or palletised' },
  { value: 'fragile',  label: 'Fragile',  desc: 'Requires special care' },
]

// ── HELPER: Get all city pairs by region ─────────────────────
export function getCityPairsByRegion(region: 'NG' | 'GH' | 'KE'): CityPair[] {
  switch (region) {
    case 'NG': return NIGERIA_CITY_PAIRS
    case 'GH': return GHANA_CITY_PAIRS
    case 'KE': return KENYA_CITY_PAIRS
  }
}

export function getCitiesByRegion(region: 'NG' | 'GH' | 'KE'): string[] {
  switch (region) {
    case 'NG': return NIGERIA_CITIES
    case 'GH': return GHANA_CITIES
    case 'KE': return KENYA_CITIES
  }
}
