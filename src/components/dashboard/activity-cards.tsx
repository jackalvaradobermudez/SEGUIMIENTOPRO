import { CalendarDays, DollarSign, ShoppingCart } from 'lucide-react'

function formatAmount(n: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n)
}

export function RecentActivityCard() {
  return (
    <div className="sp-card">
      <div className="sp-card-header flex flex-row items-center justify-between !pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 shadow-[0_0_20px_rgba(124,92,255,0.1)]">
            <ShoppingCart size={18} className="text-violet-300" />
          </div>
          <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">Actividad reciente</h3>
        </div>
        <button className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-slate-100 cursor-pointer">
          Ver todas
        </button>
      </div>
      <div className="sp-card-content flex flex-col !pt-2">
        <div className="flex items-center gap-4 border-b border-slate-100 py-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
            <DollarSign size={16} className="text-emerald-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Pago recibido de Ana María López</p>
            <p className="text-[13px] text-slate-400 mt-0.5">VTA-0003 · 02 Jul 2026</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-emerald-400 tabular-nums">{formatAmount(120000)}</p>
            <p className="text-[12px] text-slate-500 mt-0.5">Hoy, 10:24 AM</p>
          </div>
        </div>
        <div className="flex items-center gap-4 py-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/20">
            <ShoppingCart size={16} className="text-blue-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Venta creada para Carlos Ramírez</p>
            <p className="text-[13px] text-slate-400 mt-0.5">VTA-0004 · 30 Jun 2026</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-[var(--text-primary)] tabular-nums">{formatAmount(85000)}</p>
            <p className="text-[12px] text-slate-500 mt-0.5">Ayer, 04:18 PM</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function UpcomingPaymentsCard() {
  return (
    <div className="sp-card">
      <div className="sp-card-header flex flex-row items-center justify-between !pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 shadow-[0_0_20px_rgba(38,198,255,0.1)]">
            <CalendarDays size={18} className="text-cyan-300" />
          </div>
          <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">Próximos cobros</h3>
        </div>
        <button className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-slate-100 cursor-pointer">
          Ver calendario
        </button>
      </div>
      <div className="sp-card-content flex flex-col !pt-2">
        {[
          { month: 'JUL', day: '08', client: 'Jack Prueba Ejemplo', ref: 'VTA-0001', amount: 20000, days: 'En 4 días' },
          { month: 'JUL', day: '10', client: 'María Delgado', ref: 'VTA-0005', amount: 60000, days: 'En 6 días' },
        ].map((item, index) => (
          <div key={item.ref} className={`flex items-center gap-4 py-3.5 ${index === 0 ? 'border-b border-slate-100' : ''}`}>
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-lg font-bold leading-5 text-[var(--text-primary)] tabular-nums">{item.day}</span>
              <span className="text-[10px] font-semibold uppercase text-slate-400 mt-0.5">{item.month}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)]">{item.client}</p>
              <p className="text-[13px] text-slate-400 mt-0.5">{item.ref}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-amber-400 tabular-nums">{formatAmount(item.amount)}</p>
              <p className="text-[12px] text-slate-500 mt-0.5">{item.days}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
