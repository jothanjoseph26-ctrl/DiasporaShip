'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDriverStore, useShipmentStore } from '@/store';
import { formatCurrency, getOperationalStory } from '@/lib/utils';
import { Clock, Navigation, Truck } from 'lucide-react';

const dashboardCard = 'border-border/70 bg-card/95 text-card-foreground shadow-sm';

export default function DriverHome() {
  const router = useRouter();
  const { currentDriver, isOnline, toggleOnline } = useDriverStore();
  const { shipments } = useShipmentStore();
  const activeJob = shipments.find((shipment) => shipment.trackingNumber === 'DS-20260319-M4N5O6');
  const hero = shipments.find((shipment) => shipment.trackingNumber === 'DS-20260318-A1B2C3');

  return (
    <div className="space-y-4 pb-6">
      <Card className={isOnline ? 'border-emerald-200 bg-emerald-50/60' : 'border-border/70 bg-muted/40'}>
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div>
            <p className="text-base font-semibold text-foreground">{isOnline ? 'Online and ready' : 'Driver offline'}</p>
            <p className="text-sm text-muted-foreground">{currentDriver?.name} is handling the delivery retry and POD flow.</p>
          </div>
          <Button variant="outline" className="border-border text-foreground hover:bg-muted" onClick={toggleOnline}>{isOnline ? 'Go offline' : 'Go online'}</Button>
        </CardContent>
      </Card>

      <Card className={dashboardCard}>
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Active job</p>
              <p className="text-xs text-muted-foreground">{activeJob?.routeLabel ?? getOperationalStory(activeJob?.originCountry ?? 'NG', activeJob?.destinationCountry ?? 'NG')}</p>
            </div>
            <Badge className="border border-border/70 bg-muted text-foreground">{activeJob?.trackingNumber}</Badge>
          </div>
          <div className="rounded-2xl border border-border/70 bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Truck className="h-4 w-4 text-primary" />
              First delivery failed, reattempt pending
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Customer has been notified and the next trip is queued with OTP handoff.</p>
          </div>
          <Button className="w-full bg-[#C4622D] text-white hover:bg-[#D97B48]" onClick={() => router.push('/driver/jobs/j1')}>
            <Navigation className="mr-2 h-4 w-4" />
            Open job detail
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        <Card className={dashboardCard}><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Today</p><p className="mt-1 text-lg font-bold text-foreground">{formatCurrency(127.5, 'USD')}</p></CardContent></Card>
        <Card className={dashboardCard}><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Completion</p><p className="mt-1 text-lg font-bold text-foreground">98.1%</p></CardContent></Card>
        <Card className={dashboardCard}><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Hero shipment</p><p className="mt-1 text-lg font-bold text-foreground">{hero?.status}</p></CardContent></Card>
      </div>

      <Card className={dashboardCard}>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Clock className="h-4 w-4 text-primary" />
            Delivery evidence
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Capture photo, signature, OTP, location, and timestamp before closing the shipment.</p>
        </CardContent>
      </Card>
    </div>
  );
}
