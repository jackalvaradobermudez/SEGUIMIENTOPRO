import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import { formatCurrency } from '@/lib/utils'
import { ExportDataDropdown } from '@/components/reports/export-data-dropdown'
import { AGING_BUCKETS, SALE_STATUS_BADGE_CLASS, SALE_STATUS_LABEL } from '@/lib/constants'
import { TrendingUp, Users, Package, BarChart3, AlertTriangle } from 'lucide-react'
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
    { label: 'Total vendido', value: formatCurrency(totalSold, business.currency), icon: TrendingUp, color: 'var(--accent)' },
    { label: 'Recaudado', value: formatCurrency(totalCollected, business.currency), icon: TrendingUp, color: 'var(--success)' },
    { label: 'Pendiente', value: formatCurrency(totalPending, business.currency), icon: Users, color: 'var(--warning)' },
    { label: 'Vencido', value: formatCurrency(totalOverdue, business.currency), icon: AlertTriangle, color: 'var(--danger)' },
  ]

  const periodLabel = PERIODS.find((p) => p.value === period)?.label ?? 'Este mes'

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Reportes</h1>
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
      <div className="mb-6 flex flex-wrap gap-1 rounded-[var(--radius-md)] border border-[var(--border)] p-1 w-fit">
        {PERIODS.map((p) => (
          <Link
            key={p.value}
            href={`/dashboard/reports?period=${p.value}`}
            id={`report-period-${p.value}`}
            className={`rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-colors ${
              period === p.value
                ? 'bg-[var(--accent-light)] text-[var(--text-accent)]'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {p.label}
          </Link>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPI_DATA.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div
              key={kpi.label}
              className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <div className="mb-2 flex items-center gap-2">
                <Icon size={16} style={{ color: kpi.color }} />
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {kpi.label}
                </p>
              </div>
              <p className="font-display text-xl font-bold" style={{ color: kpi.color }}>
                {kpi.value}
              </p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Top Clientes */}
        <section aria-labelledby="top-clients-heading">
          <div className="mb-4 flex items-center gap-2">
            <Users size={18} style={{ color: 'var(--accent)' }} />
            <h2 id="top-clients-heading" className="section-title">Top clientes</h2>
          </div>
          {topClients.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin ventas en el período.</p>
          ) : (
            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
              {topClients.map(([clientId, data], i) => {
                const pct = totalSold > 0 ? (data.total / totalSold) * 100 : 0
                return (
                  <div
                    key={clientId}
                    className="flex items-center gap-4 p-4 border-b border-[var(--border)] last:border-0"
                  >
                    <span className="text-lg font-bold text-muted-foreground w-6 text-center">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/dashboard/clients/${clientId}`}
                        className="text-sm font-medium text-[var(--text)] hover:text-[var(--accent)] truncate block"
                      >
                        {data.name}
                      </Link>
                      <div className="mt-1.5 h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: 'var(--accent)' }}
                        />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold">{formatCurrency(data.total, business.currency)}</p>
                      <p className="text-xs text-muted-foreground">{data.count} venta{data.count !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Cartera por edades */}
        <section aria-labelledby="aging-heading">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 size={18} style={{ color: 'var(--accent)' }} />
            <h2 id="aging-heading" className="section-title">Cartera por edades</h2>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            {Object.entries(AGING_BUCKETS).map(([key, bucket]) => {
              const amount = agingBuckets[key] ?? 0
              const pct = totalAging > 0 ? (amount / totalAging) * 100 : 0
              return (
                <div key={key} className="flex items-center gap-4 p-4 border-b border-[var(--border)] last:border-0">
                  <div className="w-24 flex-shrink-0">
                    <span className="text-xs font-medium text-muted-foreground">{bucket.label}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: key === 'current' ? 'var(--success)' : key === '1_30' ? 'var(--warning)' : 'var(--danger)',
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right min-w-[100px]">
                    <p className="text-sm font-bold">{formatCurrency(amount, business.currency)}</p>
                    <p className="text-xs text-muted-foreground">{pct.toFixed(1)}%</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {/* Tabla de ventas del período */}
      <section aria-labelledby="sales-period-heading" className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <Package size={18} style={{ color: 'var(--accent)' }} />
          <h2 id="sales-period-heading" className="section-title">
            Ventas del período ({activeSales.length})
          </h2>
        </div>

        {activeSales.length === 0 ? (
          <div className="empty-placeholder">
            <p>No hay ventas en el período seleccionado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)]">
            <table className="data-table w-full">
              <thead>
                <tr>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">#Venta</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cliente</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Fecha</th>
                  <th className="text-right p-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total</th>
                  <th className="text-right p-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Saldo</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Estado</th>
                </tr>
              </thead>
              <tbody>
                {activeSales.slice(0, 20).map((sale) => (
                  <tr key={sale.id} className="border-t border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors">
                    <td className="p-3 text-sm">
                      <Link href={`/dashboard/sales/${sale.id}`} className="text-[var(--accent)] hover:underline">
                        #{sale.sale_number}
                      </Link>
                    </td>
                    <td className="p-3 text-sm">{clientMap.get(sale.client_id) ?? '—'}</td>
                    <td className="p-3 text-sm text-muted-foreground">{sale.sale_date}</td>
                    <td className="p-3 text-sm text-right font-medium">{formatCurrency(sale.total_amount, business.currency)}</td>
                    <td className="p-3 text-sm text-right font-medium" style={{ color: (sale.balance ?? 0) > 0 ? 'var(--warning)' : 'var(--success)' }}>
                      {formatCurrency(sale.balance ?? 0, business.currency)}
                    </td>
                    <td className="p-3 text-sm">
                      <span className={`${SALE_STATUS_BADGE_CLASS[sale.status as keyof typeof SALE_STATUS_BADGE_CLASS] ?? ''} rounded-full px-2 py-0.5 text-xs font-medium`}>
                        {SALE_STATUS_LABEL[sale.status as keyof typeof SALE_STATUS_LABEL] ?? sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {activeSales.length > 20 && (
                  <tr>
                    <td colSpan={6} className="p-3 text-center text-sm text-muted-foreground">
                      Mostrando 20 de {activeSales.length}. Exporta CSV para ver todos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
