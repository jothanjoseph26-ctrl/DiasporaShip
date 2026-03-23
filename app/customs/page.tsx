'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useShipmentStore } from '@/store';
import { TrackingTimeline } from '@/components/shared';
import { formatCurrency, getCustomsDocsLabel } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, FileText, ShieldCheck } from 'lucide-react';

export default function CustomsDashboard() {
  const { shipments } = useShipmentStore();
  const hero = shipments.find((shipment) => shipment.trackingNumber === 'DS-20260318-A1B2C3');
  const held = shipments.find((shipment) => shipment.trackingNumber === 'DS-20260312-G7H8I9');

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-[#E8DDD0] bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#1A1208]">Hero clearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold text-[#1A1208]">{hero?.trackingNumber}</span>
              <Badge className="bg-green-100 text-green-700">{getCustomsDocsLabel(hero?.customsDocsStatus ?? 'submitted')}</Badge>
            </div>
            <div className="grid gap-2 text-sm text-[#1A1208]">
              <div><strong>Documents:</strong> {hero?.documentChecklist?.join(' · ')}</div>
              <div><strong>Duties estimate:</strong> {formatCurrency(hero?.customsDuties ?? 0, hero?.currency ?? 'USD')}</div>
              <div><strong>Officer:</strong> {hero?.customsOfficer ?? 'Destination desk'}</div>
            </div>
            <div className="rounded-2xl border border-[#E8DDD0] bg-[#FAF6EF] p-4">
              <TrackingTimeline events={hero?.trackingEvents ?? []} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/60">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-amber-900">Exception case: missing customs document</CardTitle>
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
                <Badge key={item} className="bg-white text-[var(--ink)]">{item}</Badge>
              ))}
            </div>
            <div className="rounded-xl bg-white p-3 text-sm text-[#1A1208]">
              <p className="font-semibold">Action path</p>
              <p className="text-[#8C7B6B]">Alert raised to customs, warehouse, and customer. The shipment stays on hold until Form M is uploaded and approved.</p>
            </div>
            <Button className="w-full bg-amber-600 text-white hover:bg-amber-700">
              <FileText className="h-4 w-4 mr-2" />
              Request missing document
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-[#E8DDD0] bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1208]">
              <ShieldCheck className="h-4 w-4 text-[#C4622D]" />
              KYC and payment
            </div>
            <p className="mt-2 text-sm text-[#8C7B6B]">KYC status, duties estimate, and payment proof stay visible on the same shipment file.</p>
          </CardContent>
        </Card>
        <Card className="border-[#E8DDD0] bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1208]">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Clearance ready
            </div>
            <p className="mt-2 text-sm text-[#8C7B6B]">Once docs are complete, customs releases the shipment to destination warehouse staging.</p>
          </CardContent>
        </Card>
        <Card className="border-[#E8DDD0] bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1208]">
              <FileText className="h-4 w-4 text-[#C4622D]" />
              Audit log
            </div>
            <p className="mt-2 text-sm text-[#8C7B6B]">Every hold, approval, and release is visible to admin and included in the review trail.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
