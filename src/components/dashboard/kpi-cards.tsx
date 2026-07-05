import Link from 'next/link'
import { ArrowUpRight, Clock, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export type KpiData = {
  pendingBalance: number
  clientsWithDebt: number
  overdueBalance: number
  monthTotal: number
  monthSalesCount: number
  monthCollected: number
  prevMonthTotal: number
  prevMonthCollected: number
  overduePercentage: number
  avgCollectionDays: number
}

export function KpiCards({ data, currency }: { data: KpiData; currency: string }) {
  const salesDelta = data.prevMonthTotal > 0
    ? Math.round(((data.monthTotal - data.prevMonthTotal) / data.prevMonthTotal) * 100)
    : null
  const collectedDelta = data.prevMonthCollected > 0
    ? Math.round(((data.monthCollected - data.prevMonthCollected) / data.prevMonthCollected) * 100)
    : null

  const kpis = [
    {
      id: 'kpi-pending',
      label: 'Cartera pendiente',
      value: formatCurrency(data.pendingBalance, currency),
      icon: Clock,
      iconColor: 'var(--warning)',
      iconBg: 'var(--warning-bg)',
      href: '/dashboard/collections',
      description: (
        <>
          {data.clientsWithDebt} clientes con deuda · {data.overduePercentage}% vencida
        </>
      ),
    },
    {
      id: 'kpi-overdue',
      label: 'Cartera vencida',
      value: formatCurrency(data.overdueBalance, currency),
      icon: AlertTriangle,
      iconColor: 'var(--danger)',
      iconBg: 'var(--danger-bg)',
      href: '/dashboard/collections/aging',
      description: `Cobro promedio: ${data.avgCollectionDays} días`,
    },
    {
      id: 'kpi-month-sales',
      label: 'Ventas del mes',
      value: formatCurrency(data.monthTotal, currency),
      icon: ArrowUpRight,
      iconColor: 'var(--accent)',
      iconBg: 'var(--accent-light)',
      href: '/dashboard/sales',
      description: (
        <span className="inline-flex items-center gap-1">
          {data.monthSalesCount} transacciones
          {salesDelta !== null && salesDelta !== 0 && (
            <span className={salesDelta >= 0 ? 'text-green-400' : 'text-red-400'}>
              {salesDelta >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(salesDelta)}% vs mes anterior
            </span>
          )}
        </span>
      ),
    },
    {
      id: 'kpi-month-collected',
      label: 'Recaudado el mes',
      value: formatCurrency(data.monthCollected, currency),
      icon: CheckCircle2,
      iconColor: 'var(--success)',
      iconBg: 'var(--success-bg)',
      href: '/dashboard/collections',
      description: (
        <span className="inline-flex items-center gap-1">
          Pagos recibidos este mes
          {collectedDelta !== null && collectedDelta !== 0 && (
            <span className={collectedDelta >= 0 ? 'text-green-400' : 'text-red-400'}>
              {collectedDelta >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(collectedDelta)}% vs mes anterior
            </span>
          )}
        </span>
      ),
    },
  ]

  return (
    <div className="sp-kpi-grid">
      {kpis.map((kpi, i) => {
        const Icon = kpi.icon
        return (
          <Link
            key={kpi.id}
            href={kpi.href}
            id={kpi.id}
            className={`sp-kpi-card group animate-fade-in delay-${(i + 1) * 50}`}
            aria-label={`${kpi.label}: ${kpi.value}`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-[13px] font-semibold text-[var(--text-secondary)]">{kpi.label}</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.03] text-slate-400 group-hover:text-white transition-colors">
                <Icon size={16} strokeWidth={2} />
              </div>
            </div>
            <div className="text-[28px] lg:text-[30px] leading-none font-bold tracking-tight text-white tabular-nums">{kpi.value}</div>
            <div className="text-[12px] leading-4 text-[var(--text-muted)] flex items-center gap-1.5">{kpi.description}</div>
            <div className="absolute bottom-5 right-5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight size={14} />
            </div>
          </Link>
        )
      })}
    </div>
  )
}
