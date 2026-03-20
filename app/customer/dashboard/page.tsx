'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  ArrowUpRight,
  Wallet,
  TrendingUp,
  Search,
  Plus,
  MapPin,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuthStore, useShipmentStore, useWalletStore } from '@/store';
import { formatCurrency, formatDate, getStatusLabel, formatRelativeTime } from '@/lib/utils';

export default function DashboardPage() {
  const { currentUser } = useAuthStore();
  const { shipments } = useShipmentStore();
  const { wallet } = useWalletStore();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const activeShipments = shipments.filter(
    (s) => s.status !== 'delivered' && s.status !== 'cancelled'
  );
  const deliveredShipments = shipments.filter((s) => s.status === 'delivered');
  const deliveryRate =
    shipments.length > 0
      ? Math.round((deliveredShipments.length / shipments.length) * 100)
      : 0;

  const recentShipments = shipments.slice(0, 5);

  const kpis = [
    {
      label: 'Active Shipments',
      value: String(activeShipments.length),
      icon: <Package className="h-5 w-5" />,
      variant: 'terra' as const,
    },
    {
      label: 'Total Shipped',
      value: String(shipments.length),
      icon: <ArrowUpRight className="h-5 w-5" />,
      variant: 'gold' as const,
    },
    {
      label: 'Wallet Balance',
      value: formatCurrency(wallet.balanceUSD, 'USD'),
      icon: <Wallet className="h-5 w-5" />,
      variant: 'ink' as const,
    },
    {
      label: 'Delivery Rate',
      value: `${deliveryRate}%`,
      icon: <TrendingUp className="h-5 w-5" />,
      variant: 'terra' as const,
    },
  ];

  const [trackQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1
            style={{ fontFamily: 'var(--font-playfair)' }}
            className="text-2xl font-bold text-[var(--ink)]"
          >
            {greeting}, {currentUser?.firstName || 'there'}
          </h1>
          <p className="text-sm text-[var(--muted-text)]">{today}</p>
        </div>
        <div className="flex gap-2">
          <Button
            asChild
            className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white"
          >
            <Link href="/customer/shipments/new">
              <Plus className="h-4 w-4 mr-1" />
              Ship Now
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/customer/track">
              <Search className="h-4 w-4 mr-1" />
              Track
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/customer/wallet">
              <Wallet className="h-4 w-4 mr-1" />
              Fund Wallet
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="kpi-card">
            <div className={`kpi-icon-wrap ${kpi.variant}`}>{kpi.icon}</div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-label">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Card className="border-[var(--border-warm)]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle
                  style={{ fontFamily: 'var(--font-playfair)' }}
                  className="text-lg"
                >
                  Recent Shipments
                </CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/customer/shipments">
                    View all
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentShipments.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-[var(--muted-text)] mx-auto mb-3 opacity-40" />
                  <p className="font-medium text-[var(--ink)] mb-1">No shipments yet</p>
                  <p className="text-sm text-[var(--muted-text)] mb-4">
                    Create your first shipment to get started.
                  </p>
                  <Button asChild className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white">
                    <Link href="/customer/shipments/new">
                      <Plus className="h-4 w-4 mr-1" />
                      Ship Now
                    </Link>
                  </Button>
                </div>
              ) : (
                recentShipments.map((shipment) => (
                  <Link
                    key={shipment.id}
                    href={`/customer/shipments/${shipment.id}`}
                    className="flex items-center gap-4 p-3 rounded-lg border border-[var(--border-warm)] hover:bg-[var(--terra-pale)] transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[var(--terra-pale)] flex items-center justify-center text-[var(--terra)] flex-shrink-0">
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-[var(--ink)]">
                          {shipment.trackingNumber}
                        </span>
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
                      <div className="flex items-center gap-1.5 text-xs text-[var(--muted-text)] mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {shipment.originCountry} &rarr; {shipment.destinationCountry}
                        <span className="mx-1">&middot;</span>
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(shipment.createdAt)}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-[var(--ink)]">
                        {formatCurrency(shipment.totalCost, shipment.currency)}
                      </p>
                      <p className="text-xs text-[var(--muted-text)]">
                        ETA {formatDate(shipment.estimatedDeliveryDate)}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[var(--muted-text)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="card-dark p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3
                style={{ fontFamily: 'var(--font-playfair)' }}
                className="text-lg font-bold"
              >
                Wallet
              </h3>
              <Wallet className="h-5 w-5 text-white/50" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider">USD Balance</p>
                <p
                  style={{ fontFamily: 'var(--font-playfair)' }}
                  className="text-3xl font-bold mt-0.5"
                >
                  {formatCurrency(wallet.balanceUSD, 'USD')}
                </p>
              </div>
              <Separator className="bg-white/10" />
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-white/40">NGN</p>
                  <p className="text-sm font-semibold">
                    {formatCurrency(wallet.balanceNGN, 'NGN')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/40">GHS</p>
                  <p className="text-sm font-semibold">
                    {formatCurrency(wallet.balanceGHS, 'GHS')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/40">KES</p>
                  <p className="text-sm font-semibold">
                    {formatCurrency(wallet.balanceKES, 'KES')}
                  </p>
                </div>
              </div>
            </div>
            <Button
              asChild
              className="w-full mt-4 bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white"
            >
              <Link href="/customer/wallet">Manage Wallet</Link>
            </Button>
          </div>

          <Card className="border-[var(--border-warm)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-[var(--ink)]">
                Track a Package
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter tracking number"
                  value={trackQuery}
                  onChange={() => {}}
                  className="flex-1"
                />
                <Button className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
