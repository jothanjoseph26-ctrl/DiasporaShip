'use client'

import { notFound, useParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { TrackingTimeline, StatusBadge } from '@/components/shared'
import { useShipmentStore } from '@/store'

export default function CustomerTrackDetailPage() {
  const params = useParams<{ trackingNumber: string }>()
  const { getShipmentByTracking } = useShipmentStore()
  const shipment = getShipmentByTracking(params.trackingNumber)

  if (!shipment) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-sm text-muted-foreground">{shipment.trackingNumber}</p>
          <h1 className="text-2xl font-bold text-foreground">Tracking Detail</h1>
        </div>
        <StatusBadge status={shipment.status} />
      </div>
      <Card className="border-border/70 bg-card/95 shadow-sm">
        <CardContent className="p-5">
          <TrackingTimeline events={shipment.trackingEvents} />
        </CardContent>
      </Card>
    </div>
  )
}
