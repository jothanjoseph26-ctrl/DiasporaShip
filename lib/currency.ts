const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  NGN: 1550,
  GHS: 12.5,
  KES: 130,
  GBP: 0.79,
  EUR: 0.92,
  CNY: 7.24,
}

export function convertCurrency(
  amount: number,
  from: string,
  to: string
): number {
  const fromRate = EXCHANGE_RATES[from]
  const toRate = EXCHANGE_RATES[to]
  
  if (!fromRate || !toRate) {
    console.warn(`Unsupported currency pair: ${from} to ${to}`)
    return amount
  }
  
  const amountInUSD = amount / fromRate
  return Math.round(amountInUSD * toRate * 100) / 100
}

export function formatCurrencyAmount(
  amount: number,
  currency: string,
  targetCurrency?: string
): string {
  if (targetCurrency && targetCurrency !== currency) {
    const converted = convertCurrency(amount, currency, targetCurrency)
    return `${getCurrencySymbol(targetCurrency)}${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  
  return `${getCurrencySymbol(currency)}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    NGN: '₦',
    GHS: '₵',
    KES: 'KSh',
    GBP: '£',
    EUR: '€',
    CNY: '¥',
  }
  return symbols[currency] || currency + ' '
}

export function getCurrencyName(currency: string): string {
  const names: Record<string, string> = {
    USD: 'US Dollar',
    NGN: 'Nigerian Naira',
    GHS: 'Ghanaian Cedi',
    KES: 'Kenyan Shilling',
    GBP: 'British Pound',
    EUR: 'Euro',
    CNY: 'Chinese Yuan',
  }
  return names[currency] || currency
}

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬' },
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi', flag: '🇬🇭' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', flag: '🇰🇪' },
]

export function hasEnoughBalance(
  balance: number,
  amount: number,
  currency: string
): boolean {
  return balance >= amount
}

export function getBalanceByCurrency(wallet: Record<string, number>, currency: string): number {
  return wallet[currency] || 0
}
