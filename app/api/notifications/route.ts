import type { NextRequest } from 'next/server'

interface Notification {
  id: string
  userId: string
  type: 'email' | 'sms' | 'push' | 'in_app'
  title: string
  body: string
  data?: Record<string, unknown>
  status: 'pending' | 'sent' | 'failed'
  sentAt?: string
  createdAt: string
}

const notifications: Notification[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || 'u1'
  const status = searchParams.get('status')
  
  let results = notifications.filter(n => n.userId === userId)
  if (status) {
    results = results.filter(n => n.status === status)
  }
  
  return Response.json({ notifications: results })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId = 'u1', type = 'in_app', title, body: notificationBody, data } = body
    
    const notification: Notification = {
      id: `n${Date.now()}`,
      userId,
      type,
      title,
      body: notificationBody,
      data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    
    notifications.unshift(notification)
    
    const sent = await sendNotification(notification)
    
    return Response.json({ 
      success: true, 
      notification: sent,
      message: 'Notification sent' 
    }, { status: 201 })
  } catch {
    return Response.json({ 
      success: false, 
      error: 'Failed to send notification' 
    }, { status: 400 })
  }
}

async function sendNotification(notification: Notification): Promise<Notification> {
  try {
    switch (notification.type) {
      case 'email':
        await simulateEmail(notification)
        break
      case 'sms':
        await simulateSMS(notification)
        break
      case 'push':
        await simulatePush(notification)
        break
      default:
        break
    }
    
    notification.status = 'sent'
    notification.sentAt = new Date().toISOString()
  } catch {
    notification.status = 'failed'
  }
  
  return notification
}

async function simulateEmail(notification: Notification): Promise<void> {
  console.log(`[EMAIL] To: user ${notification.userId}`)
  console.log(`[EMAIL] Subject: ${notification.title}`)
  console.log(`[EMAIL] Body: ${notification.body}`)
  await new Promise(resolve => setTimeout(resolve, 100))
}

async function simulateSMS(notification: Notification): Promise<void> {
  console.log(`[SMS] To: user ${notification.userId}`)
  console.log(`[SMS] Message: ${notification.body}`)
  await new Promise(resolve => setTimeout(resolve, 50))
}

async function simulatePush(notification: Notification): Promise<void> {
  console.log(`[PUSH] To: user ${notification.userId}`)
  console.log(`[PUSH] Title: ${notification.title}`)
  console.log(`[PUSH] Body: ${notification.body}`)
  await new Promise(resolve => setTimeout(resolve, 50))
}

export async function sendBookingConfirmation(params: {
  userId: string
  userEmail: string
  userPhone: string
  trackingNumber: string
  route: string
  total: number
  currency: string
  estimatedDelivery: string
}): Promise<void> {
  const emailNotification: Notification = {
    id: `n${Date.now()}-email`,
    userId: params.userId,
    type: 'email',
    title: `Booking Confirmed - ${params.trackingNumber}`,
    body: `Your shipment from ${params.route} has been booked. Total: ${params.currency} ${params.total}. Estimated delivery: ${params.estimatedDelivery}`,
    data: { trackingNumber: params.trackingNumber },
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  
  const smsNotification: Notification = {
    id: `n${Date.now()}-sms`,
    userId: params.userId,
    type: 'sms',
    title: 'Booking Confirmed',
    body: `Shipment ${params.trackingNumber} booked. Total: ${params.currency} ${params.total}. Track at our website.`,
    data: { trackingNumber: params.trackingNumber },
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  
  notifications.unshift(emailNotification, smsNotification)
  
  await Promise.all([
    sendNotification(emailNotification),
    sendNotification(smsNotification),
  ])
}
