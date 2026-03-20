'use client';

import { useState } from 'react';
import { Globe, Bell, Shield, AlertTriangle, Trash2, RefreshCw, Key, CheckCircle2, XCircle, ToggleLeft, ToggleRight } from 'lucide-react';
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { formatDate } from '@/lib/utils';

const corridors = [
  { id:'us-ng', label:'US → NG', enabled: true },
  { id:'us-gh', label:'US → GH', enabled: true },
  { id:'us-ke', label:'US → KE', enabled: true },
  { id:'uk-ng', label:'UK → NG', enabled: true },
];

const couriers = [
  { id:'dhl', name:'DHL Express', apiKey:'configured', active: true },
  { id:'fedex', name:'FedEx International', apiKey:'configured', active: true },
  { id:'ups', name:'UPS Worldwide', apiKey:'configured', active: true },
  { id:'aramex', name:'Aramex', apiKey:'missing', active: false },
  { id:'local', name:'Local Fleet (Internal)', apiKey:'configured', active: true },
];

const auditLog = [
  { timestamp:'2026-03-18T10:30:00Z', user:'admin@diasporaship.com', action:'Updated shipment DS-20260318-A1B2C3 status to in_transit_international' },
  { timestamp:'2026-03-18T09:15:00Z', user:'ops@diasporaship.com', action:'Approved KYC submission for Fatima Bello' },
  { timestamp:'2026-03-18T08:45:00Z', user:'admin@diasporaship.com', action:'Force cleared customs for DS-20260314-P6Q7R8' },
  { timestamp:'2026-03-17T16:20:00Z', user:'admin@diasporaship.com', action:'Added new vehicle GH-888-ACC to fleet' },
  { timestamp:'2026-03-17T14:00:00Z', user:'ops@diasporaship.com', action:'Deactivated user emeka.nwankwo@example.com' },
  { timestamp:'2026-03-17T11:30:00Z', user:'admin@diasporaship.com', action:'Updated notification settings - enabled SMS globally' },
  { timestamp:'2026-03-17T09:00:00Z', user:'admin@diasporaship.com', action:'Added Accra Agent branch' },
  { timestamp:'2026-03-16T15:45:00Z', user:'ops@diasporaship.com', action:'Rejected KYC submission for unknown user' },
  { timestamp:'2026-03-16T12:00:00Z', user:'admin@diasporaship.com', action:'Enabled US→KE corridor' },
  { timestamp:'2026-03-16T10:30:00Z', user:'admin@diasporaship.com', action:'Updated session timeout to 1 hour' },
  { timestamp:'2026-03-15T16:00:00Z', user:'ops@diasporaship.com', action:'Adjusted wallet balance for John Okafor (+$500)' },
  { timestamp:'2026-03-15T14:20:00Z', user:'admin@diasporaship.com', action:'Tested DHL API connection - success' },
  { timestamp:'2026-03-15T11:00:00Z', user:'admin@diasporaship.com', action:'Updated platform support email' },
  { timestamp:'2026-03-14T16:30:00Z', user:'ops@diasporaship.com', action:'Assigned vehicle LG-284-KJA to driver Adebayo Ogundimu' },
  { timestamp:'2026-03-14T10:00:00Z', user:'admin@diasporaship.com', action:'Force held customs shipment DS-20260312-G7H8I9' },
  { timestamp:'2026-03-13T15:00:00Z', user:'admin@diasporaship.com', action:'Enabled MFA requirement for all admins' },
  { timestamp:'2026-03-13T11:00:00Z', user:'ops@diasporaship.com', action:'Approved KYC submission for Kwame Asante' },
  { timestamp:'2026-03-12T14:30:00Z', user:'admin@diasporaship.com', action:'Cleared platform cache' },
  { timestamp:'2026-03-12T09:00:00Z', user:'admin@diasporaship.com', action:'Updated FedEx API key' },
  { timestamp:'2026-03-11T16:00:00Z', user:'ops@diasporaship.com', action:'Changed driver Emeka Nwosu status to available' },
];

export default function AdminSettingsPage() {
  const [corridorState, setCorridorState] = useState(corridors);
  const [courierState, setCourierState] = useState(couriers);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('1h');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const toggleCorridor = (id: string) => {
    setCorridorState(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  const toggleCourier = (id: string) => {
    setCourierState(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-[var(--ink)]">Platform Settings</h1>
        <p className="text-xs text-[var(--muted-text)]">Configure system-wide settings</p>
      </div>

      <Tabs defaultValue="platform">
        <TabsList className="flex-wrap h-auto gap-1 bg-transparent">
          <TabsTrigger value="platform" className="data-[state=active]:bg-[var(--terra)] data-[state=active]:text-white">Platform</TabsTrigger>
          <TabsTrigger value="corridors" className="data-[state=active]:bg-[var(--terra)] data-[state=active]:text-white">Corridors</TabsTrigger>
          <TabsTrigger value="couriers" className="data-[state=active]:bg-[var(--terra)] data-[state=active]:text-white">Couriers</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-[var(--terra)] data-[state=active]:text-white">Notifications</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-[var(--terra)] data-[state=active]:text-white">Security</TabsTrigger>
          <TabsTrigger value="danger" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="platform" className="mt-4 space-y-4">
          <div className="border border-[var(--border-warm)] rounded-xl bg-[var(--warm-white)] p-5 space-y-4">
            <div><label className="text-xs font-semibold text-[var(--muted-text)] uppercase tracking-wider">Platform Name</label><Input defaultValue="DiasporaShip" className="mt-1" /></div>
            <div>
              <label className="text-xs font-semibold text-[var(--muted-text)] uppercase tracking-wider">Logo</label>
              <div className="mt-1 border-2 border-dashed border-[var(--border-warm)] rounded-lg p-6 text-center text-sm text-[var(--muted-text)]">
                Click to upload logo (PNG, SVG)
              </div>
            </div>
            <div><label className="text-xs font-semibold text-[var(--muted-text)] uppercase tracking-wider">Support Email</label><Input defaultValue="support@diasporaship.com" className="mt-1" /></div>
            <div><label className="text-xs font-semibold text-[var(--muted-text)] uppercase tracking-wider">Contact Phone</label><Input defaultValue="+1 (404) 555-1234" className="mt-1" /></div>
            <Button className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white">Save Changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="corridors" className="mt-4">
          <div className="border border-[var(--border-warm)] rounded-xl bg-[var(--warm-white)] p-5 space-y-3">
            {corridorState.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-[var(--cream)] rounded-lg">
                <div>
                  <div className="text-sm font-medium text-[var(--ink)]">{c.label}</div>
                  <div className="text-xs text-gray-600">Base rate: Phase 2</div>
                </div>
                <button onClick={() => toggleCorridor(c.id)} className="text-2xl">
                  {c.enabled ? <ToggleRight size={28} className="text-green-500" /> : <ToggleLeft size={28} className="text-gray-300" />}
                </button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="couriers" className="mt-4">
          <div className="border border-[var(--border-warm)] rounded-xl bg-[var(--warm-white)] p-5 space-y-3">
            {courierState.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-[var(--cream)] rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="text-sm font-medium text-[var(--ink)]">{c.name}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {c.apiKey === 'configured' ? (
                        <><CheckCircle2 size={12} className="text-green-500" /><span className="text-xs text-green-700">Configured</span></>
                      ) : (
                        <><XCircle size={12} className="text-red-500" /><span className="text-xs text-red-600">Missing</span></>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1"><Key size={10} /> Test</Button>
                  <button onClick={() => toggleCourier(c.id)}>
                    {c.active ? <ToggleRight size={28} className="text-green-500" /> : <ToggleLeft size={28} className="text-gray-300" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <div className="border border-[var(--border-warm)] rounded-xl bg-[var(--warm-white)] p-5 space-y-4">
            <div className="flex items-center justify-between p-3 bg-[var(--cream)] rounded-lg">
              <div>
                <div className="text-sm font-medium text-[var(--ink)]">Global SMS</div>
                <div className="text-xs text-gray-600">Send SMS notifications for all events</div>
              </div>
              <button onClick={() => setSmsEnabled(!smsEnabled)}>
                {smsEnabled ? <ToggleRight size={28} className="text-green-500" /> : <ToggleLeft size={28} className="text-gray-300" />}
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--cream)] rounded-lg">
              <div>
                <div className="text-sm font-medium text-[var(--ink)]">Global Email</div>
                <div className="text-xs text-gray-600">Send email notifications for all events</div>
              </div>
              <button onClick={() => setEmailEnabled(!emailEnabled)}>
                {emailEnabled ? <ToggleRight size={28} className="text-green-500" /> : <ToggleLeft size={28} className="text-gray-300" />}
              </button>
            </div>
            <div className="border-t border-[var(--border-warm)] pt-4">
              <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Provider Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-[var(--cream)] rounded-lg">
                  <span className="text-sm font-medium text-[var(--ink)]">Twilio (SMS)</span>
                  <Badge className="bg-green-100 text-green-800"><CheckCircle2 size={10} className="mr-1" /> Connected</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-[var(--cream)] rounded-lg">
                  <span className="text-sm font-medium text-[var(--ink)]">SendGrid (Email)</span>
                  <Badge className="bg-green-100 text-green-800"><CheckCircle2 size={10} className="mr-1" /> Connected</Badge>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-4 space-y-4">
          <div className="border border-[var(--border-warm)] rounded-xl bg-[var(--warm-white)] p-5 space-y-4">
            <div className="flex items-center justify-between p-3 bg-[var(--cream)] rounded-lg">
              <div>
                <div className="text-sm font-medium text-[var(--ink)]">Force MFA for Admins</div>
                <div className="text-xs text-gray-600">Require two-factor authentication for all admin accounts</div>
              </div>
              <button onClick={() => setMfaEnabled(!mfaEnabled)}>
                {mfaEnabled ? <ToggleRight size={28} className="text-green-500" /> : <ToggleLeft size={28} className="text-gray-300" />}
              </button>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Session Timeout</label>
              <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                <SelectTrigger className="mt-1 w-48 text-[var(--ink)] [&_span]:text-[var(--ink)]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="15m">15 minutes</SelectItem>
                  <SelectItem value="30m">30 minutes</SelectItem>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="4h">4 hours</SelectItem>
                  <SelectItem value="24h">24 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border border-[var(--border-warm)] rounded-xl bg-[var(--warm-white)] p-5">
            <h3 className="text-sm font-semibold text-[var(--ink)] mb-4">Audit Log (Last 20 Entries)</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {auditLog.map((entry, i) => (
                <div key={i} className="flex items-start gap-3 p-2 bg-[var(--cream)] rounded-lg text-sm">
                  <div className="flex-1">
                    <div className="text-[var(--ink)]">{entry.action}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{entry.user} · {formatDate(entry.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="danger" className="mt-4">
          <div className="border-2 border-red-200 rounded-xl bg-red-50/30 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-red-800">Danger Zone</h3>
                <p className="text-xs text-red-600 mt-1">These actions are irreversible. Proceed with caution.</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-200">
              <div>
                <div className="text-sm font-medium text-[var(--ink)]">Maintenance Mode</div>
                <div className="text-xs text-gray-600">Disable all customer-facing operations</div>
              </div>
              <button onClick={() => setMaintenanceMode(!maintenanceMode)}>
                {maintenanceMode ? <ToggleRight size={28} className="text-orange-500" /> : <ToggleLeft size={28} className="text-gray-300" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-[var(--border-warm)]">
              <div>
                <div className="text-sm font-medium text-[var(--ink)]">Clear Cache</div>
                <div className="text-xs text-gray-600">Clear all cached data across the platform</div>
              </div>
              <Button variant="outline" className="gap-1.5 text-sm"><RefreshCw size={14} /> Clear Cache</Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-300">
              <div>
                <div className="text-sm font-medium text-red-700">Reset All Data</div>
                <div className="text-xs text-red-500">Permanently delete all platform data</div>
              </div>
              <Button variant="destructive" className="gap-1.5 text-sm" onClick={() => setResetConfirmOpen(true)}><Trash2 size={14} /> Reset All Data</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-700">Reset All Data</DialogTitle>
            <DialogDescription>This action is irreversible. All shipments, users, transactions, and configurations will be permanently deleted.</DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
            Type <strong>RESET</strong> to confirm. This will wipe all data.
          </div>
          <Input placeholder="Type RESET to confirm" className="border-red-300" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive">I understand, reset everything</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
