'use client';

import { useState } from 'react';
import { Bell, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { PasswordStrengthBar } from '@/components/shared';

export default function AgentSettingsPage() {
  const [name, setName] = useState('Kwame Asante');
  const [email, setEmail] = useState('agent@diasporaship.com');
  const [phone, setPhone] = useState('+2349012345678');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const [pushNotifs, setPushNotifs] = useState({ newShipment: true, statusUpdate: true, payout: true });
  const [emailNotifs, setEmailNotifs] = useState({ newShipment: false, statusUpdate: true, payout: true });

  const togglePush = (key: keyof typeof pushNotifs) => setPushNotifs(p => ({ ...p, [key]: !p[key] }));
  const toggleEmail = (key: keyof typeof emailNotifs) => setEmailNotifs(p => ({ ...p, [key]: !p[key] }));

  return (
    <Tabs defaultValue="account" className="space-y-6">
      <TabsList className="bg-[var(--cream)]">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="branch">Branch Info</TabsTrigger>
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
          <Button className="bg-[var(--gold)] hover:bg-[var(--gold-dark)] text-[var(--ink)] font-semibold">Save Changes</Button>
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
          <Button className="bg-[var(--gold)] hover:bg-[var(--gold-dark)] text-[var(--ink)] font-semibold">Update Password</Button>
        </div>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <div className="bg-[var(--warm-white)] border border-[var(--border-warm)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-card)] max-w-xl">
          <div className="flex items-center gap-2 mb-5">
            <Bell size={16} className="text-[var(--gold-dark)]" />
            <h3 className="text-sm font-semibold text-[var(--ink)]">Push Notifications</h3>
          </div>
          <div className="space-y-4">
            {[
              { key: 'newShipment' as const, label: 'New shipment', desc: 'When a new shipment is assigned to your branch' },
              { key: 'statusUpdate' as const, label: 'Status updates', desc: 'When shipment status changes' },
              { key: 'payout' as const, label: 'Payout', desc: 'When settlement is processed' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">{item.label}</p>
                  <p className="text-xs text-[var(--muted-text)]">{item.desc}</p>
                </div>
                <button
                  onClick={() => togglePush(item.key)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${pushNotifs[item.key] ? 'bg-[var(--gold)]' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${pushNotifs[item.key] ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>

          <Separator className="my-5" />

          <div className="flex items-center gap-2 mb-5">
            <Bell size={16} className="text-[var(--gold-dark)]" />
            <h3 className="text-sm font-semibold text-[var(--ink)]">Email Notifications</h3>
          </div>
          <div className="space-y-4">
            {[
              { key: 'newShipment' as const, label: 'New shipment', desc: 'Daily summary of new shipments' },
              { key: 'statusUpdate' as const, label: 'Status updates', desc: 'Email on significant status changes' },
              { key: 'payout' as const, label: 'Payout', desc: 'Settlement confirmation emails' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">{item.label}</p>
                  <p className="text-xs text-[var(--muted-text)]">{item.desc}</p>
                </div>
                <button
                  onClick={() => toggleEmail(item.key)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${emailNotifs[item.key] ? 'bg-[var(--gold)]' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${emailNotifs[item.key] ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="branch" className="space-y-6">
        <div className="bg-[var(--warm-white)] border border-[var(--border-warm)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-card)] max-w-xl">
          <div className="flex items-center gap-2 mb-5">
            <MapPin size={16} className="text-[var(--gold-dark)]" />
            <h3 className="text-sm font-semibold text-[var(--ink)]">Branch Information</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Branch Name', value: 'Lagos Hub' },
              { label: 'Branch Type', value: 'Agent' },
              { label: 'Country', value: 'Nigeria 🇳🇬' },
              { label: 'Address', value: '15 Admiralty Way, Lekki Phase 1, Lagos' },
              { label: 'Commission Rate', value: '8%' },
              { label: 'Manager', value: 'Tunde Adeyemi' },
              { label: 'Phone', value: '+2349012345678' },
              { label: 'Email', value: 'lagos@logix.com' },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center py-1">
                <span className="text-sm text-[var(--muted-text)]">{item.label}</span>
                <span className="text-sm font-medium text-[var(--ink)]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
