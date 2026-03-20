'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RightDrawer } from '@/components/shared';
import {
  RefreshCw,
  Maximize2,
  Phone,
  MapPin,
  Navigation,
  Truck,
  Package,
  Circle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const countries = [
  { code: 'US', label: '🇺🇸 US', flag: '🇺🇸' },
  { code: 'NG', label: '🇳🇬 NG', flag: '🇳🇬' },
  { code: 'GH', label: '🇬🇭 GH', flag: '🇬🇭' },
  { code: 'KE', label: '🇰🇪 KE', flag: '🇰🇪' },
];

const mockDrivers = [
  { id: 'd1', name: 'Adebayo Ogundimu', phone: '+234801234567', status: 'on_trip', isOnline: true, vehiclePlate: 'ABC-123-XY', activeJob: 'DS-20260318-A1B2C3', country: 'NG' },
  { id: 'd2', name: 'Kwame Asante', phone: '+233201234567', status: 'available', isOnline: true, vehiclePlate: 'GH-4567-24', activeJob: null, country: 'GH' },
  { id: 'd3', name: 'Emeka Nwosu', phone: '+234809876543', status: 'available', isOnline: true, vehiclePlate: 'DEF-456-XY', activeJob: null, country: 'NG' },
  { id: 'd4', name: 'James Mwangi', phone: '+254712345678', status: 'on_trip', isOnline: true, vehiclePlate: 'KBA-789Z', activeJob: 'DS-20260317-G7H8I9', country: 'KE' },
  { id: 'd5', name: 'Oluwaseun Adeyemi', phone: '+234807654321', status: 'offline', isOnline: false, vehiclePlate: 'GHI-789-XY', activeJob: null, country: 'NG' },
];

const mockStats = { online: 24, activeTrips: 18, unassigned: 7 };

const statusLabels: Record<string, string> = {
  on_trip: 'On Trip',
  available: 'Online',
  offline: 'Offline',
};

const statusColors: Record<string, string> = {
  on_trip: 'bg-blue-100 text-blue-700',
  available: 'bg-green-100 text-green-700',
  offline: 'bg-gray-100 text-gray-600',
};

const driverPinColors: Record<string, string> = {
  on_trip: '#2563EB',
  available: '#22C55E',
  offline: '#9CA3AF',
};

const countryFlags: Record<string, string> = {
  US: '🇺🇸',
  NG: '🇳🇬',
  GH: '🇬🇭',
  KE: '🇰🇪',
};

interface SelectedDriver {
  id: string;
  name: string;
  phone: string;
  status: string;
  isOnline: boolean;
  vehiclePlate: string;
  activeJob: string | null;
  country: string;
}

export default function DispatchMapPage() {
  const [activeCountry, setActiveCountry] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDriver, setSelectedDriver] = useState<SelectedDriver | null>(null);

  const filteredDrivers = mockDrivers.filter((d) => {
    if (activeCountry !== 'all' && d.country !== activeCountry) return false;
    if (statusFilter === 'all') return true;
    if (statusFilter === 'online') return d.isOnline;
    if (statusFilter === 'on_trip') return d.status === 'on_trip';
    return true;
  });

  return (
    <div className="relative" style={{ minHeight: 'calc(100vh - 56px)' }}>
      {/* Map placeholder */}
      <div className="w-full bg-gray-100 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
        <div className="text-center">
          <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-semibold text-gray-400">Map View</p>
          <p className="text-sm text-gray-400 mt-1">{filteredDrivers.length} drivers visible</p>
        </div>

        {/* Simulated driver pins */}
        {filteredDrivers.map((driver, i) => (
          <button
            key={driver.id}
            onClick={() => setSelectedDriver(driver)}
            className="absolute flex flex-col items-center cursor-pointer group"
            style={{
              left: `${20 + i * 18}%`,
              top: `${25 + (i % 3) * 20}%`,
            }}
          >
            <div
              className="w-9 h-9 rounded-full border-[3px] border-white shadow-lg flex items-center justify-center text-white text-xs font-bold transition-transform group-hover:scale-110"
              style={{ backgroundColor: driverPinColors[driver.status] }}
            >
              {driver.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] mt-[-2px]"
              style={{ borderTopColor: driverPinColors[driver.status] }}
            />
            <span className="mt-1 text-[10px] font-semibold text-gray-700 bg-white/90 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
              {driver.name.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Floating controls - top left */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        {/* Country chips */}
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur rounded-lg p-1 shadow-lg border border-gray-200">
          <button
            onClick={() => setActiveCountry('all')}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-semibold transition-colors',
              activeCountry === 'all'
                ? 'bg-[#2563EB] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            All
          </button>
          {countries.map((c) => (
            <button
              key={c.code}
              onClick={() => setActiveCountry(c.code)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-semibold transition-colors',
                activeCountry === c.code
                  ? 'bg-[#2563EB] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-36 bg-white/95 backdrop-blur shadow-lg border-gray-200 text-xs">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Drivers</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="on_trip">On Trip</SelectItem>
          </SelectContent>
        </Select>

        {/* Refresh button */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 bg-white/95 backdrop-blur shadow-lg border-gray-200 hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4 text-gray-600" />
        </Button>

        {/* Fullscreen toggle */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 bg-white/95 backdrop-blur shadow-lg border-gray-200 hover:bg-gray-50"
        >
          <Maximize2 className="h-4 w-4 text-gray-600" />
        </Button>
      </div>

      {/* Stats card - top right */}
      <div className="absolute top-4 right-4 z-10 bg-[#1A1208]/90 backdrop-blur text-white rounded-xl p-4 shadow-xl min-w-[160px]">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Online</span>
            <span className="text-lg font-bold">{mockStats.online}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Active trips</span>
            <span className="text-lg font-bold">{mockStats.activeTrips}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Unassigned</span>
            <span className="text-lg font-bold text-amber-400">{mockStats.unassigned}</span>
          </div>
        </div>
      </div>

      {/* Right drawer for driver details */}
      <RightDrawer
        open={!!selectedDriver}
        onClose={() => setSelectedDriver(null)}
        title="Driver Details"
        width={320}
      >
        {selectedDriver && (
          <div className="space-y-5">
            {/* Driver info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback
                  className="text-white font-bold text-sm"
                  style={{ backgroundColor: driverPinColors[selectedDriver.status] }}
                >
                  {selectedDriver.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1A1208] text-sm">{selectedDriver.name}</p>
                <p className="text-xs text-[#8C7B6B] flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {selectedDriver.phone}
                </p>
              </div>
              <Badge className={cn('text-[10px]', statusColors[selectedDriver.status])}>
                {statusLabels[selectedDriver.status]}
              </Badge>
            </div>

            {/* Vehicle */}
            <div className="flex items-center gap-2 p-3 bg-[#FFF8F0] rounded-lg border border-[#E8DDD0]">
              <Truck className="h-4 w-4 text-[#8C7B6B]" />
              <div>
                <p className="text-[10px] text-[#8C7B6B] uppercase font-semibold">Vehicle Plate</p>
                <p className="font-mono font-semibold text-sm text-[#1A1208]">{selectedDriver.vehiclePlate}</p>
              </div>
            </div>

            {/* Active job */}
            {selectedDriver.activeJob ? (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="h-4 w-4 text-blue-600" />
                  <p className="text-[10px] text-blue-600 uppercase font-semibold">Active Job</p>
                </div>
                <p className="font-mono font-semibold text-sm text-[#1A1208]">{selectedDriver.activeJob}</p>
                <p className="text-xs text-[#8C7B6B] mt-1">In transit to destination</p>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-500">No active job</p>
                </div>
              </div>
            )}

            {/* Country */}
            <div className="text-xs text-[#8C7B6B] flex items-center gap-1.5">
              <span className="text-base">{countryFlags[selectedDriver.country]}</span>
              <span>{selectedDriver.country}</span>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <Button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm">
                Assign Job
              </Button>
              <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 text-sm">
                Unassign
              </Button>
              <Button variant="outline" className="w-full border-[#E8DDD0] text-[#1A1208] text-sm">
                <Phone className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>
        )}
      </RightDrawer>
    </div>
  );
}
