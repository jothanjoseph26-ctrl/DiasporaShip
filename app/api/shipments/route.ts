import type { NextRequest } from 'next/server'
import { generateTrackingNumber } from '@/lib/utils'

const shipments: Map<string, unknown> = new Map()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const status = searchParams.get('status')
  
  let results = Array.from(shipments.values())
  
  if (userId) {
    results = results.filter((s: unknown) => (s as { userId: string }).userId === userId)
  }
  if (status) {
    results = results.filter((s: unknown) => (s as { status: string }).status === status)
  }
  
  return Response.json({ shipments: results })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const trackingNumber = generateTrackingNumber()
    
    const shipment = {
      id: `s${Date.now()}`,
      trackingNumber,
      ...body,
      status: 'pending_pickup',
      createdAt: new Date().toISOString(),
      trackingEvents: [
        {
          id: `e${Date.now()}`,
          shipmentId: `s${Date.now()}`,
          eventType: 'booked',
          description: 'Shipment booked and payment confirmed',
          locationName: body.pickupAddress?.city || 'Origin',
          occurredAt: new Date().toISOString(),
        },
      ],
    }
    
    shipments.set(shipment.id, shipment)
    
    return Response.json({ 
      success: true, 
      shipment,
      message: 'Shipment created successfully' 
    }, { status: 201 })
  } catch {
    return Response.json({ 
      success: false, 
      error: 'Failed to create shipment' 
    }, { status: 400 })
  }
}
