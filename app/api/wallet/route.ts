import type { NextRequest } from 'next/server'

interface WalletBalance {
  USD: number
  NGN: number
  GHS: number
  KES: number
}

interface Transaction {
  id: string
  type: 'credit' | 'debit'
  category: string
  amount: number
  currency: string
  reference: string
  description: string
  createdAt: string
}

const wallets: Map<string, WalletBalance> = new Map([
  ['w1', { USD: 1250.00, NGN: 485000, GHS: 3200, KES: 89000 }],
])

const transactions: Map<string, Transaction[]> = new Map([
  ['w1', [
    { id: 't1', type: 'credit', category: 'topup', amount: 500, currency: 'USD', reference: 'TXN-001', description: 'Wallet top-up', createdAt: '2026-03-15T10:00:00Z' },
  ]],
])

function getCurrencyKey(currency: string): keyof WalletBalance {
  switch (currency) {
    case 'USD': return 'USD'
    case 'NGN': return 'NGN'
    case 'GHS': return 'GHS'
    case 'KES': return 'KES'
    default: return 'USD'
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const walletId = searchParams.get('walletId') || 'w1'
  
  return Response.json({
    wallet: wallets.get(walletId) || { USD: 0, NGN: 0, GHS: 0, KES: 0 },
    transactions: transactions.get(walletId) || [],
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletId = 'w1', amount, currency = 'USD', type, description, shipmentId } = body
    
    const wallet = wallets.get(walletId) || { USD: 0, NGN: 0, GHS: 0, KES: 0 }
    const key = getCurrencyKey(currency)
    
    if (type === 'debit') {
      if (wallet[key] < amount) {
        return Response.json({ 
          success: false, 
          error: 'Insufficient balance' 
        }, { status: 400 })
      }
      wallet[key] -= amount
    } else {
      wallet[key] += amount
    }
    
    wallets.set(walletId, wallet)
    
    const transaction: Transaction = {
      id: `txn-${Date.now()}`,
      type,
      category: type === 'debit' ? 'shipment' : 'topup',
      amount,
      currency,
      reference: `TXN-${Date.now()}`,
      description: description || (type === 'debit' ? 'Shipment payment' : 'Wallet top-up'),
      createdAt: new Date().toISOString(),
    }
    
    if (shipmentId) {
      transaction.reference = `SHP-${shipmentId}`
    }
    
    const walletTransactions = transactions.get(walletId) || []
    walletTransactions.unshift(transaction)
    transactions.set(walletId, walletTransactions)
    
    return Response.json({ 
      success: true, 
      wallet,
      transaction,
      message: type === 'debit' ? 'Payment processed' : 'Top-up successful' 
    })
  } catch {
    return Response.json({ 
      success: false, 
      error: 'Transaction failed' 
    }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletId = 'w1', amount, currency = 'USD' } = body
    
    const wallet = wallets.get(walletId) || { USD: 0, NGN: 0, GHS: 0, KES: 0 }
    const key = getCurrencyKey(currency)
    
    if (wallet[key] < amount) {
      return Response.json({ 
        success: false, 
        error: 'Insufficient balance',
        available: wallet[key],
        required: amount,
      }, { status: 400 })
    }
    
    wallet[key] -= amount
    wallets.set(walletId, wallet)
    
    const transaction: Transaction = {
      id: `txn-${Date.now()}`,
      type: 'debit',
      category: 'shipment',
      amount,
      currency,
      reference: `SHP-${body.shipmentId || 'UNKNOWN'}`,
      description: `Shipment payment - ${body.trackingNumber || 'Booking'}`,
      createdAt: new Date().toISOString(),
    }
    
    const walletTransactions = transactions.get(walletId) || []
    walletTransactions.unshift(transaction)
    transactions.set(walletId, walletTransactions)
    
    return Response.json({ 
      success: true, 
      wallet,
      transaction,
      message: 'Payment successful' 
    })
  } catch {
    return Response.json({ 
      success: false, 
      error: 'Payment failed' 
    }, { status: 400 })
  }
}
