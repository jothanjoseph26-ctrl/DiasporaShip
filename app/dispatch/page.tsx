'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDriverStore, useShipmentStore } from '@/store';
import { formatCurrency, getOperationalStory } from '@/lib/utils';
import { ArrowRight, CheckCircle2, MapPin, Truck } from 'lucide-react';

const dashboardCard = 'border-border/70 bg-card/95 text-card-foreground shadow-sm';

export default function DispatchDashboard() {
  const { shipments } = useShipmentStore();
  const { drivers } = useDriverStore();

  const hero = shipments.find((shipment) => shipment.trackingNumber === 'DS-20260318-A1B2C3');
  const retry = shipments.find((shipment) => shipment.trackingNumber === 'DS-20260319-M4N5O6');
  const assignedDriver = drivers.find((driver) => driver.id === 'd1');

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr,0.75fr]">
      <Card className={dashboardCard}>
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">International handoff</p>
              <p className="text-xs text-muted-foreground">{hero?.routeLabel ?? getOperationalStory(hero?.originCountry ?? 'US', hero?.destinationCountry ?? 'NG')}</p>
            </div>
            <Badge className="border border-border/70 bg-muted text-foreground">{hero?.trackingNumber}</Badge>
          </div>
          <div className="rounded-2xl border border-border/70 bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Truck className="h-4 w-4 text-primary" />
              {assignedDriver?.name ?? 'Driver'} assigned for destination handoff
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{hero?.trackingNumber} is staged for the final mile after customs clearance.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Shipment value</p>
              <p className="mt-1 text-lg font-bold text-foreground">{formatCurrency(hero?.totalCost ?? 0, hero?.currency ?? 'USD')}</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Documents</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{hero?.customsDocsStatus}</p>
            </div>
          </div>
          <Button className="bg-[#C4622D] text-white hover:bg-[#D97B48]">
            Confirm dispatch
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Card className={dashboardCard}>
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            Exception recovery
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
            <p className="text-sm font-semibold text-amber-900">{retry?.trackingNumber}</p>
            <p className="text-xs text-amber-800">First delivery attempt failed. Dispatch is coordinating the reattempt and customer notification.</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Next action</p>
            <p className="mt-2 text-sm text-foreground">Assign vehicle, notify recipient, and push OTP handoff to driver app.</p>
          </div>
          <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Broadcast reattempt
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
