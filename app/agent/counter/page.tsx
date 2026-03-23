'use client';

import { useState, useMemo } from 'react';
import {
  Package,
  User,
  MapPin,
  CreditCard,
  Banknote,
  Wallet,
  Search,
  Check,
  Printer,
  Scale,
  FileText,
  ChevronRight,
  Receipt,
  AlertCircle,
  Plus,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn, formatCurrency, generateTrackingNumber } from '@/lib/utils';
import {
  NIGERIA_CITY_PAIRS,
  GHANA_CITY_PAIRS,
  KENYA_CITY_PAIRS,
  calcDomesticPrice,
  domesticCurrency,
} from '@/lib/corridors';

type Step = 'customer' | 'package' | 'route' | 'payment' | 'complete';

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

interface PackageInfo {
  description: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  type: 'parcel' | 'document' | 'cargo' | 'fragile';
}

interface RouteInfo {
  fromCity: string;
  toCity: string;
  region: 'NG' | 'GH' | 'KE';
}

const SHIPMENT_TYPES = [
  { value: 'parcel', label: 'Parcel', desc: 'Boxes/packages' },
  { value: 'document', label: 'Document', desc: 'Papers' },
  { value: 'cargo', label: 'Cargo', desc: 'Bulk/pallet' },
  { value: 'fragile', label: 'Fragile', desc: 'Special care' },
];

const MOCK_CUSTOMERS = [
  { id: 'c1', name: 'Emeka Okafor', phone: '+2348012345678', email: 'emeka@example.com', totalShipments: 12 },
  { id: 'c2', name: 'Aisha Bello', phone: '+2348023456789', email: 'aisha@example.com', totalShipments: 8 },
  { id: 'c3', name: 'Chinedu Nwosu', phone: '+2348034567890', email: 'chinedu@example.com', totalShipments: 5 },
];

const cardClassName = 'rounded-2xl border border-border/60 bg-card shadow-sm';
const headerClassName = 'flex items-center gap-2 text-[var(--ink)]';

export default function AgentCounterPage() {
  const [step, setStep] = useState<Step>('customer');
  const [customerMode, setCustomerMode] = useState<'existing' | 'new'>('existing');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof MOCK_CUSTOMERS[0] | null>(null);
  const [newCustomer, setNewCustomer] = useState<CustomerInfo>({ name: '', phone: '', email: '' });
  
  const [pkg, setPkg] = useState<PackageInfo>({
    description: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    type: 'parcel',
  });

  const [route, setRoute] = useState<RouteInfo>({
    fromCity: '',
    toCity: '',
    region: 'NG',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'wallet'>('cash');
  const [amountTendered, setAmountTendered] = useState('');
  const [completedBooking, setCompletedBooking] = useState<{
    trackingNumber: string;
    customer: string;
    amount: number;
    route: string;
    weight: string;
  } | null>(null);

  const regions = { NG: NIGERIA_CITY_PAIRS, GH: GHANA_CITY_PAIRS, KE: KENYA_CITY_PAIRS };
  const cities = { 
    NG: ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Enugu', 'Owerri', 'Warri', 'Calabar', 'Benin City'], 
    GH: ['Accra', 'Kumasi', 'Tamale', 'Takoradi'], 
    KE: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'] 
  };

  const filteredCustomers = MOCK_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const cityPairs = regions[route.region] || [];
  const selectedPair = cityPairs.find(p => p.from === route.fromCity && p.to === route.toCity);

  const price = useMemo(() => {
    if (!selectedPair || !pkg.weight) return null;
    const weight = parseFloat(pkg.weight) || 1;
    return calcDomesticPrice(selectedPair, weight);
  }, [selectedPair, pkg.weight]);

  const currency = selectedPair ? domesticCurrency(selectedPair.region) : 'NGN';

  const change = useMemo(() => {
    if (paymentMethod !== 'cash' || !amountTendered || !price) return 0;
    return Math.max(0, parseFloat(amountTendered) - price);
  }, [paymentMethod, amountTendered, price]);

  const handleSelectCustomer = (customer: typeof MOCK_CUSTOMERS[0]) => {
    setSelectedCustomer(customer);
    setStep('package');
  };

  const handleNewCustomer = () => {
    if (newCustomer.name && newCustomer.phone) {
      const tempCustomer = {
        id: `temp-${Date.now()}`,
        name: newCustomer.name,
        phone: newCustomer.phone,
        email: newCustomer.email,
        totalShipments: 0,
      };
      setSelectedCustomer(tempCustomer);
      setStep('package');
    }
  };

  const handleCompleteBooking = () => {
    if (!selectedCustomer || !price || !selectedPair) return;
    
    setCompletedBooking({
      trackingNumber: generateTrackingNumber(),
      customer: selectedCustomer.name,
      amount: price,
      route: `${selectedPair.from} → ${selectedPair.to}`,
      weight: pkg.weight,
    });
    setStep('complete');
  };

  const handleNewBooking = () => {
    setStep('customer');
    setSelectedCustomer(null);
    setNewCustomer({ name: '', phone: '', email: '' });
    setPkg({ description: '', weight: '', length: '', width: '', height: '', type: 'parcel' });
    setRoute({ fromCity: '', toCity: '', region: 'NG' });
    setPaymentMethod('cash');
    setAmountTendered('');
    setCompletedBooking(null);
    setSearchQuery('');
  };

  const steps: { key: Step; label: string; icon: typeof User }[] = [
    { key: 'customer', label: 'Customer', icon: User },
    { key: 'package', label: 'Package', icon: Package },
    { key: 'route', label: 'Route', icon: MapPin },
    { key: 'payment', label: 'Payment', icon: Banknote },
    { key: 'complete', label: 'Complete', icon: Check },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === step);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-playfair)' }}>
            Walk-in Counter
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Process new shipments at the counter</p>
        </div>
        <Button 
          onClick={handleNewBooking} 
          className="gap-2 bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white shadow-sm"
        >
          <Plus className="h-4 w-4" /> New Booking
        </Button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center">
            <div className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200',
              i === currentStepIndex
                ? 'bg-gradient-to-r from-[var(--terra)] to-[var(--terra-light)] text-white shadow-lg shadow-[var(--terra)]/20'
                : i < currentStepIndex || s.key === 'complete'
                ? 'bg-gradient-to-r from-green-500 to-green-400 text-white shadow-sm'
                : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-500 border border-gray-200'
            )}>
              {i < currentStepIndex || s.key === 'complete' ? (
                <Check className="h-4 w-4" />
              ) : (
                <s.icon className="h-4 w-4" />
              )}
              <span>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight className="h-4 w-4 mx-2 text-gray-300" />
            )}
          </div>
        ))}
      </div>

      {step === 'customer' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className={cardClassName}>
            <CardHeader className="pb-4">
              <CardTitle className={headerClassName}>
                <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--terra)]/10 to-[var(--terra)]/5">
                  <User className="h-5 w-5 text-[var(--terra)]" />
                </div>
                Customer Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 p-1 bg-muted/60 rounded-xl">
                <Button
                  variant={customerMode === 'existing' ? 'default' : 'ghost'}
                  onClick={() => setCustomerMode('existing')}
                  className={cn(
                    'flex-1',
                    customerMode === 'existing' && 'bg-[var(--terra)] shadow-sm'
                  )}
                >
                  Existing Customer
                </Button>
                <Button
                  variant={customerMode === 'new' ? 'default' : 'ghost'}
                  onClick={() => setCustomerMode('new')}
                  className={cn(
                    'flex-1',
                    customerMode === 'new' && 'bg-[var(--terra)] shadow-sm'
                  )}
                >
                  New Customer
                </Button>
              </div>

              {customerMode === 'existing' ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-11 bg-muted/30"
                    />
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredCustomers.length === 0 ? (
                      <div className="text-center py-8">
                        <User className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">No customers found</p>
                      </div>
                    ) : (
                      filteredCustomers.map(customer => (
                        <button
                          key={customer.id}
                          onClick={() => handleSelectCustomer(customer)}
                          className="w-full text-left p-4 rounded-xl border border-border/60 bg-gradient-to-r from-card to-muted/20 hover:from-[var(--terra)]/5 hover:to-[var(--terra)]/10 hover:border-[var(--terra)]/30 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-[var(--ink)]">{customer.name}</p>
                              <p className="text-sm text-muted-foreground">{customer.phone}</p>
                            </div>
                            <Badge className="bg-[var(--terra)]/10 text-[var(--terra)] border-[var(--terra)]/20">
                              {customer.totalShipments} shipments
                            </Badge>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Customer Name *</Label>
                    <Input
                      placeholder="Full name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer(p => ({ ...p, name: e.target.value }))}
                      className="h-11 bg-muted/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Phone Number *</Label>
                    <Input
                      placeholder="+234..."
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer(p => ({ ...p, phone: e.target.value }))}
                      className="h-11 bg-muted/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Email (optional)</Label>
                    <Input
                      placeholder="email@example.com"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer(p => ({ ...p, email: e.target.value }))}
                      className="h-11 bg-muted/30"
                    />
                  </div>
                  <Button
                    onClick={handleNewCustomer}
                    disabled={!newCustomer.name || !newCustomer.phone}
                    className="w-full bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white shadow-md h-11"
                  >
                    Continue with New Customer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[var(--terra)] to-[var(--terra-dark)] text-white border-none shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            <CardContent className="p-6 relative">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[var(--gold)]" />
                Quick Tips
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-white/90">
                  <div className="p-1 rounded-lg bg-white/10 mt-0.5">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>Search for existing customers first to maintain records</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white/90">
                  <div className="p-1 rounded-lg bg-white/10 mt-0.5">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>New customers will be registered automatically</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white/90">
                  <div className="p-1 rounded-lg bg-white/10 mt-0.5">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>Ensure phone number is correct for SMS updates</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-white/90">
                  <div className="p-1 rounded-lg bg-white/10 mt-0.5">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>Take a photo ID for KYC compliance if needed</span>
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-white/20">
                <p className="text-xs text-white/60">Need help? Contact support</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 'package' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className={cn(cardClassName, 'lg:col-span-2')}>
            <CardHeader className="pb-4">
              <CardTitle className={headerClassName}>
                <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--terra)]/10 to-[var(--terra)]/5">
                  <Package className="h-5 w-5 text-[var(--terra)]" />
                </div>
                Package Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Shipment Type</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {SHIPMENT_TYPES.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setPkg(p => ({ ...p, type: t.value as PackageInfo['type'] }))}
                      className={cn(
                        'p-4 rounded-xl border text-left transition-all duration-200 bg-gradient-to-br',
                        pkg.type === t.value
                          ? 'from-[var(--terra)]/10 to-[var(--terra)]/5 border-[var(--terra)]/40 shadow-md'
                          : 'from-card to-muted/20 border-border/60 hover:from-[var(--terra)]/5 hover:to-[var(--terra)]/10 hover:border-[var(--terra)]/20'
                      )}
                    >
                      <p className="font-semibold text-sm text-[var(--ink)]">{t.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Package Description *</Label>
                <Input
                  placeholder="What is being shipped?"
                  value={pkg.description}
                  onChange={(e) => setPkg(p => ({ ...p, description: e.target.value }))}
                  className="h-11 bg-muted/30"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Scale className="h-4 w-4 text-muted-foreground" />
                    Weight (kg) *
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g. 5.5"
                    value={pkg.weight}
                    onChange={(e) => setPkg(p => ({ ...p, weight: e.target.value }))}
                    className="h-11 bg-muted/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Declared Value (optional)
                  </Label>
                  <Input
                    type="number"
                    placeholder="For insurance"
                    className="h-11 bg-muted/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Dimensions (cm) - Optional</Label>
                <div className="grid grid-cols-3 gap-3">
                  {['Length', 'Width', 'Height'].map((dim, i) => (
                    <div key={dim} className="space-y-1">
                      <Input 
                        type="number" 
                        placeholder={dim} 
                        value={[pkg.length, pkg.width, pkg.height][i]} 
                        onChange={(e) => setPkg(p => ({ ...p, [i === 0 ? 'length' : i === 1 ? 'width' : 'height']: e.target.value }))}
                        className="h-11 bg-muted/30" 
                      />
                      <span className="text-xs text-muted-foreground ml-1">{dim}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep('customer')} className="h-11">
                  Back
                </Button>
                <Button
                  onClick={() => setStep('route')}
                  disabled={!pkg.description || !pkg.weight}
                  className="flex-1 bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white shadow-md h-11"
                >
                  Continue to Route
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-[var(--ink)]/5 to-transparent border-[var(--ink)]/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-[var(--ink)]">Selected Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--ink)] to-[var(--ink)]/80 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedCustomer?.name}</p>
                    <p className="text-sm text-white/70">{selectedCustomer?.phone}</p>
                  </div>
                </div>
                {selectedCustomer?.email && (
                  <p className="text-sm text-white/70">{selectedCustomer.email}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 'route' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className={cn(cardClassName, 'lg:col-span-2')}>
            <CardHeader className="pb-4">
              <CardTitle className={headerClassName}>
                <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--terra)]/10 to-[var(--terra)]/5">
                  <MapPin className="h-5 w-5 text-[var(--terra)]" />
                </div>
                Route Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Region</Label>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { code: 'NG' as const, flag: '🇳🇬', name: 'Nigeria' },
                    { code: 'GH' as const, flag: '🇬🇭', name: 'Ghana' },
                    { code: 'KE' as const, flag: '🇰🇪', name: 'Kenya' },
                  ]).map(r => (
                    <button
                      key={r.code}
                      onClick={() => setRoute(p => ({ ...p, region: r.code, fromCity: '', toCity: '' }))}
                      className={cn(
                        'py-3 px-4 rounded-xl border font-medium transition-all duration-200',
                        route.region === r.code
                          ? 'bg-gradient-to-br from-[var(--terra)] to-[var(--terra-light)] text-white border-transparent shadow-md'
                          : 'bg-gradient-to-br from-card to-muted/20 border-border/60 hover:border-[var(--terra)]/30'
                      )}
                    >
                      <span className="block text-lg">{r.flag}</span>
                      <span className="text-sm font-medium">{r.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">From City *</Label>
                  <select
                    value={route.fromCity}
                    onChange={(e) => setRoute(p => ({ ...p, fromCity: e.target.value }))}
                    className="w-full h-11 px-3 rounded-xl border border-border/60 bg-gradient-to-br from-card to-muted/20 focus:border-[var(--terra)]/40 focus:ring-2 focus:ring-[var(--terra)]/20 transition-all"
                  >
                    <option value="">Select city</option>
                    {cities[route.region].map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">To City *</Label>
                  <select
                    value={route.toCity}
                    onChange={(e) => setRoute(p => ({ ...p, toCity: e.target.value }))}
                    className="w-full h-11 px-3 rounded-xl border border-border/60 bg-gradient-to-br from-card to-muted/20 focus:border-[var(--terra)]/40 focus:ring-2 focus:ring-[var(--terra)]/20 transition-all"
                  >
                    <option value="">Select city</option>
                    {cities[route.region].filter(c => c !== route.fromCity).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedPair && price && (
                <div className="p-5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">Estimated Price</p>
                      <p className="text-xs text-green-600 mt-1">Delivery: {selectedPair.days}</p>
                    </div>
                    <span className="text-3xl font-bold text-green-700">
                      {formatCurrency(price, currency)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep('package')} className="h-11">
                  Back
                </Button>
                <Button
                  onClick={() => setStep('payment')}
                  disabled={!route.fromCity || !route.toCity || !price}
                  className="flex-1 bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white shadow-md h-11"
                >
                  Continue to Payment
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-[var(--ink)]/5 to-transparent border-[var(--ink)]/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-[var(--ink)]">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-muted/40 to-muted/20 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Customer</span>
                  <span className="font-medium text-sm">{selectedCustomer?.name}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Package</span>
                  <span className="font-medium text-sm capitalize">{pkg.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Weight</span>
                  <span className="font-medium text-sm">{pkg.weight || '—'} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Route</span>
                  <span className="font-medium text-sm">{route.fromCity || '—'} → {route.toCity || '—'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 'payment' && price && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className={cn(cardClassName, 'lg:col-span-2')}>
            <CardHeader className="pb-4">
              <CardTitle className={headerClassName}>
                <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--terra)]/10 to-[var(--terra)]/5">
                  <CreditCard className="h-5 w-5 text-[var(--terra)]" />
                </div>
                Payment Collection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Payment Method</Label>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { value: 'cash' as const, icon: Banknote, label: 'Cash' },
                    { value: 'card' as const, icon: CreditCard, label: 'Card' },
                    { value: 'wallet' as const, icon: Wallet, label: 'Wallet' },
                  ]).map(m => (
                    <button
                      key={m.value}
                      onClick={() => setPaymentMethod(m.value)}
                      className={cn(
                        'p-4 rounded-xl border text-center transition-all duration-200',
                        paymentMethod === m.value
                          ? 'bg-gradient-to-br from-[var(--terra)] to-[var(--terra-light)] text-white border-transparent shadow-lg'
                          : 'bg-gradient-to-br from-card to-muted/20 border-border/60 hover:border-[var(--terra)]/30'
                      )}
                    >
                      <m.icon className={cn('h-7 w-7 mx-auto mb-2', paymentMethod === m.value ? 'text-white' : 'text-muted-foreground')} />
                      <p className="font-medium text-sm">{m.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'cash' && (
                <div className="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 space-y-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-amber-900">Total Amount</span>
                    <span className="text-3xl font-bold text-amber-700">
                      {formatCurrency(price, currency)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-amber-800">Amount Tendered</Label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={amountTendered}
                      onChange={(e) => setAmountTendered(e.target.value)}
                      className="h-12 text-lg bg-white/80 border-amber-200"
                    />
                  </div>
                  {change > 0 && (
                    <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200/60">
                      <span className="font-semibold text-green-800">Change Due</span>
                      <span className="text-2xl font-bold text-green-700">
                        {formatCurrency(change, currency)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-8 rounded-xl bg-gradient-to-br from-muted/40 to-muted/20 border border-border/60 text-center">
                  <CreditCard className="h-14 w-14 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-semibold text-[var(--ink)]">Card Payment</p>
                  <p className="text-sm text-muted-foreground mt-1">Ready for POS terminal</p>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="p-8 rounded-xl bg-gradient-to-br from-muted/40 to-muted/20 border border-border/60 text-center">
                  <Wallet className="h-14 w-14 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-semibold text-[var(--ink)]">Wallet Payment</p>
                  <p className="text-sm text-muted-foreground mt-1">Customer will pay from LogiX wallet</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep('route')} className="h-11">
                  Back
                </Button>
                <Button
                  onClick={handleCompleteBooking}
                  disabled={paymentMethod === 'cash' && (!amountTendered || parseFloat(amountTendered) < price)}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg h-11"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Complete Booking
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-[var(--terra)]/5 to-transparent border-[var(--terra)]/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-[var(--ink)]">Final Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--ink)] to-[var(--ink)]/80 text-white shadow-lg">
                <p className="text-xs text-white/60 mb-1">Customer</p>
                <p className="font-semibold">{selectedCustomer?.name}</p>
                <p className="text-sm text-white/70">{selectedCustomer?.phone}</p>
              </div>
              
              <div className="p-4 rounded-xl bg-gradient-to-br from-muted/40 to-muted/20 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Package</span>
                  <span className="font-medium text-sm">{pkg.description || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Weight</span>
                  <span className="font-medium text-sm">{pkg.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Route</span>
                  <span className="font-medium text-sm">{route.fromCity} → {route.toCity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Delivery</span>
                  <span className="font-medium text-sm">{selectedPair?.days}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-[var(--terra)]/10 to-[var(--terra)]/5 border border-[var(--terra)]/20">
                <span className="font-bold text-[var(--ink)]">Total</span>
                <span className="text-2xl font-bold text-[var(--terra)]">
                  {formatCurrency(price, currency)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 'complete' && completedBooking && (
        <Card className="max-w-xl mx-auto bg-gradient-to-b from-white to-[var(--terra)]/5 border-[var(--terra)]/20 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--ink)] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
              Booking Complete!
            </h2>
            <p className="text-muted-foreground mb-6">Shipment has been created successfully</p>

            <div className="rounded-2xl bg-gradient-to-br from-[var(--ink)] to-[var(--ink)]/80 text-white p-6 mb-6 shadow-xl">
              <div className="flex items-center justify-center gap-3 mb-4 pb-4 border-b border-white/20">
                <span className="text-sm text-white/60">Tracking Number</span>
                <Badge className="text-base px-4 py-1.5 bg-white/20 text-white border-white/30">
                  {completedBooking.trackingNumber}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-xs text-white/50">Customer</p>
                  <p className="font-semibold">{completedBooking.customer}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50">Route</p>
                  <p className="font-semibold">{completedBooking.route}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50">Weight</p>
                  <p className="font-semibold">{completedBooking.weight} kg</p>
                </div>
                <div>
                  <p className="text-xs text-white/50">Amount</p>
                  <p className="font-bold text-[var(--gold)]">{formatCurrency(completedBooking.amount, currency)}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="outline" onClick={() => window.print()} className="gap-2">
                <Printer className="h-4 w-4" />
                Print Receipt
              </Button>
              <Button variant="outline" onClick={() => window.print()} className="gap-2">
                <Receipt className="h-4 w-4" />
                Print Label
              </Button>
              <Button onClick={handleNewBooking} className="gap-2 bg-[var(--terra)] hover:bg-[var(--terra-light)] text-white shadow-md">
                <Plus className="h-4 w-4" />
                New Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
