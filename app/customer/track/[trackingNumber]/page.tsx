'use client';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileCheck2,
  MapPin,
  Package,
  ShieldCheck,
  Signature,
  UserCheck,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrackingTimeline } from '@/components/shared/TrackingTimeline';
import { useShipmentStore, useAuthStore } from '@/store';
import { formatCurrency, formatDateTime, getCountryFlag, getCorridorLabel, getCustomsDocsLabel, getStatusLabel } from '@/lib/utils';
import type { Shipment } from '@/types';

const JOURNEY_STEPS = [
  'booked',
  'picked_up',
  'at_warehouse',
  'customs_cleared',
  'in_transit_international',
  'at_destination_warehouse',
  'out_for_delivery',
  'delivered',
];

function getProgress(status: string) {
  const index = JOURNEY_STEPS.indexOf(status);
  if (index >= 0) return ((index + 1) / JOURNEY_STEPS.length) * 100;
  if (status === 'customs_held' || status === 'customs_pending') return 38;
  if (status === 'failed_delivery') return 88;
  return 0;
}

function getTrustPill(status: string) {
  if (status === 'delivered') return { label: 'Delivered with POD', tone: 'bg-green-100 text-green-700 border-green-200' };
  if (status === 'customs_held' || status === 'customs_pending') return { label: 'Exception in review', tone: 'bg-amber-100 text-amber-700 border-amber-200' };
  if (status === 'failed_delivery') return { label: 'Recovery in progress', tone: 'bg-red-100 text-red-700 border-red-200' };
  return { label: 'Cross-border visibility active', tone: 'bg-blue-100 text-blue-700 border-blue-200' };
}

function buildProvisionalShipment(trackingNumber: string): Shipment {
  return {
    id: `preview-${trackingNumber}`,
    trackingNumber,
    userId: 'preview-user',
    responsibleTeam: 'Customer care + origin warehouse',
    corridor: 'US -> NG',
    routeLabel: 'US pickup -> international transit -> customs clearance -> Nigeria last-mile delivery',
    shipmentType: 'parcel',
    serviceType: 'express',
    status: 'pending_pickup',
    originCountry: 'US',
    destinationCountry: 'NG',
    pickupAddress: {
      id: 'preview-pickup',
      label: 'Pickup',
      type: 'commercial',
      recipientName: 'Booking preview',
      recipientPhone: '+14045551234',
      addressLine1: '123 Commerce St',
      city: 'Atlanta',
      stateProvince: 'GA',
      postalCode: '30301',
      country: 'US',
      isDefaultPickup: true,
      isDefaultDelivery: false,
    },
    deliveryAddress: {
      id: 'preview-delivery',
      label: 'Delivery',
      type: 'commercial',
      recipientName: 'Destination contact',
      recipientPhone: '+2348012345678',
      addressLine1: '15 Admiralty Way',
      city: 'Lagos',
      stateProvince: 'Lagos',
      postalCode: '10176',
      country: 'NG',
      isDefaultPickup: false,
      isDefaultDelivery: true,
    },
    weightKg: 5.2,
    chargeableWeightKg: 5.2,
    declaredValue: 850,
    currency: 'USD',
    packageDescription: 'Freshly booked shipment awaiting first operational scan',
    isInsured: true,
    insuranceCost: 13,
    shippingCost: 165,
    customsDuties: 35,
    totalCost: 213,
    paymentStatus: 'paid',
    paymentMethod: 'card',
    pickupDate: new Date().toISOString().slice(0, 10),
    estimatedDeliveryDate: 'Pending first scan',
    customsDocsStatus: 'submitted',
    requiresCustoms: true,
    customsReference: 'Pending first scan',
    etaConfidence: 74,
    complianceFlags: ['Booking confirmed', 'Payment recorded', 'Docs prepared'],
    notes: 'This is a prototype preview generated from a just-booked shipment before warehouse intake.',
    createdAt: new Date().toISOString(),
    trackingEvents: [
      {
        id: `${trackingNumber}-booked`,
        shipmentId: `preview-${trackingNumber}`,
        eventType: 'booked',
        description: 'Shipment booked and payment confirmed',
        locationName: 'Customer portal',
        team: 'Customer care',
        country: 'US',
        occurredAt: new Date().toISOString(),
      },
      {
        id: `${trackingNumber}-queued`,
        shipmentId: `preview-${trackingNumber}`,
        eventType: 'pending_pickup',
        description: 'Awaiting first warehouse scan and pickup assignment',
        locationName: 'Atlanta origin queue',
        team: 'Origin warehouse',
        country: 'US',
        occurredAt: new Date().toISOString(),
      },
    ],
  };
}

export default function TrackingDetailPage() {
  const params = useParams<{ trackingNumber: string }>();
  const { getShipmentByTracking } = useShipmentStore();
  const { isAuthenticated } = useAuthStore();
  const requestedTrackingNumber = decodeURIComponent(params.trackingNumber).toUpperCase();
  const shipment = getShipmentByTracking(requestedTrackingNumber) ?? (requestedTrackingNumber.startsWith('DS-') ? buildProvisionalShipment(requestedTrackingNumber) : null);

  if (!shipment) {
    notFound();
  }

  const progress = getProgress(shipment.status);
  const trustPill = getTrustPill(shipment.status);
  const isInternational = shipment.originCountry !== shipment.destinationCountry;
  const isNigeriaDestination = shipment.destinationCountry === 'NG';
  const storyCopy = isNigeriaDestination
    ? 'One tracking number covers origin pickup, international transit, customs handling, and the final handoff in Nigeria.'
    : 'One tracking number covers origin pickup, international transit, customs handling where required, and the final destination handoff.';
  const corridorCopy = isNigeriaDestination
    ? 'This corridor uses a single tracking number across origin warehouse, airline or ocean leg, destination customs, and Nigeria last-mile delivery.'
    : 'This corridor uses a single tracking number across origin warehouse, line-haul, customs checkpoints where required, and destination delivery.';
  const complianceItems = [
    { label: 'KYC verified', value: 'Approved', icon: UserCheck },
    { label: 'Payment', value: shipment.paymentStatus === 'paid' ? 'Confirmed' : 'Pending', icon: CreditCard },
    { label: 'Customs docs', value: getCustomsDocsLabel(shipment.customsDocsStatus), icon: FileCheck2 },
    { label: 'Insurance', value: shipment.isInsured ? 'Active' : 'Not selected', icon: ShieldCheck },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="rounded-[28px] border border-[var(--border-warm)] bg-[linear-gradient(135deg,#fffaf3_0%,#f7efe3_45%,#fdf8f0_100%)] p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-[var(--muted-text)]">
              <span className="font-semibold text-[var(--ink)]">DiasporaShip</span>
              <span>Customer shipment detail</span>
            </div>
            <div>
              <p className="font-mono text-lg font-semibold text-[var(--ink)]">{shipment.trackingNumber}</p>
              <h1 style={{ fontFamily: 'var(--font-playfair)' }} className="mt-2 text-3xl md:text-4xl font-bold text-[var(--ink)]">
                {getCorridorLabel(shipment.originCountry, shipment.destinationCountry)}
              </h1>
              <p className="mt-2 max-w-2xl text-sm md:text-base text-[var(--muted-text)]">{storyCopy}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={trustPill.tone}>{trustPill.label}</Badge>
              <Badge variant="secondary" className="bg-white">
                {getStatusLabel(shipment.status)}
              </Badge>
              <Badge variant="outline" className="border-[var(--border-warm)] bg-white">
                {getCountryFlag(shipment.originCountry)} {shipment.originCountry}
                <ArrowRight className="mx-1 h-3 w-3" />
                {getCountryFlag(shipment.destinationCountry)} {shipment.destinationCountry}
              </Badge>
            </div>
          </div>

          <Card className="w-full max-w-sm border-[var(--border-warm)] bg-white/90">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-[var(--muted-text)]">
                <span>Delivery progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="mt-3 h-3" />
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[var(--muted-text)]">ETA</p>
                  <p className="font-semibold text-[var(--ink)]">{shipment.estimatedDeliveryDate}</p>
                </div>
                <div>
                  <p className="text-[var(--muted-text)]">Currency</p>
                  <p className="font-semibold text-[var(--ink)]">{shipment.currency}</p>
                </div>
                <div>
                  <p className="text-[var(--muted-text)]">Weight</p>
                  <p className="font-semibold text-[var(--ink)]">{shipment.chargeableWeightKg} kg</p>
                </div>
                <div>
                  <p className="text-[var(--muted-text)]">Route</p>
                  <p className="font-semibold text-[var(--ink)]">{shipment.originCountry} - {shipment.destinationCountry}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
        <div className="space-y-6">
          <Card className="border-[var(--border-warm)]">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-[var(--terra)]" />
                <h2 className="text-lg font-semibold text-[var(--ink)]">Shipment overview</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-[var(--muted-text)]">Package</p>
                  <p className="font-medium text-[var(--ink)]">{shipment.packageDescription}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-[var(--muted-text)]">Responsible team</p>
                  <p className="font-medium text-[var(--ink)]">{shipment.responsibleTeam || 'Shared ops team'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-[var(--muted-text)]">Pickup</p>
                  <p className="font-medium text-[var(--ink)]">{shipment.pickupAddress.city}, {shipment.pickupAddress.country}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-[var(--muted-text)]">Delivery</p>
                  <p className="font-medium text-[var(--ink)]">{shipment.deliveryAddress.city}, {shipment.deliveryAddress.country}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-[var(--muted-text)]">Customs reference</p>
                  <p className="font-medium text-[var(--ink)]">{shipment.customsReference || 'Not required'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-[var(--muted-text)]">Duties estimate</p>
                  <p className="font-medium text-[var(--ink)]">{formatCurrency(shipment.customsDuties, shipment.currency)}</p>
                </div>
              </div>
              {isInternational && (
                <div className="mt-5 rounded-2xl bg-[var(--cream)] p-4 text-sm text-[var(--muted-text)]">{corridorCopy}</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-[var(--border-warm)]">
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold text-[var(--ink)]">Compliance and trust</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {complianceItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-2xl border border-[var(--border-warm)] bg-[var(--cream)] p-4">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-[var(--terra)]" />
                        <span className="text-sm font-medium text-[var(--ink)]">{item.label}</span>
                      </div>
                      <p className="mt-2 text-sm text-[var(--muted-text)]">{item.value}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-[var(--border-warm)] bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]"><MapPin className="h-4 w-4 text-[var(--terra)]" />Handoff points</div>
                  <p className="mt-2 text-sm text-[var(--muted-text)]">Origin warehouse, customs, dispatch, driver, and delivery contact all stay linked to this shipment.</p>
                </div>
                <div className="rounded-2xl border border-[var(--border-warm)] bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]"><Clock3 className="h-4 w-4 text-[var(--terra)]" />ETA confidence</div>
                  <p className="mt-2 text-sm text-[var(--muted-text)]">{shipment.etaConfidence ?? 90}% confident unless customs or weather creates a hold.</p>
                </div>
                <div className="rounded-2xl border border-[var(--border-warm)] bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]"><ShieldCheck className="h-4 w-4 text-[var(--terra)]" />Audit trail</div>
                  <p className="mt-2 text-sm text-[var(--muted-text)]">Payment, KYC, customs docs, and delivery proof remain visible in the event log.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[var(--border-warm)]">
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold text-[var(--ink)]">Tracking timeline</h2>
              <TrackingTimeline events={shipment.trackingEvents} mode="full" />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-[var(--border-warm)]">
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold text-[var(--ink)]">Delivery proof</h2>
              {shipment.status === 'delivered' ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--cream)] p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]">
                      <Signature className="h-4 w-4 text-[var(--terra)]" />
                      Recipient signature
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted-text)]">{shipment.assignedDriverName || 'Driver'} captured a signed handoff at {shipment.proofOfDeliveryLocation || shipment.deliveryAddress.city}.</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--cream)] p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]">
                      <CheckCircle2 className="h-4 w-4 text-[var(--terra)]" />
                      Delivered timestamp
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted-text)]">{formatDateTime(shipment.podDeliveredAt || shipment.actualDeliveryDate || shipment.createdAt)}</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--cream)] p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]">
                      <Wallet className="h-4 w-4 text-[var(--terra)]" />
                      Proof package
                    </div>
                    <p className="mt-2 text-sm text-[var(--muted-text)]">
                      {shipment.proofOfDeliveryMethod === 'otp' ? 'OTP handoff code confirmed.' : 'Photo and signature proof stored in the audit trail.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--border-warm)] bg-[var(--cream)] p-4 text-sm text-[var(--muted-text)]">
                  Proof of delivery appears here after the shipment reaches the final handoff point.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-[var(--border-warm)]">
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold text-[var(--ink)]">Exception status</h2>
              {shipment.status === 'customs_held' ? (
                <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <p className="font-semibold">Customs hold detected.</p>
                  <p>{shipment.delayReason || 'Additional customs documents are required before release.'}</p>
                  <p>Responsible team: {shipment.responsibleTeam || 'Customs desk'}</p>
                </div>
              ) : shipment.status === 'failed_delivery' ? (
                <div className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                  <p className="font-semibold">First delivery attempt failed.</p>
                  <p>{shipment.notes || 'The driver reported recipient unavailability and rescheduled the handoff.'}</p>
                  <p>Next step: dispatch confirms a second attempt and keeps the customer updated.</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-[var(--border-warm)] bg-[var(--cream)] p-4 text-sm text-[var(--muted-text)]">
                  No active exception on this shipment. All checkpoints are flowing through the same shipment record.
                </div>
              )}
            </CardContent>
          </Card>

          {!isAuthenticated && (
            <Card className="border-[var(--terra)] bg-[var(--terra-pale)]">
              <CardContent className="p-6 text-center">
                <h3 style={{ fontFamily: 'var(--font-playfair)' }} className="text-lg font-bold text-[var(--ink)] mb-2">
                  Want to manage shipments?
                </h3>
                <p className="text-sm text-[var(--muted-text)] mb-4">
                  Sign in to see saved addresses, documents, customs activity, and payment history.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white">
                    <Link href="/customer/auth/register">Sign Up Free</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/customer/auth/login">Sign In</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
