'use client';

import { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  FileCheck,
  AlertTriangle,
  Camera,
  Lock,
  Eye,
  EyeOff,
  Globe,
  DollarSign,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAuthStore } from '@/store';

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['bg-red-500', 'bg-amber-500', 'bg-[var(--gold)]', 'bg-green-500'];
  return { score, label: labels[score - 1] || '', color: colors[score - 1] || 'bg-gray-200' };
}

function PasswordStrengthBar({ password }: { password: string }) {
  const { score, label, color } = getPasswordStrength(password);
  if (!password) return null;
  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i < score ? color : 'bg-gray-200'}`} />
        ))}
      </div>
      {label && (
        <p className={`text-xs ${score <= 1 ? 'text-red-600' : score === 2 ? 'text-amber-600' : 'text-green-600'}`}>
          {label}
        </p>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const { currentUser } = useAuthStore();
  const [showPw, setShowPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const [profile, setProfile] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    phone: currentUser?.phone || '',
    country: currentUser?.countryOfResidence || '',
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [prefs, setPrefs] = useState<{
    currency: string;
    language: string;
    emailNotifs: boolean;
    smsNotifs: boolean;
    pushNotifs: boolean;
    marketingEmails: boolean;
  }>({
    currency: currentUser?.preferredCurrency || 'USD',
    language: currentUser?.preferredLanguage || 'en',
    emailNotifs: true,
    smsNotifs: true,
    pushNotifs: true,
    marketingEmails: false,
  });

  return (
    <div className="space-y-6">
      <h1
        style={{ fontFamily: 'var(--font-playfair)' }}
        className="text-2xl font-bold text-[var(--ink)]"
      >
        Settings
      </h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-[var(--cream)] p-1">
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-1.5">
            <Bell className="h-4 w-4" /> Preferences
          </TabsTrigger>
          <TabsTrigger value="kyc" className="gap-1.5">
            <FileCheck className="h-4 w-4" /> KYC
          </TabsTrigger>
          <TabsTrigger value="danger" className="gap-1.5">
            <AlertTriangle className="h-4 w-4" /> Danger Zone
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-[var(--border-warm)]">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[var(--terra-pale)] flex items-center justify-center text-[var(--terra)] text-2xl font-bold">
                  {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-1" />
                    Change Photo
                  </Button>
                  <p className="text-xs text-[var(--muted-text)] mt-1">JPG, PNG. Max 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>First Name</Label>
                  <Input
                    value={profile.firstName}
                    onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Last Name</Label>
                  <Input
                    value={profile.lastName}
                    onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input value={currentUser?.email || ''} disabled className="opacity-60" />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Country of Residence</Label>
                  <Select
                    value={profile.country}
                    onValueChange={(v) => setProfile((p) => ({ ...p, country: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="NG">Nigeria</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="GH">Ghana</SelectItem>
                      <SelectItem value="KE">Kenya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-[var(--border-warm)]">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-[var(--ink)]">Change Password</h3>
              <div className="max-w-md space-y-4">
                <div className="space-y-1.5">
                  <Label>Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-text)]" />
                    <Input
                      type={showPw ? 'text' : 'password'}
                      value={security.currentPassword}
                      onChange={(e) => setSecurity((s) => ({ ...s, currentPassword: e.target.value }))}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)]"
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-text)]" />
                    <Input
                      type={showNewPw ? 'text' : 'password'}
                      value={security.newPassword}
                      onChange={(e) => setSecurity((s) => ({ ...s, newPassword: e.target.value }))}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)]"
                    >
                      {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <PasswordStrengthBar password={security.newPassword} />
                </div>
                <div className="space-y-1.5">
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    value={security.confirmPassword}
                    onChange={(e) => setSecurity((s) => ({ ...s, confirmPassword: e.target.value }))}
                  />
                </div>
                <Button className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white">
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="border-[var(--border-warm)]">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-lg font-semibold text-[var(--ink)]">Preferences</h3>
              <div className="max-w-md space-y-4">
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" /> Preferred Currency
                  </Label>
                  <Select
                    value={prefs.currency}
                    onValueChange={(v) => setPrefs((p) => ({ ...p, currency: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                      <SelectItem value="GHS">GHS - Ghanaian Cedi</SelectItem>
                      <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-2">
                    <Globe className="h-4 w-4" /> Language
                  </Label>
                  <Select
                    value={prefs.language}
                    onValueChange={(v) => setPrefs((p) => ({ ...p, language: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="yo">Yoruba</SelectItem>
                      <SelectItem value="ig">Igbo</SelectItem>
                      <SelectItem value="ha">Hausa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <h4 className="font-medium text-[var(--ink)]">Notifications</h4>
                {[
                  { key: 'emailNotifs', label: 'Email notifications', desc: 'Receive shipment updates via email' },
                  { key: 'smsNotifs', label: 'SMS notifications', desc: 'Receive shipment updates via SMS' },
                  { key: 'pushNotifs', label: 'Push notifications', desc: 'Browser push notifications' },
                  { key: 'marketingEmails', label: 'Marketing emails', desc: 'Promotions and product updates' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-[var(--ink)]">{item.label}</p>
                      <p className="text-xs text-[var(--muted-text)]">{item.desc}</p>
                    </div>
                    <button
                      onClick={() =>
                        setPrefs((p) => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))
                      }
                      className={`w-10 h-6 rounded-full transition-colors ${
                        prefs[item.key as keyof typeof prefs] ? 'bg-[var(--terra)]' : 'bg-[var(--border-strong)]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 ${
                          prefs[item.key as keyof typeof prefs] ? 'translate-x-4' : ''
                        }`}
                      />
                    </button>
                  </div>
                ))}

                <Button className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc">
          <Card className="border-[var(--border-warm)]">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-[var(--ink)]">KYC Verification</h3>
                <Badge
                  variant={
                    currentUser?.kycStatus === 'approved'
                      ? 'success'
                      : currentUser?.kycStatus === 'pending'
                      ? 'warning'
                      : currentUser?.kycStatus === 'rejected'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {currentUser?.kycStatus || 'Not started'}
                </Badge>
              </div>

              {currentUser?.kycStatus === 'approved' ? (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-sm text-green-800 font-medium">
                    Your identity has been verified. You have full access to all features.
                  </p>
                </div>
              ) : (
                <div className="max-w-md space-y-4">
                  <p className="text-sm text-[var(--muted-text)]">
                    Complete KYC verification to unlock higher transaction limits and international shipping.
                  </p>
                  <div className="space-y-1.5">
                    <Label>Government-issued ID</Label>
                    <div className="border-2 border-dashed border-[var(--border-warm)] rounded-lg p-6 text-center">
                      <FileCheck className="h-8 w-8 text-[var(--muted-text)] mx-auto mb-2" />
                      <p className="text-sm text-[var(--muted-text)]">
                        Upload passport, driver&apos;s license, or national ID
                      </p>
                      <p className="text-xs text-[var(--muted-text)] mt-1">PDF, JPG, PNG up to 5MB</p>
                    </div>
                  </div>
                  <Button className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white">
                    Submit for Verification
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger">
          <Card className="border-red-200">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
              </div>
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm font-medium text-red-800 mb-1">Delete Account</p>
                <p className="text-sm text-red-700 mb-4">
                  This action is permanent. All your data, shipments, and wallet balance will be
                  permanently deleted. This cannot be undone.
                </p>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete My Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Type your email to confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-[var(--muted-text)]">
              Enter <span className="font-mono font-semibold text-[var(--ink)]">{currentUser?.email}</span> to confirm deletion.
            </p>
            <Input
              placeholder="Enter your email"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteOpen(false); setDeleteConfirm(''); }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteConfirm !== currentUser?.email}
              onClick={() => {
                setDeleteOpen(false);
                setDeleteConfirm('');
              }}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Permanently Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
