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
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-violet-400/40 bg-gradient-to-br from-violet-500/45 to-slate-900 text-sm font-bold text-white shadow-[0_0_22px_rgba(124,92,255,0.22)] flex-shrink-0">
          {initials}
        </div>
        <div className="flex flex-col">
          <span className="text-[16px] font-semibold leading-5 text-[var(--text-primary)]">{userName}</span>
          <span className="text-[13px] leading-5 text-slate-400">Seguimiento financiero y ventas</span>
        </div>

        {/* Enlaces de acceso rápido con iconos estilizados */}
        <div className="hidden xl:flex items-center gap-2 ml-6 border-l border-white/10 pl-6">
          <Link
            href="/dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[var(--text-secondary)] hover:bg-slate-100 hover:text-[var(--brand-700)] transition-all"
            title="Dashboard"
          >
            <LayoutDashboard size={18} />
          </Link>
          <Link
            href="/dashboard/clients"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[var(--text-secondary)] hover:bg-slate-100 hover:text-[var(--brand-700)] transition-all"
            title="Clientes"
          >
            <Users size={18} />
          </Link>
          <Link
            href="/dashboard/sales"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[var(--text-secondary)] hover:bg-slate-100 hover:text-[var(--brand-700)] transition-all"
            title="Ventas"
          >
            <ShoppingCart size={18} />
          </Link>
          <Link
            href="/dashboard/collections"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--brand-border)] bg-[var(--brand-soft)] text-[var(--brand-600)] hover:bg-[var(--brand-500)] hover:text-white transition-all"
            title="Cobros (Core)"
          >
            <CreditCard size={18} />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[8px] font-bold text-white shadow-sm">C</span>
          </Link>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex h-12 w-[320px] lg:w-[388px] items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition-colors duration-200 focus-within:border-[var(--brand-border)] focus-within:bg-white">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Buscar clientes, ventas, cobros..."
          className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none border-none shadow-none ring-0 focus:outline-none"
        />
        <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-400">
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
            className="inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-700)] pl-6 pr-5 text-sm font-semibold text-white shadow-brand transition-all duration-200 hover:brightness-105 cursor-pointer"
          >
            <Plus size={17} />
            <span>Crear</span>
            <ChevronDown size={14} className={`opacity-80 transition-transform duration-200 ${isQuickMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isQuickMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-2xl backdrop-blur-md z-50">
              <Link
                href="/dashboard/sales/new"
                onClick={() => setIsQuickMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-slate-50 hover:text-[var(--brand-700)] transition-colors"
              >
                <ShoppingCart size={15} className="text-violet-400" />
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
                <CreditCard size={15} className="text-violet-400" />
                <span>Ver Cobros (Core)</span>
              </Link>
            </div>
          )}
        </div>

        <div className="h-11 w-px bg-white/10" />

        {/* Configuración Rápida */}
        <Link
          href="/dashboard/settings"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[var(--text-secondary)] transition-all duration-200 hover:bg-slate-100 hover:text-[var(--brand-700)]"
          title="Configuración"
        >
          <Settings size={17} />
        </Link>

        {/* Notificaciones */}
        <NotificationsDropdown />

        {/* Avatar y Perfil */}
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#5B3DF5] to-[#201B68] text-sm font-bold text-white shadow-[0_0_24px_rgba(91,61,245,0.3)]">
          {initials}
        </div>
      </div>
    </header>
  )
}
