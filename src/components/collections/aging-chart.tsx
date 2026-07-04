'use client'

import { useMemo } from 'react'
import { AGING_BUCKETS } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import type { Database } from '@/types/database'

type AgingRow = Database['public']['Views']['v_aging_report']['Row']

const BAR_COLORS: Record<string, string> = {
  current: '#4ade80',
  '1_30': '#a3e635',
  '31_60': '#facc15',
  '61_90': '#fb923c',
  '90_plus': '#ef4444',
}

export function AgingChart({ rows, currency }: { rows: AgingRow[]; currency: string }) {
  const buckets = useMemo(() => {
    const map = new Map<string, number>()
    for (const row of rows) {
      // Las views de Supabase marcan todas las columnas nullable por defecto;
      // aging_bucket y balance siempre tienen valor según el schema
      const bucket = row.aging_bucket ?? 'current'
      const balance = row.balance ?? 0
      map.set(bucket, (map.get(bucket) ?? 0) + balance)
    }

    const grandTotal = Array.from(map.values()).reduce((s, v) => s + v, 0)

    return Object.entries(AGING_BUCKETS).map(([key, config]) => {
      const total = map.get(key) ?? 0
      const pct = grandTotal > 0 ? Math.round((total / grandTotal) * 100) : 0
      return { key, label: config.label, total, pct }
    })
  }, [rows])

  const maxTotal = Math.max(...buckets.map((b) => b.total), 1)

  return (
    <div className="flex flex-col gap-2">
      <h2 className="section-title">Distribución por bucket</h2>
      <div className="flex flex-col gap-2">
        {buckets.map((bucket) => (
          <div key={bucket.key} className="flex items-center gap-3">
            <span className="w-20 text-sm text-muted-foreground">{bucket.label}</span>
            <div className="relative h-7 flex-1 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--border)]">
              <div
                className="absolute inset-y-0 left-0 rounded-[var(--radius-sm)] transition-all"
                style={{
                  width: `${Math.max((bucket.total / maxTotal) * 100, bucket.total > 0 ? 2 : 0)}%`,
                  backgroundColor: BAR_COLORS[bucket.key] ?? BAR_COLORS['current'],
                }}
              />
            </div>
            <span className="w-24 text-right text-sm font-medium">{formatCurrency(bucket.total, currency)}</span>
            <span className="w-12 text-right text-xs text-muted-foreground">{bucket.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
