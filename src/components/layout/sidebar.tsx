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
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col justify-between border-r border-slate-200 bg-white py-6 shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          !isCollapsed ? 'px-4' : 'px-3'
        } overflow-hidden`}
      >
        {/* Botón Toggle Flotante */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3.5 top-12 z-50 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-slate-50 hover:text-brand-500 cursor-pointer"
          aria-label={isCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
        >
          {isCollapsed ? <ChevronRight size={14} strokeWidth={2.5} /> : <ChevronLeft size={14} strokeWidth={2.5} />}
        </button>

        <div>
          {/* Logo (Brand Guidelines) */}
          <div className={`mb-8 flex items-center ${!isCollapsed ? 'gap-2 px-2' : 'justify-center'}`}>
            <div className="flex h-9 w-9 items-center justify-center flex-shrink-0">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="#2563FF" strokeWidth="2.5" fill="white"/>
                <path d="M8.5 12L11 14.5L16 9" stroke="#2563FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {!isCollapsed && (
              <span className="font-display text-[17px] font-bold tracking-tight text-[#0F172A] transition-opacity duration-300">
                SEGUIMIENTO <span className="text-[#2563FF]">PRO</span>
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
                  className={`group relative flex h-10 items-center rounded-lg transition-all duration-200 ${
                    !isCollapsed ? 'gap-3 px-3 w-full' : 'justify-center px-0 w-full'
                  } ${
                    active
                      ? 'bg-[#EFF4FF] text-[#2563FF] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  } text-sm`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon 
                    size={18} 
                    strokeWidth={active ? 2.5 : 2} 
                    className={`${active ? 'text-[#2563FF]' : 'text-slate-400 group-hover:text-slate-600'} transition-colors flex-shrink-0`}
                  />
                  {!isCollapsed && (
                    <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.label}
                    </span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span className="rounded-md bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-blue-700 flex-shrink-0 uppercase">
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
          {!isCollapsed && (
            <Link
              href="/dashboard/settings"
              onClick={closeMobileSidebar}
              className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-all duration-300 hover:bg-slate-100"
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 border border-blue-200">
                    <Crown size={16} className="text-[#2563FF]" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{plan === 'pro' ? 'Plan PRO' : 'Plan Gratis'}</p>
                    <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${plan === 'pro' ? 'bg-green-500' : 'bg-slate-400'}`} />
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
            className={`group flex h-10 w-full items-center text-sm font-medium transition-all duration-200 hover:bg-slate-50 ${
              !isCollapsed ? 'gap-3 px-3 rounded-lg' : 'justify-center px-0 rounded-lg'
            }`}
            title={isCollapsed ? 'Cerrar sesión' : undefined}
          >
            <LogOut size={18} strokeWidth={2} className="text-slate-400 group-hover:text-red-500 transition-colors flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-slate-500 group-hover:text-red-600 transition-colors duration-200">
                Cerrar sesión
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
