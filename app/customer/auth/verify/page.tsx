'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function VerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [verified, setVerified] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0 || verified) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown, verified]);

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

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the 6-digit code.');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setVerified(true);
  };

  const handleResend = () => {
    setCountdown(60);
    setOtp(['', '', '', '', '', '']);
    setError('');
    otpRefs.current[0]?.focus();
  };

  if (verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream)] p-6">
        <div className="w-full max-w-[480px] text-center">
          <div className="mb-6">
            <span
              style={{ fontFamily: 'var(--font-playfair)' }}
              className="text-2xl font-bold text-[var(--ink)]"
            >
              Diaspora<span style={{ color: 'var(--terra)' }}>Ship</span>
            </span>
          </div>
          <Card className="border-[var(--border-warm)] shadow-[var(--shadow-card)]">
            <CardContent className="p-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1
                style={{ fontFamily: 'var(--font-playfair)' }}
                className="text-2xl font-bold text-[var(--ink)] mb-2"
              >
                Email verified!
              </h1>
              <p className="text-sm text-[var(--muted-text)] mb-6">
                Your account has been verified. You can now sign in.
              </p>
              <Button
                onClick={() => router.push('/customer/auth/login')}
                className="w-full bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white h-11"
              >
                Continue to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            <h1
              style={{ fontFamily: 'var(--font-playfair)' }}
              className="text-2xl font-bold text-[var(--ink)] mb-1"
            >
              Verify your email
            </h1>
            <p className="text-sm text-[var(--muted-text)] mb-6">
              We sent a 6-digit verification code to your email address.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-6">
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
                    Resend verification code
                  </button>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white h-11"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </Button>
            </form>

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
