'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, Users, Truck, Building2,
  BarChart3, Settings, Bell, Search, ChevronDown,
  LogOut, ShieldCheck, Globe, Warehouse, FileText,
  AlertCircle, TrendingUp, Menu, X
} from 'lucide-react'

// ── NAV STRUCTURE ───────────────────────────────────────────
const NAV = [
  {
    section: 'Overview',
    items: [
      { href: '/admin',           icon: LayoutDashboard, label: 'Dashboard',   badge: null },
      { href: '/admin/analytics', icon: TrendingUp,      label: 'Analytics',   badge: null },
    ]
  },
  {
    section: 'Operations',
    items: [
      { href: '/admin/shipments', icon: Package,    label: 'Shipments',  badge: '12' },
      { href: '/admin/dispatch',  icon: Globe,      label: 'Dispatch',   badge: null },
      { href: '/admin/customs',   icon: FileText,   label: 'Customs',    badge: '3'  },
      { href: '/admin/warehouse', icon: Warehouse,  label: 'Warehouse',  badge: null },
    ]
  },
  {
    section: 'People',
    items: [
      { href: '/admin/users',    icon: Users,      label: 'Customers',  badge: null },
      { href: '/admin/drivers',  icon: Truck,      label: 'Drivers',    badge: null },
      { href: '/admin/agents',   icon: Building2,  label: 'Agents',     badge: null },
    ]
  },
  {
    section: 'System',
    items: [
      { href: '/admin/alerts',   icon: AlertCircle, label: 'Alerts',    badge: '2'  },
      { href: '/admin/kyc',      icon: ShieldCheck, label: 'KYC Review', badge: '7' },
      { href: '/admin/settings', icon: Settings,    label: 'Settings',  badge: null },
    ]
  },
]

// ── SIDEBAR ─────────────────────────────────────────────────
function Sidebar({ collapsed, onClose }: { collapsed: boolean; onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <aside
      className="portal-admin flex flex-col h-full"
      style={{
        width: collapsed ? '0' : '240px',
        background: 'var(--ink)',
        borderRight: '1px solid rgba(255,253,249,0.07)',
        overflow: 'hidden',
        transition: 'width 0.25s ease',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{
        padding: '18px 20px 14px',
        borderBottom: '1px solid rgba(255,253,249,0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <div className="portal-sidebar-logo-text" style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: '19px',
            fontWeight: 700,
            color: 'var(--warm-white)',
            whiteSpace: 'nowrap',
          }}>
            Diaspora<span style={{ color: 'var(--terra-light)' }}>Ship</span>
          </div>
          <div style={{
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,253,249,0.3)',
            marginTop: '2px',
          }}>
            Admin Portal
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ color: 'rgba(255,253,249,0.35)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav sections */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {NAV.map(section => (
          <div key={section.section}>
            <div className="portal-nav-section" style={{
              padding: '14px 20px 4px',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,253,249,0.22)',
            }}>
              {section.section}
            </div>
            {section.items.map(item => {
              const isActive = pathname === item.href ||
                (item.href !== '/admin' && pathname?.startsWith(item.href))
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                  <div
                    className="portal-nav-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 12px',
                      margin: '1px 8px',
                      borderRadius: '7px',
                      fontSize: '13.5px',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--terra-light)' : 'rgba(255,253,249,0.52)',
                      background: isActive ? 'rgba(196,98,45,0.16)' : 'transparent',
                      transition: 'all 0.15s',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Icon size={15} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        background: 'var(--terra)',
                        color: 'var(--warm-white)',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        minWidth: '18px',
                        textAlign: 'center',
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid rgba(255,253,249,0.07)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexShrink: 0,
      }}>
        <div style={{
          width: '32px', height: '32px',
          borderRadius: '50%',
          background: 'var(--terra)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 700, color: 'var(--warm-white)',
          flexShrink: 0,
        }}>
          SA
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,253,249,0.88)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Super Admin
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,253,249,0.35)' }}>
            admin@diasporaship.com
          </div>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,253,249,0.3)', transition: 'color 0.2s' }}>
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  )
}

// ── TOP BAR ─────────────────────────────────────────────────
function TopBar({ onMenuClick, pageTitle, pageSub }: {
  onMenuClick: () => void
  pageTitle: string
  pageSub?: string
}) {
  return (
    <header style={{
      height: '56px',
      background: 'var(--warm-white)',
      borderBottom: '1px solid var(--border-warm)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: '14px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      flexShrink: 0,
    }}>
      {/* Menu toggle */}
      <button
        onClick={onMenuClick}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--muted-text)', padding: '4px',
          display: 'flex', alignItems: 'center',
        }}
      >
        <Menu size={18} />
      </button>

      {/* Page title */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: '16px',
          fontWeight: 700,
          color: 'var(--ink)',
          lineHeight: 1.2,
        }}>
          {pageTitle}
        </div>
        {pageSub && (
          <div style={{ fontSize: '11px', color: 'var(--muted-text)', marginTop: '1px' }}>
            {pageSub}
          </div>
        )}
      </div>

      {/* Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'var(--cream)',
        border: '1px solid var(--border-warm)',
        borderRadius: '7px',
        padding: '7px 12px',
        width: '220px',
      }}>
        <Search size={13} style={{ color: 'var(--muted-text)', flexShrink: 0 }} />
        <input
          placeholder="Search shipments, users..."
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            fontSize: '13px',
            color: 'var(--ink)',
            width: '100%',
            fontFamily: 'var(--font-instrument)',
          }}
        />
      </div>

      {/* Notifications */}
      <button style={{
        position: 'relative',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--muted-text)',
        padding: '6px',
        borderRadius: '7px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <Bell size={17} />
        <span style={{
          position: 'absolute',
          top: '4px', right: '4px',
          width: '7px', height: '7px',
          background: 'var(--terra)',
          borderRadius: '50%',
          border: '1.5px solid var(--warm-white)',
        }} />
      </button>

      {/* User pill */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '5px 10px',
        border: '1px solid var(--border-warm)',
        borderRadius: '20px',
        cursor: 'pointer',
        background: 'var(--warm-white)',
      }}>
        <div style={{
          width: '24px', height: '24px',
          borderRadius: '50%',
          background: 'var(--terra)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '10px', fontWeight: 700, color: 'var(--warm-white)',
        }}>
          SA
        </div>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>Admin</span>
        <ChevronDown size={12} style={{ color: 'var(--muted-text)' }} />
      </div>
    </header>
  )
}

// ── LAYOUT ──────────────────────────────────────────────────
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Derive page title from route
  const pageTitles: Record<string, { title: string; sub: string }> = {
    '/admin':            { title: 'Dashboard',    sub: 'Platform overview and live metrics' },
    '/admin/shipments':  { title: 'Shipments',    sub: 'All shipments across all corridors' },
    '/admin/analytics':  { title: 'Analytics',    sub: 'Revenue, volume and performance reports' },
    '/admin/users':      { title: 'Customers',    sub: 'Registered accounts and KYC status' },
    '/admin/drivers':    { title: 'Drivers',      sub: 'Driver profiles and performance' },
    '/admin/dispatch':   { title: 'Dispatch',     sub: 'Live fleet map and job assignment' },
    '/admin/customs':    { title: 'Customs',      sub: 'Documents pending review and clearance' },
    '/admin/warehouse':  { title: 'Warehouse',    sub: 'Inventory and fulfillment operations' },
    '/admin/kyc':        { title: 'KYC Review',   sub: 'Identity documents awaiting verification' },
    '/admin/alerts':     { title: 'Alerts',       sub: 'System alerts and anomaly flags' },
    '/admin/settings':   { title: 'Settings',     sub: 'Platform configuration and integrations' },
    '/admin/agents':     { title: 'Agents',       sub: 'Branch agents and partner accounts' },
  }

  const page = pageTitles[pathname ?? '/admin'] ?? { title: 'Admin', sub: '' }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--cream)',
      fontFamily: 'var(--font-instrument)',
    }}>
      {/* Sidebar */}
      <Sidebar collapsed={!sidebarOpen} />

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar
          onMenuClick={() => setSidebarOpen(v => !v)}
          pageTitle={page.title}
          pageSub={page.sub}
        />
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
