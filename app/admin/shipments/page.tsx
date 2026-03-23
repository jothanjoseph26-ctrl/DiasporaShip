'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, TrackingTimeline } from '@/components/shared';
import { useShipmentStore } from '@/store';
import { formatCurrency, getOperationalStory } from '@/lib/utils';
import type { Shipment } from '@/types';
import { Eye, FileText } from 'lucide-react';

export default function AdminShipmentsPage() {
  const { shipments } = useShipmentStore();

  const columns = [
    { key: 'trackingNumber', label: 'Tracking', render: (shipment: Shipment) => <span className="font-mono text-xs font-semibold">{shipment.trackingNumber}</span> },
    { key: 'route', label: 'Route', render: (shipment: Shipment) => <span className="text-sm">{shipment.routeLabel ?? getOperationalStory(shipment.originCountry, shipment.destinationCountry)}</span> },
    { key: 'status', label: 'Status', render: (shipment: Shipment) => <Badge className="bg-[#F5EBE0] text-[var(--ink)]">{shipment.status}</Badge> },
    { key: 'amount', label: 'Amount', render: (shipment: Shipment) => <span>{formatCurrency(shipment.totalCost, shipment.currency)}</span> },
    { key: 'docs', label: 'Docs', render: (shipment: Shipment) => <span className="text-sm">{shipment.customsDocsStatus}</span> },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
      <Card className="border-[#E8DDD0] bg-white">
        <CardContent className="p-0">
          <DataTable columns={columns as any} data={shipments as any} pageSize={8} />
        </CardContent>
      </Card>
      <Card className="border-[#E8DDD0] bg-white">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1208]">
            <Eye className="h-4 w-4 text-[#C4622D]" />
            Shipment evidence
          </div>
          <TrackingTimeline events={shipments.find((shipment) => shipment.trackingNumber === 'DS-20260318-A1B2C3')?.trackingEvents ?? []} />
          <Button variant="outline" className="w-full border-[#E8DDD0] text-[#1A1208] hover:bg-[#FAF6EF]">
            <FileText className="mr-2 h-4 w-4" />
            Export audit pack
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
