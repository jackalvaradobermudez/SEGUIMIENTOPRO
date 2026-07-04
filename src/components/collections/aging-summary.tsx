'use client'

import { useMemo } from 'react'
import { AGING_BUCKETS } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import type { Database } from '@/types/database'

type AgingRow = Database['public']['Views']['v_aging_report']['Row']

type BucketSummary = {
  bucket: string
  label: string
  color: string
  total: number
  count: number
}

function summarize(rows: AgingRow[]): BucketSummary[] {
  const map = new Map<string, { total: number; count: number }>()

  for (const row of rows) {
    // Las views de Supabase marcan todas las columnas nullable; aging_bucket y balance
    // siempre tienen valor según el schema de la view
    const key = row.aging_bucket ?? 'current'
    const balance = row.balance ?? 0
    const entry = map.get(key) ?? { total: 0, count: 0 }
    entry.total += balance
    entry.count += 1
    map.set(key, entry)
  }

  return Object.entries(AGING_BUCKETS).map(([key, config]) => {
    const entry = map.get(key)
    return {
      bucket: key,
      label: config.label,
      color: config.color,
      total: entry?.total ?? 0,
      count: entry?.count ?? 0,
    }
  })
}

export function AgingSummary({ rows, currency }: { rows: AgingRow[]; currency: string }) {
  const buckets = useMemo(() => summarize(rows), [rows])

  if (rows.length === 0) {
    return (
      <div className="empty-placeholder">
        <p>No tienes cartera pendiente. ¡Todo cobrado!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {buckets.map((bucket) => (
        <div
          key={bucket.bucket}
          className={`${bucket.color} rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 transition-shadow hover:shadow-lg`}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{bucket.label}</p>
          <p className="mt-1 font-display text-xl font-bold">{formatCurrency(bucket.total, currency)}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {bucket.count} {bucket.count === 1 ? 'venta' : 'ventas'}
          </p>
        </div>
      ))}
    </div>
  )
}
