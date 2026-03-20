'use client';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { MapPin, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useShipmentStore, useAuthStore } from '@/store';
import { formatDateTime, getStatusLabel } from '@/lib/utils';

const TRACKED_STATUSES = [
  'pending_pickup',
  'picked_up',
  'at_warehouse',
  'in_transit_international',
  'at_destination_warehouse',
  'out_for_delivery',
  'delivered',
];

const COUNTRY_FLAGS: Record<string, string> = {
  US: '🇺🇸', NG: '🇳🇬', GB: '🇬🇧', CN: '🇨🇳', GH: '🇬🇭', KE: '🇰🇪',
};

export default function TrackingDetailPage() {
  const params = useParams<{ trackingNumber: string }>();
  const { getShipmentByTracking } = useShipmentStore();
  const { isAuthenticated } = useAuthStore();
  const shipment = getShipmentByTracking(decodeURIComponent(params.trackingNumber));

  if (!shipment) {
    notFound();
  }

  const currentIndex = Math.max(TRACKED_STATUSES.indexOf(shipment.status), 0);
  const progress = TRACKED_STATUSES.includes(shipment.status)
    ? ((currentIndex + 1) / TRACKED_STATUSES.length) * 100
    : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <div className="mb-4">
          <span
            style={{ fontFamily: 'var(--font-playfair)' }}
            className="text-2xl font-bold text-[var(--ink)]"
          >
            Diaspora<span style={{ color: 'var(--terra)' }}>Ship</span>
          </span>
        </div>
        <p className="font-mono text-lg font-semibold text-[var(--ink)]">{shipment.trackingNumber}</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Badge
            variant={
              shipment.status === 'delivered'
                ? 'success'
                : shipment.status.includes('customs')
                ? 'warning'
                : 'secondary'
            }
          >
            {getStatusLabel(shipment.status)}
          </Badge>
        </div>
      </div>

      <Card className="border-[var(--border-warm)]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--ink)]">Delivery Progress</span>
            <span className="text-sm text-[var(--muted-text)]">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TRACKED_STATUSES.map((status, index) => (
              <div
                key={status}
                className={`p-3 rounded-lg text-center text-xs font-medium transition-colors ${
                  index <= currentIndex
                    ? 'bg-[var(--terra-pale)] text-[var(--terra)] border border-[var(--terra)]/20'
                    : 'bg-[var(--cream)] text-[var(--muted-text)]'
                }`}
              >
                {index <= currentIndex && (
                  <CheckCircle2 className="h-4 w-4 mx-auto mb-1" />
                )}
                {getStatusLabel(status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-[var(--border-warm)]">
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-[var(--ink)] mb-4">Tracking Timeline</h3>
          <div className="space-y-4">
            {shipment.trackingEvents
              .slice()
              .reverse()
              .map((event, index, arr) => (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        index === 0
                          ? 'bg-[var(--terra)] ring-4 ring-[var(--terra-pale)]'
                          : 'bg-[var(--border-strong)]'
                      }`}
                    />
                    {index < arr.length - 1 && (
                      <div className="w-px flex-1 bg-[var(--border-warm)] mt-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-[var(--ink)]">{event.description}</p>
                    <div className="flex items-center gap-2 text-xs text-[var(--muted-text)] mt-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDateTime(event.occurredAt)}</span>
                      <span>&middot;</span>
                      <MapPin className="h-3 w-3" />
                      <span>{event.locationName}</span>
                      {event.country && (
                        <>
                          <span>&middot;</span>
                          <span>{COUNTRY_FLAGS[event.country] || ''} {event.country}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {!isAuthenticated && (
        <Card className="border-[var(--terra)] bg-[var(--terra-pale)]">
          <CardContent className="p-6 text-center">
            <h3
              style={{ fontFamily: 'var(--font-playfair)' }}
              className="text-lg font-bold text-[var(--ink)] mb-2"
            >
              Want to ship with us?
            </h3>
            <p className="text-sm text-[var(--muted-text)] mb-4">
              Create an account to manage shipments, track packages, and access exclusive features.
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white">
                <Link href="/customer/auth/register">Sign Up Free</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/customer/auth/login">
                  Sign In
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
