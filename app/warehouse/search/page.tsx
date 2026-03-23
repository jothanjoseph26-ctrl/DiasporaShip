'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/shared';
import { ArrowUpFromLine, Eye, MapPin, Move, Package, ScanLine, Search } from 'lucide-react';
import type { ShipmentStatus } from '@/types';

interface SearchResult {
  tracking: string;
  warehouse: string;
  bin: string;
  status: ShipmentStatus;
  customer: string;
  destination: string;
  story: string;
}

const CURATED_RESULTS: SearchResult[] = [
  {
    tracking: 'DS-20260318-A1B2C3',
    warehouse: 'Atlanta Hub',
    bin: 'A-12-3',
    status: 'at_warehouse',
    customer: 'John Okafor',
    destination: 'Nigeria',
    story: 'Hero shipment waiting for origin processing',
  },
  {
    tracking: 'DS-20260312-G7H8I9',
    warehouse: 'Apapa Port Hold Area',
    bin: 'H-02-7',
    status: 'customs_held',
    customer: 'TechCorp Ltd',
    destination: 'Nigeria customs hold',
    story: 'Missing customs document exception',
  },
  {
    tracking: 'DS-20260319-M4N5O6',
    warehouse: 'Port Harcourt Dispatch Cage',
    bin: 'R-04-2',
    status: 'out_for_delivery',
    customer: 'Grace Nwosu',
    destination: 'Port Harcourt',
    story: 'Failed first delivery attempt recovery',
  },
];

type SearchMode = 'all' | 'warehouse' | 'transit';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [mode, setMode] = useState<SearchMode>('all');
  const [scanMode, setScanMode] = useState(false);

  const results = useMemo(() => {
    if (!hasSearched) return [];
    const term = query.trim().toLowerCase();
    return CURATED_RESULTS.filter((result) => {
      if (!term) return true;
      return [result.tracking, result.customer, result.bin, result.story].some((value) => value.toLowerCase().includes(term));
    });
  }, [hasSearched, query]);

  function handleSearch() {
    if (query.trim()) {
      setHasSearched(true);
    }
  }

  const modes: { key: SearchMode; label: string }[] = [
    { key: 'all', label: 'Curated story' },
    { key: 'warehouse', label: 'Warehouse only' },
    { key: 'transit', label: 'Transit only' },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Card className="border-[#E8DDD0] bg-white">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#1A1208]">Presenter search</p>
              <p className="text-xs text-gray-700">Search is limited to the hero shipment and the two curated exception stories.</p>
            </div>
            <Badge className="bg-[#F5EBE0] text-[var(--ink)]">Story-safe</Badge>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-700" />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (!event.target.value.trim()) setHasSearched(false);
              }}
              onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
              placeholder="Search by tracking number, customer, or story name"
              className="h-14 rounded-xl border-[#E8DDD0] bg-[#FAF6EF] pl-12 pr-4 text-base"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-2">
            {modes.map((item) => (
              <button
                key={item.key}
                onClick={() => setMode(item.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  mode === item.key ? 'bg-[#7C3AED] text-white' : 'bg-[#FAF6EF] text-gray-700 hover:bg-[#F5EBE0]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setScanMode(!scanMode)}
              className={`h-12 flex-1 gap-2 rounded-xl border-[#E8DDD0] text-[#1A1208] hover:bg-[#FAF6EF] ${scanMode ? 'border-violet-300 bg-violet-50 text-[#7C3AED]' : ''}`}
            >
              <ScanLine className="h-5 w-5" />
              {scanMode ? 'Scan mode on' : 'Scan with camera'}
            </Button>
            <Button
              onClick={handleSearch}
              className="h-12 flex-1 rounded-xl bg-[#7C3AED] font-semibold text-white hover:bg-[#6D28D9]"
              disabled={!query.trim()}
            >
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {scanMode && (
        <Card className="border-[#E8DDD0] bg-white">
          <CardContent className="p-5">
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-gray-700">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#FAF6EF]">
                <ScanLine className="h-10 w-10" />
              </div>
              <p className="text-sm font-medium">Camera scanner active</p>
              <p className="text-xs">Use this only for the curated shipment labels during the demo.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!hasSearched && !scanMode && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FAF6EF]">
            <Package className="h-8 w-8 text-gray-700" />
          </div>
          <p className="text-sm text-gray-700">Start with `DS-20260318-A1B2C3` to keep the walkthrough on the hero path.</p>
        </div>
      )}

      {hasSearched && results.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FAF6EF]">
            <Search className="h-8 w-8 text-gray-700" />
          </div>
          <p className="text-sm font-medium text-[#1A1208]">Nothing found for "{query}".</p>
          <p className="text-xs text-gray-700">Try one of the curated shipment numbers instead.</p>
        </div>
      )}

      {hasSearched && results.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-700">{results.length} curated result{results.length !== 1 ? 's' : ''} found</p>
          {results.map((result) => (
            <Card key={result.tracking} className="border-[#E8DDD0] bg-white transition-colors hover:border-violet-200">
              <CardContent className="p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="font-mono text-sm font-bold text-[#1A1208]">{result.tracking}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-gray-700" />
                      <span className="text-xs text-gray-700">{result.warehouse} - {result.bin}</span>
                    </div>
                  </div>
                  <StatusBadge status={result.status} />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#1A1208]">{result.customer}</p>
                    <p className="text-sm text-gray-700">{result.destination}</p>
                    <p className="mt-1 text-xs text-[#8C7B6B]">{result.story}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-700 hover:bg-[#FAF6EF] hover:text-[#1A1208]">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-700 hover:bg-[#FAF6EF] hover:text-[#1A1208]">
                      <Move className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#7C3AED] hover:bg-violet-50 hover:text-[#6D28D9]">
                      <ArrowUpFromLine className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
