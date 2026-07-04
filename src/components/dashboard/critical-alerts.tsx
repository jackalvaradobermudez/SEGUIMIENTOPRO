'use client'

import Link from 'next/link'
import { AlertTriangle, Check } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { formatCurrency } from '@/lib/utils'

interface AlertData {
  brokenPromisesCount: number
  todayDueCount: number
  todayDueAmount: number
  todayPaymentsCount: number
  todayPaymentsAmount: number
}

export function CriticalAlerts({ data, currency }: { data: AlertData; currency: string }) {
  const alerts: Array<{ key: string; variant: 'destructive' | 'default'; message: React.ReactNode }> = []

  if (data.brokenPromisesCount > 0) {
    alerts.push({
      key: 'broken',
      variant: 'destructive',
      message: (
        <>
          {data.brokenPromisesCount} {data.brokenPromisesCount === 1 ? 'cliente prometió pagar y no cumplió.' : 'clientes prometieron pagar y no cumplieron.'}{' '}
          <Link href="/dashboard/collections" className="font-medium underline underline-offset-2">
            Ver →
          </Link>
        </>
      ),
    })
  }

  if (data.todayDueCount > 0) {
    alerts.push({
      key: 'due',
      variant: 'default',
      message: (
        <>
          {data.todayDueCount} {data.todayDueCount === 1 ? 'venta vence hoy' : 'ventas vencen hoy'} por un total de {formatCurrency(data.todayDueAmount, currency)}.{' '}
          <Link href="/dashboard/collections" className="font-medium underline underline-offset-2">
            Ver →
          </Link>
        </>
      ),
    })
  }

  if (data.todayPaymentsCount > 0) {
    alerts.push({
      key: 'payments',
      variant: 'default',
      message: (
        <>
          <Check className="mr-1 inline size-4 text-green-400" />
          {data.todayPaymentsCount} {data.todayPaymentsCount === 1 ? 'pago registrado hoy' : 'pagos registrados hoy'} suman {formatCurrency(data.todayPaymentsAmount, currency)}.
        </>
      ),
    })
  }

  if (alerts.length === 0) return null

  return (
    <div className="mb-6 flex flex-col gap-2">
      {alerts.map((alert) => (
        <Alert key={alert.key} variant={alert.variant}>
          <AlertTriangle className="size-4" />
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
