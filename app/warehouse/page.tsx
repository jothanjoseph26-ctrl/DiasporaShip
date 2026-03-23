'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrackingTimeline, StatusBadge } from '@/components/shared';
import { useShipmentStore } from '@/store';
import { formatCurrency, getCountryFlag, getCustomsDocsLabel, getOperationalStory } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, Package, Shield, Truck } from 'lucide-react';

export default function WarehouseDashboard() {
  const { shipments } = useShipmentStore();
  const hero = shipments.find((shipment) => shipment.trackingNumber === 'DS-20260318-A1B2C3') ?? shipments[0];
  const customsHold = shipments.find((shipment) => shipment.trackingNumber === 'DS-20260312-G7H8I9');
  const deliveryRetry = shipments.find((shipment) => shipment.trackingNumber === 'DS-20260319-M4N5O6');

  const routeRequirements = hero?.documentChecklist ?? [
    'KYC approval',
    'Commercial invoice',
    'Packing list',
    'Insurance proof',
    'Customs import docs',
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.4fr,0.6fr]">
        <Card className="border-[#E8DDD0] bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#1A1208]">Hero Shipment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-semibold text-[#1A1208]">{hero?.trackingNumber}</span>
              <StatusBadge status={hero?.status ?? 'processing'} />
              <Badge className="bg-[#F5EBE0] text-[var(--ink)]">{hero?.routeLabel ?? getOperationalStory(hero?.originCountry ?? 'US', hero?.destinationCountry ?? 'NG')}</Badge>
            </div>
            <p className="text-sm text-[#8C7B6B]">
              {getCountryFlag(hero?.originCountry)} {hero?.originCountry} to {getCountryFlag(hero?.destinationCountry)} {hero?.destinationCountry} with customs, warehouse handoff, last-mile delivery, and POD captured.
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-[#E8DDD0] bg-[#FAF6EF] p-4">
                <p className="text-xs uppercase tracking-wider text-[#8C7B6B]">Financials</p>
                <p className="mt-1 text-xl font-bold text-[#1A1208]">{formatCurrency(hero?.totalCost ?? 0, hero?.currency ?? 'USD')}</p>
                <p className="text-xs text-[#8C7B6B]">Duties estimate {formatCurrency(hero?.customsDuties ?? 0, hero?.currency ?? 'USD')}</p>
              </div>
              <div className="rounded-xl border border-[#E8DDD0] bg-[#FAF6EF] p-4">
                <p className="text-xs uppercase tracking-wider text-[#8C7B6B]">Compliance</p>
                <p className="mt-1 text-sm font-semibold text-[#1A1208]">{getCustomsDocsLabel(hero?.customsDocsStatus ?? 'pending')}</p>
                <p className="text-xs text-[#8C7B6B]">{hero?.complianceFlags?.join(' · ') ?? 'KYC, docs, and insurance checked'}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E8DDD0] p-4">
              <div className="mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#C4622D]" />
                <h3 className="text-sm font-semibold text-[#1A1208]">Route requirements</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {routeRequirements.map((item) => (
                  <Badge key={item} variant="outline" className="border-[#E8DDD0] bg-white text-[11px]">{item}</Badge>
                ))}
              </div>
            </div>

            {hero?.trackingEvents && <TrackingTimeline events={hero.trackingEvents} />}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-[#E8DDD0] bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-[#1A1208]">Operational KPIs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-[#FAF6EF] p-3">
                <span className="text-sm text-[#8C7B6B]">Intake ready</span>
                <span className="font-semibold text-[#1A1208]">12</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#FAF6EF] p-3">
                <span className="text-sm text-[#8C7B6B]">Customs docs complete</span>
                <span className="font-semibold text-[#1A1208]">93%</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#FAF6EF] p-3">
                <span className="text-sm text-[#8C7B6B]">POD captured</span>
                <span className="font-semibold text-[#1A1208]">18</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50/60">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">Customs hold</p>
                  <p className="text-xs text-amber-800">{customsHold?.trackingNumber} is waiting on Form M and consignee authorization.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50/60">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Truck className="mt-0.5 h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">Delivery retry</p>
                  <p className="text-xs text-blue-800">{deliveryRetry?.trackingNumber} recorded a failed first attempt, then moved to the reattempt queue.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#E8DDD0] bg-white">
            <CardContent className="space-y-2 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1208]">
                <Package className="h-4 w-4 text-[#C4622D]" />
                Warehouse actions
              </div>
              <Button className="w-full bg-[#C4622D] text-white hover:bg-[#D97B48]">Move to customs</Button>
              <Button variant="outline" className="w-full border-[#E8DDD0] text-[#1A1208] hover:bg-[#FAF6EF]">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirm POD archive
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
