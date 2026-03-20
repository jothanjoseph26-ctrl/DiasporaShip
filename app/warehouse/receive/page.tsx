'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Barcode,
  Camera,
  CheckCircle2,
  Package,
  MapPin,
  Weight,
  DollarSign,
  User,
  Route,
  Plus,
} from 'lucide-react';

const binLocations = ['A-12-3', 'A-12-4', 'A-13-1', 'B-05-1', 'B-05-2', 'C-08-2', 'C-09-1', 'D-01-1'];

const mockLookupResult = {
  trackingNumber: 'DS-20260320-A1B2C3',
  customerName: 'John Okafor',
  route: 'US → NG',
  expectedWeight: '5.2 kg',
  shipmentType: 'parcel',
  pickupAddress: '123 Commerce St, Atlanta, GA',
  deliveryAddress: '15 Admiralty Way, Lagos',
  declaredValue: 250.0,
};

type ViewState = 'scan' | 'lookup' | 'success';

export default function ReceivePage() {
  const [barcode, setBarcode] = useState('');
  const [viewState, setViewState] = useState<ViewState>('scan');
  const [actualWeight, setActualWeight] = useState('5.2');
  const [binLocation, setBinLocation] = useState('');
  const [condition, setCondition] = useState<'good' | 'damaged'>('good');
  const [binQuery, setBinQuery] = useState('');

  const filteredBins = binQuery
    ? binLocations.filter((b) => b.toLowerCase().includes(binQuery.toLowerCase()))
    : binLocations;

  function handleLookup() {
    if (barcode.trim()) {
      setViewState('lookup');
    }
  }

  function handleConfirm() {
    setViewState('success');
  }

  function handleReset() {
    setBarcode('');
    setViewState('scan');
    setActualWeight('5.2');
    setBinLocation('');
    setCondition('good');
    setBinQuery('');
  }

  if (viewState === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-5">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#1A1208]">Received</h2>
          <p className="font-mono text-sm text-[#8C7B6B] mt-1">{mockLookupResult.trackingNumber}</p>
        </div>
        <Button onClick={handleReset} className="gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white h-12 px-8 rounded-xl">
          <Plus className="h-4 w-4" />
          Receive Another
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-base">🇺🇸</span>
        <Select defaultValue="atlanta">
          <SelectTrigger className="w-full bg-white border-[#E8DDD0]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="atlanta">Atlanta Hub</SelectItem>
            <SelectItem value="lagos">Lagos Hub</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-[#E8DDD0] bg-white">
        <CardContent className="p-5 space-y-4">
          <div className="relative">
            <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8C7B6B]" />
            <Input
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Scan or enter tracking number"
              className="h-14 pl-12 pr-4 text-lg font-mono bg-[#FAF6EF] border-[#E8DDD0] rounded-xl"
              autoFocus
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-14 gap-2 rounded-xl border-[#E8DDD0] text-[#1A1208] hover:bg-[#FAF6EF]">
              <Camera className="h-5 w-5" />
              Scan with camera
            </Button>
            <Button
              onClick={handleLookup}
              className="flex-1 h-14 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-base font-semibold"
              disabled={!barcode.trim()}
            >
              Look Up
            </Button>
          </div>
        </CardContent>
      </Card>

      {viewState === 'lookup' && (
        <Card className="border-[#E8DDD0] bg-white">
          <CardContent className="p-5 space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-[#1A1208]">{mockLookupResult.trackingNumber}</span>
              <Badge className="bg-violet-100 text-violet-800 text-xs">{mockLookupResult.shipmentType}</Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-[#8C7B6B]" />
                <span className="text-sm text-[#1A1208]">{mockLookupResult.customerName}</span>
              </div>
              <div className="flex items-center gap-3">
                <Route className="h-4 w-4 text-[#8C7B6B]" />
                <span className="text-sm text-[#1A1208]">{mockLookupResult.route}</span>
              </div>
              <div className="flex items-center gap-3">
                <Weight className="h-4 w-4 text-[#8C7B6B]" />
                <span className="text-sm text-[#1A1208]">Expected: {mockLookupResult.expectedWeight}</span>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-[#8C7B6B]" />
                <span className="text-sm text-[#1A1208]">Declared value: ${mockLookupResult.declaredValue.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-[#8C7B6B] uppercase tracking-wider mb-1.5 block">Actual Weight (kg)</label>
                <Input
                  value={actualWeight}
                  onChange={(e) => setActualWeight(e.target.value)}
                  className="h-11 bg-[#FAF6EF] border-[#E8DDD0]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#8C7B6B] uppercase tracking-wider mb-1.5 block">Bin Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C7B6B]" />
                  <Input
                    value={binLocation || binQuery}
                    onChange={(e) => {
                      setBinQuery(e.target.value);
                      setBinLocation('');
                    }}
                    placeholder="Search bin location..."
                    className="h-11 pl-9 bg-[#FAF6EF] border-[#E8DDD0]"
                  />
                </div>
                {binQuery && !binLocation && (
                  <div className="mt-1 bg-white border border-[#E8DDD0] rounded-lg shadow-sm max-h-32 overflow-y-auto">
                    {filteredBins.map((bin) => (
                      <button
                        key={bin}
                        onClick={() => {
                          setBinLocation(bin);
                          setBinQuery('');
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[#FAF6EF] transition-colors font-mono"
                      >
                        {bin}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-[#8C7B6B] uppercase tracking-wider mb-1.5 block">Condition</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCondition('good')}
                    className={`flex-1 h-11 rounded-xl text-sm font-semibold border transition-colors ${
                      condition === 'good'
                        ? 'bg-green-50 border-green-300 text-green-800'
                        : 'bg-white border-[#E8DDD0] text-[#8C7B6B] hover:bg-[#FAF6EF]'
                    }`}
                  >
                    Good
                  </button>
                  <button
                    onClick={() => setCondition('damaged')}
                    className={`flex-1 h-11 rounded-xl text-sm font-semibold border transition-colors ${
                      condition === 'damaged'
                        ? 'bg-red-50 border-red-300 text-red-800'
                        : 'bg-white border-[#E8DDD0] text-[#8C7B6B] hover:bg-[#FAF6EF]'
                    }`}
                  >
                    Damaged
                  </button>
                </div>
              </div>

              <Button variant="outline" className="w-full h-11 gap-2 rounded-xl border-[#E8DDD0] text-[#1A1208] hover:bg-[#FAF6EF]">
                <Camera className="h-4 w-4" />
                Capture Photo
              </Button>
            </div>

            <Button
              onClick={handleConfirm}
              className="w-full h-14 rounded-xl bg-green-600 hover:bg-green-700 text-white text-base font-semibold gap-2"
              disabled={!binLocation}
            >
              <CheckCircle2 className="h-5 w-5" />
              Confirm Receipt
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
