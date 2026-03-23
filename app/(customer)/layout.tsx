"use client";

import {
  Bell,
  FileText,
  Home,
  MapPin,
  Package,
  Plus,
  Settings,
  Wallet,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { PortalShell, type PortalConfig } from "@/components/shared/PortalShell";
import { useAuthStore, useNotificationStore } from "@/store";

const TITLES: Record<string, string> = {
  "/customer/dashboard": "My Dashboard",
  "/customer/shipments": "My Shipments",
  "/customer/shipments/new": "New Shipment",
  "/customer/wallet": "Wallet",
  "/customer/addresses": "Addresses",
  "/customer/documents": "Documents",
  "/customer/settings": "Settings",
};

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  const config: PortalConfig = {
    portalName: "Customer Portal",
    accentColor: "#C4622D",
    accentBg: "rgba(196,98,45,0.14)",
    userLabel: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Customer",
    userEmail: currentUser?.email ?? "customer@diasporaship.com",
    userInitials: `${currentUser?.firstName?.[0] ?? "C"}${currentUser?.lastName?.[0] ?? "U"}`,
    nav: [
      {
        section: "Main",
        items: [
          { href: "/customer/dashboard", icon: Home, label: "Dashboard" },
          { href: "/customer/shipments", icon: Package, label: "Shipments" },
          { href: "/customer/ship", icon: Plus, label: "Ship Now" },
          { href: "/customer/wallet", icon: Wallet, label: "Wallet" },
        ],
      },
      {
        section: "Account",
        items: [
          { href: "/customer/addresses", icon: MapPin, label: "Addresses" },
          { href: "/customer/documents", icon: FileText, label: "Documents" },
          { href: "/customer/settings", icon: Settings, label: "Settings" },
          { href: "/customer/track", icon: Bell, label: "Tracking", badge: unreadCount ? String(unreadCount) : null },
        ],
      },
    ],
  };

  return (
    <PortalShell
      config={config}
      pageTitle={TITLES[pathname] ?? "Customer"}
      pageSub="Bookings, tracking, documents, and wallet"
    >
      {children}
    </PortalShell>
  );
}
