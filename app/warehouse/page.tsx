'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrackingTimeline, StatusBadge } from '@/components/shared';
import { useShipmentStore } from '@/store';
import {
  formatCurrency,
  getCountryFlag,
  getCustomsDocsLabel,
  getOperationalStory,
} from '@/lib/utils';
import { AlertTriangle, CheckCircle2, Package, Shield, Truck } from 'lucide-react';

const dashboardCard = 'border-border/70 bg-card/95 text-card-foreground shadow-sm';
const mutedPanel = 'rounded-xl border border-border/70 bg-muted/50 p-4';

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
        <Card className={dashboardCard}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground">Hero Shipment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-semibold text-foreground">{hero?.trackingNumber}</span>
              <StatusBadge status={hero?.status ?? 'processing'} />
              <Badge className="border border-border/70 bg-muted text-foreground">
                {hero?.routeLabel ??
                  getOperationalStory(hero?.originCountry ?? 'US', hero?.destinationCountry ?? 'NG')}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {getCountryFlag(hero?.originCountry)} {hero?.originCountry} to{' '}
              {getCountryFlag(hero?.destinationCountry)} {hero?.destinationCountry} with customs,
              warehouse handoff, last-mile delivery, and POD captured.
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              <div className={mutedPanel}>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Financials</p>
                <p className="mt-1 text-xl font-bold text-foreground">
                  {formatCurrency(hero?.totalCost ?? 0, hero?.currency ?? 'USD')}
                </p>
                <p className="text-xs text-muted-foreground">
                  Duties estimate {formatCurrency(hero?.customsDuties ?? 0, hero?.currency ?? 'USD')}
                </p>
              </div>
              <div className={mutedPanel}>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Compliance</p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {getCustomsDocsLabel(hero?.customsDocsStatus ?? 'pending')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {hero?.complianceFlags?.join(' · ') ?? 'KYC, docs, and insurance checked'}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Route requirements</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {routeRequirements.map((item) => (
                  <Badge
                    key={item}
                    variant="outline"
                    className="border-border bg-card text-[11px] text-foreground"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            {hero?.trackingEvents && <TrackingTimeline events={hero.trackingEvents} />}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className={dashboardCard}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">
                Operational KPIs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
                <span className="text-sm text-muted-foreground">Intake ready</span>
                <span className="font-semibold text-foreground">12</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
                <span className="text-sm text-muted-foreground">Customs docs complete</span>
                <span className="font-semibold text-foreground">93%</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
                <span className="text-sm text-muted-foreground">POD captured</span>
                <span className="font-semibold text-foreground">18</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50/60">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">Customs hold</p>
                  <p className="text-xs text-amber-800">
                    {customsHold?.trackingNumber} is waiting on Form M and consignee authorization.
                  </p>
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
                  <p className="text-xs text-blue-800">
                    {deliveryRetry?.trackingNumber} recorded a failed first attempt, then moved
                    to the reattempt queue.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={dashboardCard}>
            <CardContent className="space-y-2 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Package className="h-4 w-4 text-primary" />
                Warehouse actions
              </div>
              <Button className="w-full bg-[#C4622D] text-white hover:bg-[#D97B48]">
                Move to customs
              </Button>
              <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Confirm POD archive
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
