'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowRight, CheckCircle2, FileText, ShieldCheck, Truck } from 'lucide-react';
import { useAdminStore, useShipmentStore } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrackingTimeline } from '@/components/shared';
import { formatCurrency, getCountryFlag, getOperationalStory } from '@/lib/utils';

export default function AdminDashboard() {
  const { kpis, activity } = useAdminStore();
  const { shipments } = useShipmentStore();
  const hero = shipments.find((shipment) => shipment.trackingNumber === 'DS-20260318-A1B2C3');
  const held = shipments.find((shipment) => shipment.trackingNumber === 'DS-20260312-G7H8I9');
  const retry = shipments.find((shipment) => shipment.trackingNumber === 'DS-20260319-M4N5O6');

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-4"><p className="text-xs text-[#8C7B6B]">Revenue</p><p className="mt-1 text-lg font-bold text-[#1A1208]">{kpis.revenue}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-[#8C7B6B]">Customs holds</p><p className="mt-1 text-lg font-bold text-[#1A1208]">{kpis.customsHolds}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-[#8C7B6B]">On-time rate</p><p className="mt-1 text-lg font-bold text-[#1A1208]">{kpis.onTimeRate}%</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-[#8C7B6B]">Pending payments</p><p className="mt-1 text-lg font-bold text-[#1A1208]">{kpis.pendingPayments}</p></CardContent></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
        <Card className="border-[#E8DDD0] bg-white">
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1208]">
              <ShieldCheck className="h-4 w-4 text-[#C4622D]" />
              Shipment control center
            </div>
            <div className="rounded-2xl border border-[#E8DDD0] bg-[#FAF6EF] p-4">
              <p className="font-mono text-sm font-semibold text-[#1A1208]">{hero?.trackingNumber}</p>
              <p className="text-xs text-[#8C7B6B]">{hero?.routeLabel ?? getOperationalStory(hero?.originCountry ?? 'US', hero?.destinationCountry ?? 'NG')}</p>
              <p className="mt-2 text-sm text-[#1A1208]">{getCountryFlag(hero?.originCountry)} origin, customs clearance, destination warehouse, and POD are visible in one audit trail.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-[#F5EBE0] text-[var(--ink)]">KYC verified</Badge>
              <Badge className="bg-[#F5EBE0] text-[var(--ink)]">Documents checked</Badge>
              <Badge className="bg-[#F5EBE0] text-[var(--ink)]">POD captured</Badge>
            </div>
            {hero?.trackingEvents && <TrackingTimeline events={hero.trackingEvents} />}
          </CardContent>
        </Card>

        <Card className="border-[#E8DDD0] bg-white">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1208]">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Exception watch
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-sm text-amber-900">
              {held?.trackingNumber} is held for missing Form M.
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-sm text-blue-900">
              {retry?.trackingNumber} failed first delivery and is now on the reattempt path.
            </div>
            <div className="rounded-xl border border-[#E8DDD0] p-4">
              <p className="text-xs uppercase tracking-wider text-[#8C7B6B]">Audit trail</p>
              <div className="mt-3 space-y-2 text-sm text-[#1A1208]">
                {activity.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#C4622D]" />
                    <span>{item.message}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/admin/shipments" className="inline-flex items-center gap-2 text-sm font-semibold text-[#C4622D]">
              Review all shipments <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-[#E8DDD0] bg-white"><CardContent className="p-4"><Truck className="h-5 w-5 text-[#C4622D]" /><p className="mt-2 text-sm text-[#8C7B6B]">Dispatch and driver state stay tied to one shipment file.</p></CardContent></Card>
        <Card className="border-[#E8DDD0] bg-white"><CardContent className="p-4"><FileText className="h-5 w-5 text-[#C4622D]" /><p className="mt-2 text-sm text-[#8C7B6B]">Customs docs, duty estimate, and hold notes are visible together.</p></CardContent></Card>
        <Card className="border-[#E8DDD0] bg-white"><CardContent className="p-4"><CheckCircle2 className="h-5 w-5 text-green-600" /><p className="mt-2 text-sm text-[#8C7B6B]">POD and exception resolution are captured as operational proof.</p></CardContent></Card>
      </div>
    </div>
  );
}
