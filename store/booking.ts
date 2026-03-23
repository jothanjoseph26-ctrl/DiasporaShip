import { create } from 'zustand'
import type { PriceCalculationResult } from '@/types/pricing'
import type { Address } from '@/types'

export interface BookingQuote {
  id: string
  corridorId: string
  serviceId: string
  serviceName: string
  actualWeight: number
  volumetricWeight: number
  billableWeight: number
  baseFreight: number
  fuelSurcharge: number
  customsDuties: number
  insurance: number
  vat: number
  subtotal: number
  total: number
  currency: string
  breakdown: { label: string; amount: number }[]
  calculatedAt: string
}

export interface BookingConfirmation {
  trackingNumber: string
  status: 'confirmed' | 'pending_payment' | 'failed'
  shipmentId?: string
  paymentStatus: 'paid' | 'pending' | 'failed'
  walletBalanceAfter?: number
  estimatedDelivery?: string
  createdAt: string
}

interface BookingState {
  currentQuote: BookingQuote | null
  shipmentDetails: {
    corridorId: string
    serviceId: string
    weight: number
    length?: number
    width?: number
    height?: number
    declaredValue: number
    isInsured: boolean
    description: string
    shipmentType: string
  } | null
  pickupAddress: Address | null
  deliveryAddress: Address | null
  confirmation: BookingConfirmation | null
  isProcessing: boolean
  error: string | null

  addresses: Address[]
  
  setQuote: (quote: BookingQuote) => void
  setShipmentDetails: (details: BookingState['shipmentDetails']) => void
  setPickupAddress: (address: Address | null) => void
  setDeliveryAddress: (address: Address | null) => void
  setAddresses: (addresses: Address[]) => void
  addAddress: (address: Address) => void
  clearBooking: () => void
  
  processPayment: (params: {
    walletId?: string
    paymentMethod: 'wallet' | 'card'
    userId: string
    userEmail: string
    userPhone: string
  }) => Promise<BookingConfirmation>
  fetchAddresses: (userId: string) => Promise<void>
  saveAddress: (address: Omit<Address, 'id'>) => Promise<Address | null>
}

export const useBookingStore = create<BookingState>((set, get) => ({
  currentQuote: null,
  shipmentDetails: null,
  pickupAddress: null,
  deliveryAddress: null,
  confirmation: null,
  isProcessing: false,
  error: null,
  addresses: [],

  setQuote: (quote) => set({ currentQuote: quote }),
  setShipmentDetails: (details) => set({ shipmentDetails: details }),
  setPickupAddress: (address) => set({ pickupAddress: address }),
  setDeliveryAddress: (address) => set({ deliveryAddress: address }),
  setAddresses: (addresses) => set({ addresses }),
  addAddress: (address) => set(state => ({ addresses: [...state.addresses, address] })),
  
  clearBooking: () => set({ 
    currentQuote: null, 
    shipmentDetails: null,
    pickupAddress: null,
    deliveryAddress: null,
    confirmation: null,
    error: null,
  }),

  fetchAddresses: async (userId: string) => {
    try {
      const res = await fetch(`/api/addresses?userId=${userId}`)
      const data = await res.json()
      set({ addresses: data.addresses || [] })
      
      const pickup = data.addresses?.find((a: Address) => a.isDefaultPickup)
      const delivery = data.addresses?.find((a: Address) => a.isDefaultDelivery)
      
      if (pickup) set({ pickupAddress: pickup })
      if (delivery) set({ deliveryAddress: delivery })
    } catch {
      console.error('Failed to fetch addresses')
    }
  },

  saveAddress: async (addressData) => {
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressData),
      })
      const data = await res.json()
      
      if (data.success) {
        get().addAddress(data.address)
        return data.address
      }
      return null
    } catch {
      return null
    }
  },

  processPayment: async (params) => {
    const { currentQuote, shipmentDetails, pickupAddress, deliveryAddress } = get()
    
    if (!currentQuote || !shipmentDetails) {
      set({ error: 'Missing booking data' })
      return { trackingNumber: '', status: 'failed' as const, paymentStatus: 'failed' as const, createdAt: '' }
    }

    set({ isProcessing: true, error: null })

    try {
      if (params.paymentMethod === 'wallet') {
        const walletRes = await fetch('/api/wallet', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: currentQuote.total,
            currency: currentQuote.currency,
            shipmentId: `s${Date.now()}`,
            trackingNumber: `DS-${Date.now()}`,
          }),
        })
        
        const walletData = await walletRes.json()
        
        if (!walletData.success) {
          set({ error: walletData.error || 'Payment failed', isProcessing: false })
          return { 
            trackingNumber: '', 
            status: 'pending_payment' as const, 
            paymentStatus: 'failed' as const, 
            createdAt: new Date().toISOString() 
          }
        }

        const shipmentRes = await fetch('/api/shipments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: params.userId,
            corridor: currentQuote.corridorId,
            serviceType: currentQuote.serviceId,
            weightKg: shipmentDetails.weight,
            lengthCm: shipmentDetails.length,
            widthCm: shipmentDetails.width,
            heightCm: shipmentDetails.height,
            volumetricWeightKg: currentQuote.volumetricWeight,
            chargeableWeightKg: currentQuote.billableWeight,
            declaredValue: shipmentDetails.declaredValue,
            currency: currentQuote.currency,
            packageDescription: shipmentDetails.description,
            isInsured: shipmentDetails.isInsured,
            insuranceCost: currentQuote.insurance,
            shippingCost: currentQuote.baseFreight,
            customsDuties: currentQuote.customsDuties,
            totalCost: currentQuote.total,
            paymentMethod: 'wallet',
            paymentStatus: 'paid',
            pickupDate: new Date().toISOString(),
            estimatedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            pickupAddress,
            deliveryAddress,
          }),
        })
        
        const shipmentData = await shipmentRes.json()

        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: params.userId,
            userEmail: params.userEmail,
            userPhone: params.userPhone,
            trackingNumber: shipmentData.shipment?.trackingNumber,
            route: `${pickupAddress?.city || 'Origin'} → ${deliveryAddress?.city || 'Destination'}`,
            total: currentQuote.total,
            currency: currentQuote.currency,
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          }),
        })

        const confirmation: BookingConfirmation = {
          trackingNumber: shipmentData.shipment?.trackingNumber || `DS-${Date.now()}`,
          status: 'confirmed',
          shipmentId: shipmentData.shipment?.id,
          paymentStatus: 'paid',
          walletBalanceAfter: walletData.wallet?.[currentQuote.currency] || 0,
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          createdAt: new Date().toISOString(),
        }
        
        set({ confirmation, isProcessing: false })
        return confirmation
      }
      
      return { 
        trackingNumber: `DS-${Date.now()}`, 
        status: 'pending_payment' as const, 
        paymentStatus: 'pending' as const, 
        createdAt: new Date().toISOString() 
      }
    } catch (err) {
      set({ error: 'Payment processing failed', isProcessing: false })
      return { 
        trackingNumber: '', 
        status: 'failed' as const, 
        paymentStatus: 'failed' as const, 
        createdAt: new Date().toISOString() 
      }
    }
  },
}))
