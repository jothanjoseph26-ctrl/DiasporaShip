'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useShipmentStore } from '@/store';
import { getOperationalStory } from '@/lib/utils';
import { ChevronRight, Package, Truck, AlertTriangle } from 'lucide-react';

export default function DriverJobsQueuePage() {
  const router = useRouter();
  const { shipments } = useShipmentStore();
  const jobs = shipments.filter((shipment) => shipment.id === 's1' || shipment.id === 's5' || shipment.status === 'customs_held');

  return (
    <div className="space-y-3 pb-6">
      {jobs.map((job) => (
        <Card key={job.id} className="cursor-pointer border-[#E8DDD0] bg-white" onClick={() => router.push(`/driver/jobs/${job.id}`)}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF6EF]">
              {job.status === 'customs_held' ? <AlertTriangle className="h-5 w-5 text-amber-600" /> : <Truck className="h-5 w-5 text-[#C4622D]" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm font-semibold text-[#1A1208]">{job.trackingNumber}</p>
                <Badge className="bg-[#F5EBE0] text-[var(--ink)]">{job.status}</Badge>
              </div>
              <p className="truncate text-sm text-[#8C7B6B]">{job.routeLabel ?? getOperationalStory(job.originCountry, job.destinationCountry)}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-[#8C7B6B]" />
          </CardContent>
        </Card>
      ))}
      <Card className="border-dashed border-[#E8DDD0] bg-white">
        <CardContent className="flex items-center gap-3 p-4 text-sm text-[#8C7B6B]">
          <Package className="h-4 w-4" />
          Reattempt flow is visible here after the first delivery failure.
        </CardContent>
      </Card>
    </div>
  );
}
