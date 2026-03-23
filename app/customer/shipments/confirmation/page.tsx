'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { 
  CheckCircle2, 
  Copy, 
  Truck, 
  Calendar, 
  MapPin, 
  Package,
  CreditCard,
  Mail,
  MessageSquare,
  ArrowRight,
  Download,
  Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useBookingStore } from '@/store/booking'
import { useAuthStore } from '@/store'
import { formatCurrency, cn } from '@/lib/utils'
import { getCurrencySymbol } from '@/lib/currency'

export default function BookingConfirmationPage() {
  const { currentQuote, confirmation, shipmentDetails, pickupAddress, deliveryAddress, clearBooking } = useBookingStore()
  const { currentUser } = useAuthStore()

  useEffect(() => {
    if (!confirmation) {
      console.log('No confirmation data')
    }
  }, [confirmation])

  if (!confirmation || confirmation.status !== 'confirmed') {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <div className="rounded-full bg-amber-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Truck className="h-8 w-8 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">No Booking Found</h1>
        <p className="text-muted-foreground mb-6">Complete a booking to see your confirmation</p>
        <Button asChild>
          <Link href="/customer/ship">Book a Shipment</Link>
        </Button>
      </div>
    )
  }

  const copyTracking = () => {
    navigator.clipboard.writeText(confirmation.trackingNumber)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="p-8 text-center">
          <div className="rounded-full bg-green-500 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">Booking Confirmed!</h1>
          <p className="text-green-700">
            Your shipment has been booked and payment processed successfully.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tracking Number</span>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              {confirmation.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Tracking</p>
              <p className="text-2xl font-mono font-bold text-foreground">{confirmation.trackingNumber}</p>
            </div>
            <Button size="sm" variant="outline" onClick={copyTracking} className="gap-2">
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 p-4 rounded-xl border border-border">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Estimated Delivery</p>
                <p className="font-medium text-foreground">{confirmation.estimatedDelivery}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl border border-border">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Amount Paid</p>
                <p className="font-medium text-foreground">
                  {getCurrencySymbol(currentQuote?.currency || 'USD')}{(currentQuote?.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Shipment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Route</p>
              <p className="font-medium text-foreground">
                {pickupAddress ? `${pickupAddress.city}, ${pickupAddress.country}` : 'Origin'} → {deliveryAddress ? `${deliveryAddress.city}, ${deliveryAddress.country}` : 'Destination'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Service</p>
              <p className="font-medium text-foreground">{currentQuote?.serviceName || 'Standard'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Weight</p>
              <p className="font-medium text-foreground">{shipmentDetails?.weight || 0} kg</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Billable Weight</p>
              <p className="font-medium text-primary">{currentQuote?.billableWeight || 0} kg</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-foreground mb-3">Price Breakdown</p>
            <div className="space-y-2">
              {currentQuote?.breakdown.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{getCurrencySymbol(currentQuote.currency)}{item.amount.toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-primary">{getCurrencySymbol(currentQuote?.currency || 'USD')}{(currentQuote?.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Addresses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-xl border border-border bg-muted/30">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Pickup</p>
              {pickupAddress ? (
                <>
                  <p className="font-medium text-foreground">{pickupAddress.label}</p>
                  <p className="text-sm text-muted-foreground">{pickupAddress.recipientName}</p>
                  <p className="text-sm text-muted-foreground">{pickupAddress.addressLine1}</p>
                  <p className="text-sm text-muted-foreground">{pickupAddress.city}, {pickupAddress.stateProvince}</p>
                  <p className="text-sm text-muted-foreground">{pickupAddress.country}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Default address</p>
              )}
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/30">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Delivery</p>
              {deliveryAddress ? (
                <>
                  <p className="font-medium text-foreground">{deliveryAddress.label}</p>
                  <p className="text-sm text-muted-foreground">{deliveryAddress.recipientName}</p>
                  <p className="text-sm text-muted-foreground">{deliveryAddress.addressLine1}</p>
                  <p className="text-sm text-muted-foreground">{deliveryAddress.city}, {deliveryAddress.stateProvince}</p>
                  <p className="text-sm text-muted-foreground">{deliveryAddress.country}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Default address</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-100 bg-blue-50/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Confirmation Sent</p>
              <p className="text-sm text-muted-foreground">
                A confirmation email and SMS have been sent to {currentUser?.email || 'your registered email'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild variant="outline" className="flex-1 gap-2">
          <Link href={`/customer/track/${confirmation.trackingNumber}`}>
            <Truck className="h-4 w-4" />
            Track Shipment
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1 gap-2">
          <Link href="/customer/shipments">
            <Package className="h-4 w-4" />
            View All Shipments
          </Link>
        </Button>
        <Button asChild className="flex-1 gap-2">
          <Link href="/customer/ship">
            Book Another
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
