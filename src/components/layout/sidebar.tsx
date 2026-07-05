'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Crown, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useSidebar } from '@/components/layout/sidebar-provider'
import { useState } from 'react'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/dashboard/clients', label: 'Clientes', icon: 'Users' },
  { href: '/dashboard/products', label: 'Productos', icon: 'Package' },
  { href: '/dashboard/sales', label: 'Ventas', icon: 'ShoppingCart' },
  { href: '/dashboard/collections', label: 'Cobros', icon: 'CreditCard', badge: 'CORE' },
  { href: '/dashboard/calendar', label: 'Calendario', icon: 'Calendar' },
  { href: '/dashboard/reports', label: 'Reportes', icon: 'BarChart3' },
  { href: '/dashboard/settings', label: 'Configuración', icon: 'Settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const [isHovered, setIsHovered] = useState(false)

  // El estado visual expandido depende de si no está colapsado O si se está haciendo hover sobre él
  const isVisualExpanded = !isCollapsed || isHovered

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Clases condicionales para sombra y borde en modo overlay de hover
  const asideShadow = isCollapsed && isHovered
    ? 'shadow-2xl border-r border-white/10 bg-[#0B121D]'
    : 'shadow-[inset_-1px_0_0_rgba(255,255,255,0.06)]'

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col justify-between border-r border-white/5 bg-[#0B121D]/95 py-6 sidebar-transition ${asideShadow} ${
        isVisualExpanded ? 'w-[280px] px-6' : 'w-[76px] px-3'
      }`}
    >
      {/* Botón Toggle Flotante */}
      <button
        onClick={toggleSidebar}
        className={`absolute -right-3 top-8 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#0B121D] text-slate-400 shadow-md transition-all duration-200 hover:scale-110 hover:text-white cursor-pointer ${
          isCollapsed && isHovered ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-label={isCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
      >
        {isCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>

      <div>
        {/* Logo */}
        <div className={`mb-9 flex items-center ${isVisualExpanded ? 'gap-3 px-1' : 'justify-center'}`}>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-soft)] border border-[var(--brand-border)] shadow-[0_0_22px_rgba(124,92,255,0.18)] flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C5CFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          {isVisualExpanded && (
            <span className="font-display text-[18px] font-bold tracking-tight text-white transition-opacity duration-200">
              Seguimiento<span className="text-[var(--brand-500)]">PRO</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1.5 w-full">
          {NAV.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex h-12 items-center rounded-2xl transition-all duration-200 ${
                  isVisualExpanded ? 'gap-3 pl-4 pr-4 w-full' : 'justify-center px-0 w-full'
                } ${
                  active
                    ? 'bg-[var(--brand-soft)] border border-[var(--brand-border)] text-white shadow-[0_0_0_1px_rgba(124,92,255,0.10)]'
                    : 'text-[var(--text-secondary)] border border-transparent hover:bg-white/[0.04] hover:text-white'
                } font-semibold text-[15px]`}
                title={isCollapsed && !isHovered ? item.label : undefined}
              >
                <span className={`${active ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'} transition-colors flex-shrink-0`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {item.icon === 'LayoutDashboard' && <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>}
                    {item.icon === 'Users' && <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>}
                    {item.icon === 'Package' && <><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></>}
                    {item.icon === 'ShoppingCart' && <><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></>}
                    {item.icon === 'CreditCard' && <><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></>}
                    {item.icon === 'Calendar' && <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>}
                    {item.icon === 'BarChart3' && <><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></>}
                    {item.icon === 'Settings' && <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></>}
                  </svg>
                </span>
                {isVisualExpanded && (
                  <span className={`flex-1 whitespace-nowrap overflow-hidden text-ellipsis transition-colors duration-200 ${
                    active ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-white'
                  }`}>
                    {item.label}
                  </span>
                )}
                {isVisualExpanded && item.badge && (
                  <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-300 flex-shrink-0">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 w-full">
        {/* Plan card */}
        {isVisualExpanded && (
          <div className="overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-1)] transition-all duration-200">
            <div className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-soft)] border border-[var(--brand-border)]">
                  <Crown size={14} className="text-violet-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Plan Profesional</p>
                  <p className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Tu plan está activo
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-white/[0.06] p-5">
              <div className="mb-2.5 flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)]">Usuarios</span>
                <span className="font-medium text-white">8 / 15</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[53%] rounded-full bg-gradient-to-r from-violet-500 to-violet-400" />
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`group flex h-12 w-full items-center border border-[var(--border-subtle)] bg-white/[0.03] text-[15px] font-medium transition-all duration-200 hover:bg-white/[0.05] ${
            isVisualExpanded ? 'gap-3 px-4 rounded-2xl' : 'justify-center px-0 rounded-2xl'
          }`}
          title={isCollapsed && !isHovered ? 'Cerrar sesión' : undefined}
        >
          <LogOut size={15} className="text-[var(--text-secondary)] group-hover:text-white transition-colors flex-shrink-0" />
          {isVisualExpanded && (
            <span className="text-[var(--text-secondary)] group-hover:text-white transition-colors duration-200">
              Cerrar sesión
            </span>
          )}
        </button>
      </div>
    </aside>
  )
}
