'use client';

import { useState } from 'react';
import { ArrowRight, Clock3, Globe2, Search, ShieldCheck, Truck } from 'lucide-react';
import { NavBar } from '@/components/marketing/NavBar';
import { Footer } from '@/components/marketing/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { TrackingTimeline } from '@/components/shared/TrackingTimeline';
import { useShipmentStore } from '@/store';
import { formatCurrency, formatDateTime, getCountryFlag, getCorridorLabel, getCustomsDocsLabel, getStatusLabel } from '@/lib/utils';

const DEMO_TRACKING = {
  hero: 'DS-20260318-A1B2C3',
  local: 'DS-20260316-D4E5F6',
  customs: 'DS-20260312-G7H8I9',
  failed: 'DS-20260319-M4N5O6',
};

const STORY_LABELS = {
  hero: 'US pickup -> international transit -> customs -> Nigeria last-mile',
  local: 'Local Nigeria shipment',
  customs: 'Customs hold and resolution',
  failed: 'Failed first delivery attempt',
};

export default function TrackPage() {
  const { getShipmentByTracking } = useShipmentStore();
  const [trackingInput, setTrackingInput] = useState('');
  const [activeTracking, setActiveTracking] = useState(DEMO_TRACKING.hero);

  const shipment = getShipmentByTracking(activeTracking) || getShipmentByTracking(trackingInput.trim().toUpperCase()) || getShipmentByTracking(DEMO_TRACKING.hero);

  const activeSummary = shipment ? [
    { label: 'Status', value: getStatusLabel(shipment.status) },
    { label: 'Route', value: getCorridorLabel(shipment.originCountry, shipment.destinationCountry) },
    { label: 'Docs', value: getCustomsDocsLabel(shipment.customsDocsStatus) },
    { label: 'ETA', value: shipment.estimatedDeliveryDate },
  ] : [];

  const progressValue = shipment
    ? shipment.status === 'delivered'
      ? 100
      : shipment.status === 'failed_delivery'
        ? 84
        : shipment.status === 'customs_held'
          ? 42
          : shipment.status === 'customs_pending'
            ? 36
            : shipment.status === 'in_transit_international'
              ? 58
              : 24
    : 0;

  return (
    <div className="min-h-screen bg-[#FAF6EF]">
      <NavBar />

      <main className="pt-32 pb-16">
        <section className="mx-auto max-w-6xl px-6">
          <div className="rounded-[28px] border border-[#E8DDD0] bg-[linear-gradient(135deg,#fffaf3_0%,#f8efe1_60%,#fffdf9_100%)] p-8 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 text-sm text-[#8C7B6B]">
                  <Globe2 className="h-4 w-4 text-[var(--terra)]" />
                  <span>Public demo tracker</span>
                </div>
                <h1 style={{ fontFamily: 'var(--font-playfair)' }} className="mt-2 text-4xl font-bold text-[var(--ink)]">
                  Track the shipment story, not just the package
                </h1>
                <p className="mt-3 text-lg text-[#8C7B6B]">
                  One timeline covers origin pickup, international transit, customs, and Nigeria last-mile delivery. The same view also shows local shipments and exception handling.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:w-[320px]">
                <div className="rounded-2xl border border-[#E8DDD0] bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-[#8C7B6B]">Hero shipment</p>
                  <p className="mt-2 font-mono text-lg font-semibold text-[var(--ink)]">{DEMO_TRACKING.hero}</p>
                </div>
                <div className="rounded-2xl border border-[#E8DDD0] bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-[#8C7B6B]">Exception story</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--ink)]">Customs hold + failed delivery</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8C7B6B]" />
                <Input
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="Enter tracking number"
                  className="h-14 pl-12 text-base"
                />
              </div>
              <Button onClick={() => setActiveTracking(trackingInput.trim().toUpperCase() || DEMO_TRACKING.hero)} className="h-14 bg-[var(--ink)] text-white hover:opacity-90">
                Track shipment
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button onClick={() => setActiveTracking(DEMO_TRACKING.hero)} className="bg-[var(--terra)] text-white hover:bg-[var(--terra-light)]">Start hero flow</Button>
              <Button variant="outline" onClick={() => setActiveTracking(DEMO_TRACKING.customs)}>Jump to customs exception</Button>
              <Button variant="outline" onClick={() => setActiveTracking(DEMO_TRACKING.failed)}>Jump to delivery exception</Button>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-8 grid max-w-6xl gap-6 px-6 lg:grid-cols-[1.3fr_0.9fr]">
          <Card className="border-[#E8DDD0]">
            <CardContent className="p-6">
              {shipment ? (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="font-mono text-xl font-bold text-[var(--ink)]">{shipment.trackingNumber}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="bg-[var(--terra-pale)] text-[var(--terra)]">{STORY_LABELS[activeTracking as keyof typeof STORY_LABELS] || 'Shipment story'}</Badge>
                        <Badge>{getStatusLabel(shipment.status)}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#8C7B6B]">Estimated delivery</p>
                      <p className="font-semibold text-[var(--ink)]">{shipment.estimatedDeliveryDate}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-3 text-2xl font-semibold text-[var(--ink)]">
                    <span>{getCountryFlag(shipment.originCountry)}</span>
                    <span>{shipment.originCountry}</span>
                    <ArrowRight className="h-5 w-5 text-[#8C7B6B]" />
                    <span>{getCountryFlag(shipment.destinationCountry)}</span>
                    <span>{shipment.destinationCountry}</span>
                  </div>

                  <div className="mt-6 rounded-2xl border border-[#E8DDD0] bg-[#FAF6EF] p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-[var(--ink)]">Journey progress</span>
                      <span className="text-[#8C7B6B]">{Math.round(progressValue)}%</span>
                    </div>
                    <Progress value={progressValue} className="mt-3 h-3" />
                  </div>

                  <div className="mt-6 grid gap-3 md:grid-cols-4">
                    {activeSummary.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-[#E8DDD0] bg-white p-4">
                        <p className="text-xs uppercase tracking-wide text-[#8C7B6B]">{item.label}</p>
                        <p className="mt-2 text-sm font-semibold text-[var(--ink)]">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-[#E8DDD0] bg-white p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]"><Truck className="h-4 w-4 text-[var(--terra)]" />Shipment type</div>
                      <p className="mt-2 text-sm text-[#8C7B6B]">{shipment.shipmentType} via {shipment.serviceType}</p>
                    </div>
                    <div className="rounded-2xl border border-[#E8DDD0] bg-white p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]"><ShieldCheck className="h-4 w-4 text-[var(--terra)]" />Trust signals</div>
                      <p className="mt-2 text-sm text-[#8C7B6B]">KYC, customs docs, payment proof, and POD all sit in the same record.</p>
                    </div>
                    <div className="rounded-2xl border border-[#E8DDD0] bg-white p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-[var(--ink)]"><Clock3 className="h-4 w-4 text-[var(--terra)]" />Value</div>
                      <p className="mt-2 text-sm text-[#8C7B6B]">{formatCurrency(shipment.totalCost, shipment.currency)}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="mb-4 font-semibold text-[var(--ink)]">Tracking timeline</h3>
                    <TrackingTimeline events={shipment.trackingEvents} mode="public" />
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-[#E8DDD0] bg-white p-8 text-center text-[#8C7B6B]">
                  No shipment data found for the entered tracking number.
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-[#E8DDD0]">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[var(--ink)]">Presenter path</h3>
                <div className="mt-4 space-y-3">
                  {[
                    { key: DEMO_TRACKING.hero, label: '1. Hero shipment', sub: 'Start with the primary corridor story' },
                    { key: DEMO_TRACKING.customs, label: '2. Customs exception', sub: 'Show alert, owner, and release path' },
                    { key: DEMO_TRACKING.failed, label: '3. Delivery exception', sub: 'Show failed attempt and recovery' },
                    { key: DEMO_TRACKING.local, label: '4. Local shipment', sub: 'Use only as a short supporting story' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setActiveTracking(item.key)}
                      className={`w-full rounded-2xl border p-4 text-left transition-all ${activeTracking === item.key ? 'border-[var(--terra)] bg-[var(--terra-pale)]' : 'border-[#E8DDD0] bg-white'}`}
                    >
                      <p className="font-semibold text-[var(--ink)]">{item.label}</p>
                      <p className="text-sm text-[#8C7B6B]">{item.sub}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {shipment && (
              <Card className="border-[#E8DDD0]">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-[var(--ink)]">Operational notes</h3>
                  <div className="mt-4 space-y-3 text-sm text-[#8C7B6B]">
                    <p>Origin: {shipment.pickupAddress.city}, {shipment.pickupAddress.country}</p>
                    <p>Destination: {shipment.deliveryAddress.city}, {shipment.deliveryAddress.country}</p>
                    <p>Customs docs: {getCustomsDocsLabel(shipment.customsDocsStatus)}</p>
                    <p>Latest checkpoint: {shipment.trackingEvents[shipment.trackingEvents.length - 1]?.description}</p>
                    {shipment.podDeliveredAt && <p>POD: {formatDateTime(shipment.podDeliveredAt)}</p>}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-[#E8DDD0]">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[var(--ink)]">Why this works</h3>
                <ul className="mt-4 space-y-2 text-sm text-[#8C7B6B]">
                  <li>One shipment number across origin, customs, and delivery.</li>
                  <li>Local, international, and exception stories all share the same UI pattern.</li>
                  <li>Trust evidence is visible without exposing backend complexity.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
