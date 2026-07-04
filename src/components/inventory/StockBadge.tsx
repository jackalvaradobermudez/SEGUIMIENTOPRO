import { cn } from '@/lib/utils'

const VARIANT_CLASS: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400',
  warning: 'bg-amber-500/20 text-amber-400',
  ok: 'bg-green-500/20 text-green-400',
  out: 'bg-gray-500/20 text-gray-400',
}

export function StockBadge({
  stock,
  minimum,
  trackStock,
  className,
}: {
  stock: number
  minimum: number
  trackStock: boolean
  className?: string
}) {
  if (!trackStock) return null

  let variant: string
  let label: string

  if (stock <= 0) {
    variant = 'out'
    label = 'Agotado'
  } else if (stock <= minimum) {
    variant = 'critical'
    label = 'Stock crítico'
  } else if (stock <= minimum * 2) {
    variant = 'warning'
    label = 'Stock bajo'
  } else {
    variant = 'ok'
    label = `${stock}`
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        VARIANT_CLASS[variant],
        className,
      )}
    >
      {label}
    </span>
  )
}
