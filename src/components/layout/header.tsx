'use client'

import { ChevronDown, Plus, Search, Settings, ShoppingCart, Users, CreditCard, LayoutDashboard, Menu } from 'lucide-react'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { NotificationsDropdown } from '@/components/layout/notifications-dropdown'
import { useSidebar } from '@/components/layout/sidebar-provider'

interface HeaderProps {
  user: User | null
}

export default function Header({ user }: HeaderProps) {
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false)
  const quickMenuRef = useRef<HTMLDivElement>(null)
  const { toggleMobileSidebar } = useSidebar()

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'SP'

  const userName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Usuario'

  // Cerrar menú interactivo al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (quickMenuRef.current && !quickMenuRef.current.contains(event.target as Node)) {
        setIsQuickMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="dashboard-header flex h-[88px] items-center justify-between px-9">
      {/* Left: Menú móvil + Avatar + Name + Enlaces Rápidos (Iconos) */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMobileSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[var(--text-secondary)] hover:bg-slate-100 md:hidden"
          aria-label="Abrir menú"
        >
          <Menu size={18} />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 shadow-sm flex-shrink-0">
          {initials}
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-semibold leading-5 text-slate-900 tracking-tight">{userName}</span>
          <span className="text-xs leading-5 text-slate-500">Seguimiento financiero y ventas</span>
        </div>

        {/* Enlaces de acceso rápido con iconos estilizados */}
        <div className="hidden xl:flex items-center gap-1 ml-6 pl-6 relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-px before:bg-slate-200">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all"
            title="Dashboard"
          >
            <LayoutDashboard size={18} />
          </Link>
          <Link
            href="/dashboard/clients"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all"
            title="Clientes"
          >
            <Users size={18} />
          </Link>
          <Link
            href="/dashboard/sales"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all"
            title="Ventas"
          >
            <ShoppingCart size={18} />
          </Link>
          <Link
            href="/dashboard/collections"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[var(--brand-600)] transition-all"
            title="Cobros (Core)"
          >
            <CreditCard size={18} />
          </Link>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex h-10 w-[320px] lg:w-[360px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 transition-all duration-200 focus-within:border-[var(--brand-500)] focus-within:bg-white focus-within:ring-4 focus-within:ring-[var(--brand-500)]/10 shadow-sm">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          placeholder="Buscar clientes, ventas, cobros..."
          className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none border-none shadow-none ring-0 focus:outline-none"
        />
        <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 shadow-sm">
          <span>⌘</span>
          <span>K</span>
        </div>
      </div>

      {/* Right: CTA Creación Rápida + Configuración + Notificaciones + Avatar */}
      <div className="flex items-center gap-4">
        {/* Menú de Creación Rápida */}
        <div className="relative" ref={quickMenuRef}>
          <button
            onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--brand-500)] px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-[var(--brand-600)] cursor-pointer"
          >
            <Plus size={16} />
            <span>Crear</span>
            <ChevronDown size={14} className={`opacity-70 transition-transform duration-200 ${isQuickMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isQuickMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-2xl backdrop-blur-md z-50">
              <Link
                href="/dashboard/sales/new"
                onClick={() => setIsQuickMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-slate-50 hover:text-[var(--brand-700)] transition-colors"
              >
                <ShoppingCart size={15} className="text-[#2563FF]" />
                <span>Nueva venta</span>
              </Link>
              <Link
                href="/dashboard/clients/new"
                onClick={() => setIsQuickMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-slate-50 hover:text-[var(--brand-700)] transition-colors"
              >
                <Users size={15} className="text-emerald-400" />
                <span>Nuevo cliente</span>
              </Link>
              <Link
                href="/dashboard/products/new"
                onClick={() => setIsQuickMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-slate-50 hover:text-[var(--brand-700)] transition-colors"
              >
                <Plus size={15} className="text-sky-400" />
                <span>Nuevo producto</span>
              </Link>
              <div className="my-1 border-t border-slate-100" />
              <Link
                href="/dashboard/collections"
                onClick={() => setIsQuickMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-slate-50 hover:text-[var(--brand-700)] transition-colors"
              >
                <CreditCard size={15} className="text-[#2563FF]" />
                <span>Ver Cobros (Core)</span>
              </Link>
            </div>
          )}
        </div>

        <div className="h-11 w-px bg-white/10" />

        {/* Configuración Rápida */}
        <Link
          href="/dashboard/settings"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
          title="Configuración"
        >
          <Settings size={18} />
        </Link>

        {/* Notificaciones */}
        <NotificationsDropdown />

        {/* Avatar y Perfil */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 border border-slate-200/60 text-[11px] font-bold tracking-wider text-slate-600 shadow-sm ml-1">
          {initials}
        </div>
      </div>
    </header>
  )
}
