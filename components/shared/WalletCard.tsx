"use client";

import { useState } from 'react';
import { Wallet, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/utils';
import type { Wallet as WalletType } from '@/types';

interface WalletCardProps {
  wallet: WalletType;
  onFund: (currency: string) => void;
}

const currencies = [
  { key: 'USD', label: 'USD', balanceKey: 'balanceUSD' as const, symbol: '$' },
  { key: 'NGN', label: 'NGN', balanceKey: 'balanceNGN' as const, symbol: '\u20A6' },
  { key: 'GHS', label: 'GHS', balanceKey: 'balanceGHS' as const, symbol: '\u20B5' },
  { key: 'KES', label: 'KES', balanceKey: 'balanceKES' as const, symbol: 'KSh' },
];

export function WalletCard({ wallet, onFund }: WalletCardProps) {
  const [activeCurrency, setActiveCurrency] = useState('USD');
  const current = currencies.find(c => c.key === activeCurrency)!;
  const balance = wallet[current.balanceKey];

  return (
    <div className="bg-[var(--ink)] border border-[rgba(255,253,249,0.08)] rounded-[var(--radius-lg)] p-5 text-[var(--warm-white)]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-[rgba(255,253,249,0.1)] flex items-center justify-center">
            <Wallet size={16} className="text-[var(--gold-light)]" />
          </div>
          <div>
            <div className="text-sm font-semibold">Wallet Balance</div>
            <div className="text-[10px] text-[rgba(255,253,249,0.4)]">DiasporaShip Wallet</div>
          </div>
        </div>
      </div>

      <Tabs value={activeCurrency} onValueChange={setActiveCurrency}>
        <TabsList className="bg-[rgba(255,253,249,0.08)] h-8 mb-4">
          {currencies.map(c => (
            <TabsTrigger
              key={c.key}
              value={c.key}
              className="text-[11px] font-semibold px-3 py-1 text-[rgba(255,253,249,0.5)] data-[state=active]:bg-[rgba(255,253,249,0.12)] data-[state=active]:text-[var(--warm-white)]"
            >
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mb-5">
        <div className="font-display text-3xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
          {formatCurrency(balance, activeCurrency)}
        </div>
        {wallet.isFrozen && (
          <div className="text-xs text-red-400 mt-1 font-medium">Account frozen</div>
        )}
      </div>

      <Button
        onClick={() => onFund(activeCurrency)}
        disabled={wallet.isFrozen}
        className="w-full bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[var(--ink)] font-semibold gap-2"
      >
        <Plus size={14} />
        Fund Wallet
      </Button>
    </div>
  );
}
