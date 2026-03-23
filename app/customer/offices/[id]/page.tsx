'use client';

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  Clock3,
  Globe,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useBranchStore } from '@/store';
import { cn } from '@/lib/utils';

const COUNTRY_FLAGS: Record<string, string> = {
  US: '🇺🇸',
  GB: '🇬🇧',
  NG: '🇳🇬',
  GH: '🇬🇭',
  KE: '🇰🇪',
  CN: '🇨🇳',
};

const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States',
  GB: 'United Kingdom',
  NG: 'Nigeria',
  GH: 'Ghana',
  KE: 'Kenya',
  CN: 'China',
};

const BRANCH_TYPE_LABELS: Record<string, string> = {
  hq: 'Headquarters',
  branch: 'Branch office',
  agent: 'Agent location',
  partner: 'Partner office',
};

const OFFICE_HOURS: Record<string, string> = {
  NG: 'Mon - Sat, 8:00 AM - 6:00 PM',
  GH: 'Mon - Sat, 8:00 AM - 5:30 PM',
  KE: 'Mon - Sat, 8:30 AM - 5:30 PM',
  US: 'Mon - Fri, 9:00 AM - 5:00 PM',
  GB: 'Mon - Fri, 9:00 AM - 5:00 PM',
  CN: 'Mon - Fri, 9:00 AM - 6:00 PM',
};

const OFFICE_PURPOSE: Record<string, string> = {
  hq: 'Best for full-service support, shipment drop-off, account help, and escalated delivery issues.',
  branch: 'Best for local drop-off, pickup coordination, and delivery support within the region.',
  agent: 'Best for customer assistance, package intake, and routing to the nearest main branch.',
  partner: 'Best for assisted service and partner-supported handoff requests.',
};

const OFFICE_SERVICES: Record<string, string[]> = {
  hq: ['Shipment drop-off', 'Pickup coordination', 'Account support', 'Documentation help'],
  branch: ['Shipment drop-off', 'Pickup coordination', 'Tracking support', 'Delivery resolution'],
  agent: ['Package intake', 'Basic support', 'Route guidance', 'Customer enquiries'],
  partner: ['Assisted booking', 'Drop-off support', 'Referral handling', 'Local coordination'],
};

export default function OfficeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { branches } = useBranchStore();
  const { id } = React.use(params);

  const branch = branches.find((item) => item.id === id);

  if (!branch) {
    notFound();
  }

  const officeIcon =
    branch.type === 'hq' ? (
      <Globe className="h-6 w-6 text-primary" />
    ) : branch.type === 'agent' ? (
      <Users className="h-6 w-6 text-green-600" />
    ) : (
      <Building2 className="h-6 w-6 text-[var(--gold)]" />
    );

  const mapsQuery = encodeURIComponent(
    [
      branch.name,
      branch.address.addressLine1,
      branch.address.addressLine2,
      branch.address.city,
      branch.address.stateProvince,
      branch.address.postalCode,
      COUNTRY_NAMES[branch.country] || branch.country,
    ]
      .filter(Boolean)
      .join(', ')
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <Button asChild variant="ghost" className="w-fit gap-2 px-0 hover:bg-transparent">
          <Link href="/customer/offices">
            <ArrowLeft className="h-4 w-4" />
            Back to offices
          </Link>
        </Button>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-background to-[var(--gold)]/10">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background shadow-sm">
                  {officeIcon}
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {COUNTRY_FLAGS[branch.country]} {COUNTRY_NAMES[branch.country] || branch.country}
                    </Badge>
                    <Badge variant="outline">{BRANCH_TYPE_LABELS[branch.type]}</Badge>
                    <Badge
                      variant={branch.isActive ? 'default' : 'secondary'}
                      className={cn(
                        branch.isActive
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      )}
                    >
                      {branch.isActive ? 'Open for service' : 'Temporarily unavailable'}
                    </Badge>
                  </div>
                  <div>
                    <h1
                      style={{ fontFamily: 'var(--font-playfair)' }}
                      className="text-3xl font-bold text-[var(--ink)]"
                    >
                      {branch.name}
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-text)]">
                      {OFFICE_PURPOSE[branch.type]}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
                <Button asChild className="gap-2">
                  <a href={`tel:${branch.phone}`}>
                    <Phone className="h-4 w-4" />
                    Call office
                  </a>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <a href={`mailto:${branch.email}`}>
                    <Mail className="h-4 w-4" />
                    Send email
                  </a>
                </Button>
                <Button asChild variant="outline" className="gap-2 sm:col-span-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Get directions
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-text)]">
                  Office type
                </p>
                <p className="mt-1 text-lg font-semibold text-[var(--ink)]">
                  {BRANCH_TYPE_LABELS[branch.type]}
                </p>
              </div>
              {officeIcon}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-text)]">
                  Office hours
                </p>
                <p className="mt-1 text-lg font-semibold text-[var(--ink)]">
                  {OFFICE_HOURS[branch.country] || 'Contact office'}
                </p>
              </div>
              <Clock3 className="h-7 w-7 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-text)]">
                  Location
                </p>
                <p className="mt-1 text-lg font-semibold text-[var(--ink)]">
                  {branch.address.city}
                </p>
              </div>
              <MapPin className="h-7 w-7 text-[var(--gold)]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-text)]">
                  Service status
                </p>
                <p className="mt-1 text-lg font-semibold text-[var(--ink)]">
                  {branch.isActive ? 'Available' : 'Unavailable'}
                </p>
              </div>
              <ShieldCheck className="h-7 w-7 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardContent className="space-y-5 p-6">
            <div>
              <h2 className="text-lg font-semibold text-[var(--ink)]">Visit this office</h2>
              <p className="text-sm text-[var(--muted-text)]">
                Everything a customer needs before going to this location.
              </p>
            </div>

            <Separator />

            <div className="rounded-xl border bg-card p-5">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-[var(--ink)]">Address</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-text)]">
                    {branch.address.addressLine1}
                    {branch.address.addressLine2 && `, ${branch.address.addressLine2}`}
                    <br />
                    {branch.address.city}
                    {branch.address.stateProvince && `, ${branch.address.stateProvince}`}{' '}
                    {branch.address.postalCode}
                    <br />
                    {COUNTRY_NAMES[branch.country] || branch.country}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border bg-muted/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-text)]">
                  Phone
                </p>
                <a href={`tel:${branch.phone}`} className="mt-2 block font-semibold text-[var(--ink)]">
                  {branch.phone}
                </a>
              </div>
              <div className="rounded-xl border bg-muted/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-text)]">
                  Email
                </p>
                <a href={`mailto:${branch.email}`} className="mt-2 block font-semibold text-[var(--ink)]">
                  {branch.email}
                </a>
              </div>
            </div>

            <div className="rounded-xl border bg-primary/5 p-5">
              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-[var(--ink)]">Opening hours</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-text)]">
                    {OFFICE_HOURS[branch.country] || 'Please contact the office directly for hours.'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-5 p-6">
            <div>
              <h2 className="text-lg font-semibold text-[var(--ink)]">Services available</h2>
              <p className="text-sm text-[var(--muted-text)]">
                What this location is most suitable for.
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              {OFFICE_SERVICES[branch.type].map((service) => (
                <div key={service} className="rounded-xl border bg-muted/35 p-4">
                  <div className="flex items-center gap-3">
                    <Truck className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium text-[var(--ink)]">{service}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="rounded-xl border bg-card p-5">
              <p className="text-sm font-semibold text-[var(--ink)]">Before you go</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted-text)]">
                <li>Bring your tracking number if you are following up on an existing shipment.</li>
                <li>Call ahead for bulky cargo, special handling, or time-sensitive delivery issues.</li>
                <li>Email the office first if your visit is mainly for documentation support.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
