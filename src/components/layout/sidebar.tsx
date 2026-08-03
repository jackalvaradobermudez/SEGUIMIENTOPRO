'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Crown, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  Calendar, 
  BarChart3, 
  Settings
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useSidebar } from '@/components/layout/sidebar-provider'
import { formatDate } from '@/lib/utils'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/clients', label: 'Clientes', icon: Users },
  { href: '/dashboard/products', label: 'Productos', icon: Package },
  { href: '/dashboard/sales', label: 'Ventas', icon: ShoppingCart },
  { href: '/dashboard/collections', label: 'Cobros', icon: CreditCard, badge: 'CORE' },
  { href: '/dashboard/calendar', label: 'Calendario', icon: Calendar },
  { href: '/dashboard/reports', label: 'Reportes', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
]

export default function Sidebar({
  plan,
  planExpiresAt,
}: {
  plan: string
  planExpiresAt: string | null
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { isCollapsed, toggleSidebar, isMobileOpen, closeMobileSidebar } = useSidebar()

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* Backdrop móvil */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}
      <aside
        style={{ width: isCollapsed ? '80px' : '260px' }}
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col justify-between border-r border-white/5 bg-neutral-950/80 backdrop-blur-2xl py-6 shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          !isCollapsed ? 'px-4' : 'px-3'
        } overflow-hidden`}
      >
        {/* Ambient Glow (Efecto Liquid Glass Apple) */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-50">
          <div className="absolute -top-20 -left-20 w-[200px] h-[200px] rounded-full bg-violet-600/20 blur-[60px]" />
          <div className="absolute top-1/2 left-0 w-[150px] h-[150px] rounded-full bg-indigo-600/10 blur-[50px]" />
        </div>
        {/* Botón Toggle Flotante (estilo macOS) */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3.5 top-12 z-50 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-neutral-900 text-neutral-400 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-neutral-800 hover:text-white cursor-pointer"
          aria-label={isCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
        >
          {isCollapsed ? <ChevronRight size={14} strokeWidth={2.5} /> : <ChevronLeft size={14} strokeWidth={2.5} />}
        </button>

        <div>
          {/* Logo (Minimalista) */}
          <div className={`mb-8 flex items-center ${!isCollapsed ? 'gap-3 px-2' : 'justify-center'}`}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-[0_0_20px_rgba(124,92,255,0.3)] flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            {!isCollapsed && (
              <span className="font-display text-lg font-semibold tracking-tight text-white transition-opacity duration-300">
                Seguimiento<span className="text-violet-400">PRO</span>
              </span>
            )}
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1 w-full">
            {NAV.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileSidebar}
                  className={`group relative flex h-10 items-center rounded-xl transition-all duration-200 ${
                    !isCollapsed ? 'gap-3 px-3 w-full' : 'justify-center px-0 w-full'
                  } ${
                    active
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/30 font-semibold'
                      : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-100 font-medium'
                  } text-sm`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon 
                    size={18} 
                    strokeWidth={active ? 2.5 : 2} 
                    className={`${active ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-200'} transition-colors flex-shrink-0`}
                  />
                  {!isCollapsed && (
                    <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.label}
                    </span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span className="rounded-md bg-violet-500/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-violet-300 flex-shrink-0 uppercase">
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
          {/* Plan card (macOS Widget style) */}
          {!isCollapsed && (
            <Link
              href="/dashboard/settings"
              onClick={closeMobileSidebar}
              className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md transition-all duration-300 hover:bg-white/[0.04] hover:border-white/10"
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/20 border border-violet-500/30">
                    <Crown size={16} className="text-violet-400" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{plan === 'pro' ? 'Plan PRO' : 'Plan Gratis'}</p>
                    <p className="flex items-center gap-1.5 text-xs text-neutral-400 mt-0.5">
                      <span className={`h-1.5 w-1.5 rounded-full shadow-[0_0_8px_currentColor] ${plan === 'pro' ? 'bg-emerald-400 text-emerald-400' : 'bg-neutral-500 text-neutral-500'}`} />
                      {plan === 'pro' && planExpiresAt
                        ? `Hasta ${formatDate(planExpiresAt)}`
                        : 'Actualiza a PRO'}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`group flex h-10 w-full items-center text-sm font-medium transition-all duration-200 hover:bg-white/5 ${
              !isCollapsed ? 'gap-3 px-3 rounded-xl' : 'justify-center px-0 rounded-xl'
            }`}
            title={isCollapsed ? 'Cerrar sesión' : undefined}
          >
            <LogOut size={18} strokeWidth={2} className="text-neutral-400 group-hover:text-red-400 transition-colors flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-neutral-400 group-hover:text-red-400 transition-colors duration-200">
                Cerrar sesión
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
