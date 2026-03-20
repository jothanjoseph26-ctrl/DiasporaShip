// ── AGENT LAYOUT ────────────────────────────────────────────
// src/app/agent/layout.tsx
'use client'
import { useState } from 'react'
import { PortalSidebar, PortalTopBar } from '@/components/shared/PortalShell'
import { Building2, Package, Users, DollarSign, BarChart2, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'

const AGENT_CONFIG = {
  portalName: 'Agent Portal',
  accentColor: '#C9972B',
  accentBg: 'rgba(201,151,43,0.14)',
  userLabel: 'Lagos Branch Agent',
  userEmail: 'agent.lagos@diasporaship.com',
  userInitials: 'LA',
  nav: [
    { section: 'Branch', items: [
      { href: '/agent',             icon: Building2, label: 'Branch Overview', badge: null },
      { href: '/agent/shipments',   icon: Package,   label: 'Shipments',      badge: '6'  },
      { href: '/agent/customers',   icon: Users,     label: 'Customers',      badge: null },
    ]},
    { section: 'Finance', items: [
      { href: '/agent/settlements', icon: DollarSign, label: 'Settlements',   badge: null },
      { href: '/agent/reports',     icon: BarChart2,  label: 'Reports',       badge: null },
      { href: '/agent/settings',    icon: Settings,   label: 'Settings',      badge: null },
    ]},
  ]
}

export function AgentLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  const pathname = usePathname()
  const titles: Record<string,string> = { '/agent':'Branch Overview', '/agent/shipments':'Shipments', '/agent/customers':'Customers', '/agent/settlements':'Settlements' }
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--cream)', fontFamily:'var(--font-instrument)' }}>
      <PortalSidebar config={AGENT_CONFIG} collapsed={!open} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <PortalTopBar pageTitle={titles[pathname??'/agent']??'Agent'} onMenuClick={()=>setOpen(v=>!v)} accentColor={AGENT_CONFIG.accentColor} userInitials={AGENT_CONFIG.userInitials} />
        <main style={{ flex:1, padding:'24px', overflowY:'auto' }}>{children}</main>
      </div>
    </div>
  )
}
export default AgentLayout

// ── CUSTOMS LAYOUT ───────────────────────────────────────────
// src/app/customs/layout.tsx
import { FileText, CheckSquare, AlertCircle, Clock } from 'lucide-react'

const CUSTOMS_CONFIG = {
  portalName: 'Customs Portal',
  accentColor: '#0891B2',
  accentBg: 'rgba(8,145,178,0.14)',
  userLabel: 'Customs Officer',
  userEmail: 'customs@diasporaship.com',
  userInitials: 'CO',
  nav: [
    { section: 'Queue', items: [
      { href: '/customs',          icon: Clock,       label: 'Pending Review', badge: '3'  },
      { href: '/customs/cleared',  icon: CheckSquare, label: 'Cleared',        badge: null },
      { href: '/customs/held',     icon: AlertCircle, label: 'On Hold',        badge: '1'  },
    ]},
    { section: 'Documents', items: [
      { href: '/customs/docs',     icon: FileText,    label: 'All Documents',  badge: null },
      { href: '/customs/settings', icon: Settings,    label: 'Settings',       badge: null },
    ]},
  ]
}

export function CustomsLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  const pathname = usePathname()
  const titles: Record<string,string> = { '/customs':'Pending Review', '/customs/cleared':'Cleared Shipments', '/customs/held':'On Hold', '/customs/docs':'All Documents' }
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--cream)', fontFamily:'var(--font-instrument)' }}>
      <PortalSidebar config={CUSTOMS_CONFIG} collapsed={!open} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <PortalTopBar pageTitle={titles[pathname??'/customs']??'Customs'} onMenuClick={()=>setOpen(v=>!v)} accentColor={CUSTOMS_CONFIG.accentColor} userInitials={CUSTOMS_CONFIG.userInitials} />
        <main style={{ flex:1, padding:'24px', overflowY:'auto' }}>{children}</main>
      </div>
    </div>
  )
}

// ── CUSTOMER LAYOUT ──────────────────────────────────────────
import { Home, Send, MapPin, Wallet, Bell, HelpCircle } from 'lucide-react'

const CUSTOMER_CONFIG = {
  portalName: 'Customer Portal',
  accentColor: '#C4622D',
  accentBg: 'rgba(196,98,45,0.14)',
  userLabel: 'Adaeze Okonkwo',
  userEmail: 'adaeze@gmail.com',
  userInitials: 'AO',
  nav: [
    { section: 'Main', items: [
      { href: '/customer',           icon: Home,       label: 'Dashboard',  badge: null },
      { href: '/customer/ship',      icon: Send,       label: 'Ship Now',   badge: null },
      { href: '/customer/shipments', icon: Package,    label: 'Shipments',  badge: null },
      { href: '/customer/tracking',  icon: MapPin,     label: 'Track',      badge: null },
    ]},
    { section: 'Account', items: [
      { href: '/customer/wallet',    icon: Wallet,     label: 'Wallet',     badge: null },
      { href: '/customer/alerts',    icon: Bell,       label: 'Alerts',     badge: '2'  },
      { href: '/customer/support',   icon: HelpCircle, label: 'Support',    badge: null },
      { href: '/customer/settings',  icon: Settings,   label: 'Settings',   badge: null },
    ]},
  ]
}

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  const pathname = usePathname()
  const titles: Record<string,string> = { '/customer':'My Dashboard', '/customer/ship':'New Shipment', '/customer/shipments':'My Shipments', '/customer/tracking':'Track Shipment', '/customer/wallet':'My Wallet' }
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--cream)', fontFamily:'var(--font-instrument)' }}>
      <PortalSidebar config={CUSTOMER_CONFIG} collapsed={!open} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <PortalTopBar pageTitle={titles[pathname??'/customer']??'Customer'} onMenuClick={()=>setOpen(v=>!v)} accentColor={CUSTOMER_CONFIG.accentColor} userInitials={CUSTOMER_CONFIG.userInitials} />
        <main style={{ flex:1, padding:'24px', overflowY:'auto' }}>{children}</main>
      </div>
    </div>
  )
}

// ── DRIVER LAYOUT ────────────────────────────────────────────
import { Navigation, CheckCircle, DollarSign as DollarIcon, User } from 'lucide-react'

const DRIVER_CONFIG = {
  portalName: 'Driver Portal',
  accentColor: '#059669',
  accentBg: 'rgba(5,150,105,0.14)',
  userLabel: 'Chidi Okafor',
  userEmail: 'chidi.driver@diasporaship.com',
  userInitials: 'CO',
  nav: [
    { section: 'Jobs', items: [
      { href: '/driver',          icon: Home,          label: 'Dashboard',    badge: null },
      { href: '/driver/jobs',     icon: Package,       label: 'My Jobs',      badge: '3'  },
      { href: '/driver/active',   icon: Navigation,    label: 'Active Job',   badge: null },
      { href: '/driver/history',  icon: CheckCircle,   label: 'Completed',    badge: null },
    ]},
    { section: 'Account', items: [
      { href: '/driver/earnings', icon: DollarIcon,    label: 'Earnings',     badge: null },
      { href: '/driver/profile',  icon: User,          label: 'Profile',      badge: null },
      { href: '/driver/settings', icon: Settings,      label: 'Settings',     badge: null },
    ]},
  ]
}

export function DriverLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  const pathname = usePathname()
  const titles: Record<string,string> = { '/driver':'Driver Dashboard', '/driver/jobs':'My Jobs', '/driver/active':'Active Delivery', '/driver/earnings':'My Earnings' }
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--cream)', fontFamily:'var(--font-instrument)' }}>
      <PortalSidebar config={DRIVER_CONFIG} collapsed={!open} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <PortalTopBar pageTitle={titles[pathname??'/driver']??'Driver'} onMenuClick={()=>setOpen(v=>!v)} accentColor={DRIVER_CONFIG.accentColor} userInitials={DRIVER_CONFIG.userInitials} showSearch={false} />
        <main style={{ flex:1, padding:'24px', overflowY:'auto' }}>{children}</main>
      </div>
    </div>
  )
}

// ── ANALYTICS LAYOUT ─────────────────────────────────────────
import { TrendingUp, PieChart, Globe as GlobeIcon, Download } from 'lucide-react'

const ANALYTICS_CONFIG = {
  portalName: 'Analytics Portal',
  accentColor: '#DB2777',
  accentBg: 'rgba(219,39,119,0.14)',
  userLabel: 'Business Analyst',
  userEmail: 'analytics@diasporaship.com',
  userInitials: 'BA',
  nav: [
    { section: 'Reports', items: [
      { href: '/analytics',            icon: TrendingUp, label: 'Overview',      badge: null },
      { href: '/analytics/revenue',    icon: DollarSign, label: 'Revenue',       badge: null },
      { href: '/analytics/operations', icon: Package,    label: 'Operations',    badge: null },
      { href: '/analytics/corridors',  icon: GlobeIcon,  label: 'Corridors',     badge: null },
      { href: '/analytics/customers',  icon: Users,      label: 'Customers',     badge: null },
    ]},
    { section: 'Tools', items: [
      { href: '/analytics/exports',    icon: Download,   label: 'Exports',       badge: null },
      { href: '/analytics/settings',   icon: Settings,   label: 'Settings',      badge: null },
    ]},
  ]
}

export function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  const pathname = usePathname()
  const titles: Record<string,string> = { '/analytics':'Analytics Overview', '/analytics/revenue':'Revenue Analytics', '/analytics/operations':'Operations', '/analytics/corridors':'Corridor Performance' }
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--cream)', fontFamily:'var(--font-instrument)' }}>
      <PortalSidebar config={ANALYTICS_CONFIG} collapsed={!open} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <PortalTopBar pageTitle={titles[pathname??'/analytics']??'Analytics'} onMenuClick={()=>setOpen(v=>!v)} accentColor={ANALYTICS_CONFIG.accentColor} userInitials={ANALYTICS_CONFIG.userInitials} />
        <main style={{ flex:1, padding:'24px', overflowY:'auto' }}>{children}</main>
      </div>
    </div>
  )
}
