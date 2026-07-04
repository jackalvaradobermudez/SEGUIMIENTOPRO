'use client'

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LowStockBanner({
  count,
  className,
}: {
  count: number
  className?: string
}) {
  if (count === 0) return null

  return (
    <Link
      href="/dashboard/products"
      className={cn(
        'flex items-center gap-2 rounded-[var(--radius-md)] bg-red-500/15 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/25',
        className,
      )}
    >
      <AlertTriangle size={14} className="shrink-0" />
      <span className="flex-1 truncate">
        {count} {count === 1 ? 'producto' : 'productos'} con stock crítico
      </span>
    </Link>
  )
}
