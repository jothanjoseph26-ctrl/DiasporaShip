"use client";

import { BarChart3, LayoutDashboard, Package, Settings, Truck, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { PortalShell, type PortalConfig } from "@/components/shared/PortalShell";

const AGENT_CONFIG: PortalConfig = {
  portalName: "Agent Portal",
  accentColor: "#C9972B",
  accentBg: "rgba(201,151,43,0.14)",
  userLabel: "Kwame Asante",
  userEmail: "agent@diasporaship.com",
  userInitials: "KA",
  nav: [
    {
      section: "Branch",
      items: [
        { href: "/agent", icon: LayoutDashboard, label: "Overview" },
        { href: "/agent/shipments", icon: Package, label: "Shipments" },
        { href: "/agent/customers", icon: Users, label: "Customers" },
        { href: "/agent/drivers", icon: Truck, label: "Drivers" },
      ],
    },
    {
      section: "Finance",
      items: [
        { href: "/agent/reports", icon: BarChart3, label: "Reports" },
        { href: "/agent/settings", icon: Settings, label: "Settings" },
      ],
    },
  ],
};

const TITLES: Record<string, string> = {
  "/agent": "Branch Overview",
  "/agent/shipments": "Shipments",
  "/agent/customers": "Customers",
  "/agent/drivers": "Drivers",
  "/agent/reports": "Reports",
  "/agent/settings": "Settings",
};

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <PortalShell
      config={AGENT_CONFIG}
      pageTitle={TITLES[pathname] ?? "Agent"}
      pageSub="Branch operations and customer management"
    >
      {children}
    </PortalShell>
  );
}
