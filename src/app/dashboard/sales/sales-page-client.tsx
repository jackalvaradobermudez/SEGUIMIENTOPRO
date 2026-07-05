'use client'

import { useState } from 'react'
import {
  BarChart3,
  ChevronDown,
  CreditCard,
  Download,
  Clock,
  CircleAlert,
} from 'lucide-react'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { FilterPills } from '@/components/dashboard/filter-pills'
import { FilterControls } from '@/components/dashboard/filter-controls'
import { SalesTableRow } from '@/components/dashboard/sales-table-row'
import { RecentActivityCard, UpcomingPaymentsCard } from '@/components/dashboard/activity-cards'
import { Pagination } from '@/components/dashboard/pagination'
import type { BadgeVariant } from '@/components/dashboard/stat-badge'

const STATUS_FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'pending', label: 'Pendientes', count: 12, countClass: 'bg-cyan-500/20 text-cyan-300' },
  { key: 'overdue', label: 'Vencidas', count: 8, countClass: 'bg-amber-500/20 text-amber-300' },
  { key: 'paid', label: 'Pagadas', count: 24, countClass: 'bg-emerald-500/20 text-emerald-300' },
]

const DEMO_SALES: Array<{
  id: string
  client: { name: string; email: string; initials: string; avatarColor: string }
  date: string
  total: number
  paid: number
  balance: number
  status: BadgeVariant
}> = [
  { id:'VTA-0001', client:{name:'Jack Prueba Ejemplo',email:'jack@ejemplo.com',initials:'JP',avatarColor:'bg-violet-500'}, date:'04 Jul 2026', total:20000, paid:0, balance:20000, status:'pending' },
  { id:'VTA-0002', client:{name:'Jack Prueba Ejemplo',email:'jack@ejemplo.com',initials:'JP',avatarColor:'bg-violet-500'}, date:'04 Jul 2026', total:20000, paid:0, balance:20000, status:'pending' },
  { id:'VTA-0003', client:{name:'Ana María López',email:'ana.lopez@mail.com',initials:'AM',avatarColor:'bg-emerald-500'}, date:'02 Jul 2026', total:120000, paid:120000, balance:0, status:'paid' },
  { id:'VTA-0004', client:{name:'Carlos Ramírez',email:'carlos.ramirez@mail.com',initials:'CR',avatarColor:'bg-violet-600'}, date:'30 Jun 2026', total:85000, paid:40000, balance:45000, status:'pending' },
  { id:'VTA-0005', client:{name:'María Delgado',email:'maria.delgado@mail.com',initials:'MD',avatarColor:'bg-orange-500'}, date:'28 Jun 2026', total:60000, paid:0, balance:60000, status:'overdue' },
]

export default function SalesPageClient() {
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = status === 'all' ? DEMO_SALES : DEMO_SALES.filter(s => s.status === status)

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-6 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-[31px] font-semibold leading-none tracking-normal text-white">Ventas</h1>
          <p className="mt-2 text-[16px] leading-6 text-slate-400">Gestiona y consulta el historial de ventas de tu negocio.</p>
        </div>
        <button className="inline-flex h-11 items-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-all hover:border-white/20 hover:bg-white/[0.06]">
          <span className="inline-flex h-full items-center gap-2 px-4">
            <Download size={16} className="text-slate-300" />
            Exportar
          </span>
          <span className="inline-flex h-full w-10 items-center justify-center border-l border-white/10">
            <ChevronDown size={15} className="text-slate-400" />
          </span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-4">
        <KpiCard
          label="Total vendido este mes"
          value="$ 12.480.000"
          deltaText="18.6%"
          icon={<BarChart3 size={22} className="text-violet-200" />}
          iconBg="bg-violet-500/25 shadow-[0_0_32px_rgba(124,92,255,0.28)]"
          sparklineColor="#7C5CFF"
        />
        <KpiCard
          label="Total cobrado este mes"
          value="$ 9.230.000"
          deltaText="22.4%"
          icon={<CreditCard size={22} className="text-cyan-200" />}
          iconBg="bg-cyan-500/20 shadow-[0_0_32px_rgba(38,198,255,0.22)]"
          sparklineColor="#26C6FF"
        />
        <KpiCard
          label="Saldo pendiente"
          value="$ 3.250.000"
          deltaText="8.7%"
          deltaClassName="text-amber-400"
          icon={<Clock size={22} className="text-amber-200" />}
          iconBg="bg-amber-500/25 shadow-[0_0_32px_rgba(244,178,77,0.24)]"
          sparklineColor="#F4B24D"
        />
        <KpiCard
          label="Facturas vencidas"
          value="8"
          subtitle="$ 1.250.000"
          subtitleClassName="text-rose-400"
          icon={<CircleAlert size={22} className="text-rose-200" />}
          iconBg="bg-rose-500/25 shadow-[0_0_32px_rgba(240,93,108,0.22)]"
          sparklineColor="#F05D6C"
        />
      </div>

      {/* Filters */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
        <FilterPills options={STATUS_FILTERS} active={status} onChange={setStatus} />
        <FilterControls period="Este mes" />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-1)] shadow-surface">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white/[0.01]">
              {['Venta','Cliente','Fecha','Total','Pagado','Saldo','Estado','Acciones'].map(h => {
                const isRight = ['Total', 'Pagado', 'Saldo'].includes(h)
                return (
                  <th key={h} className={`px-5 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)] ${isRight ? 'text-right' : 'text-left'}`}>{h}</th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {filtered.map(sale => <SalesTableRow key={sale.id} sale={sale} />)}
          </tbody>
        </table>
        <div className="border-t border-white/[0.06] bg-white/[0.01]">
          <Pagination current={page} total={44} pageSize={5} onChange={setPage} />
        </div>
      </div>

      {/* Bottom cards */}
      <div className="mt-6 grid grid-cols-2 gap-5">
        <RecentActivityCard />
        <UpcomingPaymentsCard />
      </div>
    </div>
  )
}
