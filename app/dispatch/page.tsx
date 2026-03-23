'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDriverStore, useShipmentStore } from '@/store';
import { formatCurrency, getOperationalStory } from '@/lib/utils';
import { ArrowRight, CheckCircle2, MapPin, Truck } from 'lucide-react';

export default function DispatchDashboard() {
  const { shipments } = useShipmentStore();
  const { drivers } = useDriverStore();

  const hero = shipments.find((shipment) => shipment.trackingNumber === 'DS-20260318-A1B2C3');
  const retry = shipments.find((shipment) => shipment.trackingNumber === 'DS-20260319-M4N5O6');
  const assignedDriver = drivers.find((driver) => driver.id === 'd1');

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr,0.75fr]">
      <Card className="border-[#E8DDD0] bg-white">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#1A1208]">International handoff</p>
              <p className="text-xs text-[#8C7B6B]">{hero?.routeLabel ?? getOperationalStory(hero?.originCountry ?? 'US', hero?.destinationCountry ?? 'NG')}</p>
            </div>
            <Badge className="bg-[#F5EBE0] text-[var(--ink)]">{hero?.trackingNumber}</Badge>
          </div>
          <div className="rounded-2xl border border-[#E8DDD0] bg-[#FAF6EF] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1208]">
              <Truck className="h-4 w-4 text-[#C4622D]" />
              {assignedDriver?.name ?? 'Driver'} assigned for destination handoff
            </div>
            <p className="mt-2 text-sm text-[#8C7B6B]">{hero?.trackingNumber} is staged for the final mile after customs clearance.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-[#E8DDD0] p-4">
              <p className="text-xs uppercase tracking-wider text-[#8C7B6B]">Shipment value</p>
              <p className="mt-1 text-lg font-bold text-[#1A1208]">{formatCurrency(hero?.totalCost ?? 0, hero?.currency ?? 'USD')}</p>
            </div>
            <div className="rounded-xl border border-[#E8DDD0] p-4">
              <p className="text-xs uppercase tracking-wider text-[#8C7B6B]">Documents</p>
              <p className="mt-1 text-sm font-semibold text-[#1A1208]">{hero?.customsDocsStatus}</p>
            </div>
          </div>
          <Button className="bg-[#C4622D] text-white hover:bg-[#D97B48]">
            Confirm dispatch
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Card className="border-[#E8DDD0] bg-white">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1208]">
            <MapPin className="h-4 w-4 text-[#C4622D]" />
            Exception recovery
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
            <p className="text-sm font-semibold text-amber-900">{retry?.trackingNumber}</p>
            <p className="text-xs text-amber-800">First delivery attempt failed. Dispatch is coordinating the reattempt and customer notification.</p>
          </div>
          <div className="rounded-2xl border border-[#E8DDD0] p-4">
            <p className="text-xs uppercase tracking-wider text-[#8C7B6B]">Next action</p>
            <p className="mt-2 text-sm text-[#1A1208]">Assign vehicle, notify recipient, and push OTP handoff to driver app.</p>
          </div>
          <Button variant="outline" className="w-full border-[#E8DDD0] text-[#1A1208] hover:bg-[#FAF6EF]">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Broadcast reattempt
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
