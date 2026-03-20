"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Package, 
  Truck, 
  Wallet, 
  TrendingUp,
  ArrowRight,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus
} from "lucide-react";
import { useAuthStore, useShipmentStore, useWalletStore } from "@/store";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";

export default function CustomerDashboard() {
  const { currentUser } = useAuthStore();
  const { shipments } = useShipmentStore();
  const { wallet } = useWalletStore();

  const activeShipments = shipments.filter(s => !['delivered', 'cancelled'].includes(s.status));
  const recentShipments = shipments.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {currentUser?.firstName}</h1>
          <p className="text-muted-foreground">
            Track your shipments and manage your logistics
          </p>
        </div>
        <Link href="/customer/shipments/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Shipment
          </Button>
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeShipments.length}</p>
                <p className="text-xs text-muted-foreground">Active Shipments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {shipments.filter(s => s.status === 'delivered').length}
                </p>
                <p className="text-xs text-muted-foreground">Delivered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Truck className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {shipments.filter(s => s.status === 'in_transit_international').length}
                </p>
                <p className="text-xs text-muted-foreground">In Transit</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Wallet className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(wallet.balanceUSD)}</p>
                <p className="text-xs text-muted-foreground">Wallet Balance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent shipments */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Shipments</CardTitle>
              <Link href="/customer/shipments">
                <Button variant="ghost" size="sm" className="gap-2">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="active">
                <TabsList className="mb-4">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
                <TabsContent value="active" className="space-y-4">
                  {activeShipments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No active shipments</p>
                      <Link href="/customer/shipments/new">
                        <Button variant="link">Book your first shipment</Button>
                      </Link>
                    </div>
                  ) : (
                    activeShipments.map((shipment) => (
                      <Link key={shipment.id} href={`/customer/shipments/${shipment.id}`}>
                        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-semibold">
                                {shipment.trackingNumber}
                              </span>
                              <span className={`h-2 w-2 rounded-full ${getStatusColor(shipment.status)}`} />
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">
                                {shipment.originCountry} → {shipment.destinationCountry}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={shipment.status === 'delivered' ? 'success' : 'secondary'}>
                              {getStatusLabel(shipment.status)}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              ETA: {formatDate(shipment.estimatedDeliveryDate)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </TabsContent>
                <TabsContent value="all" className="space-y-4">
                  {recentShipments.map((shipment) => (
                    <Link key={shipment.id} href={`/customer/shipments/${shipment.id}`}>
                      <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-semibold">
                              {shipment.trackingNumber}
                            </span>
                            <span className={`h-2 w-2 rounded-full ${getStatusColor(shipment.status)}`} />
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">
                              {shipment.originCountry} → {shipment.destinationCountry}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={shipment.status === 'delivered' ? 'success' : 'secondary'}>
                            {getStatusLabel(shipment.status)}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatCurrency(shipment.totalCost, shipment.currency)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions & Wallet */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/customer/shipments/new">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Plus className="h-4 w-4" /> Book New Shipment
                </Button>
              </Link>
              <Link href="/customer/wallet">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Wallet className="h-4 w-4" /> Fund Wallet
                </Button>
              </Link>
              <Link href="/customer/addresses">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <MapPin className="h-4 w-4" /> Add Address
                </Button>
              </Link>
              <Link href="/customer/track">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Package className="h-4 w-4" /> Track Package
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Wallet Card */}
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium opacity-80">Available Balance</span>
                <Wallet className="h-5 w-5 opacity-80" />
              </div>
              <p className="text-3xl font-bold mb-4">${wallet.balanceUSD.toLocaleString()}</p>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white/10 rounded p-2">
                  <p className="opacity-70">NGN</p>
                  <p className="font-semibold">{wallet.balanceNGN.toLocaleString()}</p>
                </div>
                <div className="bg-white/10 rounded p-2">
                  <p className="opacity-70">GHS</p>
                  <p className="font-semibold">{wallet.balanceGHS.toLocaleString()}</p>
                </div>
                <div className="bg-white/10 rounded p-2">
                  <p className="opacity-70">KES</p>
                  <p className="font-semibold">{wallet.balanceKES.toLocaleString()}</p>
                </div>
              </div>
              <Link href="/customer/wallet">
                <Button className="w-full mt-4 bg-white text-primary hover:bg-white/90">
                  Manage Wallet
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Tracking CTA */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Track Your Package</p>
                  <p className="text-xs text-muted-foreground">Enter tracking number</p>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. DS-20260318-A1B2C3"
                  className="flex-1 h-9 px-3 rounded-md border bg-background text-sm"
                />
                <Link href="/customer/track">
                  <Button>Track</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
