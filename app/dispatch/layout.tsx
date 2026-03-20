"use client";

import { LayoutDashboard, Map, Package, Radio, Route, Truck } from "lucide-react";
import { usePathname } from "next/navigation";
import { PortalShell, type PortalConfig } from "@/components/shared/PortalShell";

const DISPATCH_CONFIG: PortalConfig = {
  portalName: "Dispatch Portal",
  accentColor: "#2563EB",
  accentBg: "rgba(37,99,235,0.14)",
  userLabel: "Ops Dispatcher",
  userEmail: "dispatch@diasporaship.com",
  userInitials: "OD",
  nav: [
    {
      section: "Operations",
      items: [
        { href: "/dispatch", icon: LayoutDashboard, label: "Overview" },
        { href: "/dispatch/map", icon: Map, label: "Live Map", badge: "28" },
        { href: "/dispatch/fleet", icon: Truck, label: "Fleet" },
        { href: "/dispatch/shipments", icon: Package, label: "Shipments" },
        { href: "/dispatch/routes", icon: Route, label: "Routes" },
        { href: "/dispatch/broadcast", icon: Radio, label: "Broadcast" },
      ],
    },
  ],
};

const TITLES: Record<string, string> = {
  "/dispatch": "Dispatch Overview",
  "/dispatch/map": "Live Map",
  "/dispatch/fleet": "Fleet",
  "/dispatch/shipments": "Shipments",
  "/dispatch/routes": "Routes",
  "/dispatch/broadcast": "Broadcast",
};

export default function DispatchLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <PortalShell
      config={DISPATCH_CONFIG}
      pageTitle={TITLES[pathname] ?? "Dispatch"}
      pageSub="Real-time routing and driver coordination"
    >
      {children}
    </PortalShell>
  );
}
