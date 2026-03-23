'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useShipmentStore, useDriverStore } from '@/store';
import { formatCurrency, getCountryFlag, getOperationalStory } from '@/lib/utils';
import { CheckCircle2, Printer, Truck, UserRound } from 'lucide-react';

export default function WarehouseDispatchPage() {
  const { shipments } = useShipmentStore();
  const { drivers } = useDriverStore();
  const [vehicle, setVehicle] = useState('');
  const [carrier, setCarrier] = useState('DHL');

  const dispatchReady = useMemo(
    () => shipments.filter((shipment) => shipment.status === 'out_for_delivery' || shipment.status === 'customs_cleared' || shipment.status === 'delivered'),
    [shipments]
  );

  const assignedDriver = drivers.find((driver) => driver.id === 'd1');

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr,0.7fr]">
      <Card className="border-[#E8DDD0] bg-white">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#1A1208]">Dispatch queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dispatchReady.map((shipment) => (
            <div key={shipment.id} className="rounded-2xl border border-[#E8DDD0] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm font-semibold text-[#1A1208]">{shipment.trackingNumber}</p>
                  <p className="text-xs text-[#8C7B6B]">{shipment.routeLabel ?? getOperationalStory(shipment.originCountry, shipment.destinationCountry)}</p>
                </div>
                <Badge className="bg-[#F5EBE0] text-[var(--ink)]">{getCountryFlag(shipment.destinationCountry)} {shipment.destinationCountry}</Badge>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-[#1A1208] md:grid-cols-3">
                <div>Carrier: {shipment.assignedDriverName ?? assignedDriver?.name ?? 'Unassigned'}</div>
                <div>Amount: {formatCurrency(shipment.totalCost, shipment.currency)}</div>
                <div>Documents: {shipment.customsDocsStatus}</div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button className="bg-[#C4622D] text-white hover:bg-[#D97B48]">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Dispatch now
                </Button>
                <Button variant="outline" className="border-[#E8DDD0] text-[#1A1208] hover:bg-[#FAF6EF]">
                  <Printer className="h-4 w-4 mr-2" />
                  Print manifest
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-[#E8DDD0] bg-white">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#1A1208]">Last-mile handoff</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#8C7B6B]">Vehicle</label>
            <Select value={vehicle} onValueChange={setVehicle}>
              <SelectTrigger className="border-[#E8DDD0] bg-[#FAF6EF]">
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lg-284">LG-284-KJA</SelectItem>
                <SelectItem value="lg-931">LG-931-EPE</SelectItem>
                <SelectItem value="ph-778">PH-778-RVS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#8C7B6B]">Carrier / hub note</label>
            <Input value={carrier} onChange={(e) => setCarrier(e.target.value)} className="border-[#E8DDD0] bg-[#FAF6EF]" />
          </div>
          <div className="rounded-2xl border border-[#E8DDD0] bg-[#FAF6EF] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1208]">
              <UserRound className="h-4 w-4 text-[#C4622D]" />
              Driver ready
            </div>
            <p className="mt-2 text-sm text-[#8C7B6B]">{assignedDriver?.name} is assigned to the hero shipment for final delivery and POD capture.</p>
          </div>
          <Button className="w-full bg-[#C4622D] text-white hover:bg-[#D97B48]">Confirm dispatch wave</Button>
        </CardContent>
      </Card>
    </div>
  );
}
