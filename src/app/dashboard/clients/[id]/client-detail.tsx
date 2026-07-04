'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  MessageCircle,
  Pencil,
  Trash2,
  ShoppingCart,
  Phone,
  DollarSign,
  Cake,
  Bell,
  Star,
} from 'lucide-react'
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
import { ClientForm } from '@/components/forms/client-form'
import { deleteClientAction } from '@/app/dashboard/clients/actions'
import {
  formatCurrency,
  formatDate,
  buildWhatsAppUrl,
  getClientScore,
  getClientScoreLabel,
} from '@/lib/utils'
import { SALE_STATUS_BADGE_CLASS, SALE_STATUS_LABEL } from '@/lib/constants'
import type { ClientFormData } from '@/lib/validations/client'
import type { Database } from '@/types/database'

// Tipos derivados del schema real (nullable donde el schema lo dice)
type Client = Database['public']['Tables']['clients']['Row']
type Sale = Pick<
  Database['public']['Tables']['sales']['Row'],
  | 'id'
  | 'sale_number'
  | 'sale_date'
  | 'due_date'
  | 'total_amount'
  | 'paid_amount'
  | 'balance'
  | 'status'
>
type Payment = Pick<
  Database['public']['Tables']['payments']['Row'],
  'id' | 'sale_id' | 'amount' | 'payment_date' | 'payment_method' | 'receipt_number'
>
type CollectionAction = Database['public']['Tables']['collection_actions']['Row']
type Reminder = Database['public']['Tables']['reminders']['Row']

type TimelineEventType = 'sale' | 'payment' | 'collection' | 'reminder'
type TimelineIcon = TimelineEventType | 'birthday'

type TimelineEvent = {
  id: string
  date: string
  type: TimelineEventType
  title: string
  description?: string
  amount?: number
  link?: string
  icon: TimelineIcon
}

const TIMELINE_ICONS: Record<TimelineIcon, typeof ShoppingCart> = {
  sale: ShoppingCart,
  payment: DollarSign,
  collection: Phone,
  reminder: Bell,
  birthday: Cake,
}

// Mapeo de color semántico del score a variable CSS del design system
const SCORE_COLOR_VAR: Record<string, string> = {
  green: 'var(--success)',
  amber: 'var(--warning)',
  orange: 'var(--warning)',
  red: 'var(--danger)',
}

const MAX_TIMELINE_EVENTS = 30

type ClientDetailProps = {
  client: Client
  sales: Sale[]
  payments: Payment[]
  collectionActions: CollectionAction[]
  reminders: Reminder[]
  totalDebt: number
  totalPurchased: number
  onTimePaymentsRatio: number
  avgPaymentDays: number
  daysSinceLastSale: number
  currency: string
}

export function ClientDetail({
  client,
  sales,
  payments,
  collectionActions,
  reminders,
  totalDebt,
  totalPurchased,
  onTimePaymentsRatio,
  avgPaymentDays,
  daysSinceLastSale,
  currency,
}: ClientDetailProps) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteClientAction(client.id)

    if (result?.error) {
      toast.error(result.error)
      setDeleting(false)
      return
    }

    toast.success(`Cliente ${client.name} eliminado`)
    setDeleteOpen(false)
    router.push('/dashboard/clients')
    router.refresh()
  }

  const clientScore = useMemo(
    () => getClientScore(onTimePaymentsRatio, avgPaymentDays, daysSinceLastSale),
    [onTimePaymentsRatio, avgPaymentDays, daysSinceLastSale],
  )

  const scoreLabel = useMemo(() => getClientScoreLabel(clientScore), [clientScore])
  const scoreColorVar = SCORE_COLOR_VAR[scoreLabel.color] ?? 'var(--muted-foreground)'

  const timeline = useMemo<TimelineEvent[]>(() => {
    const events: TimelineEvent[] = []

    for (const sale of sales) {
      events.push({
        id: `sale-${sale.id}`,
        date: sale.sale_date,
        type: 'sale',
        title: `Venta #${sale.sale_number}`,
        amount: sale.total_amount,
        link: `/dashboard/sales/${sale.id}`,
        icon: 'sale',
      })
    }

    for (const payment of payments) {
      events.push({
        id: `payment-${payment.id}`,
        date: payment.payment_date,
        type: 'payment',
        title: 'Abono a venta',
        amount: payment.amount,
        link: `/dashboard/sales/${payment.sale_id}`,
        icon: 'payment',
      })
    }

    for (const action of collectionActions) {
      events.push({
        id: `collection-${action.id}`,
        date: action.action_date,
        type: 'collection',
        title: `Gestión: ${action.action_type}`,
        description: action.notes ?? undefined,
        amount: action.promised_amount ?? undefined,
        link: `/dashboard/sales/${action.sale_id}`,
        icon: 'collection',
      })
    }

    for (const reminder of reminders) {
      events.push({
        id: `reminder-${reminder.id}`,
        date: reminder.remind_at,
        type: 'reminder',
        title: reminder.title,
        description: reminder.description ?? undefined,
        icon: reminder.reminder_type === 'birthday' ? 'birthday' : 'reminder',
      })
    }

    return events
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, MAX_TIMELINE_EVENTS)
  }, [sales, payments, collectionActions, reminders])

  const whatsAppMessage = `Hola ${client.name}, te contacto para recordarte tu saldo pendiente de ${formatCurrency(totalDebt, currency)}. ¿Podemos coordinar el pago?`

  const contactSummary =
    [client.company, client.phone, client.email].filter(Boolean).join(' · ') ||
    'Sin datos de contacto'

  if (editing) {
    const defaultValues: Partial<ClientFormData> = {
      name: client.name,
      phone: client.phone ?? '',
      email: client.email ?? '',
      address: client.address ?? '',
      company: client.company ?? '',
      id_number: client.id_number ?? '',
      birthday: client.birthday ?? '',
      notes: client.notes ?? '',
    }

    return (
      <div className="dashboard-page animate-fade-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">Editar cliente</h1>
            <p className="page-subtitle">{client.name}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setEditing(false)}
            id="cancel-edit-client"
          >
            Cancelar
          </Button>
        </div>
        <div className="max-w-xl">
          <ClientForm clientId={client.id} defaultValues={defaultValues} />
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{client.name}</h1>
          <p className="page-subtitle">{contactSummary}</p>
        </div>

        <div className="header-quick-links">
          {client.phone && (
            <a
              href={buildWhatsAppUrl(client.phone, whatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
              id="client-whatsapp-button"
              className="quick-link"
              aria-label="Escribir por WhatsApp"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          )}
          <Link
            href={`/dashboard/sales/new?client_id=${client.id}`}
            id="new-sale-for-client"
            className="quick-link"
          >
            <ShoppingCart size={16} />
            Nueva venta
          </Link>
          <Button
            variant="outline"
            onClick={() => setEditing(true)}
            id="edit-client-button"
          >
            <Pencil size={16} />
            Editar
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
            id="delete-client-button"
            aria-label="Eliminar cliente"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {/* Score card */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Score</p>
          <div className="mt-1 inline-flex items-center gap-1.5">
            <Star size={16} style={{ color: scoreColorVar }} />
            <span className="font-display text-2xl font-bold">{clientScore}</span>
          </div>
          <p
            className="mt-0.5 text-xs font-medium"
            style={{ color: scoreColorVar }}
          >
            {scoreLabel.label}
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Total comprado
          </p>
          <p className="mt-1 font-display text-xl font-bold">
            {formatCurrency(totalPurchased, currency)}
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Pagos a tiempo
          </p>
          <p className="mt-1 font-display text-xl font-bold">
            {Math.round(onTimePaymentsRatio * 100)}%
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {avgPaymentDays} días promedio
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Última compra
          </p>
          <p className="mt-1 font-display text-xl font-bold">
            {daysSinceLastSale === 0 ? 'Hoy' : `${daysSinceLastSale}d`}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">atrás</p>
        </div>
      </div>

      {/* Deuda pendiente */}
      <div className="mb-8 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-sm text-muted-foreground">Deuda total pendiente</p>
        <p
          className="font-display text-3xl font-bold"
          style={{ color: totalDebt > 0 ? 'var(--warning)' : 'var(--success)' }}
        >
          {formatCurrency(totalDebt, currency)}
        </p>
      </div>

      {/* Ventas */}
      <div className="section-header">
        <h2 className="section-title">Ventas</h2>
      </div>

      {sales.length === 0 ? (
        <div className="empty-placeholder">
          <p>Este cliente no tiene ventas registradas.</p>
        </div>
      ) : (
        <Table className="data-table mb-8">
          <TableHeader>
            <TableRow>
              <TableHead>#Venta</TableHead>
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
                  <Link
                    href={`/dashboard/sales/${sale.id}`}
                    className="text-accent hover:underline"
                  >
                    #{sale.sale_number}
                  </Link>
                </TableCell>
                <TableCell>{formatDate(sale.sale_date)}</TableCell>
                <TableCell>{formatCurrency(sale.total_amount, currency)}</TableCell>
                <TableCell>{formatCurrency(sale.paid_amount, currency)}</TableCell>
                <TableCell>{formatCurrency(sale.balance ?? 0, currency)}</TableCell>
                <TableCell>
                  <span
                    className={`${SALE_STATUS_BADGE_CLASS[sale.status]} rounded-full px-2 py-0.5 text-xs font-medium`}
                  >
                    {SALE_STATUS_LABEL[sale.status]}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Timeline */}
      <h2 className="section-title mb-4">Línea de tiempo</h2>
      {timeline.length === 0 ? (
        <div className="empty-placeholder">
          <p>No hay actividad registrada para este cliente.</p>
        </div>
      ) : (
        <div className="relative ml-4 flex flex-col gap-0 border-l border-[var(--border)] pl-6">
          {timeline.map((event) => {
            const Icon = TIMELINE_ICONS[event.icon]
            return (
              <div key={event.id} className="relative pb-4">
                <div className="absolute -left-[27px] top-1 flex size-3.5 items-center justify-center rounded-full bg-[var(--surface)] ring-1 ring-[var(--border)]">
                  <Icon size={10} className="text-muted-foreground" />
                </div>
                <div className="flex flex-wrap items-start gap-2 text-sm">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(event.date)}
                  </span>
                  {event.link ? (
                    <Link
                      href={event.link}
                      className="font-medium text-accent hover:underline"
                    >
                      {event.title}
                    </Link>
                  ) : (
                    <span className="font-medium">{event.title}</span>
                  )}
                  {event.amount != null && (
                    <span className="font-semibold">
                      {formatCurrency(event.amount, currency)}
                    </span>
                  )}
                </div>
                {event.description && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {event.description}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Sticky action bar (mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-2 border-t border-[var(--border)] bg-[var(--surface)] p-3 sm:hidden">
        {client.phone && (
          <a
            href={buildWhatsAppUrl(client.phone, whatsAppMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-md)] bg-green-600 px-3 py-2.5 text-sm font-medium text-white"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
        )}
        <Link
          href={`/dashboard/sales/new?client_id=${client.id}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--accent)] px-3 py-2.5 text-sm font-medium text-white"
        >
          <ShoppingCart size={16} />
          Nueva venta
        </Link>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar cliente?</DialogTitle>
            <DialogDescription>
              Esta acción ocultará a {client.name} de tu lista de clientes. Los datos históricos se conservan y podrás recuperarlos contactando soporte.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              id="confirm-delete-client"
            >
              {deleting ? 'Eliminando…' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}