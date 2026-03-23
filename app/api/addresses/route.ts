import type { NextRequest } from 'next/server'

interface Address {
  id: string
  userId: string
  label: string
  type: 'residential' | 'commercial' | 'warehouse' | 'port'
  recipientName: string
  recipientPhone: string
  addressLine1: string
  addressLine2?: string
  city: string
  stateProvince: string
  postalCode: string
  country: string
  lat?: number
  lng?: number
  isDefaultPickup: boolean
  isDefaultDelivery: boolean
  createdAt: string
}

const addresses: Map<string, Address[]> = new Map([
  ['u1', [
    {
      id: 'a1',
      userId: 'u1',
      label: 'My Warehouse',
      type: 'warehouse',
      recipientName: 'John Okafor',
      recipientPhone: '+12345551234',
      addressLine1: '123 Commerce St',
      addressLine2: 'Suite 400',
      city: 'Atlanta',
      stateProvince: 'GA',
      postalCode: '30301',
      country: 'US',
      isDefaultPickup: true,
      isDefaultDelivery: false,
      createdAt: '2024-01-15T00:00:00Z',
    },
    {
      id: 'a2',
      userId: 'u1',
      label: 'Office Delivery',
      type: 'commercial',
      recipientName: 'Emmanuel Okafor',
      recipientPhone: '+2348012345678',
      addressLine1: '15 Admiralty Way',
      addressLine2: 'Lekki Phase 1',
      city: 'Lagos',
      stateProvince: 'Lagos',
      postalCode: '10176',
      country: 'NG',
      isDefaultPickup: false,
      isDefaultDelivery: true,
      createdAt: '2024-01-15T00:00:00Z',
    },
  ]],
])

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || 'u1'
  const type = searchParams.get('type')
  
  let userAddresses = addresses.get(userId) || []
  
  if (type === 'pickup') {
    userAddresses = userAddresses.filter(a => a.isDefaultPickup || a.type === 'warehouse')
  } else if (type === 'delivery') {
    userAddresses = userAddresses.filter(a => a.isDefaultDelivery || a.type === 'commercial' || a.type === 'residential')
  }
  
  return Response.json({ addresses: userAddresses })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const userId = body.userId || 'u1'
    
    const userAddresses = addresses.get(userId) || []
    
    if (body.isDefaultPickup) {
      userAddresses.forEach(a => { a.isDefaultPickup = false })
    }
    if (body.isDefaultDelivery) {
      userAddresses.forEach(a => { a.isDefaultDelivery = false })
    }
    
    const address: Address = {
      id: `a${Date.now()}`,
      userId,
      ...body,
      createdAt: new Date().toISOString(),
    }
    
    userAddresses.push(address)
    addresses.set(userId, userAddresses)
    
    return Response.json({ 
      success: true, 
      address,
      message: 'Address saved successfully' 
    }, { status: 201 })
  } catch {
    return Response.json({ 
      success: false, 
      error: 'Failed to save address' 
    }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, userId = 'u1', isDefaultPickup, isDefaultDelivery } = body
    
    const userAddresses = addresses.get(userId) || []
    const addressIndex = userAddresses.findIndex(a => a.id === id)
    
    if (addressIndex === -1) {
      return Response.json({ 
        success: false, 
        error: 'Address not found' 
      }, { status: 404 })
    }
    
    if (isDefaultPickup) {
      userAddresses.forEach(a => { a.isDefaultPickup = false })
    }
    if (isDefaultDelivery) {
      userAddresses.forEach(a => { a.isDefaultDelivery = false })
    }
    
    userAddresses[addressIndex] = { ...userAddresses[addressIndex], ...body }
    addresses.set(userId, userAddresses)
    
    return Response.json({ 
      success: true, 
      address: userAddresses[addressIndex],
      message: 'Address updated' 
    })
  } catch {
    return Response.json({ 
      success: false, 
      error: 'Failed to update address' 
    }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const userId = searchParams.get('userId') || 'u1'
  
  if (!id) {
    return Response.json({ 
      success: false, 
      error: 'Address ID required' 
    }, { status: 400 })
  }
  
  const userAddresses = addresses.get(userId) || []
  const filtered = userAddresses.filter(a => a.id !== id)
  addresses.set(userId, filtered)
  
  return Response.json({ 
    success: true, 
    message: 'Address deleted' 
  })
}
