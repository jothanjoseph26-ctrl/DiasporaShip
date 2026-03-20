"use client";

import { Home, Navigation, Package, Power, Settings, User, Wallet } from "lucide-react";
import { usePathname } from "next/navigation";
import { PortalShell, type PortalConfig } from "@/components/shared/PortalShell";
import { useDriverStore } from "@/store";

const TITLES: Record<string, string> = {
  "/driver/home": "Driver Dashboard",
  "/driver/jobs/queue": "Job Queue",
  "/driver/earnings": "Earnings",
  "/driver/profile": "Profile",
  "/driver/settings": "Settings",
};

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentDriver, isOnline } = useDriverStore();

  const config: PortalConfig = {
    portalName: "Driver Portal",
    accentColor: "#059669",
    accentBg: "rgba(5,150,105,0.14)",
    userLabel: currentDriver?.name ?? "Driver",
    userEmail: currentDriver?.branchName ?? "Driver operations",
    userInitials: currentDriver?.avatar ?? "DR",
    nav: [
      {
        section: "Jobs",
        items: [
          { href: "/driver/home", icon: Home, label: "Home" },
          { href: "/driver/jobs/queue", icon: Package, label: "Jobs", badge: currentDriver?.activeShipments ? String(currentDriver.activeShipments) : null },
          { href: "/driver/earnings", icon: Wallet, label: "Earnings" },
        ],
      },
      {
        section: "Account",
        items: [
          { href: "/driver/profile", icon: User, label: "Profile" },
          { href: "/driver/settings", icon: Settings, label: "Settings" },
          { href: "/driver/home", icon: isOnline ? Navigation : Power, label: isOnline ? "Online" : "Offline" },
        ],
      },
    ],
  };

  return (
    <PortalShell
      config={config}
      pageTitle={TITLES[pathname] ?? "Driver"}
      pageSub={isOnline ? "Live and available for assignments" : "Offline mode"}
      showSearch={false}
    >
      {children}
    </PortalShell>
  );
}
