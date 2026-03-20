"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Truck,
  Clock,
  Shield,
  FileText,
  Upload,
  Calendar,
  TrendingUp,
  Award,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockDriver = {
  name: "Adebayo Ogundimu",
  avatar: "AO",
  phone: "+2348012345678",
  licenseNumber: "DL-284-ABC",
  licenseExpiry: "2027-05-15",
  vehiclePlate: "LG-284-KJA",
  vehicleType: "Van",
  branchName: "Lagos HQ",
  totalDeliveries: 847,
  onTimeRate: 96.5,
  rating: 4.8,
};

const performanceData = [
  { label: "W1", value: 78 },
  { label: "W2", value: 85 },
  { label: "W3", value: 92 },
  { label: "W4", value: 88 },
];

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function DriverProfilePage() {
  const daysUntilExpiry = useMemo(
    () => getDaysUntil(mockDriver.licenseExpiry),
    []
  );
  const isExpiringSoon = daysUntilExpiry > 0 && daysUntilExpiry < 60;

  return (
    <div className="flex flex-col gap-4 pb-6">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-emerald-200">
              <AvatarFallback className="bg-emerald-500 text-xl font-bold text-white">
                {mockDriver.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-lg font-bold text-ink">{mockDriver.name}</p>
              <div className="mt-1 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(mockDriver.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
                <span className="ml-1 text-sm font-semibold text-ink">
                  {mockDriver.rating}
                </span>
              </div>
              <Badge className="mt-2 border-0 bg-emerald-100 text-xs font-semibold text-emerald-700">
                {mockDriver.branchName}
              </Badge>
            </div>
            <Button variant="outline" size="sm" className="shrink-0">
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <Truck className="mx-auto mb-1 h-4 w-4 text-emerald-600" />
            <p className="text-lg font-bold text-ink">
              {mockDriver.totalDeliveries}
            </p>
            <p className="text-[10px] text-muted-foreground">Deliveries</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Clock className="mx-auto mb-1 h-4 w-4 text-blue-600" />
            <p className="text-lg font-bold text-ink">{mockDriver.onTimeRate}%</p>
            <p className="text-[10px] text-muted-foreground">On-time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <Award className="mx-auto mb-1 h-4 w-4 text-amber-600" />
            <p className="text-lg font-bold text-ink">{mockDriver.rating}</p>
            <p className="text-[10px] text-muted-foreground">Rating</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Details
          </p>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                License Number
              </span>
              <span className="font-mono text-sm font-semibold text-ink">
                {mockDriver.licenseNumber}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                License Expiry
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-sm font-semibold",
                    isExpiringSoon ? "text-red-600" : "text-ink"
                  )}
                >
                  {mockDriver.licenseExpiry}
                </span>
                {isExpiringSoon && (
                  <Badge className="border-0 bg-red-100 text-[10px] font-bold text-red-600">
                    Expiring
                  </Badge>
                )}
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Vehicle Plate</span>
              <span className="font-mono text-sm font-semibold text-ink">
                {mockDriver.vehiclePlate}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Vehicle Type</span>
              <span className="text-sm font-semibold text-ink">
                {mockDriver.vehicleType}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Branch</span>
              <span className="text-sm font-semibold text-ink">
                {mockDriver.branchName}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Documents
          </p>
          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">Driver's License</p>
                <p className="text-xs text-muted-foreground">
                  Uploaded · Expires {mockDriver.licenseExpiry}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="shrink-0">
                <Upload className="mr-1 h-3.5 w-3.5" />
                Replace
              </Button>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <Shield className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">
                  Vehicle Insurance
                </p>
                <p className="text-xs text-muted-foreground">
                  Active · Policy #INS-2026-0456
                </p>
              </div>
              <Button variant="ghost" size="sm" className="shrink-0">
                <Upload className="mr-1 h-3.5 w-3.5" />
                Replace
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Last 30 Days
          </p>
          <div className="mt-3 flex items-end gap-2" style={{ height: "64px" }}>
            {performanceData.map((d) => (
              <div
                key={d.label}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${d.value}%`,
                    background: "#059669",
                    minHeight: "4px",
                  }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
