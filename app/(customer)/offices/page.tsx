'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Building2,
  Users,
  Globe,
  Search,
  ChevronRight,
  Clock,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

export default function OfficesPage() {
  const { branches } = useBranchStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const countries = [...new Set(branches.map((b) => b.country))];
  const filteredBranches = branches.filter((branch) => {
    const matchesSearch =
      !searchQuery ||
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.address.country.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCountry = !selectedCountry || branch.country === selectedCountry;
    const matchesType = !selectedType || branch.type === selectedType;

    return matchesSearch && matchesCountry && matchesType;
  });

  const groupedByCountry = filteredBranches.reduce(
    (acc, branch) => {
      const country = branch.country;
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(branch);
      return acc;
    },
    {} as Record<string, typeof branches>
  );

  const stats = {
    total: branches.length,
    hq: branches.filter((b) => b.type === 'hq').length,
    branches: branches.filter((b) => b.type === 'branch').length,
    agents: branches.filter((b) => b.type === 'agent').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1
            style={{ fontFamily: 'var(--font-playfair)' }}
            className="text-2xl font-bold text-[var(--ink)]"
          >
            Our Offices & Locations
          </h1>
          <p className="mt-1 text-sm text-[var(--muted-text)]">
            Find a LogiX service center near you
          </p>
        </div>
        <Button variant="outline" asChild>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="gap-2"
          >
            <MapPin className="h-4 w-4" />
            View on Map
          </a>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-[var(--terra)]/10 to-[var(--terra)]/5 border-[var(--terra)]/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-text)]">
                  Total Locations
                </p>
                <p className="mt-1 text-2xl font-bold text-[var(--ink)]">{stats.total}</p>
              </div>
              <Building2 className="h-8 w-8 text-[var(--terra)]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-text)]">
                  Headquarters
                </p>
                <p className="mt-1 text-2xl font-bold text-[var(--ink)]">{stats.hq}</p>
              </div>
              <Globe className="h-8 w-8 text-[var(--gold)]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-text)]">
                  Branches
                </p>
                <p className="mt-1 text-2xl font-bold text-[var(--ink)]">{stats.branches}</p>
              </div>
              <MapPin className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-text)]">
                  Agents
                </p>
                <p className="mt-1 text-2xl font-bold text-[var(--ink)]">{stats.agents}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, city, or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCountry || ''}
                onChange={(e) => setSelectedCountry(e.target.value || null)}
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {COUNTRY_FLAGS[country]} {COUNTRY_NAMES[country] || country}
                  </option>
                ))}
              </select>
              <select
                value={selectedType || ''}
                onChange={(e) => setSelectedType(e.target.value || null)}
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="">All Types</option>
                <option value="hq">Headquarters</option>
                <option value="branch">Branch</option>
                <option value="agent">Agent</option>
                <option value="partner">Partner</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {Object.entries(groupedByCountry).map(([country, countryBranches]) => (
          <div key={country} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{COUNTRY_FLAGS[country]}</span>
              <h2 className="text-lg font-semibold text-[var(--ink)]">
                {COUNTRY_NAMES[country] || country}
              </h2>
              <Badge variant="secondary" className="ml-auto">
                {countryBranches.length} location{countryBranches.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {countryBranches.map((branch) => (
                <Link key={branch.id} href={`/customer/offices/${branch.id}`} className="block">
                  <Card className="group cursor-pointer transition-all hover:border-primary/40 hover:shadow-md">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            {branch.type === 'hq' ? (
                              <Globe className="h-5 w-5 text-primary" />
                            ) : branch.type === 'agent' ? (
                              <Users className="h-5 w-5 text-green-600" />
                            ) : (
                              <Building2 className="h-5 w-5 text-[var(--gold)]" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-[var(--ink)]">{branch.name}</h3>
                            <p className="text-xs text-[var(--muted-text)] capitalize">
                              {branch.type}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={branch.isActive ? 'default' : 'secondary'}
                          className={cn(
                            'text-xs',
                            branch.isActive
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : 'bg-gray-100 text-gray-600 border-gray-200'
                          )}
                        >
                          {branch.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      <Separator />

                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                          <span className="text-[var(--muted-text)]">
                            {branch.address.addressLine1}
                            {branch.address.addressLine2 && `, ${branch.address.addressLine2}`}
                            , {branch.address.city}
                            {branch.address.stateProvince && `, ${branch.address.stateProvince}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                          <span className="text-[var(--muted-text)]">{branch.phone}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                          <span className="text-[var(--muted-text)]">{branch.email}</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="flex gap-4 text-xs text-[var(--muted-text)]">
                          <div className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            <span>{branch.shipmentCount.toLocaleString()}</span>
                          </div>
                          {branch.commissionRate && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{branch.commissionRate}%</span>
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 gap-1 text-xs opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          View Details
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {filteredBranches.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-[var(--ink)]">No offices found</h3>
              <p className="mt-1 text-sm text-[var(--muted-text)]">
                Try adjusting your search or filters
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCountry(null);
                  setSelectedType(null);
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-[var(--gold)]/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold text-[var(--ink)]">
                Can&apos;t find an office near you?
              </h3>
              <p className="mt-1 text-sm text-[var(--muted-text)]">
                We&apos;re constantly expanding. Contact us and we&apos;ll help you find the nearest
                service point.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Contact Support</Button>
              <Button className="bg-[var(--terra)] hover:bg-[var(--terra-light)]">
                Request Pickup
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
