'use client'

import { useState } from 'react'
import { Calculator, Clock, History, Save, AlertCircle, CheckCircle2, DollarSign, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { usePricingStore } from '@/store/pricing'
import { formatCurrency } from '@/lib/utils'

export default function PricingManagementPage() {
  const { internationalRates, domesticRates, auditLog, calculatePrice } = usePricingStore()
  const [selectedCorridor, setSelectedCorridor] = useState('US-NG')
  const [previewWeight, setPreviewWeight] = useState('5')
  const [previewDimensions, setPreviewDimensions] = useState({ l: '40', w: '30', h: '20' })
  const [previewService, setPreviewService] = useState('standard')
  const [previewResult, setPreviewResult] = useState<ReturnType<typeof calculatePrice> | null>(null)
  const [saveMessage, setSaveMessage] = useState('')

  const currentRate = internationalRates.find(r => r.corridorId === selectedCorridor)

  const handlePreview = () => {
    const result = calculatePrice({
      corridorId: selectedCorridor,
      actualWeight: parseFloat(previewWeight) || 1,
      lengthCm: parseFloat(previewDimensions.l) || undefined,
      widthCm: parseFloat(previewDimensions.w) || undefined,
      heightCm: parseFloat(previewDimensions.h) || undefined,
      serviceId: previewService,
      declaredValue: 500,
      isInsured: false,
    })
    setPreviewResult(result)
  }

  const handleSave = () => {
    setSaveMessage('Rates saved successfully')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pricing Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure shipping rates and surcharges</p>
        </div>
        {saveMessage && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">{saveMessage}</span>
          </div>
        )}
      </div>

      <Tabs defaultValue="international" className="space-y-6">
        <TabsList>
          <TabsTrigger value="international">International Rates</TabsTrigger>
          <TabsTrigger value="domestic">Domestic Rates</TabsTrigger>
          <TabsTrigger value="calculator">Price Calculator</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="international" className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Corridors</p>
                <div className="space-y-1">
                  {internationalRates.map(rate => (
                    <button
                      key={rate.corridorId}
                      onClick={() => setSelectedCorridor(rate.corridorId)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCorridor === rate.corridorId 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      <span className="font-medium">{rate.origin}</span>
                      <span className="text-muted-foreground mx-1">→</span>
                      <span className="font-medium">{rate.destination}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {currentRate && (
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {currentRate.origin} → {currentRate.destination}
                    </CardTitle>
                    <Badge variant="outline">USD</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date(currentRate.updatedAt).toLocaleDateString()} by {currentRate.updatedBy}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Min Charge ($)
                      </label>
                      <Input 
                        type="number" 
                        defaultValue={currentRate.minCharge}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Vol. Divisor
                      </label>
                      <Input 
                        type="number" 
                        defaultValue={currentRate.volumetricDivisor}
                        className="h-10"
                      />
                      <p className="text-xs text-muted-foreground">Air: 5000, Sea: 6000</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Fuel Surcharge (%)
                      </label>
                      <Input 
                        type="number" 
                        defaultValue={currentRate.fuelSurchargePercent}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Effective From
                      </label>
                      <Input 
                        type="date" 
                        defaultValue={currentRate.effectiveFrom}
                        className="h-10"
                      />
                      <p className="text-xs text-muted-foreground">Schedule rate change</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-semibold text-foreground mb-4">Service Rates (per kg)</p>
                    <div className="space-y-4">
                      {currentRate.services.map(service => (
                        <div key={service.id} className="grid gap-4 sm:grid-cols-4 items-end p-4 rounded-xl border border-border bg-muted/30">
                          <div className="sm:col-span-2">
                            <p className="font-medium text-foreground">{service.name}</p>
                            <p className="text-sm text-muted-foreground">{service.transitDays}</p>
                            {service.badge && (
                              <Badge variant="secondary" className="mt-1">{service.badge}</Badge>
                            )}
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">$/kg</label>
                            <Input 
                              type="number" 
                              step="0.5"
                              defaultValue={service.basePerKg}
                              className="h-9"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Customs ($)</label>
                            <Input 
                              type="number" 
                              defaultValue={service.customsFixed}
                              className="h-9"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button onClick={handleSave} className="gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="domestic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Domestic City Pair Rates</CardTitle>
              <p className="text-sm text-muted-foreground">Configure rates for Nigeria, Ghana, and Kenya domestic deliveries</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Route</th>
                      <th className="text-left py-3 px-4 font-medium">Region</th>
                      <th className="text-left py-3 px-4 font-medium">Base Price</th>
                      <th className="text-left py-3 px-4 font-medium">Per kg extra</th>
                      <th className="text-left py-3 px-4 font-medium">Min Charge</th>
                      <th className="text-left py-3 px-4 font-medium">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {domesticRates.map(rate => (
                      <tr key={rate.corridorId} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">
                          {rate.fromCity} → {rate.toCity}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{rate.region}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Input type="number" defaultValue={rate.basePrice} className="w-28 h-8" />
                        </td>
                        <td className="py-3 px-4">
                          <Input type="number" defaultValue={rate.perKgExtra} className="w-24 h-8" />
                        </td>
                        <td className="py-3 px-4">
                          <Input type="number" defaultValue={rate.minCharge} className="w-24 h-8" />
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(rate.updatedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Price Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Corridor</label>
                  <select 
                    value={selectedCorridor}
                    onChange={e => setSelectedCorridor(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background"
                  >
                    {internationalRates.map(r => (
                      <option key={r.corridorId} value={r.corridorId}>{r.origin} → {r.destination}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Weight (kg)</label>
                    <Input 
                      type="number" 
                      value={previewWeight}
                      onChange={e => setPreviewWeight(e.target.value)}
                      placeholder="0.0"
                      className="h-10"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Service</label>
                    <select 
                      value={previewService}
                      onChange={e => setPreviewService(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background"
                    >
                      {currentRate?.services.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Dimensions (cm)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Input 
                        type="number" 
                        value={previewDimensions.l}
                        onChange={e => setPreviewDimensions(p => ({ ...p, l: e.target.value }))}
                        placeholder="L"
                        className="h-10"
                      />
                      <span className="text-xs text-muted-foreground mt-1 block">Length</span>
                    </div>
                    <div>
                      <Input 
                        type="number" 
                        value={previewDimensions.w}
                        onChange={e => setPreviewDimensions(p => ({ ...p, w: e.target.value }))}
                        placeholder="W"
                        className="h-10"
                      />
                      <span className="text-xs text-muted-foreground mt-1 block">Width</span>
                    </div>
                    <div>
                      <Input 
                        type="number" 
                        value={previewDimensions.h}
                        onChange={e => setPreviewDimensions(p => ({ ...p, h: e.target.value }))}
                        placeholder="H"
                        className="h-10"
                      />
                      <span className="text-xs text-muted-foreground mt-1 block">Height</span>
                    </div>
                  </div>
                </div>

                <Button onClick={handlePreview} className="w-full gap-2">
                  <Calculator className="h-4 w-4" />
                  Calculate Price
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Calculation Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                {previewResult ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-muted/50">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Actual</p>
                        <p className="text-lg font-bold">{previewResult.actualWeight} kg</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Volumetric</p>
                        <p className="text-lg font-bold">{previewResult.volumetricWeight} kg</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Billable</p>
                        <p className="text-lg font-bold text-primary">{previewResult.billableWeight} kg</p>
                      </div>
                    </div>

                    {previewResult.volumetricWeight > previewResult.actualWeight && (
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                        <p className="text-sm text-amber-800">
                          Volumetric weight exceeds actual weight. Package may be priced as {previewResult.billableWeight}kg.
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      {previewResult.breakdown.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm py-1 border-b border-border/50">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="font-medium">{formatCurrency(item.amount, previewResult.currency)}</span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <div>
                        <p className="text-sm font-medium text-foreground">Total</p>
                        <p className="text-xs text-muted-foreground">Includes VAT and all surcharges</p>
                      </div>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(previewResult.total, previewResult.currency)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <DollarSign className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">Enter values and click Calculate to see pricing</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5" />
                Rate Change History
              </CardTitle>
              <p className="text-sm text-muted-foreground">Track all pricing changes and who made them</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLog.map(log => (
                  <div key={log.id} className="flex items-start gap-4 p-4 rounded-xl border border-border bg-muted/30">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{log.corridorId}</Badge>
                        <span className="text-sm font-medium">{log.field}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Changed from <span className="font-medium text-foreground">{log.oldValue}</span>
                        {' → '}
                        <span className="font-medium text-primary">{log.newValue}</span>
                      </p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p className="font-medium">{log.changedBy}</p>
                      <p className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {new Date(log.changedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
