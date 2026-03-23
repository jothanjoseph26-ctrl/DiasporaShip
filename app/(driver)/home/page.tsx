'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDriverStore, useShipmentStore } from '@/store';
import { formatCurrency, getOperationalStory } from '@/lib/utils';
import { CheckCircle2, Clock, Navigation, Phone, Truck } from 'lucide-react';

export default function DriverHome() {
  const router = useRouter();
  const { currentDriver, isOnline, toggleOnline } = useDriverStore();
  const { shipments } = useShipmentStore();
  const activeJob = shipments.find((shipment) => shipment.trackingNumber === 'DS-20260319-M4N5O6');
  const hero = shipments.find((shipment) => shipment.trackingNumber === 'DS-20260318-A1B2C3');

  return (
    <div className="space-y-4 pb-6">
      <Card className={isOnline ? 'border-emerald-200 bg-emerald-50/60' : 'border-gray-200 bg-gray-50/60'}>
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div>
            <p className="text-base font-semibold text-[#1A1208]">{isOnline ? 'Online and ready' : 'Driver offline'}</p>
            <p className="text-sm text-[#8C7B6B]">{currentDriver?.name} is handling the delivery retry and POD flow.</p>
          </div>
          <Button variant="outline" onClick={toggleOnline}>{isOnline ? 'Go offline' : 'Go online'}</Button>
        </CardContent>
      </Card>

      <Card className="border-[#E8DDD0] bg-white">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#1A1208]">Active job</p>
              <p className="text-xs text-[#8C7B6B]">{activeJob?.routeLabel ?? getOperationalStory(activeJob?.originCountry ?? 'NG', activeJob?.destinationCountry ?? 'NG')}</p>
            </div>
            <Badge className="bg-[#F5EBE0] text-[var(--ink)]">{activeJob?.trackingNumber}</Badge>
          </div>
          <div className="rounded-2xl border border-[#E8DDD0] bg-[#FAF6EF] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1208]">
              <Truck className="h-4 w-4 text-[#C4622D]" />
              First delivery failed, reattempt pending
            </div>
            <p className="mt-2 text-sm text-[#8C7B6B]">Customer has been notified and the next trip is queued with OTP handoff.</p>
          </div>
          <Button className="w-full bg-[#C4622D] text-white hover:bg-[#D97B48]" onClick={() => router.push('/driver/jobs/j1')}>
            <Navigation className="mr-2 h-4 w-4" />
            Open job detail
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-[#8C7B6B]">Today</p><p className="mt-1 text-lg font-bold text-[#1A1208]">{formatCurrency(127.5, 'USD')}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-[#8C7B6B]">Completion</p><p className="mt-1 text-lg font-bold text-[#1A1208]">98.1%</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-[#8C7B6B]">Hero shipment</p><p className="mt-1 text-lg font-bold text-[#1A1208]">{hero?.status}</p></CardContent></Card>
      </div>

      <Card className="border-[#E8DDD0] bg-white">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1208]">
            <Clock className="h-4 w-4 text-[#C4622D]" />
            Delivery evidence
          </div>
          <p className="mt-2 text-sm text-[#8C7B6B]">Capture photo, signature, OTP, location, and timestamp before closing the shipment.</p>
        </CardContent>
      </Card>
    </div>
  );
}
