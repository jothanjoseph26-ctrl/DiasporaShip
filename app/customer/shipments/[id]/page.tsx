'use client'

import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrackingTimeline, StatusBadge } from '@/components/shared'
import { useShipmentStore } from '@/store'
import { formatCurrency } from '@/lib/utils'

export default function CustomerShipmentDetailPage() {
  const params = useParams<{ id: string }>()
  const { getShipmentById } = useShipmentStore()
  const shipment = getShipmentById(params.id)

  if (!shipment) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-sm text-muted-foreground">{shipment.trackingNumber}</p>
          <h1 className="text-2xl font-bold text-foreground">{shipment.packageDescription}</h1>
        </div>
        <StatusBadge status={shipment.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/70 bg-card/95 shadow-sm">
          <CardContent className="space-y-3 p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Route</p>
            <p className="font-semibold text-foreground">{shipment.pickupAddress.city} to {shipment.deliveryAddress.city}</p>
            <p className="text-sm text-muted-foreground">{shipment.pickupAddress.addressLine1}</p>
            <p className="text-sm text-muted-foreground">{shipment.deliveryAddress.addressLine1}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70 bg-card/95 shadow-sm">
          <CardContent className="space-y-3 p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Charges</p>
            <p className="text-xl font-bold text-primary">{formatCurrency(shipment.totalCost, shipment.currency)}</p>
            <div className="flex flex-wrap gap-2">
              {shipment.complianceFlags?.map((flag) => (
                <Badge key={flag} className="border border-border/70 bg-muted text-foreground">{flag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70 bg-card/95 shadow-sm">
        <CardContent className="p-5">
          <TrackingTimeline events={shipment.trackingEvents} />
        </CardContent>
      </Card>

      <Button asChild variant="outline" className="border-border text-foreground hover:bg-muted">
        <Link href="/customer/shipments">Back to Shipments</Link>
      </Button>
    </div>
  )
}
