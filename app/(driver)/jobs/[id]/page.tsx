"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  Package,
  Truck,
  Clock,
  Weight,
  FileText,
  AlertTriangle,
  Camera,
  PenLine,
  CheckCircle2,
  Navigation,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { cn, getStatusLabel } from "@/lib/utils";

const mockJobDetail = {
  id: "j1",
  trackingNumber: "DS-20260318-A1B2C3",
  type: "pickup",
  status: "pickup_assigned",
  recipientName: "John Okafor",
  recipientPhone: "+12345551234",
  address: "123 Commerce St, Suite 400, Atlanta, GA 30301",
  distance: "2.3 km",
  packageType: "parcel",
  weight: "5.2 kg",
  description: "Electronics - Laptop accessories and phone parts",
  specialInstructions: "Fragile items. Handle with care. Ring doorbell twice.",
  pickupWindow: "10:00 AM - 12:00 PM",
  priority: false,
  declaredValue: 850,
  isInsured: true,
};

type JobStatus = "pickup_assigned" | "picked_up" | "out_for_delivery" | "delivered" | "failed_delivery";

export default function DriverJobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<JobStatus>(mockJobDetail.status as JobStatus);
  const [showPod, setShowPod] = useState(false);

  const statusFlow: Record<JobStatus, { label: string; next: JobStatus | null; buttonLabel: string; variant: "default" | "destructive" }> = {
    pickup_assigned: { label: "Assigned", next: "picked_up", buttonLabel: "Start Pickup", variant: "default" },
    picked_up: { label: "Picked Up", next: "out_for_delivery", buttonLabel: "Confirm Pickup", variant: "default" },
    out_for_delivery: { label: "Out for Delivery", next: "delivered", buttonLabel: "Confirm Delivery", variant: "default" },
    delivered: { label: "Delivered", next: null, buttonLabel: "Completed", variant: "default" },
    failed_delivery: { label: "Failed", next: null, buttonLabel: "Report Failed Delivery", variant: "destructive" },
  };

  const handleStatusAdvance = () => {
    if (currentStatus === "out_for_delivery") {
      setShowPod(true);
      return;
    }
    const next = statusFlow[currentStatus].next;
    if (next) setCurrentStatus(next);
  };

  const handleSubmitPod = () => {
    setCurrentStatus("delivered");
    setShowPod(false);
  };

  return (
    <div className="flex flex-col gap-4 pb-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-semibold text-ink">
          {mockJobDetail.trackingNumber}
        </span>
        <Badge
          className={cn(
            "border-0 text-[10px] font-bold uppercase",
            mockJobDetail.type === "pickup"
              ? "bg-emerald-500 text-white"
              : "bg-blue-500 text-white"
          )}
        >
          {mockJobDetail.type}
        </Badge>
        <Badge
          className={cn(
            "border-0 text-[10px] font-bold uppercase",
            currentStatus === "delivered"
              ? "bg-emerald-500 text-white"
              : currentStatus === "failed_delivery"
              ? "bg-red-500 text-white"
              : "bg-amber-500 text-white"
          )}
        >
          {statusFlow[currentStatus].label}
        </Badge>
      </div>

      <Card className="overflow-hidden border-0">
        <CardContent className="flex h-[260px] items-center justify-center bg-gray-100 p-0">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <MapPin className="h-8 w-8" />
            <span className="text-sm font-medium">Map View</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Address
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">
                {mockJobDetail.address}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {mockJobDetail.recipientName}
              </p>
            </div>
            <a
              href={`tel:${mockJobDetail.recipientPhone}`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-colors hover:bg-emerald-200"
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Package Details
          </p>
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-ink">{mockJobDetail.packageType}</span>
              <span className="text-muted-foreground">·</span>
              <Weight className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-ink">{mockJobDetail.weight}</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground">{mockJobDetail.description}</span>
            </div>
            {mockJobDetail.specialInstructions && (
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-2.5 text-sm">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <span className="text-amber-800">{mockJobDetail.specialInstructions}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Pickup: {mockJobDetail.pickupWindow}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {!showPod && currentStatus !== "delivered" && (
        <div className="sticky bottom-4">
          {currentStatus === "failed_delivery" ? (
            <Button
              className="w-full font-semibold"
              size="lg"
              variant="destructive"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Report Failed Delivery
            </Button>
          ) : (
            <Button
              className="w-full bg-emerald-500 font-semibold text-white hover:bg-emerald-600"
              size="lg"
              onClick={handleStatusAdvance}
            >
              <Navigation className="mr-2 h-4 w-4" />
              {statusFlow[currentStatus].buttonLabel}
            </Button>
          )}
        </div>
      )}

      {showPod && (
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Proof of Delivery
            </p>
            <div className="mt-3 space-y-3">
              <div className="flex h-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 transition-colors hover:border-emerald-400 hover:bg-emerald-50/50">
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Camera className="h-6 w-6" />
                  <span className="text-xs font-medium">Upload Photo</span>
                </div>
              </div>
              <div className="flex h-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 transition-colors hover:border-emerald-400 hover:bg-emerald-50/50">
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <PenLine className="h-6 w-6" />
                  <span className="text-xs font-medium">Signature Pad</span>
                </div>
              </div>
              <Button
                className="w-full bg-emerald-500 font-semibold text-white hover:bg-emerald-600"
                size="lg"
                onClick={handleSubmitPod}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Submit Delivery
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStatus === "delivered" && (
        <Card className="border-emerald-200 bg-emerald-50/60">
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                Delivery Confirmed
              </p>
              <p className="text-xs text-emerald-600">
                Proof of delivery submitted successfully
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
