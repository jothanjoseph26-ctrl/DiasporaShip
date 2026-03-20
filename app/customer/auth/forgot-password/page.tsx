'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

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

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step !== 2 || countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [step, countdown]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setStep(2);
    setCountdown(60);
  };

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      if (value.length > 1) return;
      const next = [...otp];
      next[index] = value;
      setOtp(next);
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    },
    [otp]
  );

  const handleOtpKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the 6-digit code.');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setStep(3);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError('Please fill in both fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    router.push('/customer/auth/login');
  };

  const handleResend = async () => {
    setCountdown(60);
    setOtp(['', '', '', '', '', '']);
    otpRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--cream)] p-6">
      <div className="w-full max-w-[480px]">
        <div className="mb-8 text-center">
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
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 text-sm text-[var(--muted-text)] hover:text-[var(--ink)] mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            )}

            <div className="flex gap-1.5 mb-6">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    s <= step ? 'bg-[var(--terra)]' : 'bg-[var(--border-warm)]'
                  }`}
                />
              ))}
            </div>

            {step === 1 && (
              <>
                <h1
                  style={{ fontFamily: 'var(--font-playfair)' }}
                  className="text-2xl font-bold text-[var(--ink)] mb-1"
                >
                  Reset your password
                </h1>
                <p className="text-sm text-[var(--muted-text)] mb-6">
                  Enter your email and we&apos;ll send you a reset code.
                </p>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSendCode} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-text)]" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white h-11"
                  >
                    {loading ? 'Sending...' : 'Send Reset Code'}
                  </Button>
                </form>
              </>
            )}

            {step === 2 && (
              <>
                <h1
                  style={{ fontFamily: 'var(--font-playfair)' }}
                  className="text-2xl font-bold text-[var(--ink)] mb-1"
                >
                  Enter verification code
                </h1>
                <p className="text-sm text-[var(--muted-text)] mb-6">
                  We sent a 6-digit code to {email}
                </p>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          otpRefs.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-12 h-14 text-center text-xl font-semibold border border-[var(--border-warm)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--terra)] focus:border-transparent"
                      />
                    ))}
                  </div>

                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-sm text-[var(--muted-text)]">
                        Resend code in{' '}
                        <span className="font-medium text-[var(--ink)]">
                          {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                        </span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="text-sm text-[var(--terra)] font-medium hover:underline"
                      >
                        Resend code
                      </button>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white h-11"
                  >
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </Button>
                </form>
              </>
            )}

            {step === 3 && (
              <>
                <h1
                  style={{ fontFamily: 'var(--font-playfair)' }}
                  className="text-2xl font-bold text-[var(--ink)] mb-1"
                >
                  Set new password
                </h1>
                <p className="text-sm text-[var(--muted-text)] mb-6">
                  Choose a strong password for your account.
                </p>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="newPassword">New password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-text)]" />
                      <Input
                        id="newPassword"
                        type={showPw ? 'text' : 'password'}
                        placeholder="Min 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    <PasswordStrengthBar password={password} />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirmNewPassword">Confirm password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-text)]" />
                      <Input
                        id="confirmNewPassword"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10"
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

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white h-11"
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </form>
              </>
            )}

            <p className="mt-6 text-center text-sm text-[var(--muted-text)]">
              <Link href="/customer/auth/login" className="text-[var(--terra)] font-medium hover:underline">
                Back to login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
