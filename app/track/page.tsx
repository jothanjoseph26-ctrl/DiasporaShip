'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NavBar } from '@/components/marketing/NavBar';
import { Footer } from '@/components/marketing/Footer';
import { getStatusLabel, formatDateTime } from '@/lib/utils';
import { useShipmentStore } from '@/store';
import type { Shipment, ShipmentStatus, TrackingEvent } from '@/types';
import { Search, Package, MapPin, Clock, CheckCircle2, Truck, ArrowRight } from 'lucide-react';

const countryFlags: Record<string, string> = {
  US: '🇺🇸',
  NG: '🇳🇬',
  GH: '🇬🇭',
  KE: '🇰🇪',
  GB: '🇬🇧',
  UK: '🇬🇧',
};

const publicMockShipments: Record<string, any> = {
  'DS-20260318-A1B2C3': {
    trackingNumber: 'DS-20260318-A1B2C3',
    status: 'in_transit_international',
    serviceType: 'express',
    originCountry: 'US',
    destinationCountry: 'NG',
    createdAt: '2026-03-15T10:30:00Z',
    estimatedDeliveryDate: '2026-03-25',
    trackingEvents: [
      { id: 'e1', description: 'Shipment booked and confirmed', locationName: 'Atlanta, GA', country: 'US', occurredAt: '2026-03-15T10:30:00Z' },
      { id: 'e2', description: 'Package picked up from sender', locationName: 'Atlanta, GA', country: 'US', occurredAt: '2026-03-16T09:00:00Z' },
      { id: 'e3', description: 'Arrived at Atlanta sorting facility', locationName: 'Hartsfield-Jackson Airport', country: 'US', occurredAt: '2026-03-16T14:30:00Z' },
      { id: 'e4', description: 'Departed via international air freight', locationName: 'Hartsfield-Jackson Airport', country: 'US', occurredAt: '2026-03-17T08:00:00Z' },
      { id: 'e5', description: 'In transit — international flight', locationName: 'In Transit', country: '', occurredAt: '2026-03-18T02:00:00Z' },
    ],
  },
  'DS-20260316-D4E5F6': {
    trackingNumber: 'DS-20260316-D4E5F6',
    status: 'out_for_delivery',
    serviceType: 'standard',
    originCountry: 'NG',
    destinationCountry: 'NG',
    createdAt: '2026-03-14T08:00:00Z',
    estimatedDeliveryDate: '2026-03-18',
    trackingEvents: [
      { id: 'e1', description: 'Shipment booked', locationName: 'Lagos', country: 'NG', occurredAt: '2026-03-14T08:00:00Z' },
      { id: 'e2', description: 'Picked up', locationName: 'Victoria Island', country: 'NG', occurredAt: '2026-03-15T10:00:00Z' },
      { id: 'e3', description: 'At warehouse', locationName: 'Lagos Hub', country: 'NG', occurredAt: '2026-03-15T14:00:00Z' },
      { id: 'e4', description: 'Out for delivery', locationName: 'Lekki', country: 'NG', occurredAt: '2026-03-18T08:00:00Z' },
    ],
  },
};

const progressSteps = [
  { key: 'pending_pickup', label: 'Pending Pickup' },
  { key: 'picked_up', label: 'Picked Up' },
  { key: 'in_transit', label: 'In Transit' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

function getStepIndex(status: ShipmentStatus): number {
  const statusMap: Record<string, number> = {
    draft: 0,
    pending_pickup: 0,
    pickup_assigned: 0,
    picked_up: 1,
    at_warehouse: 1,
    processing: 1,
    customs_pending: 2,
    customs_cleared: 2,
    customs_held: 2,
    in_transit_domestic: 2,
    in_transit_international: 2,
    at_destination_warehouse: 2,
    out_for_delivery: 3,
    delivered: 4,
    failed_delivery: 3,
    returned_to_sender: 3,
    cancelled: 0,
    on_hold: 2,
  };
  return statusMap[status] ?? 0;
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending_pickup: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    pickup_assigned: 'bg-blue-100 text-blue-800 border-blue-200',
    picked_up: 'bg-blue-100 text-blue-800 border-blue-200',
    at_warehouse: 'bg-purple-100 text-purple-800 border-purple-200',
    processing: 'bg-purple-100 text-purple-800 border-purple-200',
    customs_pending: 'bg-orange-100 text-orange-800 border-orange-200',
    customs_cleared: 'bg-green-100 text-green-800 border-green-200',
    customs_held: 'bg-red-100 text-red-800 border-red-200',
    in_transit_domestic: 'bg-blue-100 text-blue-800 border-blue-200',
    in_transit_international: 'bg-blue-100 text-blue-800 border-blue-200',
    at_destination_warehouse: 'bg-purple-100 text-purple-800 border-purple-200',
    out_for_delivery: 'bg-green-100 text-green-800 border-green-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    failed_delivery: 'bg-red-100 text-red-800 border-red-200',
    returned_to_sender: 'bg-gray-100 text-gray-800 border-gray-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
    on_hold: 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
}

function getPublicShipment(trackingNumber: string): (Partial<Shipment> & { trackingEvents: TrackingEvent[] }) | null {
  const storeShipment = useShipmentStore.getState().getShipmentByTracking(trackingNumber);
  if (storeShipment) {
    return storeShipment;
  }
  const mock = publicMockShipments[trackingNumber];
  if (mock) return mock;
  return null;
}

function getServiceLabel(serviceType: string): string {
  const labels: Record<string, string> = {
    standard: 'Standard',
    express: 'Express',
    same_day: 'Same Day',
    economy: 'Economy',
    air_freight: 'Air Freight',
    sea_freight: 'Sea Freight',
  };
  return labels[serviceType] || serviceType;
}

export default function TrackPage() {
  const [trackingInput, setTrackingInput] = useState('');
  const [searchedNumber, setSearchedNumber] = useState('');
  const [shipment, setShipment] = useState<(Partial<Shipment> & { trackingEvents: TrackingEvent[] }) | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = trackingInput.trim().toUpperCase();
    if (!trimmed) return;

    setSearchedNumber(trimmed);
    setHasSearched(true);

    const result = getPublicShipment(trimmed);
    if (result) {
      setShipment(result);
      setNotFound(false);
    } else {
      setShipment(null);
      setNotFound(true);
    }
  }

  function handleExampleClick() {
    const example = 'DS-20260318-A1B2C3';
    setTrackingInput(example);
    setSearchedNumber(example);
    setHasSearched(true);
    const result = getPublicShipment(example);
    if (result) {
      setShipment(result);
      setNotFound(false);
    }
  }

  const stepIndex = shipment ? getStepIndex(shipment.status as ShipmentStatus) : 0;
  const sortedEvents = shipment
    ? [...shipment.trackingEvents].sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    : [];

  return (
    <div className="min-h-screen bg-[#FAF6EF]">
      <NavBar />

      <main className="pt-32 pb-16">
        {!hasSearched && (
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h1 className="font-playfair text-4xl font-bold text-[var(--ink)] mb-4">
              Track Your Shipment
            </h1>
            <p className="text-[#8C7B6B] text-lg mb-10">
              Enter your tracking number to see real-time updates on your package&apos;s journey.
            </p>

            <form onSubmit={handleSearch} className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C7B6B]" />
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full h-14 pl-12 pr-4 text-lg rounded-xl border border-[#E8DDD0] bg-white outline-none focus:ring-2 focus:ring-[var(--terra)] focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                className="h-14 px-10 rounded-xl bg-[var(--ink)] text-white font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Track
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 text-sm text-[#8C7B6B]">
              <span>Don&apos;t have a tracking number?</span>
              <button
                onClick={handleExampleClick}
                className="px-3 py-1 rounded-full bg-[#E8DDD0] text-[var(--ink)] font-medium hover:bg-[#DDD0C0] transition-colors cursor-pointer"
              >
                Try: DS-20260318-A1B2C3
              </button>
            </div>

            <p className="mt-3 text-sm text-[#8C7B6B]">
              Don&apos;t have a tracking number?{' '}
              <Link href="/customer/auth/login" className="text-[var(--terra)] font-medium hover:underline">
                Sign in
              </Link>{' '}
              to your account.
            </p>
          </div>
        )}

        {hasSearched && (
          <>
            <div className="max-w-2xl mx-auto px-6 text-center mb-10">
              <h1 className="font-playfair text-4xl font-bold text-[var(--ink)] mb-4">
                Track Your Shipment
              </h1>

              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C7B6B]" />
                  <input
                    type="text"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="Enter tracking number"
                    className="w-full h-14 pl-12 pr-4 text-lg rounded-xl border border-[#E8DDD0] bg-white outline-none focus:ring-2 focus:ring-[var(--terra)] focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="h-14 px-10 rounded-xl bg-[var(--ink)] text-white font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Track
                </button>
              </form>
            </div>

            {shipment && (
              <div className="max-w-3xl mx-auto px-6">
                <div className="bg-white rounded-2xl border border-[#E8DDD0] p-8">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="font-mono font-bold text-xl text-[var(--ink)]">
                        {shipment.trackingNumber}
                      </div>
                      <div className="text-sm text-[#8C7B6B] mt-1">
                        {getServiceLabel(shipment.serviceType as string)} Service
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(shipment.status as string)}`}>
                      {getStatusLabel(shipment.status as string)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-2xl font-semibold text-[var(--ink)] mb-8">
                    <span>{countryFlags[shipment.originCountry as string] || '🌍'}</span>
                    <span>{shipment.originCountry}</span>
                    <ArrowRight className="w-5 h-5 text-[#8C7B6B]" />
                    <span>{countryFlags[shipment.destinationCountry as string] || '🌍'}</span>
                    <span>{shipment.destinationCountry}</span>
                  </div>

                  <div className="mb-10">
                    <div className="flex items-center justify-between relative">
                      <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-[#E8DDD0]" />
                      <div
                        className="absolute top-5 left-[10%] h-0.5 bg-[var(--terra)] transition-all"
                        style={{ width: `${Math.min(stepIndex / (progressSteps.length - 1), 1) * 80}%` }}
                      />
                      {progressSteps.map((step, i) => {
                        const isCompleted = i < stepIndex;
                        const isCurrent = i === stepIndex;
                        return (
                          <div key={step.key} className="relative z-10 flex flex-col items-center" style={{ width: '20%' }}>
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                                isCompleted
                                  ? 'bg-[var(--terra)] border-[var(--terra)] text-white'
                                  : isCurrent
                                  ? 'bg-[var(--terra)] border-[var(--terra)] text-white'
                                  : 'bg-white border-[#E8DDD0] text-[#8C7B6B]'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : isCurrent ? (
                                <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
                                </span>
                              ) : (
                                <span className="w-2.5 h-2.5 rounded-full bg-[#E8DDD0]" />
                              )}
                            </div>
                            <span
                              className={`mt-2 text-xs font-medium text-center ${
                                isCompleted || isCurrent ? 'text-[var(--ink)]' : 'text-[#8C7B6B]'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {shipment.estimatedDeliveryDate && (
                    <div className="flex items-center gap-2 mb-8 px-4 py-3 rounded-xl bg-[#FAF6EF] text-sm text-[#8C7B6B]">
                      <Clock className="w-4 h-4 text-[var(--terra)]" />
                      <span>
                        Estimated delivery: <span className="font-semibold text-[var(--ink)]">{shipment.estimatedDeliveryDate}</span>
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-[var(--ink)] mb-5 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-[var(--terra)]" />
                      Tracking History
                    </h3>
                    <div className="relative">
                      <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-[#E8DDD0]" />
                      <div className="space-y-0">
                        {sortedEvents.map((event, idx) => (
                          <div key={event.id} className="relative pl-10 pb-6 last:pb-0">
                            <div
                              className={`absolute left-[8px] top-1 w-[15px] h-[15px] rounded-full border-2 ${
                                idx === 0
                                  ? 'bg-[var(--terra)] border-[var(--terra)]'
                                  : 'bg-white border-[#E8DDD0]'
                              }`}
                            />
                            <div>
                              <p className="text-sm font-medium text-[var(--ink)]">
                                {event.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-[#8C7B6B]">
                                {event.locationName && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {event.locationName}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDateTime(event.occurredAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#E8DDD0] text-center text-sm text-[#8C7B6B]">
                    Want full details?{' '}
                    <Link href="/customer/auth/login" className="text-[var(--terra)] font-medium hover:underline">
                      Sign in to your account
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {notFound && (
              <div className="max-w-3xl mx-auto px-6">
                <div className="bg-white rounded-2xl border border-[#E8DDD0] p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
                    <Package className="w-8 h-8 text-red-400" />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--ink)] mb-2">
                    No shipment found
                  </h2>
                  <p className="text-[#8C7B6B] mb-2">
                    We couldn&apos;t find a shipment with tracking number:
                  </p>
                  <p className="font-mono font-bold text-lg text-[var(--ink)] mb-4">
                    {searchedNumber}
                  </p>
                  <p className="text-sm text-[#8C7B6B] mb-6">
                    Double-check your tracking number and try again. It should look like{' '}
                    <span className="font-mono font-medium">DS-XXXXXXXXXXXX</span>.
                  </p>
                  <div className="text-sm text-[#8C7B6B]">
                    Need help?{' '}
                    <Link href="/contact" className="text-[var(--terra)] font-medium hover:underline">
                      Contact us
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
