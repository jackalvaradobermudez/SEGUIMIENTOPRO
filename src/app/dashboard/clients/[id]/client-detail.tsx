'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { MessageCircle, Pencil, Trash2 } from 'lucide-react'
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
import { formatCurrency, formatDate, getStatusLabel } from '@/lib/utils'
import { SALE_STATUS_BADGE_CLASS } from '@/lib/constants'
import type { ClientFormData } from '@/lib/validations/client'
import type { Database } from '@/types/database'

type Client = Database['public']['Tables']['clients']['Row']
type Sale = Pick<
  Database['public']['Tables']['sales']['Row'],
  'id' | 'sale_number' | 'sale_date' | 'total_amount' | 'paid_amount' | 'balance' | 'status'
>

export function ClientDetail({
  client,
  sales,
  totalDebt,
  currency,
}: {
  client: Client
  sales: Sale[]
  totalDebt: number
  currency: string
}) {
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
  }

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
          <Button variant="outline" onClick={() => setEditing(false)} id="cancel-edit-client">
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
          <p className="page-subtitle">
            {[client.company, client.phone, client.email].filter(Boolean).join(' · ') || 'Sin datos de contacto'}
          </p>
        </div>

        <div className="header-quick-links">
          {client.phone && (
            <a
              href={`https://wa.me/${client.phone.replace(/\D/g, '')}`}
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
          <Button variant="outline" onClick={() => setEditing(true)} id="edit-client-button">
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

      <div className="mb-8 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-sm text-muted-foreground">Deuda total pendiente</p>
        <p
          className="font-display text-3xl font-bold"
          style={{ color: totalDebt > 0 ? 'var(--warning)' : 'var(--success)' }}
        >
          {formatCurrency(totalDebt, currency)}
        </p>
      </div>

      <div className="section-header">
        <h2 className="section-title">Ventas</h2>
      </div>

      {sales.length === 0 ? (
        <div className="empty-placeholder">
          <p>Este cliente no tiene ventas registradas.</p>
        </div>
      ) : (
        <Table className="data-table">
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
              <TableRow
                key={sale.id}
                className="cursor-pointer"
                onClick={() => router.push(`/dashboard/sales/${sale.id}`)}
              >
                <TableCell>#{sale.sale_number}</TableCell>
                <TableCell>{formatDate(sale.sale_date)}</TableCell>
                <TableCell>{formatCurrency(sale.total_amount, currency)}</TableCell>
                <TableCell>{formatCurrency(sale.paid_amount, currency)}</TableCell>
                <TableCell>{formatCurrency(sale.balance, currency)}</TableCell>
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

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar cliente?</DialogTitle>
            <DialogDescription>
              Esta acción ocultará a {client.name} de tu lista de clientes. Podrás recuperarlo contactando soporte.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting} id="confirm-delete-client">
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
