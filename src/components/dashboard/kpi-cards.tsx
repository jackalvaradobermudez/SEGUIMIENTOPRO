import Link from 'next/link'
import { ArrowUpRight, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export type KpiData = {
  pendingBalance: number
  clientsWithDebt: number
  overdueBalance: number
  monthTotal: number
  monthSalesCount: number
  monthCollected: number
}

export function KpiCards({ data, currency }: { data: KpiData; currency: string }) {
  const kpis = [
    {
      id: 'kpi-pending',
      label: 'Cartera pendiente',
      value: formatCurrency(data.pendingBalance, currency),
      icon: Clock,
      iconColor: 'var(--warning)',
      iconBg: 'var(--warning-bg)',
      href: '/dashboard/collections',
      description: `${data.clientsWithDebt} clientes con deuda`,
    },
    {
      id: 'kpi-overdue',
      label: 'Cartera vencida',
      value: formatCurrency(data.overdueBalance, currency),
      icon: AlertTriangle,
      iconColor: 'var(--danger)',
      iconBg: 'var(--danger-bg)',
      href: '/dashboard/collections/aging',
      description: 'Requiere gestión inmediata',
    },
    {
      id: 'kpi-month-sales',
      label: 'Ventas del mes',
      value: formatCurrency(data.monthTotal, currency),
      icon: ArrowUpRight,
      iconColor: 'var(--accent)',
      iconBg: 'var(--accent-light)',
      href: '/dashboard/sales',
      description: `${data.monthSalesCount} transacciones`,
    },
    {
      id: 'kpi-month-collected',
      label: 'Recaudado el mes',
      value: formatCurrency(data.monthCollected, currency),
      icon: CheckCircle2,
      iconColor: 'var(--success)',
      iconBg: 'var(--success-bg)',
      href: '/dashboard/collections',
      description: 'Pagos recibidos este mes',
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
