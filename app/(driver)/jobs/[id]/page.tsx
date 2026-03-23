'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrackingTimeline } from '@/components/shared';
import { useShipmentStore } from '@/store';
import { formatCurrency, getOperationalStory } from '@/lib/utils';
import { ArrowLeft, Camera, CheckCircle2, MapPin, Phone, PenLine, AlertTriangle } from 'lucide-react';

export default function DriverJobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { shipments } = useShipmentStore();
  const shipment = shipments.find((item) => item.id === params.id) ?? shipments.find((item) => item.id === 's5');
  const [submitted, setSubmitted] = useState(false);

  if (!shipment) return null;

  const isRetryCase = shipment.exceptionType === 'failed_first_delivery_attempt';

  return (
    <div className="space-y-4 pb-6">
      <button type="button" onClick={() => router.back()} className="flex items-center gap-1 text-sm text-[#8C7B6B]">
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <Card className="border-[#E8DDD0] bg-white">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm font-semibold text-[#1A1208]">{shipment.trackingNumber}</p>
              <p className="text-xs text-[#8C7B6B]">{shipment.routeLabel ?? getOperationalStory(shipment.originCountry, shipment.destinationCountry)}</p>
            </div>
            <Badge className={isRetryCase ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-700'}>{shipment.status}</Badge>
          </div>
          <div className="rounded-2xl border border-[#E8DDD0] bg-[#FAF6EF] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1208]">
              {isRetryCase ? <AlertTriangle className="h-4 w-4 text-amber-600" /> : <MapPin className="h-4 w-4 text-[#C4622D]" />}
              {isRetryCase ? 'Second attempt with OTP handoff' : 'Proof of delivery ready'}
            </div>
            <p className="mt-2 text-sm text-[#8C7B6B]">{shipment.handoffNotes ?? shipment.notes}</p>
          </div>
          <div className="grid gap-2 text-sm text-[#1A1208] md:grid-cols-2">
            <div>Declared value: {formatCurrency(shipment.declaredValue, shipment.currency)}</div>
            <div>Attempts: {shipment.deliveryAttempts ?? 1}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#E8DDD0] bg-white">
        <CardContent className="p-5">
          <TrackingTimeline events={shipment.trackingEvents} />
        </CardContent>
      </Card>

      <Card className="border-[#E8DDD0] bg-white">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1208]">
            <Phone className="h-4 w-4 text-[#C4622D]" />
            Customer contact and POD
          </div>
          <div className="rounded-xl border border-[#E8DDD0] p-4 text-sm text-[#1A1208]">
            Recipient: {shipment.podRecipientName ?? shipment.deliveryAddress.recipientName}
            <Separator className="my-3" />
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 border-[#E8DDD0] text-[#1A1208] hover:bg-[#FAF6EF]"><Camera className="mr-2 h-4 w-4" />Photo</Button>
              <Button variant="outline" className="flex-1 border-[#E8DDD0] text-[#1A1208] hover:bg-[#FAF6EF]"><PenLine className="mr-2 h-4 w-4" />Signature</Button>
            </div>
            <Button className="mt-3 w-full bg-[#C4622D] text-white hover:bg-[#D97B48]" onClick={() => setSubmitted(true)}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {isRetryCase ? 'Submit second-attempt POD' : 'Submit delivery'}
            </Button>
            {submitted && <p className="mt-2 text-xs text-green-700">POD uploaded and audit trail updated.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
