'use client';

import { useState } from 'react';
import { Bell, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { PasswordStrengthBar } from '@/components/shared';

export default function CustomsSettingsPage() {
  const [name, setName] = useState('Officer A. Alabi');
  const [email, setEmail] = useState('customs@diasporaship.com');
  const [phone, setPhone] = useState('+2348012345678');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const [pushNotifs, setPushNotifs] = useState({ newQueue: true, holdAlerts: true, clearances: true });
  const [emailNotifs, setEmailNotifs] = useState({ newQueue: false, holdAlerts: true, clearances: true });

  const togglePush = (key: keyof typeof pushNotifs) => setPushNotifs(p => ({ ...p, [key]: !p[key] }));
  const toggleEmail = (key: keyof typeof emailNotifs) => setEmailNotifs(p => ({ ...p, [key]: !p[key] }));

  const placeholderRules = [
    { id: 1, name: 'High-value shipment flag', desc: 'Shipments with declared value > $50,000 require manual review', active: true },
    { id: 2, name: 'Restricted HS codes', desc: 'HS codes 9301-9305 (arms/ammunition) automatically held', active: true },
    { id: 3, name: 'Missing Form M', desc: 'Nigeria-bound cargo without Form M is auto-flagged', active: false },
  ];

  return (
    <Tabs defaultValue="account" className="space-y-6">
      <TabsList className="bg-[var(--cream)]">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="rules">Rules (Phase 2)</TabsTrigger>
      </TabsList>

      <TabsContent value="account" className="space-y-6">
        <div className="bg-[var(--warm-white)] border border-[var(--border-warm)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-card)] max-w-xl space-y-5">
          <h3 className="text-sm font-semibold text-[var(--ink)]">Profile Information</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-[var(--muted-text)]">Full Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-[var(--muted-text)]">Email</Label>
              <Input value={email} onChange={e => setEmail(e.target.value)} className="mt-1" type="email" />
            </div>
            <div>
              <Label className="text-xs text-[var(--muted-text)]">Phone</Label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} className="mt-1" />
            </div>
          </div>
          <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">Save Changes</Button>
        </div>

        <div className="bg-[var(--warm-white)] border border-[var(--border-warm)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-card)] max-w-xl space-y-5">
          <h3 className="text-sm font-semibold text-[var(--ink)]">Change Password</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-[var(--muted-text)]">Current Password</Label>
              <Input value={currentPw} onChange={e => setCurrentPw(e.target.value)} type="password" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-[var(--muted-text)]">New Password</Label>
              <Input value={newPw} onChange={e => setNewPw(e.target.value)} type="password" className="mt-1" />
              <PasswordStrengthBar password={newPw} />
            </div>
            <div>
              <Label className="text-xs text-[var(--muted-text)]">Confirm New Password</Label>
              <Input value={confirmPw} onChange={e => setConfirmPw(e.target.value)} type="password" className="mt-1" />
            </div>
          </div>
          <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">Update Password</Button>
        </div>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <div className="bg-[var(--warm-white)] border border-[var(--border-warm)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-card)] max-w-xl">
          <div className="flex items-center gap-2 mb-5">
            <Bell size={16} className="text-cyan-600" />
            <h3 className="text-sm font-semibold text-[var(--ink)]">Push Notifications</h3>
          </div>
          <div className="space-y-4">
            {[
              { key: 'newQueue' as const, label: 'New queue items', desc: 'When new shipments enter the customs queue' },
              { key: 'holdAlerts' as const, label: 'Hold alerts', desc: 'When a shipment is placed on hold' },
              { key: 'clearances' as const, label: 'Clearance confirmations', desc: 'When a shipment is cleared' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">{item.label}</p>
                  <p className="text-xs text-[var(--muted-text)]">{item.desc}</p>
                </div>
                <button
                  onClick={() => togglePush(item.key)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${pushNotifs[item.key] ? 'bg-cyan-600' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${pushNotifs[item.key] ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>

          <Separator className="my-5" />

          <div className="flex items-center gap-2 mb-5">
            <Bell size={16} className="text-cyan-600" />
            <h3 className="text-sm font-semibold text-[var(--ink)]">Email Notifications</h3>
          </div>
          <div className="space-y-4">
            {[
              { key: 'newQueue' as const, label: 'New queue items', desc: 'Daily digest of new queue items' },
              { key: 'holdAlerts' as const, label: 'Hold alerts', desc: 'Immediate email on hold actions' },
              { key: 'clearances' as const, label: 'Clearance confirmations', desc: 'Email when shipments are cleared' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">{item.label}</p>
                  <p className="text-xs text-[var(--muted-text)]">{item.desc}</p>
                </div>
                <button
                  onClick={() => toggleEmail(item.key)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${emailNotifs[item.key] ? 'bg-cyan-600' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${emailNotifs[item.key] ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="rules" className="space-y-6">
        <div className="bg-cyan-50 border border-cyan-200 rounded-[var(--radius-lg)] p-5">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={16} className="text-cyan-600" />
            <h3 className="text-sm font-semibold text-cyan-800">Compliance Rule Engine</h3>
          </div>
          <p className="text-sm text-cyan-700">Customizable compliance rules and automated screening coming in Phase 2.</p>
        </div>

        <div className="bg-[var(--warm-white)] border border-[var(--border-warm)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-card)] max-w-xl">
          <h3 className="text-sm font-semibold text-[var(--ink)] mb-4">Current Rules (Read-only)</h3>
          <div className="space-y-4">
            {placeholderRules.map(rule => (
              <div key={rule.id} className="flex items-start justify-between p-3 rounded-lg border border-[var(--border-warm)] bg-[var(--cream)] opacity-70">
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">{rule.name}</p>
                  <p className="text-xs text-[var(--muted-text)] mt-0.5">{rule.desc}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${rule.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {rule.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
