'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CollectionActionForm } from '@/components/forms/collection-action-form'
import { formatCurrency } from '@/lib/utils'
import { useState } from 'react'

interface FocusItem {
  type: 'broken_promise' | 'overdue_60' | 'due_today'
  label: string
  saleId: string
  clientId: string
  clientName: string
  amount: number
  priority: number
}

interface FocusData {
  broken: Array<{ saleId: string; clientId: string; clientName: string; balance: number }>
  overdue60: Array<{ saleId: string; clientId: string; clientName: string; balance: number }>
  dueToday: Array<{ saleId: string; clientId: string; clientName: string; balance: number }>
}

export function CollectionFocus({ data, currency }: { data: FocusData; currency: string }) {
  const [formSaleId, setFormSaleId] = useState<string | null>(null)
  const [formClientId, setFormClientId] = useState('')

  const items: FocusItem[] = []

  // Prioridad 1: promesas incumplidas
  for (const b of data.broken) {
    items.push({
      type: 'broken_promise',
      label: 'Promesa incumplida',
      saleId: b.saleId,
      clientId: b.clientId,
      clientName: b.clientName,
      amount: b.balance,
      priority: 1,
    })
  }

  // Prioridad 2: cartera > 60 días sin gestión
  for (const o of data.overdue60) {
    items.push({
      type: 'overdue_60',
      label: 'Vencida +60 días',
      saleId: o.saleId,
      clientId: o.clientId,
      clientName: o.clientName,
      amount: o.balance,
      priority: 2,
    })
  }

  // Prioridad 3: vencen hoy
  for (const d of data.dueToday) {
    items.push({
      type: 'due_today',
      label: 'Vence hoy',
      saleId: d.saleId,
      clientId: d.clientId,
      clientName: d.clientName,
      amount: d.balance,
      priority: 3,
    })
  }

  const visible = items.slice(0, 5)

  if (visible.length === 0) return null

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            Enfoque de cobro de hoy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-muted-foreground">
            Hoy tienes {items.length} {items.length === 1 ? 'gestión sugerida' : 'gestiones sugeridas'}
          </p>
          <div className="flex flex-col gap-2">
            {visible.map((item) => (
              <div
                key={`${item.type}-${item.saleId}`}
                className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--border)] p-3 text-sm"
              >
                <div>
                  <span className="font-medium">{item.label}</span>
                  <span className="ml-2 text-muted-foreground">{item.clientName}</span>
                  <span className="ml-1 font-semibold text-[var(--warning)]">
                    {formatCurrency(item.amount, currency)}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setFormClientId(item.clientId)
                    setFormSaleId(item.saleId)
                  }}
                  id={`focus-action-${item.saleId}`}
                >
                  Iniciar gestión
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!formSaleId} onOpenChange={(open) => !open && setFormSaleId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar gestión de cobro</DialogTitle>
            <DialogDescription>Gestión desde el dashboard</DialogDescription>
          </DialogHeader>
          {formSaleId && (
            <CollectionActionForm
              saleId={formSaleId}
              clientId={formClientId}
              onSuccess={() => setFormSaleId(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
