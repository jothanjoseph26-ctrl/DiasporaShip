'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowRight, CheckCircle2, FileText, ShieldCheck, Truck } from 'lucide-react';
import { useAdminStore, useShipmentStore } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrackingTimeline } from '@/components/shared';
import { getCountryFlag, getOperationalStory } from '@/lib/utils';

const dashboardCard = 'border-border/70 bg-card/95 text-card-foreground shadow-sm';
const mutedPanel = 'rounded-2xl border border-border/70 bg-muted/50 p-4';
const infoPanel = 'rounded-xl border border-border/70 bg-muted/35 p-4';

export default function AdminDashboard() {
  const { kpis, activity } = useAdminStore();
  const { shipments } = useShipmentStore();
  const hero = shipments.find((shipment) => shipment.trackingNumber === 'DS-20260318-A1B2C3');
  const held = shipments.find((shipment) => shipment.trackingNumber === 'DS-20260312-G7H8I9');
  const retry = shipments.find((shipment) => shipment.trackingNumber === 'DS-20260319-M4N5O6');

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className={dashboardCard}><CardContent className="p-4"><p className="text-xs text-muted-foreground">Revenue</p><p className="mt-1 text-lg font-bold text-foreground">{kpis.revenue}</p></CardContent></Card>
        <Card className={dashboardCard}><CardContent className="p-4"><p className="text-xs text-muted-foreground">Customs holds</p><p className="mt-1 text-lg font-bold text-foreground">{kpis.customsHolds}</p></CardContent></Card>
        <Card className={dashboardCard}><CardContent className="p-4"><p className="text-xs text-muted-foreground">On-time rate</p><p className="mt-1 text-lg font-bold text-foreground">{kpis.onTimeRate}%</p></CardContent></Card>
        <Card className={dashboardCard}><CardContent className="p-4"><p className="text-xs text-muted-foreground">Pending payments</p><p className="mt-1 text-lg font-bold text-foreground">{kpis.pendingPayments}</p></CardContent></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
        <Card className={dashboardCard}>
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Shipment control center
            </div>
            <div className={mutedPanel}>
              <p className="font-mono text-sm font-semibold text-foreground">{hero?.trackingNumber}</p>
              <p className="text-xs text-muted-foreground">{hero?.routeLabel ?? getOperationalStory(hero?.originCountry ?? 'US', hero?.destinationCountry ?? 'NG')}</p>
              <p className="mt-2 text-sm text-foreground">{getCountryFlag(hero?.originCountry)} origin, customs clearance, destination warehouse, and POD are visible in one audit trail.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="border border-border/70 bg-muted text-foreground">KYC verified</Badge>
              <Badge className="border border-border/70 bg-muted text-foreground">Documents checked</Badge>
              <Badge className="border border-border/70 bg-muted text-foreground">POD captured</Badge>
            </div>
            {hero?.trackingEvents && <TrackingTimeline events={hero.trackingEvents} />}
          </CardContent>
        </Card>

        <Card className={dashboardCard}>
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Exception watch
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-sm text-amber-900">
              {held?.trackingNumber} is held for missing Form M.
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-sm text-blue-900">
              {retry?.trackingNumber} failed first delivery and is now on the reattempt path.
            </div>
            <div className={infoPanel}>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Audit trail</p>
              <div className="mt-3 space-y-2 text-sm text-foreground">
                {activity.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <span>{item.message}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/admin/shipments" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Review all shipments <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className={dashboardCard}><CardContent className="p-4"><Truck className="h-5 w-5 text-primary" /><p className="mt-2 text-sm text-muted-foreground">Dispatch and driver state stay tied to one shipment file.</p></CardContent></Card>
        <Card className={dashboardCard}><CardContent className="p-4"><FileText className="h-5 w-5 text-primary" /><p className="mt-2 text-sm text-muted-foreground">Customs docs, duty estimate, and hold notes are visible together.</p></CardContent></Card>
        <Card className={dashboardCard}><CardContent className="p-4"><CheckCircle2 className="h-5 w-5 text-green-600" /><p className="mt-2 text-sm text-muted-foreground">POD and exception resolution are captured as operational proof.</p></CardContent></Card>
      </div>
    </div>
  );
}
