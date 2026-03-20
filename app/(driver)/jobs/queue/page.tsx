"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Package,
  Truck,
  Clock,
  MapPin,
  CheckCircle2,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockJobs = [
  {
    id: "j1",
    trackingNumber: "DS-20260318-A1B2C3",
    type: "pickup",
    address: "123 Commerce St, Atlanta, GA",
    distance: "2.3 km",
    packageType: "parcel",
    weight: "5.2 kg",
    pickupWindow: "10:00 AM - 12:00 PM",
    priority: false,
  },
  {
    id: "j2",
    trackingNumber: "DS-20260318-D4E5F6",
    type: "delivery",
    address: "456 Oak Ave, Marietta, GA",
    distance: "8.7 km",
    packageType: "cargo",
    weight: "12.0 kg",
    pickupWindow: "2:00 PM - 4:00 PM",
    priority: true,
  },
  {
    id: "j3",
    trackingNumber: "DS-20260317-G7H8I9",
    type: "pickup",
    address: "789 Peachtree St, Atlanta, GA",
    distance: "4.1 km",
    packageType: "document",
    weight: "0.3 kg",
    pickupWindow: "11:00 AM - 1:00 PM",
    priority: false,
  },
];

type FilterType = "all" | "pickup" | "delivery" | "priority";

export default function DriverJobsQueuePage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pickup", label: "Pickup" },
    { key: "delivery", label: "Delivery" },
    { key: "priority", label: "Priority" },
  ];

  const filteredJobs = mockJobs.filter((job) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "priority") return job.priority;
    return job.type === activeFilter;
  });

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setActiveFilter(f.key)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              activeFilter === f.key
                ? "bg-ink text-warm-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredJobs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-2 p-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            <p className="text-sm font-medium text-ink">
              No jobs in queue.
            </p>
            <p className="text-xs text-muted-foreground">
              You're all caught up.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => router.push(`/driver/jobs/${job.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
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
                    <div className="mb-1 flex items-center gap-2">
                      <Badge
                        className={cn(
                          "border-0 text-[10px] font-bold uppercase tracking-wider",
                          job.type === "pickup"
                            ? "bg-emerald-500 text-white"
                            : "bg-blue-500 text-white"
                        )}
                      >
                        {job.type}
                      </Badge>
                      {job.priority && (
                        <Badge className="border-0 bg-amber-500 text-[10px] font-bold uppercase tracking-wider text-white">
                          <Zap className="mr-0.5 h-3 w-3" />
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-bold text-ink">{job.address}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{job.distance}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {job.pickupWindow}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {job.packageType} · {job.weight}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground/60">
                      {job.trackingNumber}
                    </p>
                  </div>
                  <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
