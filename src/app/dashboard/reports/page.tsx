import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { formatCurrency } from '@/lib/utils'
import { ExportDataDropdown } from '@/components/reports/export-data-dropdown'
import { AGING_BUCKETS, SALE_STATUS_BADGE_CLASS, SALE_STATUS_LABEL } from '@/lib/constants'
import { TrendingUp, Users, Package, BarChart3, AlertTriangle } from 'lucide-react'
import { KpiCard } from '@/components/dashboard/kpi-card'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reportes — SeguimientoPro',
}

const PERIODS = [
  { value: 'this_month', label: 'Este mes' },
  { value: 'last_month', label: 'Mes anterior' },
  { value: 'this_quarter', label: 'Este trimestre' },
  { value: 'this_year', label: 'Este año' },
] as const

type Period = typeof PERIODS[number]['value']

function getPeriodRange(period: Period): { start: string; end: string } {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()

  if (period === 'this_month') {
    return {
      start: new Date(y, m, 1).toISOString().split('T')[0],
      end: new Date(y, m + 1, 0).toISOString().split('T')[0],
    }
  }
  if (period === 'last_month') {
    return {
      start: new Date(y, m - 1, 1).toISOString().split('T')[0],
      end: new Date(y, m, 0).toISOString().split('T')[0],
    }
  }
  if (period === 'this_quarter') {
    const q = Math.floor(m / 3)
    return {
      start: new Date(y, q * 3, 1).toISOString().split('T')[0],
      end: new Date(y, q * 3 + 3, 0).toISOString().split('T')[0],
    }
  }
  // this_year
  return {
    start: new Date(y, 0, 1).toISOString().split('T')[0],
    end: new Date(y, 11, 31).toISOString().split('T')[0],
  }
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>
}) {
  const { period: rawPeriod } = await searchParams
  const period: Period =
    rawPeriod && PERIODS.map((p) => p.value as string).includes(rawPeriod)
      ? (rawPeriod as Period)
      : 'this_month'

  const business = await getActiveBusiness()
  const supabase = await createClient()
  const { start, end } = getPeriodRange(period)

  // ── Queries paralelas ─────────────────────────────────────────────────────
  const [
    { data: periodSales },
    { data: agingData },
    { data: allClients },
  ] = await Promise.all([
    supabase
      .from('sales')
      .select('id, sale_number, sale_date, due_date, sale_type, total_amount, paid_amount, balance, status, client_id')
      .eq('business_id', business.id)
      .gte('sale_date', start)
      .lte('sale_date', end)
      .is('deleted_at', null)
      .order('sale_date', { ascending: false }),
    supabase
      .from('v_aging_report')
      .select('*')
      .eq('business_id', business.id),
    supabase
      .from('clients')
      .select('id, name')
      .eq('business_id', business.id)
      .is('deleted_at', null),
  ])

  // Mapa de clientes
  const clientMap = new Map((allClients ?? []).map((c) => [c.id, c.name]))

  // ── KPIs del período ──────────────────────────────────────────────────────
  const activeSales = (periodSales ?? []).filter((s) => s.status !== 'cancelled')
  const totalSold = activeSales.reduce((acc, s) => acc + s.total_amount, 0)
  const totalCollected = activeSales.reduce((acc, s) => acc + s.paid_amount, 0)
  const totalPending = activeSales.reduce((acc, s) => acc + (s.balance ?? 0), 0)
  const totalOverdue = activeSales
    .filter((s) => s.status === 'overdue')
    .reduce((acc, s) => acc + (s.balance ?? 0), 0)

  // ── Top clientes del período ──────────────────────────────────────────────
  const clientTotals = new Map<string, { name: string; total: number; count: number }>()
  for (const sale of activeSales) {
    const existing = clientTotals.get(sale.client_id)
    const name = clientMap.get(sale.client_id) ?? 'Desconocido'
    if (existing) {
      existing.total += sale.total_amount
      existing.count++
    } else {
      clientTotals.set(sale.client_id, { name, total: sale.total_amount, count: 1 })
    }
  }
  const topClients = [...clientTotals.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5)

  // ── Cartera por aging bucket ──────────────────────────────────────────────
  const agingBuckets: Record<string, number> = {
    current: 0, '1_30': 0, '31_60': 0, '61_90': 0, '90_plus': 0,
  }
  for (const row of agingData ?? []) {
    const bucket = String(row.aging_bucket ?? 'current')
    if (bucket in agingBuckets) {
      agingBuckets[bucket] += Number(row.balance ?? 0)
    }
  }
  const totalAging = Object.values(agingBuckets).reduce((a, b) => a + b, 0)

  // ── Datos para CSV ────────────────────────────────────────────────────────
  const csvData = activeSales.map((s) => ({
    sale_number: s.sale_number,
    sale_date: s.sale_date,
    client_name: clientMap.get(s.client_id) ?? '—',
    sale_type: s.sale_type,
    total_amount: s.total_amount,
    paid_amount: s.paid_amount,
    balance: s.balance ?? 0,
    status: s.status,
    due_date: s.due_date,
  }))

  const KPI_DATA = [
    { label: 'Total vendido', value: formatCurrency(totalSold, business.currency), icon: TrendingUp, iconBg: 'bg-[var(--brand-500)]' },
    { label: 'Recaudado', value: formatCurrency(totalCollected, business.currency), icon: TrendingUp, iconBg: 'bg-[var(--success-500)]' },
    { label: 'Pendiente', value: formatCurrency(totalPending, business.currency), icon: Users, iconBg: 'bg-[var(--warning-500)]' },
    { label: 'Vencido', value: formatCurrency(totalOverdue, business.currency), icon: AlertTriangle, iconBg: 'bg-[var(--danger-500)]' },
  ]

  const periodLabel = PERIODS.find((p) => p.value === period)?.label ?? 'Este mes'

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title text-[32px] font-bold tracking-tight">Reportes</h1>
          <p className="page-subtitle">Análisis de ventas y cartera — {periodLabel}</p>
        </div>
        <ExportDataDropdown
          id="reports-export-data"
          data={csvData}
          currency={business.currency}
          filename={`reporte-${period}`}
        />
      </div>

      {/* Filtros de período */}
      <div className="mb-8 flex flex-wrap gap-1 rounded-2xl border border-[var(--border-subtle)] bg-slate-50 p-1 w-fit">
        {PERIODS.map((p) => (
          <Link
            key={p.value}
            href={`/dashboard/reports?period=${p.value}`}
            id={`report-period-${p.value}`}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              period === p.value
                ? 'bg-[var(--brand-500)] text-white shadow-sm'
                : 'text-[var(--text-primary)] hover:text-[var(--brand-700)] hover:bg-white'
            }`}
          >
            {p.label}
          </Link>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="sp-kpi-grid">
        {KPI_DATA.map((kpi, idx) => {
          const Icon = kpi.icon
          const deltaColor = idx === 1 ? 'text-[var(--success-500)]' : idx === 2 ? 'text-[var(--warning-500)]' : 'text-[var(--danger-500)]'
          return (
            <KpiCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              icon={<Icon size={16} />}
              iconBg={kpi.iconBg}
              deltaClassName={deltaColor}
            />
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Top Clientes */}
        <section aria-labelledby="top-clients-heading">
          <div className="mb-4 flex items-center gap-2">
            <Users size={18} className="text-[var(--brand-700)]" />
            <h2 id="top-clients-heading" className="text-lg font-bold text-[var(--brand-700)] tracking-tight">Top clientes</h2>
          </div>
          {topClients.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">Sin ventas en el período.</p>
          ) : (
            <div className="sp-card">
              <div className="sp-card-content p-6">
                <div className="space-y-3">
                  {topClients.map(([clientId, data], i) => {
                    const pct = totalSold > 0 ? (data.total / totalSold) * 100 : 0
                    return (
                      <div
                        key={clientId}
                        className="flex items-center gap-5 p-4 px-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-150"
                      >
                        <span className="text-[15px] font-bold text-[var(--text-primary)] w-6 text-center">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/dashboard/clients/${clientId}`}
                            className="text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--brand-600)] transition-colors truncate block"
                          >
                            {data.name}
                          </Link>
                          <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500 bg-[var(--brand-500)]"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-[var(--text-primary)] tabular-nums">{formatCurrency(data.total, business.currency)}</p>
                          <p className="text-xs text-[var(--text-primary)] mt-0.5">{data.count} venta{data.count !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Cartera por edades */}
        <section aria-labelledby="aging-heading">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-[var(--brand-700)]" />
            <h2 id="aging-heading" className="text-lg font-bold text-[var(--brand-700)] tracking-tight">Cartera por edades</h2>
          </div>
          <div className="sp-card">
            <div className="sp-card-content p-6">
              <div className="space-y-3">
                {Object.entries(AGING_BUCKETS).map(([key, bucket]) => {
                  const amount = agingBuckets[key] ?? 0
                  const pct = totalAging > 0 ? (amount / totalAging) * 100 : 0
                  const statusColor = key === 'current' ? 'var(--success-500)' : key === '1_30' ? 'var(--warning-500)' : 'var(--danger-500)'
                  return (
                    <div key={key} className="flex items-center gap-5 p-4 px-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-150">
                      <div className="w-24 flex-shrink-0">
                        <span className="text-xs font-bold" style={{ color: statusColor }}>{bucket.label}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: statusColor }}
                          />
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right min-w-[100px]">
                        <p className="text-sm font-bold text-[var(--text-primary)] tabular-nums">{formatCurrency(amount, business.currency)}</p>
                        <p className="text-xs font-bold mt-0.5 tabular-nums" style={{ color: statusColor }}>{pct.toFixed(1)}%</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Tabla de ventas del período */}
      <section aria-labelledby="sales-period-heading" className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <Package size={18} className="text-[var(--brand-700)]" />
          <h2 id="sales-period-heading" className="text-lg font-bold text-[var(--brand-700)] tracking-tight">
            Ventas del período ({activeSales.length})
          </h2>
        </div>

        {activeSales.length === 0 ? (
          <div className="empty-placeholder">
            <p>No hay ventas en el período seleccionado.</p>
          </div>
        ) : (
          <div className="sp-card">
            <div className="sp-card-content !p-0 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-primary)]">#Venta</th>
                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-primary)]">Cliente</th>
                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-primary)]">Fecha</th>
                    <th className="text-right px-5 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-primary)]">Total</th>
                    <th className="text-right px-5 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-primary)]">Saldo</th>
                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-primary)]">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {activeSales.slice(0, 20).map((sale) => (
                    <tr key={sale.id} className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors duration-150">
                      <td className="px-5 py-4 text-sm font-semibold">
                        <Link href={`/dashboard/sales/${sale.id}`} className="text-[var(--brand-600)] hover:underline">
                          #{sale.sale_number}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-sm text-[var(--text-primary)]">{clientMap.get(sale.client_id) ?? '—'}</td>
                      <td className="px-5 py-4 text-sm text-[var(--text-primary)] tabular-nums">{sale.sale_date}</td>
                      <td className="px-5 py-4 text-sm text-right font-semibold text-[var(--text-primary)] tabular-nums">{formatCurrency(sale.total_amount, business.currency)}</td>
                      <td className="px-5 py-4 text-sm text-right font-semibold tabular-nums" style={{ color: (sale.balance ?? 0) > 0 ? 'var(--warning-500)' : 'var(--success-500)' }}>
                        {formatCurrency(sale.balance ?? 0, business.currency)}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        <span className={`${SALE_STATUS_BADGE_CLASS[sale.status as keyof typeof SALE_STATUS_BADGE_CLASS] ?? ''} rounded-full px-2.5 py-0.5 text-xs font-semibold`}>
                          {SALE_STATUS_LABEL[sale.status as keyof typeof SALE_STATUS_LABEL] ?? sale.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {activeSales.length > 20 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-4 text-center text-sm text-[var(--text-primary)] bg-slate-50/50">
                        Mostrando 20 de {activeSales.length}. Exporta CSV para ver todos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
