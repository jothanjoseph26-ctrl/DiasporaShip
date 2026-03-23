'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useShipmentStore } from '@/store'

export default function CustomerDocumentsPage() {
  const { shipments } = useShipmentStore()
  const docs = Array.from(new Set(shipments.flatMap((shipment) => shipment.documentChecklist || [])))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Documents</h1>
        <p className="text-sm text-muted-foreground">Required shipment and compliance documents.</p>
      </div>

      <Card className="border-border/70 bg-card/95 shadow-sm">
        <CardContent className="space-y-3 p-5">
          <h2 className="font-semibold text-foreground">Checklist Library</h2>
          <div className="flex flex-wrap gap-2">
            {docs.map((doc) => (
              <Badge key={doc} className="border border-border/70 bg-muted text-foreground">{doc}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
