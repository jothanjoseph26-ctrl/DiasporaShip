"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Map as MapIcon,
  Package,
  Truck,
  Users,
  ArrowRight,
  CheckCircle2,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useDriverStore, useShipmentStore } from "@/store";
import { cn } from "@/lib/utils";

export default function DispatchDashboard() {
  const { drivers } = useDriverStore();
  const { shipments } = useShipmentStore();

  const onlineDrivers = drivers.filter(d => d.isOnline);
  const unassignedShipments = shipments.filter(s => !s.assignedDriverId && s.status === 'pending_pickup');
  const outForDelivery = shipments.filter(s => s.status === 'out_for_delivery');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1208]">Dispatch Operations</h1>
          <p className="text-[#8C7B6B]">
            Real-time fleet management and shipment assignment
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 border-[#E8DDD0] text-[#1A1208] hover:bg-[#F5EBE0] hover:border-[#C4622D]">
            <Zap className="h-4 w-4" /> Auto-Assign
          </Button>
          <Link href="/dispatch/map">
            <Button className="gap-2 bg-[#C4622D] hover:bg-[#D97B48] text-white shadow-lg shadow-[#C4622D]/20">
              <MapIcon className="h-4 w-4" /> Live Map
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#E8DDD0] bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1208]">{onlineDrivers.length}</p>
                <p className="text-xs text-[#8C7B6B]">Drivers Online</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#E8DDD0] bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-amber-50 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1208]">{unassignedShipments.length}</p>
                <p className="text-xs text-[#8C7B6B]">Unassigned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#E8DDD0] bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-[#F5EBE0] rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-[#C4622D]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1208]">{outForDelivery.length}</p>
                <p className="text-xs text-[#8C7B6B]">Out for Delivery</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#E8DDD0] bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-[#FBF3DC] rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-[#C9972B]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1208]">{drivers.length}</p>
                <p className="text-xs text-[#8C7B6B]">Total Fleet</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dispatch" className="space-y-4">
        <TabsList className="bg-[#F5EBE0] border border-[#E8DDD0]">
          <TabsTrigger value="dispatch" className="data-[state=active]:bg-[#C4622D] data-[state=active]:text-white">Dispatch Queue</TabsTrigger>
          <TabsTrigger value="drivers" className="data-[state=active]:bg-[#C4622D] data-[state=active]:text-white">Driver Status</TabsTrigger>
        </TabsList>

        <TabsContent value="dispatch">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Unassigned shipments */}
            <div className="lg:col-span-2">
              <Card className="border-[#E8DDD0] bg-white shadow-sm">
                <CardHeader className="border-b border-[#E8DDD0] pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold text-[#1A1208]">Unassigned Shipments</CardTitle>
                    <Badge variant="default" className="bg-amber-500 text-white">{unassignedShipments.length} pending</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  {unassignedShipments.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500" />
                      <p className="font-medium text-[#1A1208]">All caught up!</p>
                      <p className="text-sm text-[#8C7B6B]">No pending assignments</p>
                    </div>
                  ) : (
                    unassignedShipments.map((shipment) => (
                      <div key={shipment.id} className="p-4 rounded-xl border border-[#E8DDD0] bg-white hover:bg-[#FAF6EF] hover:border-[#C4622D]/30 transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono font-semibold text-[#1A1208]">{shipment.trackingNumber}</span>
                          <Badge variant={shipment.serviceType === 'express' ? 'default' : 'secondary'} className={shipment.serviceType === 'express' ? 'bg-[#C4622D] text-white' : 'bg-[#F5EBE0] text-[var(--ink)]'}>
                            {shipment.serviceType}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-[#8C7B6B] text-xs">Pickup</p>
                            <p className="font-medium text-[#1A1208]">{shipment.pickupAddress.city}</p>
                          </div>
                          <div>
                            <p className="text-[#8C7B6B] text-xs">Delivery</p>
                            <p className="font-medium text-[#1A1208]">{shipment.deliveryAddress.city}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="text-[#8C7B6B]">Weight: </span>
                            <span className="font-medium text-[#1A1208]">{shipment.weightKg} kg</span>
                          </div>
                          <Button size="sm" className="gap-1 bg-[#C4622D] hover:bg-[#D97B48] text-white">
                            Assign Driver <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Available drivers */}
            <div>
              <Card className="border-[#E8DDD0] bg-white shadow-sm">
                <CardHeader className="border-b border-[#E8DDD0] pb-3">
                  <CardTitle className="text-base font-semibold text-[#1A1208]">Available Drivers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-3">
                  {drivers.filter(d => d.isAvailable).map((driver) => (
                    <div key={driver.id} className="p-3 rounded-xl border border-[#E8DDD0] bg-white hover:bg-[#FAF6EF] hover:border-[#C4622D]/30 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-[#C4622D] text-white font-semibold">
                              {driver.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-[#1A1208] truncate">{driver.name}</p>
                          <p className="text-xs text-[#8C7B6B]">{driver.vehicleType} · {driver.currentLocation}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-[#8C7B6B]">{driver.activeShipments} active</span>
                        <span className="font-semibold text-[#C9972B]">{driver.rating}★</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="drivers">
          <Card className="border-[#E8DDD0] bg-white shadow-sm">
            <CardHeader className="border-b border-[#E8DDD0]">
              <CardTitle className="text-base font-semibold text-[#1A1208]">All Drivers Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drivers.map((driver) => (
                  <div key={driver.id} className="p-4 rounded-xl border border-[#E8DDD0] bg-white">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={cn(
                          driver.isOnline ? "bg-[#C4622D]" : "bg-[#8C7B6B]",
                          "text-white font-semibold"
                        )}>
                          {driver.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-[#1A1208]">{driver.name}</p>
                        <p className="text-xs text-[#8C7B6B]">{driver.vehicleType}</p>
                      </div>
                      <Badge variant="secondary" className={driver.isOnline ? 'bg-green-100 text-green-700' : 'bg-[#E8DDD0] text-[var(--ink)]'}>
                        {driver.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 bg-[#FAF6EF] rounded-lg">
                        <p className="font-semibold text-[#1A1208]">{driver.completedToday}</p>
                        <p className="text-[#8C7B6B]">Today</p>
                      </div>
                      <div className="p-2 bg-[#FAF6EF] rounded-lg">
                        <p className="font-semibold text-[#1A1208]">{driver.activeShipments}</p>
                        <p className="text-[#8C7B6B]">Active</p>
                      </div>
                      <div className="p-2 bg-[#FAF6EF] rounded-lg">
                        <p className="font-semibold text-[#1A1208]">{driver.rating}</p>
                        <p className="text-[#8C7B6B]">Rating</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
