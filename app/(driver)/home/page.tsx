"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Navigation,
  Package,
  Clock,
  DollarSign,
  TrendingUp,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Truck,
  Zap,
} from "lucide-react";
import { useDriverStore, useShipmentStore } from "@/store";
import { cn, formatCurrency } from "@/lib/utils";

const mockDriver = {
  isOnline: true,
  isAvailable: true,
  status: "available" as const,
  totalDeliveries: 847,
  onTimeRate: 96.5,
  rating: 4.8,
  earningsBalance: 1250.0,
  activeShipments: [],
  completedToday: 5,
  todayEarnings: 127.5,
  weekEarnings: 892.3,
};

const mockActiveJob = {
  id: "s1",
  trackingNumber: "DS-20260318-A1B2C3",
  type: "delivery" as string,
  status: "out_for_delivery",
  address: "15 Admiralty Way, Lekki Phase 1, Lagos",
  recipientName: "Emmanuel Okafor",
  recipientPhone: "+2348012345678",
  packageType: "parcel",
  weight: "12.5 kg",
  distance: "8.2 km",
  eta: "25 min",
};

const mockPendingJobs = [
  {
    id: "j1",
    trackingNumber: "DS-20260318-B2C3D4",
    type: "pickup",
    address: "123 Commerce St, Atlanta, GA",
    distance: "2.3 km",
    timeWindow: "10:00 AM - 12:00 PM",
    packageType: "parcel",
  },
  {
    id: "j2",
    trackingNumber: "DS-20260318-E5F6G7",
    type: "delivery",
    address: "456 Oak Ave, Marietta, GA",
    distance: "8.7 km",
    timeWindow: "2:00 PM - 4:00 PM",
    packageType: "cargo",
  },
  {
    id: "j3",
    trackingNumber: "DS-20260317-H8I9J0",
    type: "pickup",
    address: "789 Peachtree St, Atlanta, GA",
    distance: "4.1 km",
    timeWindow: "11:00 AM - 1:00 PM",
    packageType: "document",
  },
];

export default function DriverHome() {
  const router = useRouter();
  const { currentDriver } = useDriverStore();
  const { isOnline, toggleOnline } = useDriverStore();
  const [driverStatus, setDriverStatus] = useState(isOnline);

  const handleToggle = () => {
    setDriverStatus(!driverStatus);
    toggleOnline();
  };

  const hasActiveJob = driverStatus && mockActiveJob;

  return (
    <div className="flex flex-col gap-4 pb-6">
      <Card
        className={cn(
          "border-2 transition-all",
          driverStatus
            ? "border-emerald-500 bg-emerald-50/60"
            : "border-gray-300 bg-gray-50/60"
        )}
        style={{ minHeight: "120px" }}
      >
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div className="flex-1">
            <p className="text-base font-semibold text-ink">
              {driverStatus ? "Available" : "Offline"}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {driverStatus
                ? "Waiting for jobs"
                : "You're offline — go online to receive deliveries."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggle}
            className={cn(
              "relative inline-flex h-10 w-[72px] shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors",
              driverStatus ? "bg-emerald-500" : "bg-gray-300"
            )}
          >
            <span
              className={cn(
                "inline-block h-8 w-8 rounded-full bg-white shadow-md transition-transform",
                driverStatus ? "translate-x-[28px]" : "translate-x-0"
              )}
            />
          </button>
        </CardContent>
      </Card>

      {hasActiveJob && (
        <Card className="overflow-hidden border-0 bg-ink text-warm-white">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <Badge
                className={cn(
                  "border-0 text-xs font-bold uppercase tracking-wider",
                  mockActiveJob.type === "pickup"
                    ? "bg-emerald-500 text-white"
                    : "bg-blue-500 text-white"
                )}
              >
                {mockActiveJob.type === "pickup" ? "Pickup" : "Delivery"}
              </Badge>
              <span className="font-mono text-xs text-warm-white/60">
                {mockActiveJob.trackingNumber}
              </span>
            </div>
            <div className="mb-3 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <p className="text-sm font-medium">{mockActiveJob.address}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-warm-white/70">
                <span className="flex items-center gap-1">
                  <Package className="h-3.5 w-3.5" />
                  {mockActiveJob.packageType} · {mockActiveJob.weight}
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5" />
                  {mockActiveJob.distance}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  ETA {mockActiveJob.eta}
                </span>
              </div>
            </div>
            <Button
              className="w-full bg-emerald-500 font-semibold text-white hover:bg-emerald-600"
              size="lg"
              onClick={() => router.push(`/driver/jobs/${mockActiveJob.id}`)}
            >
              <Navigation className="mr-2 h-4 w-4" />
              Navigate
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Today</p>
            <p className="mt-1 text-lg font-bold text-ink">
              ${mockDriver.todayEarnings.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">This Week</p>
            <p className="mt-1 text-lg font-bold text-ink">
              ${mockDriver.weekEarnings.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Completion</p>
            <p className="mt-1 text-lg font-bold text-emerald-600">
              {mockDriver.onTimeRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      {driverStatus && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Pending Jobs</h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 px-2 text-xs text-muted-foreground"
              onClick={() => router.push("/driver/jobs/queue")}
            >
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            {mockPendingJobs.map((job) => (
              <Card
                key={job.id}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => router.push(`/driver/jobs/${job.id}`)}
              >
                <CardContent className="flex items-center gap-3 p-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                      job.type === "pickup"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-blue-100 text-blue-600"
                    )}
                  >
                    {job.type === "pickup" ? (
                      <Package className="h-5 w-5" />
                    ) : (
                      <Truck className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">
                      {job.address}
                    </p>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{job.distance}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {job.timeWindow}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {job.packageType}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!driverStatus && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-2 p-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">
              You're offline — go online to receive deliveries.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
