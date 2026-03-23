import type { NextRequest } from 'next/server'

interface ExchangeRates {
  base: string
  date: string
  rates: Record<string, number>
}

const MOCK_RATES: ExchangeRates = {
  base: 'USD',
  date: new Date().toISOString().split('T')[0],
  rates: {
    USD: 1,
    NGN: 1550,
    GHS: 12.5,
    KES: 130,
    GBP: 0.79,
    EUR: 0.92,
    CNY: 7.24,
  },
}

export async function GET() {
  return Response.json(MOCK_RATES)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, from = 'USD', to = 'NGN' } = body
    
    const fromRate = MOCK_RATES.rates[from]
    const toRate = MOCK_RATES.rates[to]
    
    if (!fromRate || !toRate) {
      return Response.json({ 
        success: false, 
        error: 'Unsupported currency' 
      }, { status: 400 })
    }
    
    const amountInUSD = amount / fromRate
    const convertedAmount = amountInUSD * toRate
    
    return Response.json({
      success: true,
      original: { amount, currency: from },
      converted: { 
        amount: Math.round(convertedAmount * 100) / 100, 
        currency: to 
      },
      rate: `${from}1 = ${to}${toRate / fromRate}`,
      rates: MOCK_RATES,
    })
  } catch {
    return Response.json({ 
      success: false, 
      error: 'Conversion failed' 
    }, { status: 400 })
  }
}
