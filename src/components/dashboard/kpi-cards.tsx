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
    <div className="kpi-grid">
      {kpis.map((kpi, i) => {
        const Icon = kpi.icon
        return (
          <Link
            key={kpi.id}
            href={kpi.href}
            id={kpi.id}
            className={`kpi-card animate-fade-in delay-${(i + 1) * 50}`}
            aria-label={`${kpi.label}: ${kpi.value}`}
          >
            <div className="kpi-top">
              <span className="kpi-label">{kpi.label}</span>
              <div className="kpi-icon-wrapper" style={{ background: kpi.iconBg }}>
                <Icon size={18} color={kpi.iconColor} strokeWidth={2} />
              </div>
            </div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-description">{kpi.description}</div>
            <div className="kpi-arrow">
              <ArrowUpRight size={14} />
            </div>
          </Link>
        )
      })}
    </div>
  )
}
