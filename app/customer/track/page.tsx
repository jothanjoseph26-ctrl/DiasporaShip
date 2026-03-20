'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Package, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useShipmentStore, useAuthStore } from '@/store';

export default function TrackPage() {
  const router = useRouter();
  const { shipments, getShipmentByTracking } = useShipmentStore();
  const { isAuthenticated } = useAuthStore();
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a tracking number.');
      return;
    }
    const found = getShipmentByTracking(query.trim());
    if (found) {
      router.push(`/customer/track/${found.trackingNumber}`);
    } else {
      setError('Shipment not found. Please check the tracking number.');
    }
  };

  const recentSearches = shipments.slice(0, 4);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <div className="mb-4">
          <span
            style={{ fontFamily: 'var(--font-playfair)' }}
            className="text-3xl font-bold text-[var(--ink)]"
          >
            Diaspora<span style={{ color: 'var(--terra)' }}>Ship</span>
          </span>
        </div>
        <h1
          style={{ fontFamily: 'var(--font-playfair)' }}
          className="text-2xl font-bold text-[var(--ink)] mb-2"
        >
          Track Your Package
        </h1>
        <p className="text-[var(--muted-text)]">
          Enter your tracking number to see real-time updates.
        </p>
      </div>

      <Card className="border-[var(--border-warm)] shadow-[var(--shadow-card)] mb-8">
        <CardContent className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleTrack} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-text)]" />
              <Input
                placeholder="Enter tracking number (e.g. DS-20260318-A1B2C3)"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setError('');
                }}
                className="pl-11 h-12 text-base"
              />
            </div>
            <Button
              type="submit"
              className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white h-12 px-8"
            >
              Track
            </Button>
          </form>
        </CardContent>
      </Card>

      {isAuthenticated && recentSearches.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[var(--ink)] mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-[var(--muted-text)]" />
            Recent Shipments
          </h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((s) => (
              <Link
                key={s.id}
                href={`/customer/track/${s.trackingNumber}`}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-[var(--border-warm)] hover:border-[var(--terra)] transition-colors text-sm"
              >
                <Package className="h-3.5 w-3.5 text-[var(--terra)]" />
                <span className="font-mono font-medium">{s.trackingNumber}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
