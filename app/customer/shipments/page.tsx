'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MapPin,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { useShipmentStore } from '@/store';
import { formatCurrency, formatDate, getStatusLabel } from '@/lib/utils';
import type { Shipment, ShipmentStatus, ShipmentType } from '@/types';

const ALL_STATUSES: ShipmentStatus[] = [
  'draft', 'pending_pickup', 'pickup_assigned', 'picked_up', 'at_warehouse',
  'processing', 'customs_pending', 'customs_cleared', 'customs_held',
  'in_transit_domestic', 'in_transit_international', 'at_destination_warehouse',
  'out_for_delivery', 'delivered', 'failed_delivery', 'returned_to_sender',
  'cancelled', 'on_hold',
];

const SHIPMENT_TYPES: ShipmentType[] = ['parcel', 'cargo', 'freight', 'document', 'fragile', 'cold_chain'];

const COUNTRY_FLAGS: Record<string, string> = {
  US: '🇺🇸', NG: '🇳🇬', GB: '🇬🇧', CN: '🇨🇳', GH: '🇬🇭', KE: '🇰🇪',
  CA: '🇨🇦', DE: '🇩🇪', FR: '🇫🇷', ZA: '🇿🇦',
};

function ShipmentCard({ shipment }: { shipment: Shipment }) {
  return (
    <Link
      href={`/customer/shipments/${shipment.id}`}
      className="block p-4 rounded-xl border border-[var(--border-warm)] hover:bg-[var(--terra-pale)] transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--terra-pale)] flex items-center justify-center text-[var(--terra)] flex-shrink-0">
          <Package className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm font-semibold">{shipment.trackingNumber}</span>
            <Badge
              variant={
                shipment.status === 'delivered'
                  ? 'success'
                  : shipment.status.includes('customs')
                  ? 'warning'
                  : 'secondary'
              }
              className="text-[10px] px-1.5 py-0"
            >
              {getStatusLabel(shipment.status)}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted-text)] mt-1">
            <MapPin className="h-3 w-3" />
            {COUNTRY_FLAGS[shipment.originCountry]} {shipment.originCountry} &rarr;{' '}
            {COUNTRY_FLAGS[shipment.destinationCountry]} {shipment.destinationCountry}
            <span className="mx-1">&middot;</span>
            {shipment.serviceType.replace('_', ' ')}
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-[var(--muted-text)]">
            <span>{formatDate(shipment.createdAt)}</span>
            <span className="font-semibold text-[var(--ink)]">
              {formatCurrency(shipment.totalCost, shipment.currency)}
            </span>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-[var(--muted-text)] flex-shrink-0 mt-1" />
      </div>
    </Link>
  );
}

export default function ShipmentsPage() {
  const router = useRouter();
  const { shipments } = useShipmentStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 20;

  const filtered = useMemo(() => {
    return shipments.filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (typeFilter !== 'all' && s.shipmentType !== typeFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          s.trackingNumber.toLowerCase().includes(q) ||
          s.deliveryAddress.city.toLowerCase().includes(q) ||
          s.deliveryAddress.country.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [shipments, statusFilter, typeFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const clearFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setSearchQuery('');
    setPage(1);
  };

  const hasFilters = statusFilter !== 'all' || typeFilter !== 'all' || searchQuery;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            style={{ fontFamily: 'var(--font-playfair)' }}
            className="text-2xl font-bold text-[var(--ink)]"
          >
            My Shipments
          </h1>
          <p className="text-sm text-[var(--muted-text)]">
            {filtered.length} shipment{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Button
          asChild
          className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white"
        >
          <Link href="/customer/ship">
            <Plus className="h-4 w-4 mr-1" />
            New Shipment
          </Link>
        </Button>
      </div>

      <Card className="border-[var(--border-warm)]">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-text)]" />
              <Input
                placeholder="Search by tracking ID or destination..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {ALL_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {getStatusLabel(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={typeFilter}
              onValueChange={(v) => {
                setTypeFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {SHIPMENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1).replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="hidden md:block">
        <Card className="border-[var(--border-warm)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <Package className="h-10 w-10 text-[var(--muted-text)] mx-auto mb-2 opacity-40" />
                    <p className="font-medium text-[var(--ink)]">No shipments found</p>
                    <p className="text-sm text-[var(--muted-text)]">Try adjusting your filters.</p>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((shipment) => (
                  <TableRow
                    key={shipment.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/customer/shipments/${shipment.id}`)}
                  >
                    <TableCell>
                      <span className="font-mono text-sm font-semibold">
                        {shipment.trackingNumber}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] capitalize">
                        {shipment.shipmentType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {COUNTRY_FLAGS[shipment.originCountry]} {shipment.originCountry} &rarr;{' '}
                        {COUNTRY_FLAGS[shipment.destinationCountry]} {shipment.destinationCountry}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm capitalize">
                        {shipment.serviceType.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          shipment.status === 'delivered'
                            ? 'success'
                            : shipment.status.includes('customs')
                            ? 'warning'
                            : shipment.status === 'cancelled'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className="text-[10px]"
                      >
                        {getStatusLabel(shipment.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{formatDate(shipment.createdAt)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-semibold">
                        {formatCurrency(shipment.totalCost, shipment.currency)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <ArrowRight className="h-4 w-4 text-[var(--muted-text)]" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <div className="md:hidden space-y-3">
        {paginated.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-10 w-10 text-[var(--muted-text)] mx-auto mb-2 opacity-40" />
            <p className="font-medium text-[var(--ink)]">No shipments found</p>
            <p className="text-sm text-[var(--muted-text)]">Try adjusting your filters.</p>
          </div>
        ) : (
          paginated.map((shipment) => (
            <ShipmentCard key={shipment.id} shipment={shipment} />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--muted-text)]">
            Showing {(page - 1) * perPage + 1} to{' '}
            {Math.min(page * perPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-[var(--ink)]">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
