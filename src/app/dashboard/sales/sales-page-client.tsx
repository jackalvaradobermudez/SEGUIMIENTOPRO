'use client'

import { useState } from 'react'
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
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
      <div className="mb-7">
        <h1 className="text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] text-white">Ventas</h1>
        <p className="mt-1 text-[18px] text-slate-400">Gestiona y consulta el historial de ventas de tu negocio.</p>
      </div>

      {/* KPI Cards */}
      <div className="mb-7 grid grid-cols-4 gap-5">
        <KpiCard
          label="Total vendido este mes"
          value="$ 12.480.000"
          deltaText="+18.2%"
          icon={<TrendingUp size={20} className="text-violet-300" />}
          iconBg="bg-violet-500/20 shadow-[0_0_30px_rgba(124,92,255,0.25)]"
          sparklineColor="#7C5CFF"
        />
        <KpiCard
          label="Total cobrado este mes"
          value="$ 9.230.000"
          deltaText="+12.5%"
          icon={<CheckCircle2 size={20} className="text-emerald-300" />}
          iconBg="bg-emerald-500/20 shadow-[0_0_30px_rgba(53,208,127,0.25)]"
          sparklineColor="#35D07F"
        />
        <KpiCard
          label="Saldo pendiente"
          value="$ 3.250.000"
          subtitle="32% de la cartera"
          icon={<Clock size={20} className="text-amber-300" />}
          iconBg="bg-amber-500/20 shadow-[0_0_30px_rgba(244,178,77,0.25)]"
          sparklineColor="#F4B24D"
        />
        <KpiCard
          label="Facturas vencidas"
          value="8 facturas"
          subtitle="$ 1.250.000"
          icon={<AlertTriangle size={20} className="text-rose-300" />}
          iconBg="bg-rose-500/20 shadow-[0_0_30px_rgba(240,93,108,0.25)]"
          sparklineColor="#F05D6C"
        />
      </div>

      {/* Filters */}
      <div className="mb-5 flex items-center justify-between">
        <FilterPills options={STATUS_FILTERS} active={status} onChange={setStatus} />
        <FilterControls period="Este mes" />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#121B2B]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Venta','Cliente','Fecha','Total','Pagado','Saldo','Estado','Acciones'].map(h => (
                <th key={h} className="px-6 py-4 text-left text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(sale => <SalesTableRow key={sale.id} sale={sale} />)}
          </tbody>
        </table>
        <div className="border-t border-white/[0.06]">
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
