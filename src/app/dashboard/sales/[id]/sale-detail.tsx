'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Ban, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PaymentForm } from '@/components/forms/payment-form'
import { PaymentsTable, type PaymentRow } from '@/components/tables/payments-table'
import { CollectionActionForm } from '@/components/forms/collection-action-form'
import { CollectionActionsTable } from '@/components/tables/collection-actions-table'
import { cancelSaleAction } from '@/app/dashboard/sales/actions'
import { formatCurrency, formatDate, getStatusLabel, buildWhatsAppUrl } from '@/lib/utils'
import { SALE_STATUS_BADGE_CLASS } from '@/lib/constants'
import type { Database } from '@/types/database'

type Sale = Database['public']['Tables']['sales']['Row']
type SaleItem = Database['public']['Tables']['sale_items']['Row']
type CollectionActionRow = Database['public']['Tables']['collection_actions']['Row']

export function SaleDetail({
  sale,
  clientName,
  clientPhone,
  items,
  payments,
  collectionActions,
  currency,
}: {
  sale: Sale
  clientName: string
  clientPhone: string | null
  items: SaleItem[]
  payments: PaymentRow[]
  collectionActions: CollectionActionRow[]
  currency: string
}) {
  const router = useRouter()
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [collectionOpen, setCollectionOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  async function handleCancel() {
    setCancelling(true)
    const result = await cancelSaleAction(sale.id)
    if (result?.error) {
      toast.error(result.error)
      setCancelling(false)
      return
    }
    toast.success('Venta cancelada')
    setCancelOpen(false)
    setCancelling(false)
  }

  function handleCreateActionSuccess() {
    setCollectionOpen(false)
    router.refresh()
  }

  const canCancel = sale.status !== 'cancelled' && sale.status !== 'paid'
  const pendingBalance = sale.total_amount - sale.paid_amount

  const whatsAppMessage = clientName
    ? `Hola ${clientName}, te contacto para recordarte el saldo pendiente de tu compra por ${formatCurrency(pendingBalance > 0 ? pendingBalance : sale.total_amount, currency)}. ¿Podemos coordinar el pago?`
    : ''

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Venta #{sale.sale_number}</h1>
          <p className="page-subtitle">
            {formatDate(sale.sale_date)} ·{' '}
            <Link href={`/dashboard/clients/${sale.client_id}`} className="text-accent">
              {clientName}
            </Link>{' '}
            ·{' '}
            <span className={`${SALE_STATUS_BADGE_CLASS[sale.status]} rounded-full px-2 py-0.5 text-xs font-medium`}>
              {getStatusLabel(sale.status)}
            </span>
          </p>
        </div>

        <div className="header-quick-links">
          {clientPhone && (
            <a
              href={buildWhatsAppUrl(clientPhone, whatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
              id="sale-detail-whatsapp"
              className="quick-link"
              aria-label="Contactar por WhatsApp"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          )}
          {canCancel && (
            <Button variant="destructive" onClick={() => setCancelOpen(true)} id="cancel-sale-button">
              <Ban size={16} />
              Cancelar venta
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="section-title mb-4">Productos</h2>
            <Table className="data-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio unitario</TableHead>
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.unit_price, currency)}</TableCell>
                    <TableCell>{formatCurrency(item.subtotal ?? 0, currency)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div>
            <div className="section-header">
              <h2 className="section-title">Pagos</h2>
              {sale.status !== 'cancelled' && pendingBalance > 0 && (
                <Button size="sm" onClick={() => setPaymentOpen(true)} id="register-payment-button">
                  <Plus size={16} />
                  Registrar abono
                </Button>
              )}
            </div>
            <PaymentsTable saleId={sale.id} payments={payments} currency={currency} />
          </div>

          <div>
            <div className="section-header">
              <h2 className="section-title">Gestiones de cobro</h2>
              <Button size="sm" onClick={() => setCollectionOpen(true)} id="register-collection-button">
                <Plus size={16} />
                Registrar gestión
              </Button>
            </div>
            <CollectionActionsTable saleId={sale.id} actions={collectionActions} currency={currency} />
          </div>
        </div>

        <div className="flex h-fit flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-semibold">{formatCurrency(sale.total_amount, currency)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Pagado</span>
            <span className="font-semibold">{formatCurrency(sale.paid_amount, currency)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 text-sm">
            <span className="text-muted-foreground">Pendiente</span>
            <span
              className="font-display text-lg font-bold"
              style={{ color: pendingBalance > 0 ? 'var(--warning)' : 'var(--success)' }}
            >
              {formatCurrency(pendingBalance, currency)}
            </span>
          </div>
        </div>
      </div>

      <Dialog open={collectionOpen} onOpenChange={setCollectionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar gestión de cobro</DialogTitle>
            <DialogDescription>Venta #{sale.sale_number} &middot; {clientName}</DialogDescription>
          </DialogHeader>
          <CollectionActionForm
            saleId={sale.id}
            clientId={sale.client_id}
            onSuccess={handleCreateActionSuccess}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar abono</DialogTitle>
            <DialogDescription>Venta #{sale.sale_number}</DialogDescription>
          </DialogHeader>
          <PaymentForm
            saleId={sale.id}
            pendingBalance={pendingBalance}
            currency={currency}
            onSuccess={() => setPaymentOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Cancelar esta venta?</DialogTitle>
            <DialogDescription>
              La venta #{sale.sale_number} pasará a estado cancelada. Esta acción no se puede deshacer desde aquí.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)} disabled={cancelling}>
              Volver
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={cancelling} id="confirm-cancel-sale">
              {cancelling ? 'Cancelando...' : 'Cancelar venta'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
