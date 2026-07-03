import Link from 'next/link'
import { Plus, ShoppingCart } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getActiveBusiness } from '@/lib/supabase/get-business'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn, formatCurrency, formatDate, getStatusLabel } from '@/lib/utils'
import { SALE_STATUS_BADGE_CLASS } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ventas — SeguimientoPro',
}

const STATUS_FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'overdue', label: 'Vencidas' },
  { value: 'paid', label: 'Pagadas' },
] as const

const PERIOD_FILTERS = [
  { value: 'all', label: 'Todo el tiempo' },
  { value: 'this_month', label: 'Este mes' },
  { value: 'last_month', label: 'Último mes' },
] as const

export default async function SalesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; period?: string }>
}) {
  const { status = 'all', period = 'all' } = await searchParams
  const business = await getActiveBusiness()
  const supabase = await createClient()

  let query = supabase
    .from('sales')
    .select('id, sale_number, sale_date, total_amount, paid_amount, balance, status, client_id')
    .eq('business_id', business.id)
    .is('deleted_at', null)
    .order('sale_date', { ascending: false })

  if (status === 'pending') query = query.in('status', ['pending', 'partial'])
  else if (status === 'overdue') query = query.eq('status', 'overdue')
  else if (status === 'paid') query = query.eq('status', 'paid')

  const now = new Date()
  if (period === 'this_month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    query = query.gte('sale_date', start)
  } else if (period === 'last_month') {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0]
    const end = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    query = query.gte('sale_date', start).lt('sale_date', end)
  }

  const { data: sales } = await query

  const clientIds = Array.from(new Set((sales ?? []).map((s) => s.client_id)))
  const { data: clients } = clientIds.length
    ? await supabase.from('clients').select('id, name').in('id', clientIds)
    : { data: [] }
  const clientNameById = new Map((clients ?? []).map((c) => [c.id, c.name]))

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Ventas</h1>
          <p className="page-subtitle">Historial de ventas de tu negocio</p>
        </div>

        <Link href="/dashboard/sales/new" id="new-sale-button" className="quick-link">
          <Plus size={16} />
          Nueva venta
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex gap-1 rounded-[var(--radius-md)] border border-[var(--border)] p-1">
          {STATUS_FILTERS.map((filter) => (
            <Link
              key={filter.value}
              href={`/dashboard/sales?status=${filter.value}&period=${period}`}
              id={`sales-filter-${filter.value}`}
              className={cn(
                'rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-colors',
                status === filter.value ? 'bg-[var(--accent-light)] text-[var(--text-accent)]' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {filter.label}
            </Link>
          ))}
        </div>

        <div className="flex gap-1 rounded-[var(--radius-md)] border border-[var(--border)] p-1">
          {PERIOD_FILTERS.map((filter) => (
            <Link
              key={filter.value}
              href={`/dashboard/sales?status=${status}&period=${filter.value}`}
              id={`sales-period-${filter.value}`}
              className={cn(
                'rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-colors',
                period === filter.value ? 'bg-[var(--accent-light)] text-[var(--text-accent)]' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </div>

      {!sales || sales.length === 0 ? (
        <div className="empty-placeholder">
          <ShoppingCart size={32} color="var(--text-subtle)" />
          <p>No hay ventas registradas con este filtro.</p>
          <Link href="/dashboard/sales/new" id="sales-empty-cta" className="placeholder-cta">
            Registrar primera venta
          </Link>
        </div>
      ) : (
        <Table className="data-table">
          <TableHeader>
            <TableRow>
              <TableHead>#Venta</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Pagado</TableHead>
              <TableHead>Saldo</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>
                  <Link href={`/dashboard/sales/${sale.id}`} className="text-foreground hover:text-accent">
                    #{sale.sale_number}
                  </Link>
                </TableCell>
                <TableCell>{clientNameById.get(sale.client_id) ?? '—'}</TableCell>
                <TableCell>{formatDate(sale.sale_date)}</TableCell>
                <TableCell>{formatCurrency(sale.total_amount, business.currency)}</TableCell>
                <TableCell>{formatCurrency(sale.paid_amount, business.currency)}</TableCell>
                <TableCell>{formatCurrency(sale.balance, business.currency)}</TableCell>
                <TableCell>
                  <span className={`${SALE_STATUS_BADGE_CLASS[sale.status]} rounded-full px-2 py-0.5 text-xs font-medium`}>
                    {getStatusLabel(sale.status)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
