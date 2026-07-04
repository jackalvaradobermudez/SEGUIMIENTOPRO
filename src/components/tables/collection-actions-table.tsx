'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Trash2, Phone, MessageCircle, MessageSquare, MapPin, Mail, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CollectionResultBadge } from '@/components/shared/collection-result-badge'
import { deleteCollectionActionAction } from '@/app/dashboard/sales/[id]/collection-actions'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Database } from '@/types/database'

type CollectionActionRow = Database['public']['Tables']['collection_actions']['Row']

const TYPE_ICON_MAP: Record<string, typeof Phone> = {
  call: Phone,
  whatsapp: MessageCircle,
  sms: MessageSquare,
  visit: MapPin,
  email: Mail,
  other: MoreHorizontal,
}

export function CollectionActionsTable({
  saleId,
  actions,
  currency,
}: {
  saleId: string
  actions: CollectionActionRow[]
  currency: string
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(actionId: string) {
    setDeletingId(actionId)
    const result = await deleteCollectionActionAction(saleId, actionId)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Gestión eliminada')
    }
    setDeletingId(null)
  }

  if (actions.length === 0) {
    return (
      <div className="empty-placeholder">
        <p>Cuando llames, escribas o visites a este cliente, registra la gestión aquí. Así llevas el historial completo.</p>
      </div>
    )
  }

  return (
    <Table className="data-table">
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Resultado</TableHead>
          <TableHead>Promesa</TableHead>
          <TableHead>Notas</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {actions.map((action) => {
          const Icon = TYPE_ICON_MAP[action.action_type] ?? MoreHorizontal
          return (
            <TableRow key={action.id}>
              <TableCell>{formatDate(action.action_date)}</TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1.5">
                  <Icon className="size-4 text-muted-foreground" />
                </span>
              </TableCell>
              <TableCell>
                <CollectionResultBadge result={action.result} />
              </TableCell>
              <TableCell>
                {action.promised_date ? (
                  <span>
                    {formatDate(action.promised_date)}
                    {action.promised_amount != null && (
                      <> &middot; {formatCurrency(action.promised_amount, currency)}</>
                    )}
                  </span>
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell className="max-w-[200px] truncate">{action.notes ?? '—'}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Eliminar gestión"
                  disabled={deletingId === action.id}
                  onClick={() => handleDelete(action.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
