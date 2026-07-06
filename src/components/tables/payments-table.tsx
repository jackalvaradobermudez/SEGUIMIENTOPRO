'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Ban } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { voidPaymentAction } from '@/app/dashboard/sales/[id]/payment-actions'
import { formatCurrency, formatDate, getPaymentMethodLabel } from '@/lib/utils'

export type PaymentRow = {
  id: string
  amount: number
  payment_date: string
  payment_method: string
  receipt_number: string | null
}

export function PaymentsTable({
  saleId,
  payments,
  currency,
}: {
  saleId: string
  payments: PaymentRow[]
  currency: string
}) {
  const [voidingId, setVoidingId] = useState<string | null>(null)

  async function handleVoid(paymentId: string) {
    setVoidingId(paymentId)
    const result = await voidPaymentAction(saleId, paymentId)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Abono anulado')
    }
    setVoidingId(null)
  }

  if (payments.length === 0) {
    return <p className="text-sm text-muted-foreground">Sin abonos registrados.</p>
  }

  return (
    <Table className="data-table">
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead className="text-right">Monto</TableHead>
          <TableHead>Método</TableHead>
          <TableHead>Recibo</TableHead>
          <TableHead className="text-center">Acción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell className="text-[var(--text-secondary)] tabular-nums">{formatDate(payment.payment_date)}</TableCell>
            <TableCell className="text-right font-semibold text-[var(--text-primary)] tabular-nums">{formatCurrency(payment.amount, currency)}</TableCell>
            <TableCell className="text-[var(--text-secondary)]">{getPaymentMethodLabel(payment.payment_method)}</TableCell>
            <TableCell className="text-[var(--text-secondary)]">{payment.receipt_number ?? '—'}</TableCell>
            <TableCell className="text-center">
              <button
                disabled={voidingId === payment.id}
                onClick={() => handleVoid(payment.id)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-white/[0.03] text-[var(--text-secondary)] hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                aria-label="Anular abono"
              >
                <Ban className="size-4" />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
