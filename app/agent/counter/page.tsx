'use client';

import { useState, useMemo } from 'react';
import {
  Package,
  User,
  UserPlus,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Banknote,
  Wallet,
  Search,
  Check,
  Printer,
  Truck,
  Scale,
  FileText,
  ChevronRight,
  X,
  Receipt,
  AlertCircle,
  Plus,
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
import { calculatePrice } from '@/store';

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
  const cities = { NG: ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Enugu', 'Owerri', 'Warri', 'Calabar', 'Benin City'], 
                   GH: ['Accra', 'Kumasi', 'Tamale', 'Takoradi'], 
                   KE: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'] };

  const filteredCustomers = MOCK_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const cityPairs = regions[route.region] || [];
  const availablePairs = cityPairs.filter(p => p.from === route.fromCity || p.to === route.toCity);

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
          <h1 className="text-xl font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-playfair)' }}>
            Walk-in Counter
          </h1>
          <p className="text-sm text-[var(--muted-text)]">Process new shipments at the counter</p>
        </div>
        <Button variant="outline" onClick={handleNewBooking} className="gap-2">
          <Plus className="h-4 w-4" /> New Booking
        </Button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center">
            <div className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
              i === currentStepIndex
                ? 'bg-[var(--terra)] text-white shadow-md'
                : i < currentStepIndex || s.key === 'complete'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            )}>
              {i < currentStepIndex || s.key === 'complete' ? (
                <Check className="h-4 w-4" />
              ) : (
                <s.icon className="h-4 w-4" />
              )}
              <span>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            )}
          </div>
        ))}
      </div>

      {step === 'customer' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-[var(--terra)]" />
                Customer Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={customerMode === 'existing' ? 'default' : 'outline'}
                  onClick={() => setCustomerMode('existing')}
                  className="flex-1"
                >
                  Existing Customer
                </Button>
                <Button
                  variant={customerMode === 'new' ? 'default' : 'outline'}
                  onClick={() => setCustomerMode('new')}
                  className="flex-1"
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
                      className="pl-10"
                    />
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredCustomers.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">No customers found</p>
                    ) : (
                      filteredCustomers.map(customer => (
                        <button
                          key={customer.id}
                          onClick={() => handleSelectCustomer(customer)}
                          className="w-full text-left p-3 rounded-lg border hover:border-[var(--terra)]/50 hover:bg-[var(--terra)]/5 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              <p className="text-sm text-muted-foreground">{customer.phone}</p>
                            </div>
                            <Badge variant="secondary">{customer.totalShipments} shipments</Badge>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label>Customer Name *</Label>
                    <Input
                      placeholder="Full name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer(p => ({ ...p, name: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Phone Number *</Label>
                    <Input
                      placeholder="+234..."
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer(p => ({ ...p, phone: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Email (optional)</Label>
                    <Input
                      placeholder="email@example.com"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer(p => ({ ...p, email: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    onClick={handleNewCustomer}
                    disabled={!newCustomer.name || !newCustomer.phone}
                    className="w-full bg-[var(--terra)] hover:bg-[var(--terra-light)]"
                  >
                    Continue with New Customer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[var(--ink)] to-[var(--ink)]/90 text-white">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-[var(--gold)]" />
                Quick Tips
              </h3>
              <ul className="space-y-3 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-400 mt-0.5" />
                  Search for existing customers first to maintain records
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-400 mt-0.5" />
                  New customers will be registered automatically
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-400 mt-0.5" />
                  Ensure phone number is correct for SMS updates
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-400 mt-0.5" />
                  Take a photo ID for KYC compliance if needed
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 'package' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-[var(--terra)]" />
                Package Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Shipment Type</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {SHIPMENT_TYPES.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setPkg(p => ({ ...p, type: t.value as PackageInfo['type'] }))}
                      className={cn(
                        'p-3 rounded-lg border text-left transition-all',
                        pkg.type === t.value
                          ? 'border-[var(--terra)] bg-[var(--terra)]/10'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <p className="font-medium text-sm">{t.label}</p>
                      <p className="text-xs text-muted-foreground">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Package Description *</Label>
                <Input
                  placeholder="What is being shipped?"
                  value={pkg.description}
                  onChange={(e) => setPkg(p => ({ ...p, description: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Weight (kg) *
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g. 5.5"
                    value={pkg.weight}
                    onChange={(e) => setPkg(p => ({ ...p, weight: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Declared Value (optional)
                  </Label>
                  <Input
                    type="number"
                    placeholder="For insurance"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Dimensions (cm) - Optional</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div>
                    <Input type="number" placeholder="Length" value={pkg.length} onChange={(e) => setPkg(p => ({ ...p, length: e.target.value }))} />
                  </div>
                  <div>
                    <Input type="number" placeholder="Width" value={pkg.width} onChange={(e) => setPkg(p => ({ ...p, width: e.target.value }))} />
                  </div>
                  <div>
                    <Input type="number" placeholder="Height" value={pkg.height} onChange={(e) => setPkg(p => ({ ...p, height: e.target.value }))} />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep('customer')}>Back</Button>
                <Button
                  onClick={() => setStep('route')}
                  disabled={!pkg.description || !pkg.weight}
                  className="flex-1 bg-[var(--terra)] hover:bg-[var(--terra-light)]"
                >
                  Continue to Route
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Selected Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-medium">{selectedCustomer?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedCustomer?.phone}</p>
                {selectedCustomer?.email && (
                  <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 'route' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[var(--terra)]" />
                Route Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Region</Label>
                <div className="flex gap-2 mt-2">
                  {(['NG', 'GH', 'KE'] as const).map(r => (
                    <button
                      key={r}
                      onClick={() => setRoute(p => ({ ...p, region: r, fromCity: '', toCity: '' }))}
                      className={cn(
                        'flex-1 py-2 px-4 rounded-lg border font-medium transition-all',
                        route.region === r
                          ? 'border-[var(--terra)] bg-[var(--terra)]/10 text-[var(--terra)]'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      {r === 'NG' ? '🇳🇬 Nigeria' : r === 'GH' ? '🇬🇭 Ghana' : '🇰🇪 Kenya'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>From City *</Label>
                  <select
                    value={route.fromCity}
                    onChange={(e) => setRoute(p => ({ ...p, fromCity: e.target.value }))}
                    className="w-full mt-1 h-10 px-3 rounded-lg border border-input bg-background"
                  >
                    <option value="">Select city</option>
                    {cities[route.region].map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>To City *</Label>
                  <select
                    value={route.toCity}
                    onChange={(e) => setRoute(p => ({ ...p, toCity: e.target.value }))}
                    className="w-full mt-1 h-10 px-3 rounded-lg border border-input bg-background"
                  >
                    <option value="">Select city</option>
                    {cities[route.region].filter(c => c !== route.fromCity).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedPair && price && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-green-800">Estimated Price</span>
                    <span className="text-2xl font-bold text-green-700">
                      {formatCurrency(price, currency)}
                    </span>
                  </div>
                  <p className="text-xs text-green-600">Delivery: {selectedPair.days}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep('package')}>Back</Button>
                <Button
                  onClick={() => setStep('payment')}
                  disabled={!route.fromCity || !route.toCity || !price}
                  className="flex-1 bg-[var(--terra)] hover:bg-[var(--terra-light)]"
                >
                  Continue to Payment
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer</span>
                <span className="font-medium">{selectedCustomer?.name}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Package</span>
                <span className="font-medium">{pkg.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Weight</span>
                <span className="font-medium">{pkg.weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Route</span>
                <span className="font-medium">{route.fromCity} → {route.toCity}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 'payment' && price && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[var(--terra)]" />
                Payment Collection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Payment Method</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={cn(
                      'p-4 rounded-lg border text-center transition-all',
                      paymentMethod === 'cash'
                        ? 'border-[var(--terra)] bg-[var(--terra)]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <Banknote className="h-6 w-6 mx-auto mb-2" />
                    <p className="font-medium">Cash</p>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={cn(
                      'p-4 rounded-lg border text-center transition-all',
                      paymentMethod === 'card'
                        ? 'border-[var(--terra)] bg-[var(--terra)]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <CreditCard className="h-6 w-6 mx-auto mb-2" />
                    <p className="font-medium">Card</p>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('wallet')}
                    className={cn(
                      'p-4 rounded-lg border text-center transition-all',
                      paymentMethod === 'wallet'
                        ? 'border-[var(--terra)] bg-[var(--terra)]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <Wallet className="h-6 w-6 mx-auto mb-2" />
                    <p className="font-medium">Wallet</p>
                  </button>
                </div>
              </div>

              {paymentMethod === 'cash' && (
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Amount</span>
                    <span className="text-2xl font-bold text-amber-800">
                      {formatCurrency(price, currency)}
                    </span>
                  </div>
                  <div>
                    <Label>Amount Tendered</Label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={amountTendered}
                      onChange={(e) => setAmountTendered(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  {change > 0 && (
                    <div className="flex justify-between items-center p-3 rounded-lg bg-green-100">
                      <span className="font-medium text-green-800">Change Due</span>
                      <span className="text-xl font-bold text-green-700">
                        {formatCurrency(change, currency)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-4 rounded-lg border text-center">
                  <CreditCard className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-medium">Card Payment</p>
                  <p className="text-sm text-muted-foreground">Ready for POS terminal</p>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="p-4 rounded-lg border">
                  <p className="text-center text-muted-foreground">Customer will pay from LogiX wallet</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep('route')}>Back</Button>
                <Button
                  onClick={handleCompleteBooking}
                  disabled={paymentMethod === 'cash' && (!amountTendered || parseFloat(amountTendered) < price)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Complete Booking
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Final Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{selectedCustomer?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedCustomer?.phone}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Package</p>
                <p className="font-medium">{pkg.description}</p>
                <p className="text-sm">{pkg.weight} kg · {pkg.type}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Route</p>
                <p className="font-medium">{route.fromCity} → {route.toCity}</p>
                <p className="text-sm text-muted-foreground">{selectedPair?.days}</p>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-[var(--terra)]">
                  {formatCurrency(price, currency)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 'complete' && completedBooking && (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--ink)] mb-2">Booking Complete!</h2>
            <p className="text-muted-foreground mb-6">Shipment has been created successfully</p>

            <div className="bg-muted/50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Tracking Number</span>
                <Badge className="text-base px-3 py-1">{completedBooking.trackingNumber}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="font-medium">{completedBooking.customer}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Route</p>
                  <p className="font-medium">{completedBooking.route}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p className="font-medium">{completedBooking.weight} kg</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-bold text-[var(--terra)]">{formatCurrency(completedBooking.amount, currency)}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-2" />
                Print Receipt
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                <Receipt className="h-4 w-4 mr-2" />
                Print Label
              </Button>
              <Button onClick={handleNewBooking} className="bg-[var(--terra)] hover:bg-[var(--terra-light)]">
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
