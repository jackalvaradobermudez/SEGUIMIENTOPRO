'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, MessageCircle, Plus, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CollectionActionForm } from '@/components/forms/collection-action-form'
import { CollectionResultBadge } from '@/components/shared/collection-result-badge'
import { AGING_BUCKETS } from '@/lib/constants'
import { formatCurrency, formatDate, buildWhatsAppUrl } from '@/lib/utils'
import type { Database } from '@/types/database'

type AgingRow = Database['public']['Views']['v_aging_report']['Row']

type ClientGroup = {
  clientId: string
  clientName: string
  clientPhone: string | null
  totalPending: number
  sales: AgingRow[]
}

function groupByClient(rows: AgingRow[]): ClientGroup[] {
  const map = new Map<string, ClientGroup>()
  for (const row of rows) {
    // Las views de Supabase marcan todas las columnas nullable;
    // client_id, client_name y balance siempre tienen valor según el schema
    const clientId = row.client_id ?? ''
    const group = map.get(clientId) ?? {
      clientId,
      clientName: row.client_name ?? '',
      clientPhone: row.client_phone,
      totalPending: 0,
      sales: [],
    }
    group.totalPending += row.balance ?? 0
    group.sales.push(row)
    map.set(clientId, group)
  }
  return Array.from(map.values()).sort((a, b) => b.totalPending - a.totalPending)
}

export function AgingTable({
  rows,
  currency,
}: {
  rows: AgingRow[]
  currency: string
}) {
  const [search, setSearch] = useState('')
  const [onlyOverdue, setOnlyOverdue] = useState(false)
  const [collectionSaleId, setCollectionSaleId] = useState<string | null>(null)
  const [collectionClientId, setCollectionClientId] = useState<string>('')

  const groups = useMemo(() => {
    let filtered = rows
    if (onlyOverdue) {
      filtered = filtered.filter((r) => r.aging_bucket !== 'current')
    }
    return groupByClient(filtered)
  }, [rows, onlyOverdue])

  const filteredGroups = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return groups
    return groups.filter(
      (g) =>
        g.clientName.toLowerCase().includes(term),
    )
  }, [groups, search])

  if (rows.length === 0) {
    return (
      <div className="empty-placeholder">
        <p>No tienes cartera pendiente. ¡Todo cobrado!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="section-title">Detalle por cliente</h2>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            aria-label="Buscar cliente"
          />
        </div>

        <Button
          variant={onlyOverdue ? 'default' : 'outline'}
          size="sm"
          onClick={() => setOnlyOverdue(!onlyOverdue)}
          id="aging-only-overdue-toggle"
        >
          <Filter className="mr-1.5 size-4" />
          Solo cartera vencida
        </Button>
      </div>

      {groups.length === 0 && filteredGroups.length === 0 ? (
        <div className="empty-placeholder">
          <p>No tienes cartera pendiente. ¡Todo cobrado!</p>
        </div>
      ) : (
        <Accordion className="flex flex-col gap-2">
          {filteredGroups.map((group) => (
            <AccordionItem
              key={group.clientId}
              value={group.clientId}
              className="rounded-[var(--radius-md)] border border-[var(--border)]"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex w-full items-center justify-between gap-4 pr-4">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{group.clientName}</span>
                    <span className="text-sm text-[var(--warning)]">
                      {formatCurrency(group.totalPending, currency)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {group.clientPhone && (
                      <a
                        href={buildWhatsAppUrl(
                          group.clientPhone,
                          `Hola ${group.clientName}, te contacto para recordarte tu saldo pendiente de ${formatCurrency(group.totalPending, currency)}. ¿Podemos coordinar el pago?`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="quick-link text-xs"
                        aria-label="Contactar por WhatsApp"
                      >
                        <MessageCircle size={14} />
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="flex flex-col gap-2 pt-2">
                  {group.sales.map((sale) => {
                    // aging_bucket siempre tiene valor en la view; fallback a 'current' por TS
                    const bucketKey = (sale.aging_bucket ?? 'current') as keyof typeof AGING_BUCKETS
                    const bucketConfig = AGING_BUCKETS[bucketKey]
                    return (
                      <div
                        key={sale.sale_id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-sm)] bg-[var(--surface)] p-3 text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/dashboard/sales/${sale.sale_id}`}
                            className="font-medium text-accent hover:underline"
                          >
                            #{sale.sale_number}
                          </Link>
                          <span>{formatCurrency(sale.balance ?? 0, currency)}</span>
                          <Badge
                            variant="secondary"
                            className={`${bucketConfig.color} text-xs`}
                          >
                            {bucketConfig.label}
                          </Badge>
                          {sale.last_collection_date && (
                            <span className="text-xs text-muted-foreground">
                              Última gestión: {formatDate(sale.last_collection_date)}
                            </span>
                          )}
                          {sale.last_collection_result && (
                            <CollectionResultBadge result={sale.last_collection_result} />
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // sale_id y client_id siempre tienen valor en la view
                            setCollectionClientId(sale.client_id ?? '')
                            setCollectionSaleId(sale.sale_id ?? null)
                          }}
                          id={`aging-register-action-${sale.sale_id}`}
                        >
                          <Plus size={14} className="mr-1" />
                          Registrar gestión
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      <Dialog open={!!collectionSaleId} onOpenChange={(open) => !open && setCollectionSaleId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar gestión de cobro</DialogTitle>
            <DialogDescription>Gestión desde cartera por edades</DialogDescription>
          </DialogHeader>
          {collectionSaleId && (
            <CollectionActionForm
              saleId={collectionSaleId}
              clientId={collectionClientId}
              onSuccess={() => setCollectionSaleId(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
