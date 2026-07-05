'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import { Package } from 'lucide-react'
import { StockBadge } from '@/components/inventory/StockBadge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toggleProductActiveAction } from '@/app/dashboard/products/actions'
import { formatCurrency } from '@/lib/utils'

export type ProductRow = {
  id: string
  name: string
  category: string | null
  default_price: number
  cost_price: number | null
  stock: number
  stock_minimum: number
  track_stock: boolean
  is_active: boolean
}

export function ProductsTable({ products, currency }: { products: ProductRow[]; currency: string }) {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [rows, setRows] = useState(products)

  const categories = useMemo(() => {
    const set = new Set(rows.map((p) => p.category).filter((c): c is string => !!c))
    return Array.from(set)
  }, [rows])

  const filtered = useMemo(() => {
    if (categoryFilter === 'all') return rows
    return rows.filter((p) => p.category === categoryFilter)
  }, [rows, categoryFilter])

  async function handleToggle(productId: string, next: boolean) {
    setRows((prev) => prev.map((p) => (p.id === productId ? { ...p, is_active: next } : p)))
    const result = await toggleProductActiveAction(productId, next)
    if (result?.error) {
      toast.error(result.error)
      setRows((prev) => prev.map((p) => (p.id === productId ? { ...p, is_active: !next } : p)))
      return
    }
    toast.success(next ? 'Producto activado' : 'Producto desactivado')
  }

  if (products.length === 0) {
    return (
      <div className="empty-placeholder">
        <Package size={32} color="var(--text-subtle)" />
        <p>Aún no tienes productos registrados.</p>
        <Link href="/dashboard/products/new" id="products-empty-cta" className="placeholder-cta">
          Agrega tu primer producto
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value ?? 'all')}>
        <SelectTrigger className="w-56 h-12 rounded-2xl border border-[var(--border-subtle)] bg-white/[0.03] text-sm text-white focus:border-[var(--brand-border)] focus:bg-white/[0.04] px-4 transition-colors font-medium cursor-pointer" id="products-category-filter" aria-label="Filtrar por categoría">
          <SelectValue placeholder="Todas las categorías" />
        </SelectTrigger>
        <SelectContent className="bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-2xl text-white shadow-2xl p-1.5">
          <SelectItem value="all">Todas las categorías</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="sp-card">
        <div className="sp-card-content !p-0 overflow-x-auto">
          <Table className="data-table">
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Costo</TableHead>
                <TableHead className="text-right">Margen</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-center">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => {
                const margin =
                  product.cost_price != null && product.default_price > 0
                    ? Math.round(((product.default_price - product.cost_price) / product.default_price) * 100)
                    : null

                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-semibold text-white">{product.name}</TableCell>
                    <TableCell className="text-[var(--text-secondary)]">{product.category ?? '—'}</TableCell>
                    <TableCell className="text-right font-medium text-white tabular-nums">{formatCurrency(product.default_price, currency)}</TableCell>
                    <TableCell className="text-right text-[var(--text-secondary)] tabular-nums">
                      {product.cost_price != null ? formatCurrency(product.cost_price, currency) : '—'}
                    </TableCell>
                    <TableCell className="text-right text-[var(--text-secondary)] tabular-nums">
                      {margin != null ? `${margin}%` : '—'}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {product.track_stock ? (
                        <StockBadge stock={product.stock} minimum={product.stock_minimum} trackStock={true} />
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center">
                        <Switch
                          checked={product.is_active}
                          onCheckedChange={(checked) => handleToggle(product.id, checked)}
                          aria-label={product.is_active ? 'Desactivar producto' : 'Activar producto'}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
