'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable, FilterBar, StatusBadge } from '@/components/shared';
import type { FilterConfig } from '@/components/shared';
import { useShipmentStore } from '@/store';
import { formatCurrency, formatDate, getCountryFlag, getCustomsDocsLabel } from '@/lib/utils';
import type { ShipmentStatus } from '@/types';

const filterConfigs: FilterConfig[] = [
  { key: 'status', type: 'select', label: 'Status', options: [
    { value: 'customs_pending', label: 'Customs Pending' },
    { value: 'customs_cleared', label: 'Customs Cleared' },
    { value: 'customs_held', label: 'Customs Held' },
    { value: 'in_transit_international', label: 'In Transit Intl' },
  ]},
  { key: 'country', type: 'select', label: 'Country', options: [
    { value: 'US', label: 'US' },
    { value: 'NG', label: 'NG' },
    { value: 'CN', label: 'CN' },
    { value: 'GB', label: 'GB' },
  ]},
];

export default function CustomsShipmentsPage() {
  const { shipments } = useShipmentStore();
  const [filters, setFilters] = useState<Record<string, string>>({});

  const customsRows = useMemo(() => shipments.filter((shipment) => shipment.requiresCustoms || shipment.customsDocsStatus !== 'not_required'), [shipments]);

  const filtered = customsRows.filter((shipment) => {
    if (filters.status && shipment.status !== filters.status) return false;
    if (filters.country && shipment.originCountry !== filters.country && shipment.destinationCountry !== filters.country) return false;
    return true;
  });

  const columns = [
    { key: 'trackingNumber', label: 'Tracking', render: (shipment: typeof customsRows[number]) => <span className="font-mono text-xs font-semibold">{shipment.trackingNumber}</span> },
    { key: 'route', label: 'Route', render: (shipment: typeof customsRows[number]) => <span>{getCountryFlag(shipment.originCountry)} {shipment.originCountry} {'->'} {getCountryFlag(shipment.destinationCountry)} {shipment.destinationCountry}</span> },
    { key: 'docs', label: 'Docs', render: (shipment: typeof customsRows[number]) => <Badge className="bg-[#F5EBE0] text-[var(--ink)]">{getCustomsDocsLabel(shipment.customsDocsStatus)}</Badge> },
    { key: 'status', label: 'Status', render: (shipment: typeof customsRows[number]) => <StatusBadge status={shipment.status as ShipmentStatus} /> },
    { key: 'amount', label: 'Duties', render: (shipment: typeof customsRows[number]) => <span>{formatCurrency(shipment.customsDuties, shipment.currency)}</span> },
    { key: 'updated', label: 'Updated', render: (shipment: typeof customsRows[number]) => <span className="text-xs text-[var(--muted-text)]">{formatDate(shipment.createdAt)}</span> },
  ];

  return (
    <div className="space-y-5">
      <FilterBar filters={filterConfigs} onFilterChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))} onClear={() => setFilters({})} values={filters} />
      <Card className="border-[#E8DDD0] bg-white">
        <CardContent className="p-0">
          <DataTable columns={columns as any} data={filtered as any} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}
