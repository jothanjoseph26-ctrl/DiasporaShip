"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  Truck,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockEarnings = {
  today: { total: 127.5, deliveries: 5, average: 25.5 },
  week: { total: 892.3, deliveries: 32, average: 27.88 },
  month: { total: 3450.0, deliveries: 128, average: 26.95 },
  balance: 1250.0,
  trips: [
    {
      date: "2026-03-20",
      route: "Atlanta → Marietta",
      type: "delivery",
      amount: 28.5,
      status: "paid",
    },
    {
      date: "2026-03-20",
      route: "Marietta → Decatur",
      type: "pickup",
      amount: 22.0,
      status: "paid",
    },
    {
      date: "2026-03-20",
      route: "Decatur → Atlanta",
      type: "delivery",
      amount: 31.0,
      status: "pending",
    },
    {
      date: "2026-03-19",
      route: "Atlanta → Sandy Springs",
      type: "delivery",
      amount: 25.5,
      status: "paid",
    },
  ],
};

const chartData = [
  { label: "Mon", value: 85, pct: 57 },
  { label: "Tue", value: 120, pct: 80 },
  { label: "Wed", value: 95, pct: 63 },
  { label: "Thu", value: 150, pct: 100 },
  { label: "Fri", value: 110, pct: 73 },
  { label: "Sat", value: 135, pct: 90 },
  { label: "Sun", value: 127, pct: 85 },
];

type Period = "today" | "week" | "month";

export default function DriverEarningsPage() {
  const [period, setPeriod] = useState<Period>("week");

  const currentData = mockEarnings[period];

  return (
    <div className="flex flex-col gap-4 pb-6">
      <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="mt-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <DollarSign className="mx-auto mb-1 h-4 w-4 text-emerald-600" />
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Earned
                </p>
                <p className="mt-0.5 text-lg font-bold text-ink">
                  ${currentData.total.toFixed(2)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <Truck className="mx-auto mb-1 h-4 w-4 text-blue-600" />
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Deliveries
                </p>
                <p className="mt-0.5 text-lg font-bold text-ink">
                  {currentData.deliveries}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <TrendingUp className="mx-auto mb-1 h-4 w-4 text-amber-600" />
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Avg / Trip
                </p>
                <p className="mt-0.5 text-lg font-bold text-ink">
                  ${currentData.average.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Weekly Earnings
          </p>
          <div className="flex items-end gap-2" style={{ height: "100px" }}>
            {chartData.map((d) => (
              <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
                <div className="w-full rounded-t" style={{ height: `${d.pct}%`, background: "#C4622D", minHeight: "4px" }} />
                <span className="text-[10px] text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-ink">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-warm-white/60">
                Current Balance
              </p>
              <p className="mt-1 text-3xl font-bold text-warm-white">
                ${mockEarnings.balance.toFixed(2)}
              </p>
            </div>
            <Wallet className="h-8 w-8 text-warm-white/30" />
          </div>
          <Button
            className="mt-3 w-full font-semibold"
            style={{ background: "#C9972B", color: "#1A1208" }}
            size="lg"
            disabled={mockEarnings.balance < 50}
          >
            {mockEarnings.balance < 50
              ? "Minimum $50 to request payout"
              : "Request Payout"}
          </Button>
        </CardContent>
      </Card>

      <div>
        <p className="mb-3 text-sm font-semibold text-ink">Recent Trips</p>
        <div className="flex flex-col gap-3">
          {mockEarnings.trips.map((trip, i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">{trip.route}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{trip.date}</span>
                    <span>·</span>
                    <span className="capitalize">{trip.type}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-ink">
                    ${trip.amount.toFixed(2)}
                  </p>
                  <Badge
                    className={cn(
                      "border-0 text-[10px] font-bold",
                      trip.status === "paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    )}
                  >
                    {trip.status === "paid" ? (
                      <CheckCircle2 className="mr-0.5 h-2.5 w-2.5" />
                    ) : (
                      <Clock className="mr-0.5 h-2.5 w-2.5" />
                    )}
                    {trip.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
