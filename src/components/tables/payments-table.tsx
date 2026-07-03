'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Ban } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
          <TableHead>Monto</TableHead>
          <TableHead>Método</TableHead>
          <TableHead>Recibo</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>{formatDate(payment.payment_date)}</TableCell>
            <TableCell>{formatCurrency(payment.amount, currency)}</TableCell>
            <TableCell>{getPaymentMethodLabel(payment.payment_method)}</TableCell>
            <TableCell>{payment.receipt_number ?? '—'}</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Anular abono"
                disabled={voidingId === payment.id}
                onClick={() => handleVoid(payment.id)}
              >
                <Ban className="size-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
