'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  Calendar,
  BarChart3,
  Settings,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LowStockBanner } from '@/components/inventory/LowStockBanner'

const navigation = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    id: 'nav-dashboard',
  },
  {
    label: 'Clientes',
    href: '/dashboard/clients',
    icon: Users,
    id: 'nav-clients',
  },
  {
    label: 'Productos',
    href: '/dashboard/products',
    icon: Package,
    id: 'nav-products',
  },
  {
    label: 'Ventas',
    href: '/dashboard/sales',
    icon: ShoppingCart,
    id: 'nav-sales',
  },
  {
    label: 'Cobros',
    href: '/dashboard/collections',
    icon: CreditCard,
    id: 'nav-collections',
    badge: 'CORE',
  },
  {
    label: 'Calendario',
    href: '/dashboard/calendar',
    icon: Calendar,
    id: 'nav-calendar',
  },
  {
    label: 'Reportes',
    href: '/dashboard/reports',
    icon: BarChart3,
    id: 'nav-reports',
  },
  {
    label: 'Configuración',
    href: '/dashboard/settings',
    icon: Settings,
    id: 'nav-settings',
  },
]

export default function Sidebar({ lowStockCount = 0 }: { lowStockCount?: number }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside className="sidebar" id="main-sidebar" role="navigation" aria-label="Navegación principal">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="sidebar-logo-name">SeguimientoPro</span>
      </div>

      {/* Divider */}
      <div className="sidebar-divider" aria-hidden="true" />

      {/* Low stock banner */}
      <LowStockBanner count={lowStockCount} className="mx-0 mb-1" />

      {/* Navegación */}
      <nav className="sidebar-nav">
        <ul role="list">
          {navigation.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  id={item.id}
                  className={`nav-item ${active ? 'active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 1.75} />
                  <span className="nav-label">{item.label}</span>
                  {item.badge && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                  {active && (
                    <ChevronRight size={14} className="nav-arrow" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-divider" aria-hidden="true" />
        <button
          id="logout-button"
          onClick={handleLogout}
          className="nav-item logout-btn"
          aria-label="Cerrar sesión"
        >
          <LogOut size={18} strokeWidth={1.75} />
          <span className="nav-label">Cerrar sesión</span>
        </button>
      </div>

      <style jsx>{`
        .sidebar {
          width: var(--sidebar-width);
          min-height: 100dvh;
          background: #0c111b;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          flex-direction: column;
          padding: var(--space-4);
          gap: 0;
          flex-shrink: 0;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-3);
          margin-bottom: var(--space-2);
        }

        .sidebar-logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, rgba(124, 92, 255, 0.18), rgba(55, 208, 255, 0.08));
          border: 1px solid rgba(124, 92, 255, 0.22);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          flex-shrink: 0;
        }

        .sidebar-logo-name {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: var(--text-base);
          color: var(--text);
          white-space: nowrap;
        }

        .sidebar-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.06);
          margin: var(--space-3) 0;
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .sidebar-nav ul {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          list-style: none;
          padding: var(--space-1) 0;
        }

        :global(.nav-item) {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-3);
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          font-size: var(--text-sm);
          font-weight: 500;
          transition: all var(--transition-fast);
          cursor: pointer;
          white-space: nowrap;
          text-decoration: none;
          border: 1px solid transparent;
          background: transparent;
          width: 100%;
        }

        :global(.nav-item:hover) {
          background: rgba(255, 255, 255, 0.04);
          color: var(--text);
        }

        :global(.nav-item.active) {
          background: rgba(124, 92, 255, 0.10);
          color: #c4b5fd;
          border-color: rgba(124, 92, 255, 0.18);
        }

        .nav-label { flex: 1; }

        .nav-badge {
          font-size: 9px;
          font-weight: 700;
          padding: 2px 6px;
          background: rgba(124, 92, 255, 0.18);
          color: #c4b5fd;
          border-radius: var(--radius-xs);
          letter-spacing: 0.05em;
          border: 1px solid rgba(124, 92, 255, 0.18);
        }

        .nav-arrow {
          opacity: 0.4;
        }

        .sidebar-footer {
          padding-bottom: var(--space-2);
        }

        .logout-btn {
          color: var(--text-muted) !important;
          border-color: transparent !important;
          background: transparent !important;
        }

        .logout-btn:hover {
          background: rgba(255, 107, 129, 0.08) !important;
          color: var(--danger) !important;
          border-color: rgba(255, 107, 129, 0.15) !important;
        }
      `}</style>
    </aside>
  )
}
