'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, Users, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
  email: string | null
  company: string | null
  pendingBalance: number
  lastSaleDate: string | null
}

type BalanceFilter = 'all' | 'with_balance' | 'no_balance'

export function ClientsTable({ clients, currency }: { clients: ClientRow[]; currency: string }) {
  const [search, setSearch] = useState('')
  const [companyFilter, setCompanyFilter] = useState('')
  const [balanceFilter, setBalanceFilter] = useState<BalanceFilter>('all')
  const [showFilters, setShowFilters] = useState(false)

  const companies = useMemo(() => {
    const set = new Set<string>()
    clients.forEach((c) => { if (c.company) set.add(c.company) })
    return Array.from(set).sort()
  }, [clients])

  const hasActiveFilters = companyFilter !== '' || balanceFilter !== 'all'

  const filtered = useMemo(() => {
    let result = clients

    const term = search.trim().toLowerCase()
    if (term) {
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          (c.phone ?? '').toLowerCase().includes(term) ||
          (c.email ?? '').toLowerCase().includes(term) ||
          (c.company ?? '').toLowerCase().includes(term)
      )
    }

    if (companyFilter) {
      result = result.filter((c) => c.company === companyFilter)
    }

    if (balanceFilter === 'with_balance') {
      result = result.filter((c) => c.pendingBalance > 0)
    } else if (balanceFilter === 'no_balance') {
      result = result.filter((c) => c.pendingBalance === 0)
    }

    return result
  }, [clients, search, companyFilter, balanceFilter])

  function clearFilters() {
    setCompanyFilter('')
    setBalanceFilter('all')
  }

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
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <Input
            id="clients-search"
            placeholder="Buscar por nombre, teléfono, email o empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 rounded-2xl border border-slate-200 bg-white text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--brand-border)] focus:bg-slate-50 transition-colors focus-visible:ring-0"
            aria-label="Buscar clientes"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={`h-12 rounded-2xl border-slate-200 gap-2 cursor-pointer ${hasActiveFilters ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : ''}`}
        >
          <Filter size={14} />
          Filtros
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              {(companyFilter ? 1 : 0) + (balanceFilter !== 'all' ? 1 : 0)}
            </span>
          )}
        </Button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 animate-fade-in">
          <div className="flex flex-col gap-1.5 min-w-[180px]">
            <label className="text-xs font-semibold text-slate-500">Empresa</label>
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-[var(--text-primary)] focus:border-indigo-400 focus:outline-none"
            >
              <option value="">Todas</option>
              {companies.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500">Saldo</label>
            <select
              value={balanceFilter}
              onChange={(e) => setBalanceFilter(e.target.value as BalanceFilter)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-[var(--text-primary)] focus:border-indigo-400 focus:outline-none"
            >
              <option value="all">Todos</option>
              <option value="with_balance">Con saldo pendiente</option>
              <option value="no_balance">Sin saldo pendiente</option>
            </select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 text-xs text-slate-500 hover:text-slate-700 gap-1 cursor-pointer"
            >
              <X size={12} />
              Limpiar filtros
            </Button>
          )}
        </div>
      )}

      <div className="sp-card">
        <div className="sp-card-content !p-0 overflow-x-auto">
          <Table className="data-table">
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Saldo pendiente</TableHead>
                <TableHead>Última compra</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((client) => (
                <TableRow key={client.id} className="cursor-pointer">
                  <TableCell className="font-semibold text-[var(--text-primary)]">
                    <Link href={`/dashboard/clients/${client.id}`} className="text-[var(--text-primary)] hover:text-[var(--brand-500)] transition-colors">
                      {client.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-[var(--text-secondary)]">{client.phone ?? '—'}</TableCell>
                  <TableCell className="text-[var(--text-secondary)]">{client.company ?? '—'}</TableCell>
                  <TableCell className="text-[var(--text-secondary)]">{client.email ?? '—'}</TableCell>
                  <TableCell className={client.pendingBalance > 0 ? 'text-right font-semibold text-[var(--warning-500)] tabular-nums' : 'text-right text-[var(--text-secondary)] tabular-nums'}>
                    {formatCurrency(client.pendingBalance, currency)}
                  </TableCell>
                  <TableCell className="text-[var(--text-secondary)] tabular-nums">{client.lastSaleDate ? formatDate(client.lastSaleDate) : '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-[var(--text-muted)] mt-2">No se encontraron clientes con ese criterio de búsqueda.</p>
      )}
    </div>
  )
}
