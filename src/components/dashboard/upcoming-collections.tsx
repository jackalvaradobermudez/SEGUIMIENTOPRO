import Link from 'next/link'
import { Clock } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Database } from '@/types/database'

type UpcomingCollection = Database['public']['Views']['v_upcoming_collections']['Row']

export function UpcomingCollections({
  collections,
  currency,
}: {
  collections: UpcomingCollection[]
  currency: string
}) {
  if (collections.length === 0) {
    return (
      <div className="empty-placeholder">
        <Clock size={32} color="var(--text-subtle)" />
        <p>No tienes cobros programados para los próximos 7 días.</p>
        <Link href="/dashboard/sales/new" id="dash-create-first-sale" className="placeholder-cta">
          Registrar primera venta
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {collections.map((collection) => (
        <Link
          key={collection.sale_id}
          href={`/dashboard/sales/${collection.sale_id}`}
          className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--border-hover)]"
        >
          <div>
            <p className="font-medium text-foreground">{collection.client_name}</p>
            <p className="text-xs text-muted-foreground">
              Venta #{collection.sale_number} · Vence {formatDate(collection.due_date)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display font-semibold" style={{ color: 'var(--warning)' }}>
              {formatCurrency(collection.balance, currency)}
            </p>
            <p className="text-xs text-muted-foreground">
              {collection.days_until_due === 0 ? 'Hoy' : `En ${collection.days_until_due} días`}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
