'use client';

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  Globe,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useBranchStore } from '@/store';
import { cn, formatCurrency } from '@/lib/utils';

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

const CUSTOMER_HELP_TEXT: Record<string, string> = {
  hq: 'Full-service location for drop-off, account support, documentation, and escalated shipment issues.',
  branch: 'Customer-facing office for local shipment drop-off, pickup coordination, and delivery support.',
  agent: 'Smaller customer help point for intake, enquiry handling, and routing to the nearest main branch.',
  partner: 'Partner-supported office for assisted drop-off and local customer coordination.',
};

export default function AdminBranchDetailPage({
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

  const childBranches = branches.filter((item) => item.parentBranchId === branch.id);
  const parentBranch = branch.parentBranchId
    ? branches.find((item) => item.id === branch.parentBranchId)
    : null;

  const branchIcon =
    branch.type === 'hq' ? (
      <Globe className="h-6 w-6 text-primary" />
    ) : branch.type === 'agent' ? (
      <Users className="h-6 w-6 text-amber-600" />
    ) : (
      <Building2 className="h-6 w-6 text-[var(--gold)]" />
    );

  const customerPageHref = `/customer/offices/${branch.id}`;
  const officeAddress = [
    branch.address.addressLine1,
    branch.address.addressLine2,
    branch.address.city,
    branch.address.stateProvince,
    branch.address.postalCode,
    COUNTRY_NAMES[branch.country] || branch.country,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <Button asChild variant="ghost" className="w-fit gap-2 px-0 hover:bg-transparent">
          <Link href="/admin/branches">
            <ArrowLeft className="h-4 w-4" />
            Back to branches
          </Link>
        </Button>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-background to-[var(--gold)]/10">
          <CardContent className="p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background shadow-sm">
                  {branchIcon}
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {COUNTRY_FLAGS[branch.country]} {COUNTRY_NAMES[branch.country] || branch.country}
                    </Badge>
                    <Badge variant="outline">{BRANCH_TYPE_LABELS[branch.type]}</Badge>
                    <Badge
                      className={cn(
                        branch.isActive
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      )}
                    >
                      {branch.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div>
                    <h1 style={{ fontFamily: 'var(--font-playfair)' }} className="text-3xl font-bold text-[var(--ink)]">
                      {branch.name}
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted-text)]">
                      Admin detail page for managing how this office is presented to customers and how it sits inside the branch network.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button className="gap-2 bg-[var(--terra)] text-white hover:bg-[var(--terra-light)]">
                  <Save className="h-4 w-4" />
                  Save changes
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <Link href={customerPageHref}>
                    <ShieldCheck className="h-4 w-4" />
                    Open customer view
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card><CardContent className="p-4"><p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-text)]">Shipments</p><p className="mt-2 text-2xl font-bold text-[var(--ink)]">{branch.shipmentCount}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-text)]">Revenue</p><p className="mt-2 text-2xl font-bold text-[var(--ink)]">{formatCurrency(branch.revenue, 'USD')}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-text)]">Parent branch</p><p className="mt-2 text-lg font-semibold text-[var(--ink)]">{parentBranch ? parentBranch.name : 'Top-level office'}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-text)]">Child branches</p><p className="mt-2 text-2xl font-bold text-[var(--ink)]">{childBranches.length}</p></CardContent></Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardContent className="space-y-5 p-6">
            <div>
              <h2 className="text-lg font-semibold text-[var(--ink)]">Branch information</h2>
              <p className="text-sm text-[var(--muted-text)]">
                Core office data used across admin operations and customer discovery.
              </p>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="branch-name">Branch name</Label>
                <Input id="branch-name" defaultValue={branch.name} className="mt-2" />
              </div>
              <div>
                <Label htmlFor="manager-name">Manager name</Label>
                <Input id="manager-name" defaultValue={branch.managerName || ''} className="mt-2" />
              </div>
              <div>
                <Label htmlFor="branch-phone">Phone</Label>
                <Input id="branch-phone" defaultValue={branch.phone} className="mt-2" />
              </div>
              <div>
                <Label htmlFor="branch-email">Email</Label>
                <Input id="branch-email" defaultValue={branch.email} className="mt-2" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="branch-address">Customer-facing address</Label>
                <Textarea id="branch-address" defaultValue={officeAddress} className="mt-2 min-h-24" />
              </div>
            </div>

            <div className="rounded-xl border bg-muted/35 p-5">
              <p className="text-sm font-semibold text-[var(--ink)]">Hierarchy</p>
              <div className="mt-3 space-y-2 text-sm text-[var(--muted-text)]">
                <p>Parent: {parentBranch ? parentBranch.name : 'No parent branch'}</p>
                <p>Children: {childBranches.length > 0 ? childBranches.map((item) => item.name).join(', ') : 'No child branches'}</p>
                <p>Commission rate: {branch.commissionRate ? `${branch.commissionRate}%` : 'Not applicable'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-5 p-6">
            <div>
              <h2 className="text-lg font-semibold text-[var(--ink)]">Customer page preview</h2>
              <p className="text-sm text-[var(--muted-text)]">
                This is the type of information customers should see when they open this office.
              </p>
            </div>

            <Separator />

            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 via-background to-[var(--gold)]/8 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {COUNTRY_FLAGS[branch.country]} {COUNTRY_NAMES[branch.country] || branch.country}
                    </Badge>
                    <Badge variant="outline">{BRANCH_TYPE_LABELS[branch.type]}</Badge>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-[var(--ink)]">{branch.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-text)]">
                    {CUSTOMER_HELP_TEXT[branch.type]}
                  </p>
                </div>
                <Badge
                  className={cn(
                    branch.isActive
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                  )}
                >
                  {branch.isActive ? 'Open for service' : 'Temporarily unavailable'}
                </Badge>
              </div>

              <div className="mt-5 space-y-3 rounded-xl border bg-background/70 p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                  <p className="text-sm text-[var(--muted-text)]">{officeAddress}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <p className="text-sm text-[var(--muted-text)]">{branch.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <p className="text-sm text-[var(--muted-text)]">{branch.email}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-muted/35 p-5">
              <p className="text-sm font-semibold text-[var(--ink)]">Admin guidance</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted-text)]">
                <li>Keep the branch name and address customer-readable, not internal-only.</li>
                <li>Use the phone and email fields customers should actually contact.</li>
                <li>Set inactive status when the location should disappear as a live service point.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
