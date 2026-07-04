import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

interface LowStockAlertProps {
  count: number
  products: Array<{
    id: string
    name: string
    stock: number
    stock_minimum: number
    units_needed: number
  }>
}

export function LowStockAlert({ count, products }: LowStockAlertProps) {
  if (count === 0) return null

  return (
    <div
      role="alert"
      aria-label={`${count} producto${count !== 1 ? 's' : ''} con stock bajo`}
      style={{
        display: 'flex',
        gap: 'var(--space-3)',
        alignItems: 'flex-start',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(234, 179, 8, 0.08)',
        border: '1px solid rgba(234, 179, 8, 0.25)',
        marginBottom: 'var(--space-6)',
      }}
    >
      <AlertTriangle
        size={18}
        strokeWidth={2}
        style={{ color: 'var(--warning)', flexShrink: 0, marginTop: 2 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--warning)', marginBottom: 4 }}>
          {count} producto{count !== 1 ? 's' : ''} con stock bajo
        </p>
        <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {products.slice(0, 5).map((p) => (
            <li key={p.id}>
              <Link
                href={`/dashboard/products`}
                style={{
                  fontSize: 'var(--text-xs)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(234, 179, 8, 0.12)',
                  color: 'var(--warning)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {p.name}: {p.stock} / min {p.stock_minimum}
              </Link>
            </li>
          ))}
          {count > 5 && (
            <li>
              <Link
                href="/dashboard/products"
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-muted)',
                  textDecoration: 'underline',
                }}
              >
                +{count - 5} más →
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
