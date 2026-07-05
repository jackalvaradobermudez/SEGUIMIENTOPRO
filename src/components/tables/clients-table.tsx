'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils'

export type ClientRow = {
  id: string
  name: string
  phone: string | null
  pendingBalance: number
  lastSaleDate: string | null
}

export function ClientsTable({ clients, currency }: { clients: ClientRow[]; currency: string }) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return clients
    return clients.filter(
      (c) => c.name.toLowerCase().includes(term) || (c.phone ?? '').toLowerCase().includes(term)
    )
  }, [clients, search])

  if (clients.length === 0) {
    return (
      <div className="empty-placeholder">
        <Users size={32} color="var(--text-subtle)" />
        <p>Aún no tienes clientes registrados.</p>
        <Link href="/dashboard/clients/new" id="clients-empty-cta" className="placeholder-cta">
          Agrega tu primer cliente
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--text-muted)]" />
        <Input
          id="clients-search"
          placeholder="Buscar por nombre o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-12 rounded-2xl border border-[var(--border-subtle)] bg-white/[0.03] text-sm text-white placeholder:text-[var(--text-muted)] focus:border-[var(--brand-border)] focus:bg-white/[0.04] transition-colors focus-visible:ring-0"
          aria-label="Buscar clientes"
        />
      </div>

      <Table className="data-table">
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead className="text-right">Saldo pendiente</TableHead>
            <TableHead>Última compra</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((client) => (
            <TableRow key={client.id} className="cursor-pointer">
              <TableCell className="font-semibold text-white">
                <Link href={`/dashboard/clients/${client.id}`} className="text-white hover:text-[var(--brand-500)] transition-colors">
                  {client.name}
                </Link>
              </TableCell>
              <TableCell className="text-[var(--text-secondary)]">{client.phone ?? '—'}</TableCell>
              <TableCell className={client.pendingBalance > 0 ? 'text-right font-semibold text-[var(--warning-500)] tabular-nums' : 'text-right text-[var(--text-secondary)] tabular-nums'}>
                {formatCurrency(client.pendingBalance, currency)}
              </TableCell>
              <TableCell className="text-[var(--text-secondary)] tabular-nums">{client.lastSaleDate ? formatDate(client.lastSaleDate) : '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filtered.length === 0 && (
        <p className="text-sm text-[var(--text-muted)] mt-2">No se encontraron clientes con ese criterio de búsqueda.</p>
      )}
    </div>
  )
}
