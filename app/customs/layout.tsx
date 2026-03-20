"use client";

import { BarChart3, FileText, LayoutDashboard, Package, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { PortalShell, type PortalConfig } from "@/components/shared/PortalShell";

const CUSTOMS_CONFIG: PortalConfig = {
  portalName: "Customs Portal",
  accentColor: "#0891B2",
  accentBg: "rgba(8,145,178,0.14)",
  userLabel: "Customs Officer",
  userEmail: "customs@diasporaship.com",
  userInitials: "CO",
  nav: [
    {
      section: "Queue",
      items: [
        { href: "/customs", icon: LayoutDashboard, label: "Overview" },
        { href: "/customs/documents", icon: FileText, label: "Documents", badge: "2" },
        { href: "/customs/shipments", icon: Package, label: "Shipments" },
        { href: "/customs/reports", icon: BarChart3, label: "Reports" },
      ],
    },
    { section: "System", items: [{ href: "/customs/settings", icon: Settings, label: "Settings" }] },
  ],
};

const TITLES: Record<string, string> = {
  "/customs": "Customs Overview",
  "/customs/documents": "Documents",
  "/customs/shipments": "Shipments",
  "/customs/reports": "Reports",
  "/customs/settings": "Settings",
};

export default function CustomsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <PortalShell
      config={CUSTOMS_CONFIG}
      pageTitle={TITLES[pathname] ?? "Customs"}
      pageSub="Document review and clearance workflow"
    >
      {children}
    </PortalShell>
  );
}
