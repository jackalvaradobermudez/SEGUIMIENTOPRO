import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, formatDate, getStatusLabel } from '@/lib/utils'
import { SALE_STATUS_BADGE_CLASS } from '@/lib/constants'
import type { SaleStatus } from '@/types/database'

export type RecentSale = {
  id: string
  sale_number: number
  sale_date: string
  total_amount: number
  status: SaleStatus
  clientName: string
}

export function RecentSales({ sales, currency }: { sales: RecentSale[]; currency: string }) {
  if (sales.length === 0) {
    return (
      <div className="empty-placeholder">
        <ShoppingCart size={32} color="var(--text-subtle)" />
        <p>Aún no has registrado ventas.</p>
      </div>
    )
  }

  return (
    <Table className="data-table">
      <TableHeader>
        <TableRow>
          <TableHead>#Venta</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Monto</TableHead>
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
            <TableCell>{sale.clientName}</TableCell>
            <TableCell>
              {formatCurrency(sale.total_amount, currency)}
              <span className="ml-2 text-xs text-muted-foreground">{formatDate(sale.sale_date)}</span>
            </TableCell>
            <TableCell>
              <span className={`${SALE_STATUS_BADGE_CLASS[sale.status]} rounded-full px-2 py-0.5 text-xs font-medium`}>
                {getStatusLabel(sale.status)}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
