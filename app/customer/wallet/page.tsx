'use client';

import { useState } from 'react';
import {
  Wallet,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { useWalletStore } from '@/store';
import { formatCurrency, formatDateTime } from '@/lib/utils';

const CURRENCIES = ['USD', 'NGN', 'GHS', 'KES'] as const;

export default function WalletPage() {
  const { wallet, transactions, topUp } = useWalletStore();
  const [activeCurrency, setActiveCurrency] = useState<string>('USD');
  const [fundOpen, setFundOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [fundCurrency, setFundCurrency] = useState('USD');
  const [funding, setFunding] = useState(false);

  const getBalance = (currency: string) => {
    switch (currency) {
      case 'USD': return wallet.balanceUSD;
      case 'NGN': return wallet.balanceNGN;
      case 'GHS': return wallet.balanceGHS;
      case 'KES': return wallet.balanceKES;
      default: return 0;
    }
  };

  const handleFund = async () => {
    const amount = parseFloat(fundAmount);
    if (!amount || amount <= 0) return;
    setFunding(true);
    await topUp(amount, fundCurrency);
    setFunding(false);
    setFundOpen(false);
    setFundAmount('');
  };

  const totalCredits = transactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = transactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1
          style={{ fontFamily: 'var(--font-playfair)' }}
          className="text-2xl font-bold text-[var(--ink)]"
        >
          Wallet
        </h1>
        <Button
          onClick={() => setFundOpen(true)}
          className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white"
        >
          <Plus className="h-4 w-4 mr-1" />
          Fund Wallet
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <div className="card-dark p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-white/60">Total Balance</h3>
              <Wallet className="h-5 w-5 text-white/40" />
            </div>
            <div className="flex gap-2 mb-4">
              {CURRENCIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCurrency(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeCurrency === c
                      ? 'bg-[var(--terra)] text-white'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <p
              style={{ fontFamily: 'var(--font-playfair)' }}
              className="text-4xl font-bold mb-1"
            >
              {formatCurrency(getBalance(activeCurrency), activeCurrency)}
            </p>
            <p className="text-sm text-white/40">Available in {activeCurrency}</p>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/10">
              {CURRENCIES.filter((c) => c !== activeCurrency).map((c) => (
                <div key={c}>
                  <p className="text-xs text-white/40">{c}</p>
                  <p className="text-sm font-semibold">{formatCurrency(getBalance(c), c)}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-[var(--border-warm)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-[var(--ink)]">
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="text-sm whitespace-nowrap">
                        {formatDateTime(txn.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm">{txn.description}</TableCell>
                      <TableCell>
                        <Badge
                          variant={txn.type === 'credit' ? 'success' : 'secondary'}
                          className="text-[10px]"
                        >
                          {txn.type === 'credit' ? (
                            <ArrowDownLeft className="h-3 w-3 mr-0.5" />
                          ) : (
                            <ArrowUpRight className="h-3 w-3 mr-0.5" />
                          )}
                          {txn.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-[var(--muted-text)] capitalize">
                          {txn.category.replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {txn.type === 'credit' ? '+' : '-'}
                        {formatCurrency(txn.amount, txn.currency)}
                      </TableCell>
                      <TableCell className="text-right text-sm text-[var(--muted-text)]">
                        {formatCurrency(txn.balanceAfter, txn.currency)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-[var(--border-warm)]">
            <CardContent className="p-4 space-y-4">
              <h3 className="text-sm font-semibold text-[var(--ink)]">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                    <ArrowDownLeft className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted-text)]">Total Credits</p>
                    <p className="text-sm font-semibold text-[var(--ink)]">
                      {formatCurrency(totalCredits, 'USD')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                    <ArrowUpRight className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted-text)]">Total Debits</p>
                    <p className="text-sm font-semibold text-[var(--ink)]">
                      {formatCurrency(totalDebits, 'USD')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[var(--terra-pale)] flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-[var(--terra)]" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted-text)]">Transactions</p>
                    <p className="text-sm font-semibold text-[var(--ink)]">
                      {transactions.length}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[var(--border-warm)]">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-[var(--ink)] mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setFundOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Funds
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Withdraw (Coming soon)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={fundOpen} onOpenChange={setFundOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fund Wallet</DialogTitle>
            <DialogDescription>Add money to your DiasporaShip wallet.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-text)]" />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Select value={fundCurrency} onValueChange={setFundCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFundOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleFund}
              disabled={funding || !fundAmount}
              className="bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white"
            >
              {funding ? 'Processing...' : `Add ${fundAmount ? formatCurrency(parseFloat(fundAmount), fundCurrency) : 'Funds'}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
