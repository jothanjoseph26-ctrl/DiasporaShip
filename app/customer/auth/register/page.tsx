'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'GH', name: 'Ghana' },
  { code: 'KE', name: 'Kenya' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'CN', name: 'China' },
];

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
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i < score ? color : 'bg-gray-200'}`}
          />
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

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    phoneCountry: '+1',
    password: '',
    confirmPassword: '',
    country: '',
    accountType: 'individual' as 'individual' | 'business',
    businessName: '',
    agreeTerms: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const filteredCountries = useMemo(
    () => COUNTRIES.filter((c) => c.name.toLowerCase().includes(countrySearch.toLowerCase())),
    [countrySearch]
  );

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!form.agreeTerms) {
      setError('Please agree to the terms and conditions.');
      return;
    }
    if (form.accountType === 'business' && !form.businessName) {
      setError('Please enter your business name.');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    router.push('/customer/auth/verify');
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--ink)] relative flex-col justify-between p-12">
        <div>
          <Link href="/" className="inline-block">
            <span
              style={{ fontFamily: 'var(--font-playfair)' }}
              className="text-3xl font-bold text-white"
            >
              Diaspora<span style={{ color: 'var(--terra)' }}>Ship</span>
            </span>
          </Link>
        </div>
        <div>
          <p
            style={{ fontFamily: 'var(--font-playfair)' }}
            className="text-2xl italic text-white/80 leading-relaxed max-w-md"
          >
            &ldquo;Join thousands of families shipping with confidence across the globe.&rdquo;
          </p>
          <p className="mt-4 text-sm text-white/40">
            Trusted by 50,000+ diaspora families worldwide.
          </p>
        </div>
        <div className="text-xs text-white/20">
          &copy; {new Date().getFullYear()} DiasporaShip. All rights reserved.
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-[var(--cream)] p-6">
        <div className="w-full max-w-[480px]">
          <div className="lg:hidden mb-8 text-center">
            <Link href="/">
              <span
                style={{ fontFamily: 'var(--font-playfair)' }}
                className="text-2xl font-bold text-[var(--ink)]"
              >
                Diaspora<span style={{ color: 'var(--terra)' }}>Ship</span>
              </span>
            </Link>
          </div>

          <Card className="border-[var(--border-warm)] shadow-[var(--shadow-card)]">
            <CardContent className="p-8">
              <h1
                style={{ fontFamily: 'var(--font-playfair)' }}
                className="text-2xl font-bold text-[var(--ink)] mb-1"
              >
                Create your account
              </h1>
              <p className="text-sm text-[var(--muted-text)] mb-6">
                Start shipping with DiasporaShip today
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-text)]" />
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={form.firstName}
                        onChange={(e) => update('firstName', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Okafor"
                      value={form.lastName}
                      onChange={(e) => update('lastName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-text)]" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="flex gap-2">
                    <Input
                      value={form.phoneCountry}
                      onChange={(e) => update('phoneCountry', e.target.value)}
                      className="w-20"
                      placeholder="+1"
                    />
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-text)]" />
                      <Input
                        id="phone"
                        placeholder="(555) 123-4567"
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-text)]" />
                      <Input
                        id="password"
                        type={showPw ? 'text' : 'password'}
                        placeholder="Min 8 characters"
                        value={form.password}
                        onChange={(e) => update('password', e.target.value)}
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
                    <PasswordStrengthBar password={form.password} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword">Confirm</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Re-enter password"
                        value={form.confirmPassword}
                        onChange={(e) => update('confirmPassword', e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)]"
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Country of Residence</Label>
                  <Select value={form.country} onValueChange={(v) => update('country', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2">
                        <Input
                          placeholder="Search countries..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className="mb-2 h-8"
                        />
                      </div>
                      {filteredCountries.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Account Type</Label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => update('accountType', 'individual')}
                      className={`flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-colors ${
                        form.accountType === 'individual'
                          ? 'border-[var(--terra)] bg-[var(--terra-pale)] text-[var(--terra)]'
                          : 'border-[var(--border-warm)] bg-white text-gray-700 hover:border-[var(--terra)]'
                      }`}
                    >
                      Individual
                    </button>
                    <button
                      type="button"
                      onClick={() => update('accountType', 'business')}
                      className={`flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-colors ${
                        form.accountType === 'business'
                          ? 'border-[var(--terra)] bg-[var(--terra-pale)] text-[var(--terra)]'
                          : 'border-[var(--border-warm)] bg-white text-gray-700 hover:border-[var(--terra)]'
                      }`}
                    >
                      <Building2 className="inline h-4 w-4 mr-1.5" />
                      Business
                    </button>
                  </div>
                </div>

                {form.accountType === 'business' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      placeholder="Your company name"
                      value={form.businessName}
                      onChange={(e) => update('businessName', e.target.value)}
                    />
                  </div>
                )}

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agreeTerms}
                    onChange={(e) => update('agreeTerms', e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-[var(--border-warm)] text-[var(--terra)] focus:ring-[var(--terra)]"
                  />
                  <span className="text-sm text-[var(--muted-text)]">
                    I agree to the{' '}
                    <Link href="#" className="text-[var(--terra)] hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="#" className="text-[var(--terra)] hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white h-11"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-[var(--muted-text)]">
                Already have an account?{' '}
                <Link href="/customer/auth/login" className="text-[var(--terra)] font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
