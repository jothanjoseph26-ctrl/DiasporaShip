'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useShipmentStore } from '@/store';
import { formatCurrency, getCustomsDocsLabel } from '@/lib/utils';
import { Camera, FileWarning, MapPin, ScanLine, ShieldCheck } from 'lucide-react';

export default function ReceivePage() {
  const { shipments } = useShipmentStore();
  const intake = shipments.filter((shipment) => shipment.status === 'at_warehouse' || shipment.status === 'customs_held' || shipment.status === 'out_for_delivery');

  return (
    <div className="space-y-6">
      <Card className="border-[#E8DDD0] bg-white">
        <CardContent className="flex flex-wrap items-center gap-4 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1208]">
            <ScanLine className="h-4 w-4 text-[#C4622D]" />
            Intake queue
          </div>
          <div className="text-xs text-[#8C7B6B]">One tracking number follows the shipment from origin to customs to delivery.</div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {intake.map((shipment) => (
          <Card key={shipment.id} className="border-[#E8DDD0] bg-white">
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm font-semibold text-[#1A1208]">{shipment.trackingNumber}</p>
                  <p className="text-xs text-[#8C7B6B]">{shipment.routeLabel ?? shipment.corridor}</p>
                </div>
                <Badge className="bg-[#F5EBE0] text-[var(--ink)]">{getCustomsDocsLabel(shipment.customsDocsStatus)}</Badge>
              </div>
              <div className="grid gap-2 text-sm text-[#1A1208]">
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#8C7B6B]" /> {shipment.pickupAddress.city} {'->'} {shipment.deliveryAddress.city}</div>
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#8C7B6B]" /> {shipment.complianceFlags?.join(' · ') ?? 'KYC, docs, payment, POD'}</div>
                {shipment.customsDuties > 0 && <div className="flex items-center gap-2">Duties estimate: {formatCurrency(shipment.customsDuties, shipment.currency)}</div>}
              </div>
              {shipment.customsDocsStatus === 'held' && (
                <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
                  <FileWarning className="mt-0.5 h-4 w-4" />
                  Missing customs document. Hold notified to customs, warehouse, and customer.
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 border-[#E8DDD0] text-[#1A1208] hover:bg-[#FAF6EF]">
                  <Camera className="h-4 w-4 mr-2" />
                  Capture intake photo
                </Button>
                <Button className="flex-1 bg-[#C4622D] text-white hover:bg-[#D97B48]">Confirm receipt</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
