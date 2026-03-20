'use client';

import { useState, useMemo } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Send,
  Users,
  Globe,
  Building2,
  Search,
  Plus,
  X,
  Clock,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const countryOptions = [
  { code: 'US', label: '🇺🇸 US' },
  { code: 'NG', label: '🇳🇬 NG' },
  { code: 'GH', label: '🇬🇭 GH' },
  { code: 'KE', label: '🇰🇪 KE' },
];

const branchOptions = [
  { id: 'b1', name: 'Lagos HQ' },
  { id: 'b2', name: 'Abuja Branch' },
  { id: 'b3', name: 'Accra Agent' },
  { id: 'b4', name: 'Nairobi Agent' },
  { id: 'b5', name: 'Atlanta HQ' },
];

const allDrivers = [
  { id: 'd1', name: 'Adebayo Ogundimu', initials: 'AO', isOnline: true, country: 'NG' },
  { id: 'd2', name: 'Kwame Asante', initials: 'KA', isOnline: true, country: 'GH' },
  { id: 'd3', name: 'Emeka Nwosu', initials: 'EN', isOnline: true, country: 'NG' },
  { id: 'd4', name: 'James Mwangi', initials: 'JM', isOnline: true, country: 'KE' },
  { id: 'd5', name: 'Oluwaseun Adeyemi', initials: 'OA', isOnline: false, country: 'NG' },
  { id: 'd6', name: 'Chinwe Eze', initials: 'CE', isOnline: true, country: 'NG' },
  { id: 'd7', name: 'Fatima Bello', initials: 'FB', isOnline: true, country: 'NG' },
  { id: 'd8', name: 'Grace Okafor', initials: 'GO', isOnline: false, country: 'NG' },
  { id: 'd9', name: 'Ibrahim Musa', initials: 'IM', isOnline: true, country: 'NG' },
  { id: 'd10', name: 'Wanjiku Kamau', initials: 'WK', isOnline: true, country: 'KE' },
  { id: 'd11', name: 'Kofi Mensah', initials: 'KM', isOnline: false, country: 'GH' },
  { id: 'd12', name: 'Amina Sani', initials: 'AS', isOnline: true, country: 'NG' },
  { id: 'd13', name: 'Yusuf Bello', initials: 'YB', isOnline: true, country: 'NG' },
  { id: 'd14', name: 'Ngozi Okonkwo', initials: 'NO', isOnline: false, country: 'NG' },
  { id: 'd15', name: 'Samuel Adjei', initials: 'SA', isOnline: true, country: 'GH' },
  { id: 'd16', name: 'Peter Oduya', initials: 'PO', isOnline: true, country: 'US' },
  { id: 'd17', name: 'Mary Akinyi', initials: 'MA', isOnline: true, country: 'KE' },
  { id: 'd18', name: 'David Otieno', initials: 'DO', isOnline: false, country: 'KE' },
  { id: 'd19', name: 'Sarah Boateng', initials: 'SB', isOnline: true, country: 'GH' },
  { id: 'd20', name: 'Michael Chen', initials: 'MC', isOnline: true, country: 'US' },
  { id: 'd21', name: 'Adaobi Nwankwo', initials: 'AN', isOnline: true, country: 'NG' },
  { id: 'd22', name: 'Joseph Amponsah', initials: 'JA', isOnline: false, country: 'GH' },
  { id: 'd23', name: 'Halima Garba', initials: 'HG', isOnline: true, country: 'NG' },
  { id: 'd24', name: 'Brian Ochieng', initials: 'BO', isOnline: true, country: 'KE' },
];

const mockBroadcasts = [
  { id: 'b1', sender: 'Dispatch Team', target: 'All Drivers (NG)', message: 'Reminder: All pending pickups must be completed by 6 PM today.', time: '2 hours ago', delivered: 18 },
  { id: 'b2', sender: 'Dispatch Team', target: 'Branch: Lagos Hub', message: 'New route assignments for tomorrow have been posted. Check your queue.', time: '5 hours ago', delivered: 12 },
  { id: 'b3', sender: 'Operations', target: 'All Drivers', message: 'System maintenance tonight 11 PM - 1 AM. Plan your deliveries accordingly.', time: '1 day ago', delivered: 24 },
];

type SendTarget = 'all' | 'country' | 'branch' | 'specific';

export default function DispatchBroadcastPage() {
  const [sendTarget, setSendTarget] = useState<SendTarget>('all');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [specificSearch, setSpecificSearch] = useState('');
  const [specificDrivers, setSpecificDrivers] = useState<typeof allDrivers>([]);
  const [message, setMessage] = useState('');

  const maxChars = 500;

  const toggleCountry = (code: string) => {
    setSelectedCountries(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const addDriver = (driver: (typeof allDrivers)[0]) => {
    if (!specificDrivers.find(d => d.id === driver.id)) {
      setSpecificDrivers(prev => [...prev, driver]);
    }
    setSpecificSearch('');
  };

  const removeDriver = (id: string) => {
    setSpecificDrivers(prev => prev.filter(d => d.id !== id));
  };

  const recipientCount = useMemo(() => {
    if (sendTarget === 'all') return allDrivers.length;
    if (sendTarget === 'country') {
      if (selectedCountries.length === 0) return 0;
      return allDrivers.filter(d => selectedCountries.includes(d.country)).length;
    }
    if (sendTarget === 'branch') {
      if (!selectedBranch) return 0;
      return allDrivers.filter(d => d.country === 'NG').slice(0, 8).length;
    }
    if (sendTarget === 'specific') return specificDrivers.length;
    return 0;
  }, [sendTarget, selectedCountries, selectedBranch, specificDrivers]);

  const filteredSearch = useMemo(() => {
    if (!specificSearch) return [];
    return allDrivers.filter(d =>
      d.name.toLowerCase().includes(specificSearch.toLowerCase()) &&
      !specificDrivers.find(sd => sd.id === d.id)
    ).slice(0, 5);
  }, [specificSearch, specificDrivers]);

  const previewDrivers = useMemo(() => {
    if (sendTarget === 'all') return allDrivers.slice(0, 12);
    if (sendTarget === 'country') {
      if (selectedCountries.length === 0) return [];
      return allDrivers.filter(d => selectedCountries.includes(d.country));
    }
    if (sendTarget === 'branch') {
      if (!selectedBranch) return [];
      return allDrivers.filter(d => d.country === 'NG').slice(0, 8);
    }
    return specificDrivers;
  }, [sendTarget, selectedCountries, selectedBranch, specificDrivers]);

  return (
    <div className="space-y-6">
      {/* Composer */}
      <div className="flex gap-6" style={{ minHeight: '420px' }}>
        {/* Left panel - composer */}
        <div className="w-[420px] flex-shrink-0 space-y-4">
          {/* Send to */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-text)] mb-2 block">
              Send to
            </label>
            <Select value={sendTarget} onValueChange={(v) => setSendTarget(v as SendTarget)}>
              <SelectTrigger className="h-10 bg-white border-[var(--border-warm)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <span className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" /> All Drivers
                  </span>
                </SelectItem>
                <SelectItem value="country">
                  <span className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5" /> By Country
                  </span>
                </SelectItem>
                <SelectItem value="branch">
                  <span className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5" /> By Branch
                  </span>
                </SelectItem>
                <SelectItem value="specific">
                  <span className="flex items-center gap-2">
                    <Search className="h-3.5 w-3.5" /> Specific Drivers
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Country multi-select */}
          {sendTarget === 'country' && (
            <div className="flex flex-wrap gap-2">
              {countryOptions.map((c) => (
                <button
                  key={c.code}
                  onClick={() => toggleCountry(c.code)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
                    selectedCountries.includes(c.code)
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : 'bg-white text-[#1A1208] border-[var(--border-warm)] hover:border-[#2563EB]/30'
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}

          {/* Branch selector */}
          {sendTarget === 'branch' && (
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="h-10 bg-white border-[var(--border-warm)]">
                <SelectValue placeholder="Select branch..." />
              </SelectTrigger>
              <SelectContent>
                {branchOptions.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Specific driver search */}
          {sendTarget === 'specific' && (
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-text)]" />
                <Input
                  placeholder="Search drivers by name..."
                  value={specificSearch}
                  onChange={(e) => setSpecificSearch(e.target.value)}
                  className="pl-9 bg-white border-[var(--border-warm)]"
                />
              </div>
              {filteredSearch.length > 0 && (
                <div className="bg-white border border-[var(--border-warm)] rounded-lg overflow-hidden">
                  {filteredSearch.map((driver) => (
                    <button
                      key={driver.id}
                      onClick={() => addDriver(driver)}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#FFF8F0] transition-colors text-left"
                    >
                      <Plus className="h-3.5 w-3.5 text-[#2563EB]" />
                      <span className="text-sm text-[#1A1208]">{driver.name}</span>
                    </button>
                  ))}
                </div>
              )}
              {specificDrivers.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {specificDrivers.map((d) => (
                    <Badge
                      key={d.id}
                      variant="secondary"
                      className="gap-1 pl-2 pr-1 py-1 bg-[#FFF8F0] text-[#1A1208] border border-[#E8DDD0]"
                    >
                      {d.name}
                      <button
                        onClick={() => removeDriver(d.id)}
                        className="ml-0.5 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Message textarea */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-text)] mb-1.5 block">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, maxChars))}
              placeholder="Type your broadcast message..."
              className="w-full h-32 bg-white border border-[var(--border-warm)] rounded-lg px-3 py-2.5 text-sm text-[#1A1208] placeholder:text-[var(--muted-text)] resize-none focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
            />
            <p className={cn(
              'text-[10px] mt-1 text-right',
              message.length > maxChars * 0.9 ? 'text-red-500 font-semibold' : 'text-[var(--muted-text)]'
            )}>
              {message.length} / {maxChars}
            </p>
          </div>

          {/* Send button + preview */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--muted-text)]">
              Sending to <span className="font-semibold text-[#1A1208]">{recipientCount} drivers</span>
            </p>
            <Button
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white gap-2 px-6"
              disabled={!message.trim() || recipientCount === 0}
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>

        {/* Right panel - recipient preview */}
        <div className="flex-1 bg-[var(--cream)] rounded-xl border border-[var(--border-warm)] p-4 overflow-y-auto">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-text)] mb-3">
            Recipients ({previewDrivers.length})
          </h3>
          {previewDrivers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-10 w-10 mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-[var(--muted-text)]">No recipients selected</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {previewDrivers.map((driver) => (
                <div
                  key={driver.id}
                  className="flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-[var(--border-warm)]"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[10px] font-bold">
                      {driver.initials}
                    </div>
                    <span
                      className={cn(
                        'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white',
                        driver.isOnline ? 'bg-green-500' : 'bg-gray-300'
                      )}
                    />
                  </div>
                  <span className="text-xs text-[#1A1208] font-medium truncate">{driver.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Separator className="bg-[var(--border-warm)]" />

      {/* Message History */}
      <div>
        <h3 className="text-sm font-semibold text-[#1A1208] mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#8C7B6B]" />
          Message History
        </h3>
        <div className="space-y-3">
          {mockBroadcasts.map((broadcast) => (
            <div
              key={broadcast.id}
              className="p-4 bg-white rounded-lg border border-[var(--border-warm)] hover:border-[#2563EB]/20 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-[#1A1208]">{broadcast.sender}</p>
                  <p className="text-[10px] text-[var(--muted-text)] mt-0.5">{broadcast.target}</p>
                </div>
                <span className="text-[10px] text-[var(--muted-text)] flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {broadcast.time}
                </span>
              </div>
              <p className="text-sm text-[#1A1208]/80 line-clamp-2">{broadcast.message}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                <span className="text-[10px] text-[var(--muted-text)]">
                  Delivered to {broadcast.delivered} drivers
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
