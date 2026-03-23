'use client'

import Link from 'next/link'
import { Package } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared'
import { useShipmentStore } from '@/store'
import { formatCurrency } from '@/lib/utils'

export default function CustomerShipmentsPage() {
  const { shipments } = useShipmentStore()
  const customerShipments = shipments.filter((shipment) => shipment.userId === 'u1')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Shipments</h1>
          <p className="text-sm text-muted-foreground">Track active bookings and review completed deliveries.</p>
        </div>
        <Button asChild>
          <Link href="/customer/ship">New Shipment</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {customerShipments.map((shipment) => (
          <Card key={shipment.id} className="border-border/70 bg-card/95 shadow-sm">
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <p className="font-mono text-sm font-semibold text-foreground">{shipment.trackingNumber}</p>
                  <StatusBadge status={shipment.status} />
                </div>
                <p className="text-sm text-foreground">{shipment.packageDescription}</p>
                <p className="text-sm text-muted-foreground">
                  {shipment.pickupAddress.city} to {shipment.deliveryAddress.city} · {formatCurrency(shipment.totalCost, shipment.currency)}
                </p>
              </div>
              <div className="flex gap-3">
                <Button asChild variant="outline" className="border-border text-foreground hover:bg-muted">
                  <Link href={`/customer/track/${shipment.trackingNumber}`}>Track</Link>
                </Button>
                <Button asChild>
                  <Link href={`/customer/shipments/${shipment.id}`}>Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {!customerShipments.length && (
          <Card className="border-border/70 bg-card/95 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center gap-3 p-10 text-center">
              <Package className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium text-foreground">No shipments yet</p>
              <p className="text-sm text-muted-foreground">Start a new booking to see shipments here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
