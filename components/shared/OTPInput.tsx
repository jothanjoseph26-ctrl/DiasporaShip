"use client";

import { useRef, useEffect } from 'react';

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  autoFocus?: boolean;
}

export function OTPInput({ length = 6, onComplete, autoFocus }: OTPInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const digits = value.slice(-1);
    const newInputs = [...inputs.current];

    if (digits && newInputs[index]) {
      newInputs[index]!.value = digits;
      if (index < length - 1) {
        newInputs[index + 1]?.focus();
      }
    }

    const otp = newInputs.map(i => i?.value || '').join('');
    if (otp.length === length) {
      onComplete(otp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !inputs.current[index]?.value && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    pasted.split('').forEach((digit, i) => {
      if (inputs.current[i]) {
        inputs.current[i]!.value = digit;
      }
    });
    const lastIdx = Math.min(pasted.length - 1, length - 1);
    inputs.current[lastIdx]?.focus();
    if (pasted.length === length) {
      onComplete(pasted);
    }
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={el => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          autoFocus={autoFocus && i === 0}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          className="w-12 h-14 text-center text-xl font-semibold border border-[var(--border-warm)] rounded-lg bg-[var(--warm-white)] text-[var(--ink)] focus:border-[var(--terra)] focus:ring-2 focus:ring-[var(--terra)]/20 outline-none transition-all"
        />
      ))}
    </div>
  );
}
