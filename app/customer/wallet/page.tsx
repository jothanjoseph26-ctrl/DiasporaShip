'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useWalletStore } from '@/store'
import { formatCurrency } from '@/lib/utils'

export default function CustomerWalletPage() {
  const { wallet, transactions } = useWalletStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
        <p className="text-sm text-muted-foreground">Balances and recent wallet activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/70 bg-card/95 shadow-sm"><CardContent className="p-4"><p className="text-xs text-muted-foreground">USD</p><p className="mt-1 text-lg font-bold text-foreground">{formatCurrency(wallet.balanceUSD, 'USD')}</p></CardContent></Card>
        <Card className="border-border/70 bg-card/95 shadow-sm"><CardContent className="p-4"><p className="text-xs text-muted-foreground">NGN</p><p className="mt-1 text-lg font-bold text-foreground">{formatCurrency(wallet.balanceNGN, 'NGN')}</p></CardContent></Card>
        <Card className="border-border/70 bg-card/95 shadow-sm"><CardContent className="p-4"><p className="text-xs text-muted-foreground">GHS</p><p className="mt-1 text-lg font-bold text-foreground">{formatCurrency(wallet.balanceGHS, 'GHS')}</p></CardContent></Card>
        <Card className="border-border/70 bg-card/95 shadow-sm"><CardContent className="p-4"><p className="text-xs text-muted-foreground">KES</p><p className="mt-1 text-lg font-bold text-foreground">{formatCurrency(wallet.balanceKES, 'KES')}</p></CardContent></Card>
      </div>

      <Card className="border-border/70 bg-card/95 shadow-sm">
        <CardContent className="space-y-3 p-5">
          <h2 className="font-semibold text-foreground">Recent Transactions</h2>
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between rounded-xl bg-muted/35 p-3">
              <div>
                <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">{transaction.reference}</p>
              </div>
              <p className="font-semibold text-foreground">{formatCurrency(transaction.amount, transaction.currency)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
