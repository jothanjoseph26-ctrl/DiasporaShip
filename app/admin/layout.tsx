"use client";

import {
  BarChart3,
  CreditCard,
  FileText,
  Globe,
  HelpCircle,
  LayoutDashboard,
  MapPin,
  Package,
  Settings,
  Shield,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { PortalShell, type PortalConfig } from "@/components/shared/PortalShell";

const ADMIN_CONFIG: PortalConfig = {
  portalName: "Admin Portal",
  accentColor: "#C4622D",
  accentBg: "rgba(196,98,45,0.14)",
  userLabel: "Super Admin",
  userEmail: "admin@diasporaship.com",
  userInitials: "SA",
  nav: [
    {
      section: "Overview",
      items: [
        { href: "/admin", icon: LayoutDashboard, label: "Command Center" },
        { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
        { href: "/admin/map", icon: MapPin, label: "Live Map" },
      ],
    },
    {
      section: "Operations",
      items: [
        { href: "/admin/shipments", icon: Package, label: "Shipments" },
        { href: "/admin/drivers", icon: Truck, label: "Drivers" },
        { href: "/admin/vehicles", icon: Truck, label: "Fleet" },
        { href: "/admin/warehouse", icon: Warehouse, label: "Warehouses" },
        { href: "/admin/customs", icon: FileText, label: "Customs" },
      ],
    },
    {
      section: "People",
      items: [
        { href: "/admin/users", icon: Users, label: "Users" },
        { href: "/admin/kyc", icon: Shield, label: "KYC Review", badge: "5" },
        { href: "/admin/branches", icon: Globe, label: "Branches" },
      ],
    },
    {
      section: "System",
      items: [
        { href: "/admin/billing", icon: CreditCard, label: "Billing" },
        { href: "/admin/settings", icon: Settings, label: "Settings" },
        { href: "/admin/support", icon: HelpCircle, label: "Support" },
      ],
    },
  ],
};

const TITLES: Record<string, string> = {
  "/admin": "Command Center",
  "/admin/analytics": "Analytics",
  "/admin/map": "Live Map",
  "/admin/shipments": "Shipments",
  "/admin/drivers": "Drivers",
  "/admin/vehicles": "Fleet",
  "/admin/warehouse": "Warehouses",
  "/admin/customs": "Customs",
  "/admin/users": "Users",
  "/admin/kyc": "KYC Review",
  "/admin/branches": "Branches",
  "/admin/billing": "Billing",
  "/admin/settings": "Settings",
  "/admin/support": "Support",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageTitle = TITLES[pathname] ?? "Admin";

  return (
    <PortalShell
      config={ADMIN_CONFIG}
      pageTitle={pageTitle}
      pageSub="System-wide logistics operations"
    >
      {children}
    </PortalShell>
  );
}
