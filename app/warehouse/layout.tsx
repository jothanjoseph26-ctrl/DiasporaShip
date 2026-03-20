"use client";

import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  ScanLine,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { PortalShell, type PortalConfig } from "@/components/shared/PortalShell";

const WAREHOUSE_CONFIG: PortalConfig = {
  portalName: "Warehouse Portal",
  accentColor: "#7C3AED",
  accentBg: "rgba(124,58,237,0.14)",
  userLabel: "Lagos Warehouse",
  userEmail: "warehouse@diasporaship.com",
  userInitials: "WH",
  nav: [
    {
      section: "Operations",
      items: [
        { href: "/warehouse", icon: LayoutDashboard, label: "Overview" },
        { href: "/warehouse/receive", icon: ArrowDownToLine, label: "Receive" },
        { href: "/warehouse/dispatch", icon: ArrowUpFromLine, label: "Dispatch" },
        { href: "/warehouse/search", icon: ScanLine, label: "Scan/Search" },
        { href: "/warehouse/inventory", icon: Boxes, label: "Inventory" },
        { href: "/warehouse/reports", icon: ClipboardList, label: "Reports" },
      ],
    },
  ],
};

const TITLES: Record<string, string> = {
  "/warehouse": "Warehouse Overview",
  "/warehouse/receive": "Receive",
  "/warehouse/dispatch": "Dispatch",
  "/warehouse/search": "Scan/Search",
  "/warehouse/inventory": "Inventory",
  "/warehouse/reports": "Reports",
};

export default function WarehouseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <PortalShell
      config={WAREHOUSE_CONFIG}
      pageTitle={TITLES[pathname] ?? "Warehouse"}
      pageSub="Receiving, storage, and outbound control"
    >
      {children}
    </PortalShell>
  );
}
