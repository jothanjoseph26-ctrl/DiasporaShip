'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared';
import {
  Search,
  ScanLine,
  Eye,
  Move,
  ArrowUpFromLine,
  MapPin,
  Package,
} from 'lucide-react';
import type { ShipmentStatus } from '@/types';

interface SearchResult {
  tracking: string;
  warehouse: string;
  bin: string;
  status: ShipmentStatus;
  customer: string;
  destination: string;
}

const mockSearchResults: SearchResult[] = [
  { tracking: 'DS-20260318-A1B2C3', warehouse: 'Atlanta Hub', bin: 'A-12-3', status: 'at_warehouse', customer: 'John Okafor', destination: '🇳🇬 Nigeria' },
  { tracking: 'DS-20260318-D4E5F6', warehouse: 'Lagos Hub', bin: 'B-05-1', status: 'processing', customer: 'Emeka Nwosu', destination: '🇺🇸 United States' },
  { tracking: 'DS-20260317-G7H8I9', warehouse: 'Atlanta Hub', bin: 'C-08-2', status: 'customs_pending', customer: 'Kwame Asante', destination: '🇬🇭 Ghana' },
];

type SearchMode = 'all' | 'warehouse' | 'transit';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [mode, setMode] = useState<SearchMode>('all');
  const [scanMode, setScanMode] = useState(false);

  const results = hasSearched ? mockSearchResults : [];

  function handleSearch() {
    if (query.trim()) {
      setHasSearched(true);
    }
  }

  const modes: { key: SearchMode; label: string }[] = [
    { key: 'all', label: 'All Warehouses' },
    { key: 'warehouse', label: 'This Warehouse' },
    { key: 'transit', label: 'In Transit' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Card className="border-[#E8DDD0] bg-white">
        <CardContent className="p-5 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-700" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!e.target.value.trim()) setHasSearched(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Tracking number, customer name, or bin location..."
              className="h-14 pl-12 pr-4 text-base bg-[#FAF6EF] border-[#E8DDD0] rounded-xl"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-2">
            {modes.map((m) => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  mode === m.key
                    ? 'bg-[#7C3AED] text-white'
                    : 'bg-[#FAF6EF] text-gray-700 hover:bg-[#F5EBE0]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setScanMode(!scanMode)}
              className={`flex-1 h-12 gap-2 rounded-xl border-[#E8DDD0] text-[#1A1208] hover:bg-[#FAF6EF] ${scanMode ? 'bg-violet-50 border-violet-300 text-[#7C3AED]' : ''}`}
            >
              <ScanLine className="h-5 w-5" />
              {scanMode ? 'Scan Mode On' : 'Scan with camera'}
            </Button>
            <Button
              onClick={handleSearch}
              className="flex-1 h-12 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold"
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
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-700">
              <div className="h-24 w-24 rounded-2xl bg-[#FAF6EF] flex items-center justify-center">
                <ScanLine className="h-10 w-10" />
              </div>
              <p className="text-sm font-medium">Camera scanner active</p>
              <p className="text-xs">Point camera at barcode to scan</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!hasSearched && !scanMode && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="h-16 w-16 rounded-2xl bg-[#FAF6EF] flex items-center justify-center">
            <Package className="h-8 w-8 text-gray-700" />
          </div>
          <p className="text-sm text-gray-700">Enter a tracking number, customer name, or bin location to search.</p>
        </div>
      )}

      {hasSearched && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="h-16 w-16 rounded-2xl bg-[#FAF6EF] flex items-center justify-center">
            <Search className="h-8 w-8 text-gray-700" />
          </div>
          <p className="text-sm font-medium text-[#1A1208]">Nothing found for &quot;{query}&quot;.</p>
          <p className="text-xs text-gray-700">Check the tracking number and try again.</p>
        </div>
      )}

      {hasSearched && results.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
          {results.map((result) => (
            <Card key={result.tracking} className="border-[#E8DDD0] bg-white hover:border-violet-200 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono text-sm font-bold text-[#1A1208]">{result.tracking}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin className="h-3 w-3 text-gray-700" />
                      <span className="text-xs text-gray-700">{result.warehouse} — {result.bin}</span>
                    </div>
                  </div>
                  <StatusBadge status={result.status} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-[#1A1208]">{result.customer}</span>
                    <span className="text-sm text-gray-700">{result.destination}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-700 hover:text-[#1A1208] hover:bg-[#FAF6EF]">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-700 hover:text-[#1A1208] hover:bg-[#FAF6EF]">
                      <Move className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#7C3AED] hover:text-[#6D28D9] hover:bg-violet-50">
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
