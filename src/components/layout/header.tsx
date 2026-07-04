import { createClient } from '@/lib/supabase/server'
import { Bell, ChevronDown, Plus, Search } from 'lucide-react'
import Link from 'next/link'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: business } = user
    ? await supabase
        .from('businesses')
        .select('name, currency')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .single()
    : { data: null }

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'SP'

  const userName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Usuario'

  return (
    <header className="flex h-[88px] items-center justify-between border-b border-white/10 px-8">
      {/* Left: Avatar + Name + Currency */}
      <div className="flex items-center gap-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-violet-500/30 to-violet-500/10 text-sm font-bold text-white">
          {initials}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">{userName}</span>
          <span className="text-xs text-slate-400">Seguimiento financiero y ventas</span>
        </div>
        {business?.currency && (
          <div className="flex h-10 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-slate-300">
            {business.currency}
            <ChevronDown size={14} className="text-slate-400" />
          </div>
        )}
      </div>

      {/* Center: Search */}
      <div className="flex h-12 w-[420px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-4">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Buscar clientes, ventas, cobros..."
          className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 outline-none border-none! shadow-none! ring-0!"
        />
        <div className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[11px] text-slate-400">
          <span>⌘</span>
          <span>K</span>
        </div>
      </div>

      {/* Right: CTA + Notifications + Avatar */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/sales/new"
          className="inline-flex h-12 items-center gap-3 rounded-2xl bg-gradient-to-r from-[#7C5CFF] to-[#5B3DF5] px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(124,92,255,0.35)] transition-all duration-200 hover:shadow-[0_15px_40px_rgba(124,92,255,0.45)] hover:translate-y-[-1px]"
        >
          <Plus size={16} />
          Nueva venta
          <ChevronDown size={14} className="opacity-70" />
        </Link>

        <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-300 transition-all duration-200 hover:bg-white/[0.06] hover:text-white">
          <Bell size={18} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">3</span>
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-xs font-bold text-slate-300">
          {initials}
        </div>
      </div>
    </header>
  )
}
