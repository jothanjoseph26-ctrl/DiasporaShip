"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, LogOut, Menu, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: string | null;
}

export interface NavSection {
  section: string;
  items: NavItem[];
}

export interface PortalConfig {
  portalName: string;
  accentColor: string;
  accentBg: string;
  userLabel: string;
  userEmail: string;
  userInitials: string;
  nav: NavSection[];
}

export function PortalSidebar({
  config,
  collapsed,
}: {
  config: PortalConfig;
  collapsed: boolean;
}) {
  const pathname = usePathname();

  if (collapsed) {
    return null;
  }

  return (
    <aside
      style={{
        width: "240px",
        background: "var(--ink)",
        borderRight: "1px solid rgba(255,253,249,0.07)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "18px 20px 14px",
          borderBottom: "1px solid rgba(255,253,249,0.07)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "19px",
            fontWeight: 700,
            color: "var(--warm-white)",
          }}
        >
          Diaspora<span style={{ color: config.accentColor }}>Ship</span>
        </div>
        <div
          style={{
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,253,249,0.28)",
            marginTop: "2px",
          }}
        >
          {config.portalName}
        </div>
      </div>

      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {config.nav.map((section) => (
          <div key={section.section}>
            <div
              style={{
                padding: "14px 20px 4px",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,253,249,0.22)",
              }}
            >
              {section.section}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href.length > 1 && pathname?.startsWith(item.href));

              return (
                <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "9px 12px",
                      margin: "1px 8px",
                      borderRadius: "7px",
                      fontSize: "13.5px",
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? config.accentColor : "rgba(255,253,249,0.52)",
                      background: isActive ? config.accentBg : "transparent",
                      transition: "all 0.15s",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Icon size={15} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge ? (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          background: config.accentColor,
                          color: "var(--warm-white)",
                          padding: "1px 6px",
                          borderRadius: "10px",
                        }}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div
        style={{
          padding: "14px 16px",
          borderTop: "1px solid rgba(255,253,249,0.07)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: config.accentColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: 700,
            color: "var(--warm-white)",
            flexShrink: 0,
          }}
        >
          {config.userInitials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "rgba(255,253,249,0.88)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {config.userLabel}
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255,253,249,0.32)" }}>{config.userEmail}</div>
        </div>
        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,253,249,0.28)",
          }}
        >
          <LogOut size={13} />
        </button>
      </div>
    </aside>
  );
}

export function PortalTopBar({
  pageTitle,
  pageSub,
  onMenuClick,
  accentColor,
  userInitials,
  showSearch = true,
}: {
  pageTitle: string;
  pageSub?: string;
  onMenuClick: () => void;
  accentColor: string;
  userInitials: string;
  showSearch?: boolean;
}) {
  return (
    <header
      style={{
        height: "56px",
        background: "var(--warm-white)",
        borderBottom: "1px solid var(--border-warm)",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: "14px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        flexShrink: 0,
      }}
    >
      <button
        type="button"
        onClick={onMenuClick}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--muted-text)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Menu size={18} />
      </button>

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--ink)",
            lineHeight: 1.2,
          }}
        >
          {pageTitle}
        </div>
        {pageSub ? (
          <div style={{ fontSize: "11px", color: "var(--muted-text)", marginTop: "1px" }}>{pageSub}</div>
        ) : null}
      </div>

      {showSearch ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--cream)",
            border: "1px solid var(--border-warm)",
            borderRadius: "7px",
            padding: "7px 12px",
            width: "200px",
          }}
        >
          <Search size={13} style={{ color: "var(--muted-text)", flexShrink: 0 }} />
          <input
            placeholder="Search..."
            style={{
              background: "none",
              border: "none",
              outline: "none",
              fontSize: "13px",
              color: "var(--ink)",
              width: "100%",
              fontFamily: "var(--font-instrument)",
            }}
          />
        </div>
      ) : null}

      <button
        type="button"
        style={{
          position: "relative",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--muted-text)",
          padding: "6px",
          borderRadius: "7px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Bell size={17} />
        <span
          style={{
            position: "absolute",
            top: "4px",
            right: "4px",
            width: "7px",
            height: "7px",
            background: "var(--terra)",
            borderRadius: "50%",
            border: "1.5px solid var(--warm-white)",
          }}
        />
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "5px 10px",
          border: "1px solid var(--border-warm)",
          borderRadius: "20px",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: accentColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            fontWeight: 700,
            color: "var(--warm-white)",
          }}
        >
          {userInitials}
        </div>
        <ChevronDown size={12} style={{ color: "var(--muted-text)" }} />
      </div>
    </header>
  );
}

export function PortalShell({
  config,
  children,
  pageTitle,
  pageSub,
  showSearch = true,
}: {
  config: PortalConfig;
  children: React.ReactNode;
  pageTitle: string;
  pageSub?: string;
  showSearch?: boolean;
}) {
  return (
    <div className="portal-shell">
      <PortalSidebar config={config} collapsed={false} />
      <div className="portal-main">
        <PortalTopBar
          pageTitle={pageTitle}
          pageSub={pageSub}
          onMenuClick={() => {}}
          accentColor={config.accentColor}
          userInitials={config.userInitials}
          showSearch={showSearch}
        />
        <main className="portal-content">{children}</main>
      </div>
    </div>
  );
}
