'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useShipmentStore } from '@/store';
import { formatCurrency, getCustomsDocsLabel } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, FileText } from 'lucide-react';

export default function AdminCustomsPage() {
  const { shipments } = useShipmentStore();
  const held = shipments.find((shipment) => shipment.trackingNumber === 'DS-20260312-G7H8I9');
  const cleared = shipments.find((shipment) => shipment.trackingNumber === 'DS-20260318-A1B2C3');

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-amber-200 bg-amber-50/60">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-900">
            <AlertTriangle className="h-4 w-4" />
            Hold queue
          </div>
          <p className="font-mono text-sm font-semibold text-amber-900">{held?.trackingNumber}</p>
          <p className="text-sm text-amber-800">{held?.delayReason}</p>
          <div className="flex flex-wrap gap-2">
            {held?.documentChecklist?.map((item) => <Badge key={item} className="bg-white text-[var(--ink)]">{item}</Badge>)}
          </div>
          <Button className="bg-amber-600 text-white hover:bg-amber-700">
            <FileText className="mr-2 h-4 w-4" />
            Request missing Form M
          </Button>
        </CardContent>
      </Card>

      <Card className="border-[#E8DDD0] bg-white">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1208]">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Cleared queue
          </div>
          <p className="font-mono text-sm font-semibold text-[#1A1208]">{cleared?.trackingNumber}</p>
          <p className="text-sm text-[#8C7B6B]">{getCustomsDocsLabel(cleared?.customsDocsStatus ?? 'submitted')} and duties estimated at {formatCurrency(cleared?.customsDuties ?? 0, cleared?.currency ?? 'USD')}.</p>
          <Badge className="bg-[#F5EBE0] text-[var(--ink)]">Ready for last-mile release</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
