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

const PORTAL_SIDEBAR_BG = "linear-gradient(180deg, #16100c 0%, #211811 45%, #2b1f16 100%)";
const PORTAL_SIDEBAR_BORDER = "rgba(255,244,232,0.08)";
const PORTAL_PANEL_BG = "linear-gradient(180deg, #231913 0%, #2a1f17 100%)";
const PORTAL_PANEL_BORDER = "rgba(255,244,232,0.12)";
const PORTAL_TEXT = "#FFF8F1";
const PORTAL_TEXT_MUTED = "rgba(255,248,241,0.68)";
const PORTAL_TEXT_FAINT = "rgba(255,248,241,0.32)";

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
        background: PORTAL_SIDEBAR_BG,
        borderRight: `1px solid ${PORTAL_SIDEBAR_BORDER}`,
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
          borderBottom: `1px solid ${PORTAL_SIDEBAR_BORDER}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "19px",
            fontWeight: 700,
            color: PORTAL_TEXT,
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
            color: PORTAL_TEXT_FAINT,
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
                color: PORTAL_TEXT_FAINT,
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
                      color: isActive ? "#FFD7C2" : PORTAL_TEXT_MUTED,
                      background: isActive ? config.accentBg : "transparent",
                      border: isActive ? `1px solid ${config.accentColor}33` : "1px solid transparent",
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
                          color: PORTAL_TEXT,
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
          borderTop: `1px solid ${PORTAL_SIDEBAR_BORDER}`,
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
            color: PORTAL_TEXT,
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
              color: PORTAL_TEXT,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {config.userLabel}
          </div>
          <div style={{ fontSize: "11px", color: PORTAL_TEXT_FAINT }}>{config.userEmail}</div>
        </div>
        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: PORTAL_TEXT_FAINT,
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
        background: PORTAL_PANEL_BG,
        borderBottom: `1px solid ${PORTAL_PANEL_BORDER}`,
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
          color: PORTAL_TEXT_MUTED,
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
            color: PORTAL_TEXT,
            lineHeight: 1.2,
          }}
        >
          {pageTitle}
        </div>
        {pageSub ? (
          <div style={{ fontSize: "11px", color: PORTAL_TEXT_MUTED, marginTop: "1px" }}>{pageSub}</div>
        ) : null}
      </div>

      {showSearch ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,248,241,0.04)",
            border: `1px solid ${PORTAL_PANEL_BORDER}`,
            borderRadius: "7px",
            padding: "7px 12px",
            width: "200px",
          }}
        >
          <Search size={13} style={{ color: PORTAL_TEXT_FAINT, flexShrink: 0 }} />
          <input
            placeholder="Search..."
            style={{
              background: "none",
              border: "none",
              outline: "none",
              fontSize: "13px",
              color: PORTAL_TEXT,
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
          color: PORTAL_TEXT_MUTED,
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
            background: accentColor,
            borderRadius: "50%",
            border: `1.5px solid ${PORTAL_PANEL_BG}`,
          }}
        />
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "5px 10px",
          border: `1px solid ${PORTAL_PANEL_BORDER}`,
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
            color: PORTAL_TEXT,
          }}
        >
          {userInitials}
        </div>
        <ChevronDown size={12} style={{ color: PORTAL_TEXT_FAINT }} />
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
