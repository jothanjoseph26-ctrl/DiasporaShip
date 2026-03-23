'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useShipmentStore } from '@/store';
import { TrackingTimeline } from '@/components/shared';
import { formatCurrency, getCustomsDocsLabel } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, FileText, ShieldCheck } from 'lucide-react';

const dashboardCard = 'border-border/70 bg-card/95 text-card-foreground shadow-sm';

export default function CustomsDashboard() {
  const { shipments } = useShipmentStore();
  const hero = shipments.find((shipment) => shipment.trackingNumber === 'DS-20260318-A1B2C3');
  const held = shipments.find((shipment) => shipment.trackingNumber === 'DS-20260312-G7H8I9');

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className={dashboardCard}>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Hero clearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold text-foreground">
                {hero?.trackingNumber}
              </span>
              <Badge className="bg-green-100 text-green-700">
                {getCustomsDocsLabel(hero?.customsDocsStatus ?? 'submitted')}
              </Badge>
            </div>
            <div className="grid gap-2 text-sm text-foreground">
              <div><strong>Documents:</strong> {hero?.documentChecklist?.join(' · ')}</div>
              <div>
                <strong>Duties estimate:</strong>{' '}
                {formatCurrency(hero?.customsDuties ?? 0, hero?.currency ?? 'USD')}
              </div>
              <div><strong>Officer:</strong> {hero?.customsOfficer ?? 'Destination desk'}</div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/50 p-4">
              <TrackingTimeline events={hero?.trackingEvents ?? []} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/60">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-amber-900">
              Exception case: missing customs document
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm font-semibold text-amber-900">{held?.trackingNumber}</p>
                <p className="text-xs text-amber-800">{held?.delayReason}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {held?.documentChecklist?.map((item) => (
                <Badge key={item} className="border border-border/70 bg-card text-foreground">
                  {item}
                </Badge>
              ))}
            </div>
            <div className="rounded-xl border border-amber-200/60 bg-card/90 p-3 text-sm text-foreground">
              <p className="font-semibold">Action path</p>
              <p className="text-muted-foreground">
                Alert raised to customs, warehouse, and customer. The shipment stays on hold
                until Form M is uploaded and approved.
              </p>
            </div>
            <Button className="w-full bg-amber-600 text-white hover:bg-amber-700">
              <FileText className="mr-2 h-4 w-4" />
              Request missing document
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className={dashboardCard}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              KYC and payment
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              KYC status, duties estimate, and payment proof stay visible on the same shipment
              file.
            </p>
          </CardContent>
        </Card>
        <Card className={dashboardCard}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Clearance ready
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Once docs are complete, customs releases the shipment to destination warehouse
              staging.
            </p>
          </CardContent>
        </Card>
        <Card className={dashboardCard}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <FileText className="h-4 w-4 text-primary" />
              Audit log
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Every hold, approval, and release is visible to admin and included in the review
              trail.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
